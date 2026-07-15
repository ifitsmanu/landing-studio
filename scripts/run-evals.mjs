#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, realpathSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";

import Ajv from "ajv";

const MISSING = Symbol("missing");

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

function safePath(root, relativePath) {
  const path = resolve(root, relativePath);
  if (path !== root && !path.startsWith(`${root}${sep}`)) {
    throw new Error(`Eval path escapes repository: ${relativePath}`);
  }
  return path;
}

function pointerValue(value, pointer) {
  if (pointer === "") return value;
  if (!pointer.startsWith("/")) throw new Error(`Invalid JSON pointer: ${pointer}`);
  let current = value;
  for (const rawToken of pointer.slice(1).split("/")) {
    const token = rawToken.replace(/~1/gu, "/").replace(/~0/gu, "~");
    if (
      current === null ||
      typeof current !== "object" ||
      !Object.prototype.hasOwnProperty.call(current, token)
    ) {
      return MISSING;
    }
    current = current[token];
  }
  return current;
}

async function gradeAssertion(root, fixture, assertion) {
  const actual = pointerValue(fixture, assertion.pointer);
  let passed = false;
  let evidence = actual === MISSING ? { missing: true } : actual;

  switch (assertion.operator) {
    case "equals":
      passed = actual !== MISSING && isDeepStrictEqual(actual, assertion.expected);
      break;
    case "contains_all":
      passed =
        Array.isArray(actual) &&
        Array.isArray(assertion.expected) &&
        assertion.expected.every((expected) =>
          actual.some((item) => isDeepStrictEqual(item, expected)),
        );
      break;
    case "excludes_all":
      passed =
        Array.isArray(actual) &&
        Array.isArray(assertion.expected) &&
        assertion.expected.every(
          (expected) => !actual.some((item) => isDeepStrictEqual(item, expected)),
        );
      break;
    case "length_at_least":
      passed = actual !== MISSING && actual?.length >= assertion.expected;
      break;
    case "matches":
      passed = typeof actual === "string" && new RegExp(assertion.expected, "u").test(actual);
      break;
    case "schema_valid": {
      if (actual === MISSING) break;
      const schemaPath = safePath(root, assertion.expected);
      const schema = await readJson(schemaPath);
      const validate = new Ajv({ allErrors: true, strict: false }).compile(schema);
      passed = validate(actual);
      evidence = { valid: passed, errors: validate.errors ?? [] };
      break;
    }
    default:
      throw new Error(`Unsupported eval operator: ${assertion.operator}`);
  }

  return {
    id: assertion.id,
    status: passed ? "PASS" : "FAIL",
    severity: assertion.severity,
    weight: assertion.weight,
    actual: evidence,
  };
}

function revision(root) {
  const result = spawnSync("git", ["rev-parse", "--short", "HEAD"], {
    cwd: root,
    encoding: "utf8",
  });
  return result.status === 0 ? `working-tree:${result.stdout.trim()}` : "working-tree:unknown";
}

function generatedAt() {
  const epoch = process.env.SOURCE_DATE_EPOCH;
  return new Date(epoch ? Number(epoch) * 1000 : Date.now()).toISOString();
}

function schemaErrors(validate) {
  return (validate.errors ?? [])
    .map((error) => `${error.instancePath || "/"} ${error.message}`)
    .join("; ");
}

export async function runEvaluationSuite(root = process.cwd()) {
  const repositoryRoot = resolve(root);
  const suitePath = join(repositoryRoot, "evals", "evals.json");
  const suiteSchema = await readJson(join(repositoryRoot, "evals", "eval-suite.schema.json"));
  const resultSchema = await readJson(join(repositoryRoot, "evals", "result.schema.json"));
  const suite = await readJson(suitePath);
  const validateSuite = new Ajv({ allErrors: true, strict: false }).compile(suiteSchema);
  if (!validateSuite(suite)) {
    throw new Error(`evals/evals.json violates eval-suite.schema.json: ${schemaErrors(validateSuite)}`);
  }

  const caseIds = new Set();
  const cases = [];
  for (const definition of suite.cases) {
    if (caseIds.has(definition.id)) throw new Error(`Duplicate eval case id: ${definition.id}`);
    caseIds.add(definition.id);
    const fixturePath = safePath(repositoryRoot, definition.fixture_path);
    const rubricPath = safePath(repositoryRoot, definition.rubric_path);
    if (!existsSync(fixturePath)) throw new Error(`Missing eval fixture: ${definition.fixture_path}`);
    if (!existsSync(rubricPath)) throw new Error(`Missing eval rubric: ${definition.rubric_path}`);
    const fixture = await readJson(fixturePath);
    if (!fixture.input || !fixture.observed) {
      throw new Error(`${definition.fixture_path} must retain input and observed fixture data`);
    }
    const assertions = [];
    for (const assertion of definition.assertions) {
      assertions.push(await gradeAssertion(repositoryRoot, fixture, assertion));
    }
    const score = assertions
      .filter((assertion) => assertion.status === "PASS")
      .reduce((sum, assertion) => sum + assertion.weight, 0);
    const maxScore = assertions.reduce((sum, assertion) => sum + assertion.weight, 0);
    cases.push({
      id: definition.id,
      status: assertions.every((assertion) => assertion.status === "PASS") ? "PASS" : "FAIL",
      score,
      max_score: maxScore,
      assertions,
    });
  }

  for (const run of suite.cross_model_runs) {
    if (run.status === "unrun" && run.evidence_path !== null) {
      throw new Error(`${run.runtime} is unrun but declares evidence`);
    }
    if (run.status !== "unrun") {
      if (!run.evidence_path || !existsSync(safePath(repositoryRoot, run.evidence_path))) {
        throw new Error(`${run.runtime} result lacks retained evidence`);
      }
    }
  }

  const passed = cases.filter((entry) => entry.status === "PASS").length;
  const score = cases.reduce((sum, entry) => sum + entry.score, 0);
  const maxScore = cases.reduce((sum, entry) => sum + entry.max_score, 0);
  const result = {
    suite_version: suite.suite_version,
    generated_at: generatedAt(),
    repository_revision: revision(repositoryRoot),
    runner: "scripts/run-evals.mjs",
    summary: {
      status: passed === cases.length ? "PASS" : "FAIL",
      passed,
      failed: cases.length - passed,
      total: cases.length,
      score,
      max_score: maxScore,
    },
    cases,
    cross_model_runs: suite.cross_model_runs,
  };

  const validateResult = new Ajv({ allErrors: true, strict: false, formats: { "date-time": true } }).compile(
    resultSchema,
  );
  if (!validateResult(result)) {
    throw new Error(`Generated eval result violates result.schema.json: ${schemaErrors(validateResult)}`);
  }
  return result;
}

function comparable(result) {
  const copy = structuredClone(result);
  delete copy.generated_at;
  delete copy.repository_revision;
  return copy;
}

function parseArguments(argv) {
  const options = { root: process.cwd(), json: false, write: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--root") options.root = resolve(argv[++index]);
    else if (argument === "--json") options.json = true;
    else if (argument === "--write") options.write = true;
    else throw new Error(`Unknown argument: ${argument}`);
  }
  return options;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const result = await runEvaluationSuite(options.root);
  const baselinePath = join(options.root, "evals", "results", "v1.0.0-baseline.json");

  if (options.write) {
    await mkdir(dirname(baselinePath), { recursive: true });
    await writeFile(baselinePath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  } else {
    if (!existsSync(baselinePath)) {
      throw new Error("Eval baseline is missing; run node scripts/run-evals.mjs --write");
    }
    const baseline = await readJson(baselinePath);
    if (!isDeepStrictEqual(comparable(result), comparable(baseline))) {
      throw new Error("Deterministic eval output differs from the committed baseline; inspect then use --write");
    }
  }

  if (options.json) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  else {
    process.stdout.write(
      `${result.summary.status}: ${result.summary.passed}/${result.summary.total} deterministic cases, ${result.summary.score}/${result.summary.max_score} weighted points; cross-model runs remain explicitly recorded.\n`,
    );
  }
  if (result.summary.status !== "PASS") process.exitCode = 1;
}

const invokedPath = process.argv[1] ? realpathSync(resolve(process.argv[1])) : null;
if (invokedPath === realpathSync(fileURLToPath(import.meta.url))) {
  main().catch((error) => {
    process.stderr.write(`${error.stack ?? error.message}\n`);
    process.exitCode = 1;
  });
}

#!/usr/bin/env node

import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import Ajv from "ajv";
import YAML from "yaml";

import {
  GENERATED_MARKER,
  parseSkillFrontmatter,
  serializeOpenAiMetadata,
} from "./generate-openai-metadata.mjs";

const REQUIRED_REPOSITORY_FILES = Object.freeze([
  "README.md",
  "LICENSE",
  "CHANGELOG.md",
  "CITATION.cff",
  "CODE_OF_CONDUCT.md",
  "CONTRIBUTING.md",
  "GOVERNANCE.md",
  "ROADMAP.md",
  "SECURITY.md",
  "SUPPORT.md",
  "package.json",
  ".claude-plugin/plugin.json",
]);

const SKIPPED_DIRECTORIES = new Set([
  ".git",
  ".landing-studio",
  ".superpowers",
  "coverage",
  "dist",
  "node_modules",
]);

const ALLOWED_SKILL_FIELDS = new Set([
  "name",
  "description",
  "license",
  "compatibility",
  "metadata",
  "allowed-tools",
]);

const EXPECTED_SKILLS = new Set([
  "aeo-audit", "conversion-optimization", "creative-direction", "geo-audit",
  "landing-copywriter", "landing-design-system", "landing-page-build", "landing-page-design",
  "landing-page-implementation", "landing-page-qa", "landing-red-team", "landing-research",
  "marketing-campaign", "media-sourcing", "motion-video", "seo-audit",
  "technology-curator", "webgl-3d",
]);

const TEMPLATE_SCHEMA_PAIRS = Object.freeze({
  "browser-report": "browser-report",
  "creative-directions": "creative-directions",
  "dependency-decision": "dependency-decision",
  "evidence-ledger": "evidence-ledger",
  "implementation-report": "implementation-report",
  "media-ledger": "media-ledger",
  "page-audit": "page-audit",
  "page-frame": "page-frame",
  "red-team-report": "red-team-report",
  run: "run",
});

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function asRelative(root, path) {
  return relative(root, path).split(sep).join("/") || ".";
}

async function walk(directory) {
  const paths = [];
  if (!existsSync(directory)) return paths;
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && SKIPPED_DIRECTORIES.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      paths.push(...(await walk(path)));
    } else if (entry.isFile()) {
      paths.push(path);
    }
  }
  return paths;
}

async function readJson(path, root, errors) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    errors.push(`${asRelative(root, path)} has invalid JSON: ${error.message}`);
    return null;
  }
}

function parseYaml(source, file, root, errors) {
  const document = YAML.parseDocument(source, {
    prettyErrors: true,
    uniqueKeys: true,
  });
  if (document.errors.length > 0) {
    errors.push(
      `${asRelative(root, file)} has invalid YAML: ${document.errors
        .map((error) => error.message)
        .join("; ")}`,
    );
    return null;
  }
  return document.toJS();
}

function validateSkillContract(contract, body, directoryName, file, root, errors) {
  if (!isRecord(contract)) {
    errors.push(`${asRelative(root, file)} frontmatter must be a YAML mapping`);
    return;
  }

  for (const field of Object.keys(contract)) {
    if (!ALLOWED_SKILL_FIELDS.has(field)) {
      errors.push(`${asRelative(root, file)} uses unsupported frontmatter field ${field}`);
    }
  }

  if (
    typeof contract.name !== "string" ||
    contract.name.length < 1 ||
    contract.name.length > 64 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(contract.name)
  ) {
    errors.push(
      `${asRelative(root, file)} name must be 1-64 lowercase letters, digits, or single hyphens`,
    );
  } else if (contract.name !== directoryName) {
    errors.push(
      `${asRelative(root, file)} name ${contract.name} does not match directory ${directoryName}`,
    );
  }

  if (typeof contract.description !== "string" || contract.description.trim().length < 1) {
    errors.push(`${asRelative(root, file)} description must be a non-empty string`);
  } else if (contract.description.length > 1024) {
    errors.push(
      `${asRelative(root, file)} description exceeds the Agent Skills 1024-character limit`,
    );
  }

  if (contract.license !== "Apache-2.0") {
    errors.push(`${asRelative(root, file)} license must be Apache-2.0`);
  }

  if ("compatibility" in contract) {
    if (
      typeof contract.compatibility !== "string" ||
      contract.compatibility.length < 1 ||
      contract.compatibility.length > 500
    ) {
      errors.push(`${asRelative(root, file)} compatibility must be 1-500 characters`);
    }
  }

  if ("metadata" in contract) {
    if (!isRecord(contract.metadata)) {
      errors.push(`${asRelative(root, file)} metadata must be a string-to-string mapping`);
    } else {
      for (const [key, value] of Object.entries(contract.metadata)) {
        if (typeof key !== "string" || typeof value !== "string") {
          errors.push(`${asRelative(root, file)} metadata must contain only string values`);
          break;
        }
      }
    }
  }

  if (typeof body !== "string" || body.trim().length === 0) {
    errors.push(`${asRelative(root, file)} must contain instructions after frontmatter`);
  }
}

function validateOpenAiMetadata(value, contract, file, root, errors) {
  const label = asRelative(root, file);
  if (!isRecord(value) || !isRecord(value.interface)) {
    errors.push(`${label} must contain an interface mapping`);
    return;
  }

  const metadata = value.interface;
  if (
    typeof metadata.display_name !== "string" ||
    metadata.display_name.trim().length < 1 ||
    metadata.display_name.length > 64
  ) {
    errors.push(`${label} interface.display_name must be 1-64 characters`);
  }
  if (
    typeof metadata.short_description !== "string" ||
    metadata.short_description.length < 25 ||
    metadata.short_description.length > 64
  ) {
    errors.push(`${label} interface.short_description must be 25-64 characters`);
  }
  if (
    typeof metadata.default_prompt !== "string" ||
    !metadata.default_prompt.includes(`$${contract.name}`)
  ) {
    errors.push(`${label} interface.default_prompt must explicitly mention $${contract.name}`);
  }
}

async function validateSkills(root, errors, warnings) {
  const skillsRoot = join(root, "skills");
  if (!existsSync(skillsRoot)) {
    errors.push("skills/ is missing");
    return 0;
  }

  const entries = (await readdir(skillsRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    const skillDirectory = join(skillsRoot, entry.name);
    const skillPath = join(skillDirectory, "SKILL.md");
    if (!existsSync(skillPath)) {
      errors.push(`skills/${entry.name}/SKILL.md is missing`);
      continue;
    }

    let parsed;
    try {
      parsed = parseSkillFrontmatter(await readFile(skillPath, "utf8"), skillPath);
    } catch (error) {
      errors.push(`${asRelative(root, skillPath)} has invalid YAML frontmatter: ${error.message}`);
      continue;
    }

    validateSkillContract(
      parsed.frontmatter,
      parsed.body,
      entry.name,
      skillPath,
      root,
      errors,
    );

    const metadataPath = join(skillDirectory, "agents", "openai.yaml");
    if (!existsSync(metadataPath)) {
      errors.push(`${asRelative(root, metadataPath)} is missing`);
      continue;
    }
    const metadataSource = await readFile(metadataPath, "utf8");
    const metadata = parseYaml(metadataSource, metadataPath, root, errors);
    if (metadata !== null) {
      validateOpenAiMetadata(metadata, parsed.frontmatter, metadataPath, root, errors);
    }

    if (metadataSource.startsWith(GENERATED_MARKER)) {
      let expected;
      try {
        expected = serializeOpenAiMetadata(parsed.frontmatter);
      } catch (error) {
        errors.push(`${asRelative(root, metadataPath)} cannot be regenerated: ${error.message}`);
        continue;
      }
      if (metadataSource !== expected) {
        errors.push(
          `${asRelative(root, metadataPath)} is stale; run npm run metadata to regenerate it`,
        );
      }
    } else {
      warnings.push(`${asRelative(root, metadataPath)} is maintained manually`);
    }
  }

  return entries.length;
}

function markdownWithoutCode(source) {
  return source
    .replace(/```[\s\S]*?```/gu, "")
    .replace(/~~~[\s\S]*?~~~/gu, "")
    .replace(/`[^`\n]*`/gu, "");
}

function localLinkTarget(rawDestination) {
  let destination = rawDestination.trim();
  if (destination.startsWith("<") && destination.endsWith(">")) {
    destination = destination.slice(1, -1);
  }
  destination = destination.split(/\s+["']/u, 1)[0];
  if (
    destination === "" ||
    destination.startsWith("#") ||
    /^[a-z][a-z0-9+.-]*:/iu.test(destination) ||
    destination.startsWith("//") ||
    /[<$>{}*]/u.test(destination)
  ) {
    return null;
  }
  const withoutFragment = destination.split("#", 1)[0].split("?", 1)[0];
  try {
    return decodeURIComponent(withoutFragment);
  } catch {
    return withoutFragment;
  }
}

async function validateMarkdownLinks(root, markdownFiles, errors) {
  for (const file of markdownFiles) {
    const source = markdownWithoutCode(await readFile(file, "utf8"));
    const links = source.matchAll(/(?<!!)\[[^\]]*\]\(([^)]+)\)/gu);
    for (const match of links) {
      const target = localLinkTarget(match[1]);
      if (!target) continue;
      const resolved = target.startsWith("/")
        ? join(root, target.replace(/^\/+/, ""))
        : resolve(dirname(file), target);
      if (!resolved.startsWith(`${root}${sep}`) && resolved !== root) {
        errors.push(`${asRelative(root, file)} has a link outside the repository: ${target}`);
      } else if (!existsSync(resolved)) {
        errors.push(`${asRelative(root, file)} has a broken link: ${target}`);
      }
    }
  }
}

async function validateBrandKitTemplate(root, errors) {
  const path = join(root, "brand-kit.template.md");
  if (!existsSync(path)) return;
  const source = await readFile(path, "utf8");
  const block = source.match(/```yaml\r?\n([\s\S]*?)\r?\n```/u);
  if (!block) {
    errors.push("brand-kit.template.md must contain one fenced YAML contract");
    return;
  }
  const kit = parseYaml(block[1], path, root, errors);
  if (!isRecord(kit)) return;
  if (kit.kit_version !== "1.1") {
    errors.push("brand-kit.template.md kit_version must be 1.1");
    return;
  }

  const screenshots = kit.product?.ui_material?.screenshots;
  const recordings = kit.product?.ui_material?.recordings;
  const claims = kit.proof?.claims;
  const testimonials = kit.proof?.testimonials;
  const customerLogos = kit.proof?.customer_logos;
  if (!Array.isArray(screenshots) || !Array.isArray(recordings)) {
    errors.push("brand-kit.template.md v1.1 requires typed screenshots and recordings arrays");
  }
  if (!Array.isArray(claims) || !Array.isArray(testimonials) || !Array.isArray(customerLogos)) {
    errors.push(
      "brand-kit.template.md v1.1 requires claims, testimonials, and customer_logos arrays",
    );
  }
  if (!isRecord(kit.media)) {
    errors.push("brand-kit.template.md v1.1 requires a media policy mapping");
  }
}

function validateLicenseAndManifests(root, packageJson, pluginJson, errors) {
  const licensePath = join(root, "LICENSE");
  if (!existsSync(licensePath)) {
    errors.push("LICENSE is missing");
  } else {
    const source = readFileSync(licensePath, "utf8");
    if (!source.includes("Apache License") || !source.includes("Version 2.0, January 2004")) {
      errors.push("LICENSE must contain the Apache License 2.0 text");
    }
  }

  if (packageJson && packageJson.license !== "Apache-2.0") {
    errors.push("package.json license must be Apache-2.0");
  }
  if (pluginJson && pluginJson.license !== "Apache-2.0") {
    errors.push(".claude-plugin/plugin.json license must be Apache-2.0");
  }
}

async function validateCanonicalTemplates(root, jsonValues, errors) {
  for (const [templateName, schemaName] of Object.entries(TEMPLATE_SCHEMA_PAIRS)) {
    const templatePath = join(root, "templates", `${templateName}.yaml`);
    const schemaPath = join(root, "schemas", `${schemaName}.schema.json`);
    const schema = jsonValues.get(schemaPath);
    if (!existsSync(templatePath) || !schema) {
      errors.push(`canonical pair is missing: templates/${templateName}.yaml + schemas/${schemaName}.schema.json`);
      continue;
    }
    const value = parseYaml(await readFile(templatePath, "utf8"), templatePath, root, errors);
    if (value === null) continue;
    const validate = new Ajv({ allErrors: true, strict: false }).compile(schema);
    if (!validate(value)) {
      const details = validate.errors.map(({ instancePath, message }) => `${instancePath || "/"} ${message}`).join("; ");
      errors.push(`templates/${templateName}.yaml violates schemas/${schemaName}.schema.json: ${details}`);
    }
  }
  const creativeAsset = join(root, "skills", "creative-direction", "assets", "creative-territories.template.yaml");
  const creativeSchema = jsonValues.get(join(root, "schemas", "creative-directions.schema.json"));
  if (!existsSync(creativeAsset) || !creativeSchema) {
    errors.push("creative-direction canonical asset template or schema is missing");
  } else {
    const value = parseYaml(await readFile(creativeAsset, "utf8"), creativeAsset, root, errors);
    if (value !== null) {
      const validate = new Ajv({ allErrors: true, strict: false }).compile(creativeSchema);
      if (!validate(value)) {
        const details = validate.errors.map(({ instancePath, message }) => `${instancePath || "/"} ${message}`).join("; ");
        errors.push(`skills/creative-direction/assets/creative-territories.template.yaml violates schemas/creative-directions.schema.json: ${details}`);
      }
    }
  }
}

function runRepositoryTests(root, packageJson, errors, testScripts) {
  const scripts = isRecord(packageJson?.scripts) ? packageJson.scripts : {};
  const selected = testScripts ?? ["test"];
  for (const script of [...new Set(selected)]) {
    if (typeof scripts[script] !== "string") continue;
    const result = spawnSync(process.platform === "win32" ? "npm.cmd" : "npm", ["run", script, "--silent"], {
      cwd: root,
      encoding: "utf8",
      env: { ...process.env, LANDING_STUDIO_VALIDATOR_CHILD: "1" },
      maxBuffer: 8 * 1024 * 1024,
      timeout: 300_000,
    });
    if (result.status !== 0) {
      const detail = `${result.stderr || result.stdout || "no command output"}`.trim();
      errors.push(
        `${script} command failed with exit ${result.status ?? "unknown"}: ${detail.slice(-2000)}`,
      );
    }
  }
}

export async function validateRepository(
  repositoryRoot = process.cwd(),
  { runTests = true, testScripts } = {},
) {
  const root = resolve(repositoryRoot);
  const errors = [];
  const warnings = [];

  for (const file of REQUIRED_REPOSITORY_FILES) {
    if (!existsSync(join(root, file)) && file !== "LICENSE") {
      errors.push(`${file} is missing`);
    }
  }

  const allFiles = await walk(root);
  const jsonFiles = allFiles.filter((file) => extname(file) === ".json");
  const yamlFiles = allFiles.filter((file) => [".yaml", ".yml"].includes(extname(file)));
  const markdownFiles = allFiles.filter((file) => extname(file) === ".md");

  const jsonValues = new Map();
  for (const file of jsonFiles) {
    jsonValues.set(file, await readJson(file, root, errors));
  }
  for (const file of yamlFiles) {
    parseYaml(await readFile(file, "utf8"), file, root, errors);
  }

  for (const [file, value] of jsonValues.entries()) {
    if (file.endsWith(".schema.json") && value) {
      try {
        new Ajv({ allErrors: true, strict: false, formats: { "date-time": true } }).compile(
          value,
        );
      } catch (error) {
        errors.push(`${asRelative(root, file)} is not a compilable JSON Schema: ${error.message}`);
      }
    }
  }

  const packageJson = jsonValues.get(join(root, "package.json"));
  const pluginJson = jsonValues.get(join(root, ".claude-plugin", "plugin.json"));
  validateLicenseAndManifests(root, packageJson, pluginJson, errors);
  if (packageJson?.name === "landing-studio") {
    await validateCanonicalTemplates(root, jsonValues, errors);
    const skillEntries = await readdir(join(root, "skills"), { withFileTypes: true });
    const actualNames = new Set(skillEntries.filter((entry) => entry.isDirectory()).map(({ name }) => name));
    for (const name of EXPECTED_SKILLS) {
      if (!actualNames.has(name)) errors.push(`required skill is missing: skills/${name}`);
    }
    for (const name of actualNames) {
      if (!EXPECTED_SKILLS.has(name)) errors.push(`unexpected skill is not in the release inventory: skills/${name}`);
    }
  }
  const skillCount = await validateSkills(root, errors, warnings);
  await validateMarkdownLinks(root, markdownFiles, errors);
  await validateBrandKitTemplate(root, errors);

  if (runTests) runRepositoryTests(root, packageJson, errors, testScripts);

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    checked: {
      files: allFiles.length,
      skills: skillCount,
      json: jsonFiles.length,
      yaml: yamlFiles.length,
      markdown: markdownFiles.length,
    },
  };
}

function parseArguments(argv) {
  const options = { root: process.cwd(), runTests: true, json: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--root") {
      options.root = resolve(argv[++index]);
    } else if (argument === "--skip-tests") {
      options.runTests = false;
    } else if (argument === "--json") {
      options.json = true;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  return options;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const result = await validateRepository(options.root, { runTests: options.runTests });
  if (options.json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else {
    for (const warning of result.warnings) process.stdout.write(`warning: ${warning}\n`);
    for (const error of result.errors) process.stderr.write(`error: ${error}\n`);
    process.stdout.write(
      `${result.ok ? "valid" : "invalid"}: ${result.checked.skills} skills, ${result.checked.files} files\n`,
    );
  }
  if (!result.ok) process.exitCode = 1;
}

const invokedPath = process.argv[1] ? realpathSync(resolve(process.argv[1])) : null;
if (invokedPath === realpathSync(fileURLToPath(import.meta.url))) {
  main().catch((error) => {
    process.stderr.write(`${error.stack ?? error.message}\n`);
    process.exitCode = 1;
  });
}

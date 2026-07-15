#!/usr/bin/env node

import { createHash, randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { constants, createReadStream, createWriteStream, realpathSync } from 'node:fs';
import { copyFile, mkdir, open, readFile, realpath, rename, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';

import Ajv from 'ajv';
import { parse, stringify } from 'yaml';

const STAGE_RULES = {
  research: {
    allowed: new Set(['queued', 'research_ready', 'rejected', 'stale']),
    next: 'research_ready',
  },
  creative: {
    allowed: new Set(['research_ready', 'direction_ready']),
    next: 'direction_ready',
  },
  implementation: {
    allowed: new Set(['direction_approved', 'implemented']),
    next: 'implemented',
  },
  browser: {
    allowed: new Set(['implemented', 'browser_verified']),
    next: 'browser_verified',
  },
  'red-team': {
    allowed: new Set(['browser_verified', 'red_team_reviewed']),
    next: 'red_team_reviewed',
  },
};

const CAPABILITY_NAMES = new Set([
  'current_research',
  'interactive_browser',
  'screenshot_evidence',
  'image_generation',
  'video_generation',
  'independent_critic',
  'webgl_3d',
]);
const CAPABILITY_STATUSES = new Set(['native', 'fallback', 'unavailable', 'not-needed']);
const PAGE_AUDIT_KINDS = new Set(['full-page-browser', 'search-audits', 'final-red-team']);
const PAGE_AUDIT_CHECKS = {
  'full-page-browser': ['responsive-mobile', 'responsive-desktop', 'reduced-motion', 'primary-journey', 'accessibility', 'console-network', 'performance', 'privacy-consent', 'forms', 'metadata'],
  'search-audits': ['seo', 'aeo', 'geo', 'crawl-index-canonical', 'raw-html', 'metadata', 'structured-data'],
  'final-red-team': ['five-second-comprehension', 'copy-claims', 'design-originality', 'interaction-conversion', 'accessibility', 'performance-resilience', 'rights-privacy-deception', 'source-html-consistency'],
};

const schemaPath = join(import.meta.dirname, '..', 'schemas', 'run.schema.json');
let compiledValidator;
const contractValidators = new Map();

async function withRunLock(file, operation) {
  const lockPath = `${file}.lock`;
  await mkdir(dirname(file), { recursive: true });
  const deadline = Date.now() + 10_000;
  let handle;
  while (!handle) {
    try {
      handle = await open(lockPath, 'wx', 0o600);
      await handle.writeFile(`${JSON.stringify({ pid: process.pid, acquired_at: new Date().toISOString() })}\n`);
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      if (Date.now() >= deadline) {
        throw new Error(`Timed out waiting for run lock: ${lockPath}. Remove it only after confirming no writer is active.`);
      }
      await delay(25);
    }
  }
  try {
    return await operation();
  } finally {
    await handle.close().catch(() => {});
    await rm(lockPath, { force: true });
  }
}

function timestamp(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.valueOf())) throw new Error(`Invalid timestamp '${value}'`);
  return date.toISOString();
}

function epochTimestamp(value, label) {
  const epoch = Date.parse(value);
  const expected = value.endsWith('Z') && !value.includes('.') ? value.replace(/Z$/u, '.000Z') : value;
  if (Number.isNaN(epoch) || new Date(epoch).toISOString() !== expected) {
    throw new Error(`Invalid ${label} timestamp '${value}'`);
  }
  return epoch;
}

function stableId(prefix, seed) {
  const digest = seed
    ? createHash('sha256').update(seed).digest('hex').slice(0, 16)
    : randomBytes(8).toString('hex');
  return `${prefix}_${digest}`;
}

async function validator() {
  if (!compiledValidator) {
    const schema = JSON.parse(await readFile(schemaPath, 'utf8'));
    compiledValidator = new Ajv({ allErrors: true, strict: false, allowUnionTypes: true }).compile(schema);
  }
  return compiledValidator;
}

async function contractValidator(name) {
  if (!contractValidators.has(name)) {
    const contractPath = join(import.meta.dirname, '..', 'schemas', `${name}.schema.json`);
    const schema = JSON.parse(await readFile(contractPath, 'utf8'));
    contractValidators.set(
      name,
      new Ajv({ allErrors: true, strict: false, allowUnionTypes: true }).compile(schema),
    );
  }
  return contractValidators.get(name);
}

function contractSchemaName(stage, kind) {
  if (stage === 'browser') return 'browser-report';
  if (stage === 'red-team') return 'red-team-report';
  return {
    'research:evidence-ledger': 'evidence-ledger',
    'research:media-ledger': 'media-ledger',
    'creative:creative-directions': 'creative-directions',
    'implementation:implementation-report': 'implementation-report',
    'implementation:dependency-decision': 'dependency-decision',
  }[`${stage}:${kind}`] ?? null;
}

function semanticErrors(run) {
  const errors = [];
  const ids = new Set();
  const orders = new Set();
  for (const section of run.page?.sections ?? []) {
    if (ids.has(section.id)) errors.push(`duplicate section id '${section.id}'`);
    if (orders.has(section.order)) errors.push(`duplicate section order '${section.order}'`);
    ids.add(section.id);
    orders.add(section.order);
  }
  if (run.page?.active_section_id !== null && !ids.has(run.page?.active_section_id)) {
    errors.push(`active section '${run.page?.active_section_id}' does not exist`);
  }
  for (const finding of run.findings ?? []) {
    if (finding.section_id !== null && !ids.has(finding.section_id)) {
      errors.push(`finding '${finding.id}' names unknown section '${finding.section_id}'`);
    }
  }
  return errors;
}

export async function validateRun(run) {
  const validate = await validator();
  const valid = validate(run);
  const errors = [
    ...(valid
      ? []
      : validate.errors.map(({ instancePath, message, params }) =>
          `${instancePath || '/'} ${message}${params?.additionalProperty ? ` '${params.additionalProperty}'` : ''}`,
        )),
    ...semanticErrors(run),
  ];
  if (errors.length) throw new Error(`Invalid Landing Studio run manifest:\n- ${errors.join('\n- ')}`);
  return run;
}

async function atomicWrite(file, run) {
  await validateRun(run);
  await mkdir(dirname(file), { recursive: true });
  const temp = join(dirname(file), `.${file.split('/').at(-1)}.tmp-${process.pid}-${randomBytes(4).toString('hex')}`);
  let handle;
  try {
    handle = await open(temp, 'wx', 0o600);
    await handle.writeFile(stringify(run, { lineWidth: 0 }));
    await handle.sync();
    await handle.close();
    handle = undefined;
    await rename(temp, file);
  } catch (error) {
    await handle?.close().catch(() => {});
    await rm(temp, { force: true }).catch(() => {});
    throw error;
  }
}

export async function loadRun(file = '.landing-studio/run.yaml') {
  const absolute = resolve(file);
  let source;
  try {
    source = await readFile(absolute, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') throw new Error(`Run manifest not found: ${absolute}`);
    throw error;
  }
  let run;
  try {
    run = parse(source);
  } catch (error) {
    throw new Error(`Invalid YAML in ${absolute}: ${error.message}`);
  }
  return validateRun(run);
}

function normalizeSections(sections) {
  if (!Array.isArray(sections) || sections.length === 0) throw new Error('At least one page section is required');
  return sections.map((section, index) => ({
    id: section.id,
    title: section.title,
    order: section.order ?? index + 1,
    status: 'queued',
    locked: false,
    stale: false,
    stale_reasons: [],
    locks: { direction: false },
    artifacts: [],
    approvals: [],
    rejections: [],
  }));
}

async function ensureStateIgnored(projectRoot, stateFile) {
  const root = resolve(projectRoot);
  const stateDirectory = dirname(resolve(stateFile));
  const stateRelative = relative(root, stateDirectory).split(sep).join('/');
  if (stateRelative !== '.landing-studio') return false;
  const check = spawnSync('git', ['check-ignore', '-q', '.landing-studio/run.yaml'], { cwd: root });
  if (check.status === 0) return false;
  const ignorePath = join(root, '.gitignore');
  let current = '';
  try { current = await readFile(ignorePath, 'utf8'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const lines = current.split(/\r?\n/u);
  if (lines.includes('.landing-studio/') || lines.includes('/.landing-studio/')) return false;
  const prefix = current && !current.endsWith('\n') ? '\n' : '';
  await writeFile(ignorePath, `${current}${prefix}.landing-studio/\n`);
  return true;
}

export async function initializeRun({
  file = '.landing-studio/run.yaml',
  projectRoot = process.cwd(),
  route,
  testBaseUrl,
  pageId,
  outcome,
  successMetric,
  producerContextId,
  sections,
  capabilities = {},
  now,
  __locked = false,
}) {
  const absolute = resolve(file);
  if (!__locked) {
    return withRunLock(absolute, () => initializeRun({
      file: absolute,
      projectRoot,
      route,
      testBaseUrl,
      pageId,
      outcome,
      successMetric,
      producerContextId,
      sections,
      capabilities,
      now,
      __locked: true,
    }));
  }
  try {
    await stat(absolute);
    throw new Error(`Run manifest already exists: ${absolute}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const recordedAt = timestamp(now);
  const normalizedSections = normalizeSections(sections);
  await ensureStateIgnored(projectRoot, absolute);
  const run = {
    schema_version: '1.0.0',
    run: {
      id: stableId('ls', `${resolve(projectRoot)}\0${route}\0${pageId}\0${recordedAt}`),
      created_at: recordedAt,
      updated_at: recordedAt,
      requested_outcome: outcome,
      success_metric: successMetric,
      producer_context_id: producerContextId,
    },
    project: { root: resolve(projectRoot), route, page_id: pageId, test_base_url: testBaseUrl },
    capabilities,
    page: {
      frame: { artifact: null, approval: null },
      active_section_id: null,
      sections: normalizedSections,
      final_artifacts: [],
    },
    findings: [],
    skips: [],
    release: { decision: 'UNASSESSED', checked_at: null, blockers: [], unresolved_risks: [] },
  };
  await atomicWrite(absolute, run);
  return run;
}

function findSection(run, sectionId) {
  const section = run.page.sections.find(({ id }) => id === sectionId);
  if (!section) throw new Error(`Unknown section '${sectionId}'`);
  return section;
}

function requireActive(run, section) {
  if (run.page.active_section_id !== section.id) {
    throw new Error(`Section '${section.id}' is not active; active section is '${run.page.active_section_id ?? 'none'}'`);
  }
}

async function openSafeArtifact(projectRoot, artifactPath) {
  const root = resolve(projectRoot);
  const absolute = isAbsolute(artifactPath) ? resolve(artifactPath) : resolve(root, artifactPath);
  if (absolute !== root && !absolute.startsWith(`${root}${sep}`)) {
    throw new Error(`Artifact escapes project root: ${absolute}`);
  }
  const rootReal = await realpath(root);
  const artifactReal = await realpath(absolute).catch((error) => {
    if (error.code === 'ENOENT') throw new Error(`Artifact does not exist: ${absolute}`);
    throw error;
  });
  const expectedReal = resolve(rootReal, relative(root, absolute));
  if (artifactReal !== expectedReal
    || (artifactReal !== rootReal && !artifactReal.startsWith(`${rootReal}${sep}`))) {
    throw new Error(`Artifact uses a symlink or resolves outside project root: ${absolute}`);
  }
  const handle = await open(absolute, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0)).catch((error) => {
    if (error.code === 'ENOENT') throw new Error(`Artifact does not exist: ${absolute}`);
    if (error.code === 'ELOOP') throw new Error(`Artifact symlink is not allowed: ${absolute}`);
    throw error;
  });
  const info = await handle.stat();
  if (!info.isFile()) {
    await handle.close();
    throw new Error(`Artifact is not a regular file: ${absolute}`);
  }
  return { root, absolute, handle };
}

async function hashOpenHandle(handle) {
  return new Promise((fulfill, reject) => {
    const hash = createHash('sha256');
    const stream = handle.createReadStream({ autoClose: false });
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('error', reject);
    stream.on('end', () => fulfill(hash.digest('hex')));
  });
}

async function hashArtifact(projectRoot, artifactPath) {
  const opened = await openSafeArtifact(projectRoot, artifactPath);
  let sha256;
  try { sha256 = await hashOpenHandle(opened.handle); }
  finally { await opened.handle.close(); }
  return {
    path: isAbsolute(artifactPath) ? relative(opened.root, opened.absolute) : artifactPath,
    sha256,
  };
}

async function copyArtifactSafely(projectRoot, artifactPath, target, expectedSha256) {
  const opened = await openSafeArtifact(projectRoot, artifactPath);
  await mkdir(dirname(target), { recursive: true });
  try {
    await pipeline(
      opened.handle.createReadStream({ autoClose: false }),
      createWriteStream(target, { flags: 'wx', mode: 0o600 }),
    );
  } finally {
    await opened.handle.close();
  }
  const copied = await new Promise((fulfill, reject) => {
    const hash = createHash('sha256');
    const stream = createReadStream(target);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('error', reject);
    stream.on('end', () => fulfill(hash.digest('hex')));
  });
  if (copied !== expectedSha256) throw new Error(`Artifact changed while exporting: '${artifactPath}'`);
}

function absoluteArtifactPath(run, artifactPath) {
  return isAbsolute(artifactPath) ? artifactPath : resolve(run.project.root, artifactPath);
}

async function loadContractArtifact(run, section, artifact) {
  const absolute = absoluteArtifactPath(run, artifact.path);
  const schemaName = contractSchemaName(artifact.stage, artifact.kind);
  if (!schemaName) return null;
  let value;
  try {
    const source = await readFile(absolute, 'utf8');
    value = artifact.stage === 'browser' || absolute.endsWith('.json') ? JSON.parse(source) : parse(source);
  } catch (error) {
    throw new Error(`Cannot parse ${artifact.stage} contract '${artifact.path}': ${error.message}`);
  }
  const validate = await contractValidator(schemaName);
  if (!validate(value)) {
    const details = validate.errors
      .map(({ instancePath, message }) => `${instancePath || '/'} ${message}`)
      .join('; ');
    throw new Error(`${artifact.stage} contract '${artifact.path}' is invalid: ${details}`);
  }
  if (value.run_id !== run.run.id) {
    throw new Error(`${artifact.stage} contract run_id '${value.run_id}' does not match '${run.run.id}'`);
  }
  if (value.section_id !== section.id) {
    throw new Error(`${artifact.stage} contract section_id '${value.section_id}' does not match '${section.id}'`);
  }
  if (artifact.stage === 'browser') epochTimestamp(value.captured_at, 'browser captured_at');
  if (artifact.stage === 'red-team') epochTimestamp(value.reviewed_at, 'red-team reviewed_at');
  if (artifact.stage === 'red-team' && value.decision === 'PASS' && value.fresh_context !== true) {
    throw new Error('A red-team PASS requires fresh_context: true; reduced-assurance self-review cannot certify a section');
  }
  if (artifact.stage === 'red-team' && value.producer_context_id !== run.run.producer_context_id) {
    throw new Error('Red-team producer_context_id does not match the run producer');
  }
  if (artifact.stage === 'red-team' && value.reviewer_context_id === value.producer_context_id) {
    throw new Error('Red-team reviewer_context_id must differ from producer_context_id');
  }
  if (artifact.stage === 'red-team' && value.decision === 'PASS') {
    for (const finding of value.findings) {
      const resolvedP01 = ['P0', 'P1'].includes(finding.severity)
        && finding.disposition === 'fixed'
        && finding.owner
        && finding.disposition_note;
      const resolvedP2 = finding.severity === 'P2'
        && ['fixed', 'accepted', 'rejected'].includes(finding.disposition)
        && finding.owner
        && finding.disposition_note;
      const ownedP3 = finding.severity === 'P3'
        && (finding.disposition !== 'open' || (finding.owner && finding.disposition_note));
      if (!(resolvedP01 || resolvedP2 || ownedP3)) {
        throw new Error(`Red-team PASS contains unresolved finding '${finding.id}'`);
      }
    }
  }
  if (['browser', 'red-team'].includes(artifact.stage)) {
    const evidence = artifact.stage === 'browser' ? value.artifacts : value.evidence_bundle;
    const evidenceRoot = dirname(absolute);
    for (const item of evidence) {
      const evidencePath = resolve(evidenceRoot, item.path);
      const projectRoot = resolve(run.project.root);
      if (evidencePath !== projectRoot && !evidencePath.startsWith(`${projectRoot}${sep}`)) {
        throw new Error(`${artifact.stage} evidence escapes project root: '${item.path}'`);
      }
      const digest = await hashArtifact(run.project.root, evidencePath).catch((error) => {
        if (/does not exist/u.test(error.message)) throw new Error(`${artifact.stage} evidence is missing: '${item.path}'`);
        throw error;
      });
      if (digest.sha256 !== item.sha256) throw new Error(`${artifact.stage} evidence hash mismatch: '${item.path}'`);
    }
  }
  if (artifact.stage === 'browser') {
    const artifactKeys = new Set(value.artifacts.map((item) => `${item.project}\0${item.type}\0${item.path}`));
    for (const project of value.projects) {
      const auditedUrl = new URL(project.accessibility.url);
      const reportTarget = new URL(value.url);
      if (auditedUrl.origin !== reportTarget.origin || auditedUrl.pathname !== reportTarget.pathname) {
        throw new Error(`Browser project '${project.name}' audited accessibility on '${auditedUrl.href}', not the target page`);
      }
      for (const screenshot of project.evidence.screenshots) {
        if (!artifactKeys.has(`${project.name}\0screenshot\0${screenshot}`)) {
          throw new Error(`Browser project '${project.name}' screenshot lacks a hashed artifact: '${screenshot}'`);
        }
      }
      if (!artifactKeys.has(`${project.name}\0trace\0${project.evidence.trace}`)) {
        throw new Error(`Browser project '${project.name}' trace lacks a hashed artifact: '${project.evidence.trace}'`);
      }
    }
    const expectedRoute = run.project.route.replace(/\/$/u, '') || '/';
    const reportUrl = new URL(value.url);
    const expectedOrigin = new URL(run.project.test_base_url).origin;
    if (reportUrl.origin !== expectedOrigin) {
      throw new Error(`Browser origin '${reportUrl.origin}' does not match approved origin '${expectedOrigin}'`);
    }
    const actualRoute = reportUrl.pathname.replace(/\/$/u, '') || '/';
    if (actualRoute !== expectedRoute) {
      throw new Error(`Browser URL route '${actualRoute}' does not match run route '${expectedRoute}'`);
    }
    if (value.decision === 'PASS') {
      const widths = value.projects.map(({ viewport }) => viewport.width);
      const reducedMotion = value.projects.some(({ preferences }) => preferences.reducedMotion === 'reduce');
      if (!widths.some((width) => width <= 480) || !widths.some((width) => width >= 1024) || !reducedMotion) {
        throw new Error('Browser PASS requires mobile, desktop, and reduced-motion projects');
      }
    }
  }
  if (schemaName === 'creative-directions') {
    const territoryIds = value.territories.map(({ id }) => id);
    if (new Set(territoryIds).size !== 3 || !territoryIds.includes(value.selected_territory_id)) {
      throw new Error('Creative directions require three unique territories and a valid selection');
    }
    const expectedPairs = new Set([
      [territoryIds[0], territoryIds[1]].sort().join('\0'),
      [territoryIds[0], territoryIds[2]].sort().join('\0'),
      [territoryIds[1], territoryIds[2]].sort().join('\0'),
    ]);
    const actualPairs = new Set(value.pairwise_audit.map(({ left, right }) => [left, right].sort().join('\0')));
    if (actualPairs.size !== 3 || [...expectedPairs].some((pair) => !actualPairs.has(pair))) {
      throw new Error('Creative pairwise audit must cover each distinct territory pair exactly once');
    }
  }
  if (schemaName === 'media-ledger') {
    for (const asset of value.assets) {
      const digest = await hashArtifact(run.project.root, asset.local_path);
      if (digest.sha256 !== asset.sha256) throw new Error(`Media asset hash mismatch: '${asset.local_path}'`);
      if (asset.release_ready) {
        for (const field of ['source_url', 'creator', 'rights_holder', 'license_id', 'license_snapshot_url', 'approved_by']) {
          if (/^(?:unknown|none|n\/a|not[ -]?checked|tbd)$/iu.test(asset[field].trim())) {
            throw new Error(`Release-ready media '${asset.id}' has unresolved ${field}`);
          }
        }
        const acquired = Date.parse(`${asset.acquired_at}T00:00:00.000Z`);
        const approved = epochTimestamp(asset.approved_at, `media '${asset.id}' approved_at`);
        if (Number.isNaN(acquired) || new Date(acquired).toISOString().slice(0, 10) !== asset.acquired_at) {
          throw new Error(`Release-ready media '${asset.id}' has an invalid acquired_at date`);
        }
        if (acquired > Date.now()) throw new Error(`Release-ready media '${asset.id}' acquisition is in the future`);
        if (approved > Date.now()) throw new Error(`Release-ready media '${asset.id}' approval is in the future`);
        if (asset.expires_at) {
          const expires = Date.parse(`${asset.expires_at}T23:59:59.999Z`);
          if (Number.isNaN(expires) || new Date(expires).toISOString().slice(0, 10) !== asset.expires_at || expires < Date.now()) {
            throw new Error(`Release-ready media '${asset.id}' is expired or has an invalid expiry`);
          }
        }
      }
    }
  }
  if (schemaName === 'evidence-ledger') {
    for (const entry of value.entries) {
      const publicUse = entry.allowed_use.some((use) => ['public-landing-page', 'public-marketing'].includes(use));
      if (publicUse && ['VERIFIED', 'USER-SUPPLIED'].includes(entry.status)) {
        for (const field of ['source', 'owner', 'approved_by']) {
          if (/^(?:unknown|none|n\/a|not[ -]?checked|tbd)$/iu.test(entry[field].trim())) {
            throw new Error(`Public claim '${entry.id}' has unresolved ${field}`);
          }
        }
        const accessed = Date.parse(`${entry.accessed}T00:00:00.000Z`);
        if (Number.isNaN(accessed) || new Date(accessed).toISOString().slice(0, 10) !== entry.accessed || accessed > Date.now()) {
          throw new Error(`Public claim '${entry.id}' has an invalid or future accessed date`);
        }
        const approved = epochTimestamp(entry.approved_at, `claim '${entry.id}' approved_at`);
        if (approved > Date.now()) throw new Error(`Public claim '${entry.id}' approval is in the future`);
      }
    }
  }
  if (schemaName === 'dependency-decision') {
    const proof = await hashArtifact(run.project.root, value.proof.path);
    if (proof.sha256 !== value.proof.sha256) throw new Error(`Dependency proof hash mismatch: '${value.proof.path}'`);
    if (value.decision === 'adopt') {
      for (const field of ['license', 'security_status', 'maintenance_evidence']) {
        if (/^(unknown|none|n\/a|not checked)$/iu.test(value[field].trim())) {
          throw new Error(`Adopted dependency '${value.id}' has unresolved ${field}`);
        }
      }
    }
  }
  if (schemaName === 'implementation-report') {
    if (value.route !== run.project.route) throw new Error(`Implementation route '${value.route}' does not match run route '${run.project.route}'`);
    for (const reference of [...value.source_files, value.build.evidence, value.tests.evidence]) {
      const digest = await hashArtifact(run.project.root, reference.path);
      if (digest.sha256 !== reference.sha256) throw new Error(`Implementation evidence hash mismatch: '${reference.path}'`);
    }
  }
  return value;
}

async function inspectArtifact(run, section, artifact) {
  const digest = await hashArtifact(run.project.root, artifact.path);
  if (digest.sha256 !== artifact.sha256) {
    throw new Error(`Artifact changed after recording: '${artifact.path}'`);
  }
  if (contractSchemaName(artifact.stage, artifact.kind)) {
    return loadContractArtifact(run, section, artifact);
  }
  return null;
}

async function loadPageContract(run, artifact, schemaName) {
  const absolute = absoluteArtifactPath(run, artifact.path);
  let value;
  try {
    const source = await readFile(absolute, 'utf8');
    value = absolute.endsWith('.json') ? JSON.parse(source) : parse(source);
  } catch (error) {
    throw new Error(`Cannot parse ${schemaName} contract '${artifact.path}': ${error.message}`);
  }
  const validate = await contractValidator(schemaName);
  if (!validate(value)) {
    const details = validate.errors.map(({ instancePath, message }) => `${instancePath || '/'} ${message}`).join('; ');
    throw new Error(`${schemaName} contract '${artifact.path}' is invalid: ${details}`);
  }
  if (value.run_id !== run.run.id || value.page_id !== run.project.page_id) {
    throw new Error(`${schemaName} contract does not match run '${run.run.id}' and page '${run.project.page_id}'`);
  }
  return value;
}

async function inspectPageArtifact(run, artifact, schemaName) {
  const digest = await hashArtifact(run.project.root, artifact.path);
  if (digest.sha256 !== artifact.sha256) throw new Error(`Artifact changed after recording: '${artifact.path}'`);
  const contract = await loadPageContract(run, artifact, schemaName);
  if (schemaName === 'page-frame') epochTimestamp(contract.created_at, 'page frame created_at');
  if (schemaName === 'page-frame') {
    const expected = run.page.sections.map(({ id, title }) => `${id}\0${title}`);
    const actual = contract.sections.map(({ id, title }) => `${id}\0${title}`);
    if (expected.length !== actual.length || expected.some((entry, index) => entry !== actual[index])) {
      throw new Error('Page frame section queue does not match the initialized run');
    }
  } else {
    const capturedAt = epochTimestamp(contract.captured_at, `page audit '${contract.kind}' captured_at`);
    const auditUrl = new URL(contract.url);
    const approvedUrl = new URL(run.project.test_base_url);
    const expectedRoute = run.project.route.replace(/\/$/u, '') || '/';
    const auditRoute = auditUrl.pathname.replace(/\/$/u, '') || '/';
    if (auditUrl.origin !== approvedUrl.origin || auditRoute !== expectedRoute) {
      throw new Error(`Page audit '${contract.kind}' URL is outside the approved origin/route`);
    }
    if (contract.kind !== artifact.kind) throw new Error(`Page audit kind '${contract.kind}' does not match '${artifact.kind}'`);
    if (contract.producer_context_id !== run.run.producer_context_id) throw new Error('Page audit producer context does not match the run');
    if (contract.kind === 'final-red-team' && contract.reviewer_context_id === contract.producer_context_id) {
      throw new Error('Final page red-team reviewer must differ from the producer');
    }
    const evidenceRoot = dirname(absoluteArtifactPath(run, artifact.path));
    for (const item of contract.evidence) {
      const evidencePath = resolve(evidenceRoot, item.path);
      const digestEntry = await hashArtifact(run.project.root, evidencePath);
      if (digestEntry.sha256 !== item.sha256) throw new Error(`Page audit evidence hash mismatch: '${item.path}'`);
    }
    const checks = new Map(contract.checks.map((check) => [check.name, check]));
    for (const name of PAGE_AUDIT_CHECKS[contract.kind]) {
      if (!checks.has(name)) throw new Error(`Page audit '${contract.kind}' lacks required check '${name}'`);
    }
    if (contract.kind === 'search-audits' && contract.evidence.length < 3) {
      throw new Error('Search page audit must retain the SEO, AEO, and GEO reports');
    }
    if (contract.kind === 'full-page-browser') {
      let browserReport = null;
      let browserReportPath = null;
      for (const item of contract.evidence) {
        const candidatePath = resolve(dirname(absoluteArtifactPath(run, artifact.path)), item.path);
        if (!candidatePath.endsWith('.json')) continue;
        try {
          const candidate = JSON.parse(await readFile(candidatePath, 'utf8'));
          const validateBrowser = await contractValidator('browser-report');
          if (validateBrowser(candidate)) {
            browserReport = candidate;
            browserReportPath = candidatePath;
            break;
          }
        } catch { /* not the browser report */ }
      }
      if (!browserReport) throw new Error('Full-page browser audit must hash-link a schema-valid browser report');
      if (browserReport.run_id !== run.run.id || browserReport.section_id !== 'page'
        || browserReport.url !== contract.url || browserReport.commit !== contract.commit) {
        throw new Error('Full-page browser report does not match the page audit candidate');
      }
      if (contract.decision === 'PASS' && browserReport.decision !== 'PASS') {
        throw new Error('Full-page browser page-audit PASS requires browser-report PASS');
      }
      if (epochTimestamp(browserReport.captured_at, 'full-page browser captured_at') > capturedAt) {
        throw new Error('Full-page audit predates its browser report');
      }
      const widths = browserReport.projects.map(({ viewport }) => viewport.width);
      if (!widths.some((width) => width <= 480) || !widths.some((width) => width >= 1024)
        || !browserReport.projects.some(({ preferences }) => preferences.reducedMotion === 'reduce')) {
        throw new Error('Full-page browser report lacks mobile, desktop, or reduced-motion coverage');
      }
      const reportRoot = dirname(browserReportPath);
      const artifactKeys = new Set(browserReport.artifacts.map((item) => `${item.project}\0${item.type}\0${item.path}`));
      for (const project of browserReport.projects) {
        for (const screenshot of project.evidence.screenshots) {
          if (!artifactKeys.has(`${project.name}\0screenshot\0${screenshot}`)) {
            throw new Error(`Full-page browser screenshot lacks a hashed artifact: '${screenshot}'`);
          }
        }
        if (!artifactKeys.has(`${project.name}\0trace\0${project.evidence.trace}`)) {
          throw new Error(`Full-page browser trace lacks a hashed artifact: '${project.evidence.trace}'`);
        }
      }
      for (const item of browserReport.artifacts) {
        const digest = await hashArtifact(run.project.root, resolve(reportRoot, item.path));
        if (digest.sha256 !== item.sha256) throw new Error(`Full-page browser nested evidence hash mismatch: '${item.path}'`);
      }
    }
    if (contract.kind === 'final-red-team') {
      if (contract.fresh_context !== true) throw new Error('Final page red team requires fresh_context: true');
      if (contract.decision === 'PASS') {
        for (const finding of contract.findings) {
          const closesP01 = ['P0', 'P1'].includes(finding.severity) && finding.disposition === 'fixed';
          const closesP2 = finding.severity === 'P2' && ['fixed', 'accepted', 'rejected'].includes(finding.disposition);
          if ((['P0', 'P1', 'P2'].includes(finding.severity))
            && (!(closesP01 || closesP2) || !finding.owner || !finding.disposition_note)) {
            throw new Error(`Final page red-team PASS contains unresolved finding '${finding.id}'`);
          }
          if (finding.severity === 'P3' && finding.disposition === 'open'
            && (!finding.owner || !finding.disposition_note)) {
            throw new Error(`Final page red-team PASS contains unowned backlog finding '${finding.id}'`);
          }
        }
      }
      const reportRoot = dirname(absoluteArtifactPath(run, artifact.path));
      for (const kind of ['full-page-browser', 'search-audits']) {
        const prior = [...run.page.final_artifacts].reverse().find((item) => item.kind === kind && !item.stale);
        if (!prior) throw new Error(`Final page red team requires current '${kind}' evidence`);
        const linked = contract.evidence.some((item) =>
          resolve(reportRoot, item.path) === absoluteArtifactPath(run, prior.path) && item.sha256 === prior.sha256);
        if (!linked) throw new Error(`Final page red team must hash-link current '${kind}' report`);
        const priorContract = await loadPageContract(run, prior, 'page-audit');
        if (capturedAt < epochTimestamp(priorContract.captured_at, `page audit '${kind}' captured_at`)) {
          throw new Error(`Final page red team predates '${kind}' evidence`);
        }
      }
    }
  }
  return contract;
}

function currentArtifact(section, stage) {
  return [...section.artifacts].reverse().find((artifact) => artifact.stage === stage && !artifact.stale);
}

function currentArtifactByKind(section, kind) {
  return [...section.artifacts].reverse().find((artifact) => artifact.kind === kind && !artifact.stale);
}

async function validateSectionContracts(run, section) {
  const contracts = {};
  for (const kind of ['evidence-ledger', 'media-ledger', 'creative-directions', 'implementation-report']) {
    const artifact = currentArtifactByKind(section, kind);
    if (!artifact) throw new Error(`Section '${section.id}' lacks required '${kind}' artifact`);
    contracts[kind] = await inspectArtifact(run, section, artifact);
  }
  const evidenceById = new Map(contracts['evidence-ledger'].entries.map((entry) => [entry.id, entry]));
  const mediaById = new Map(contracts['media-ledger'].assets.map((asset) => [asset.id, asset]));
  const dependenciesById = new Map();
  for (const artifact of section.artifacts.filter(({ kind, stale }) => kind === 'dependency-decision' && !stale)) {
    const dependency = await inspectArtifact(run, section, artifact);
    dependenciesById.set(dependency.id, dependency);
  }
  const implementation = contracts['implementation-report'];
  for (const id of implementation.claims_used) {
    const entry = evidenceById.get(id);
    if (!entry || !['VERIFIED', 'USER-SUPPLIED'].includes(entry.status)
      || !entry.allowed_use.some((use) => ['public-landing-page', 'public-marketing'].includes(use))) {
      throw new Error(`Implementation claim '${id}' lacks public-use evidence`);
    }
  }
  for (const id of implementation.media_assets_used) {
    const media = mediaById.get(id);
    if (!media?.release_ready || !media.allowed_channels.includes('public-landing-page')) {
      throw new Error(`Implementation media '${id}' is not release-ready for public-landing-page`);
    }
  }
  for (const id of implementation.dependencies_used) {
    if (dependenciesById.get(id)?.decision !== 'adopt') {
      throw new Error(`Implementation dependency '${id}' lacks an adopted decision`);
    }
  }
  return contracts;
}

function validateReviewSequence(run, browserArtifact, browser, redTeamArtifact, redTeam) {
  const browserPath = absoluteArtifactPath(run, browserArtifact.path);
  const redTeamRoot = dirname(absoluteArtifactPath(run, redTeamArtifact.path));
  const linked = redTeam.evidence_bundle.find((item) =>
    item.kind === 'browser-report'
      && resolve(redTeamRoot, item.path) === browserPath
      && item.sha256 === browserArtifact.sha256);
  if (!linked) throw new Error('Red-team evidence must hash-link the current browser report');
  if (epochTimestamp(redTeam.reviewed_at, 'red-team reviewed_at') < epochTimestamp(browser.captured_at, 'browser captured_at')) {
    throw new Error('Red-team review predates the browser evidence it claims to review');
  }
}

function syncRedTeamFindings(run, section, report, recordedAt) {
  const reportIds = new Set();
  for (const reported of report.findings) {
    if (reportIds.has(reported.id)) throw new Error(`Red-team report repeats finding id '${reported.id}'`);
    reportIds.add(reported.id);
    const existing = run.findings.find(({ id }) => id === reported.id);
    if (existing) {
      const expected = {
        section_id: section.id,
        severity: reported.severity,
        summary: reported.summary,
        evidence: reported.evidence,
        acceptance_test: reported.acceptance_test,
      };
      for (const [field, value] of Object.entries(expected)) {
        if (existing[field] !== value) {
          throw new Error(`Finding '${reported.id}' immutable field '${field}' conflicts with the existing run finding`);
        }
      }
      existing.updated_at = recordedAt;
      continue;
    }
    const fields = {
      section_id: section.id,
      severity: reported.severity,
      summary: reported.summary,
      evidence: reported.evidence,
      acceptance_test: reported.acceptance_test,
      disposition: 'open',
      owner: reported.owner ?? null,
      note: reported.disposition_note ?? null,
      reported_by: report.reviewer_context_id,
      resolved_by: null,
      verification_artifact: null,
      updated_at: recordedAt,
    };
    run.findings.push({ id: reported.id, ...fields, created_at: recordedAt });
  }
}

function touch(run, now) {
  run.run.updated_at = timestamp(now);
  run.release = { decision: 'UNASSESSED', checked_at: null, blockers: [], unresolved_risks: [] };
}

function stalePageAudits(run) {
  for (const artifact of run.page.final_artifacts) artifact.stale = true;
}

function gitCandidate(projectRoot) {
  const revision = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: projectRoot, encoding: 'utf8' });
  if (revision.status !== 0) return null;
  const changes = spawnSync('git', ['status', '--porcelain'], { cwd: projectRoot, encoding: 'utf8' });
  return {
    revision: revision.stdout.trim(),
    dirty: changes.status !== 0 || changes.stdout.trim().length > 0,
  };
}

export async function recordPageFrame({ file = '.landing-studio/run.yaml', path, now, __locked = false }) {
  const absolute = resolve(file);
  if (!__locked) return withRunLock(absolute, () => recordPageFrame({ file: absolute, path, now, __locked: true }));
  const run = await loadRun(absolute);
  if (run.page.frame.approval) throw new Error('Page frame is approved and locked; start a new run to change strategy or queue');
  const digest = await hashArtifact(run.project.root, path);
  const recordedAt = timestamp(now);
  const entry = {
    id: stableId('artifact', `${run.run.id}\0page-frame\0${digest.sha256}\0${recordedAt}`),
    stage: 'page-frame',
    kind: 'page-frame',
    path: digest.path,
    sha256: digest.sha256,
    recorded_at: recordedAt,
    stale: false,
  };
  await inspectPageArtifact(run, entry, 'page-frame');
  run.page.frame.artifact = entry;
  touch(run, recordedAt);
  await atomicWrite(absolute, run);
  return entry;
}

export async function approvePageFrame({ file = '.landing-studio/run.yaml', by, note, now, __locked = false }) {
  const absolute = resolve(file);
  if (!__locked) return withRunLock(absolute, () => approvePageFrame({ file: absolute, by, note, now, __locked: true }));
  const run = await loadRun(absolute);
  if (!run.page.frame.artifact) throw new Error('Page frame approval requires a recorded page-frame artifact');
  await inspectPageArtifact(run, run.page.frame.artifact, 'page-frame');
  const approved = decision({ stage: 'page-frame', by, note, now });
  run.page.frame.approval = { by: approved.by, note: approved.note, recorded_at: approved.recorded_at };
  run.page.active_section_id = [...run.page.sections].sort((a, b) => a.order - b.order)[0].id;
  touch(run, now);
  await atomicWrite(absolute, run);
  return run;
}

export async function setCapability({ file = '.landing-studio/run.yaml', name, status, evidence, now, __locked = false }) {
  const absolute = resolve(file);
  if (!__locked) return withRunLock(absolute, () => setCapability({ file: absolute, name, status, evidence, now, __locked: true }));
  if (!CAPABILITY_NAMES.has(name)) throw new Error(`Unknown capability '${name}'`);
  if (!CAPABILITY_STATUSES.has(status)) throw new Error(`Invalid capability status '${status}'`);
  if (!evidence?.trim()) throw new Error('Capability update requires evidence');
  const run = await loadRun(absolute);
  run.capabilities[name] = { status, evidence };
  stalePageAudits(run);
  touch(run, now);
  await atomicWrite(absolute, run);
  return run.capabilities[name];
}

export async function recordSkip({ file = '.landing-studio/run.yaml', stage, reason, evidence, risk, substitute, approvedBy, now, __locked = false }) {
  const absolute = resolve(file);
  if (!__locked) return withRunLock(absolute, () => recordSkip({ file: absolute, stage, reason, evidence, risk, substitute, approvedBy, now, __locked: true }));
  for (const [name, value] of Object.entries({ stage, reason, evidence, risk, substitute, approvedBy })) {
    if (!value?.trim()) throw new Error(`Skip requires ${name}`);
  }
  const run = await loadRun(absolute);
  const recordedAt = timestamp(now);
  run.skips.push({ stage, reason, evidence, risk, substitute, approved_by: approvedBy, recorded_at: recordedAt });
  stalePageAudits(run);
  touch(run, recordedAt);
  await atomicWrite(absolute, run);
  return run.skips.at(-1);
}

export async function recordPageArtifact({ file = '.landing-studio/run.yaml', kind, path, now, __locked = false }) {
  const absolute = resolve(file);
  if (!__locked) return withRunLock(absolute, () => recordPageArtifact({ file: absolute, kind, path, now, __locked: true }));
  if (!PAGE_AUDIT_KINDS.has(kind)) throw new Error(`Unknown page audit kind '${kind}'`);
  const run = await loadRun(absolute);
  if (run.page.sections.some(({ status, locked }) => status !== 'approved' || !locked)) {
    throw new Error('Whole-page audits require every section to be approved and locked');
  }
  const digest = await hashArtifact(run.project.root, path);
  const recordedAt = timestamp(now);
  const entry = {
    id: stableId('artifact', `${run.run.id}\0page-audit\0${kind}\0${digest.sha256}\0${recordedAt}`),
    stage: 'page-audit', kind, path: digest.path, sha256: digest.sha256, recorded_at: recordedAt, stale: false,
  };
  const contract = await inspectPageArtifact(run, entry, 'page-audit');
  for (const prior of run.page.final_artifacts) if (prior.kind === kind && !prior.stale) prior.stale = true;
  if (kind !== 'final-red-team') {
    for (const prior of run.page.final_artifacts) if (prior.kind === 'final-red-team') prior.stale = true;
  }
  run.page.final_artifacts.push(entry);
  if (kind === 'final-red-team') syncRedTeamFindings(run, { id: null }, {
    findings: contract.findings,
    reviewer_context_id: contract.reviewer_context_id,
  }, recordedAt);
  touch(run, recordedAt);
  await atomicWrite(absolute, run);
  return entry;
}

export async function recordArtifact({ file = '.landing-studio/run.yaml', sectionId, stage, kind, path, now, __locked = false }) {
  const absolute = resolve(file);
  if (!__locked) {
    return withRunLock(absolute, () => recordArtifact({ file: absolute, sectionId, stage, kind, path, now, __locked: true }));
  }
  const run = await loadRun(absolute);
  if (!run.page.frame.approval) throw new Error('Section work requires an approved page frame');
  const section = findSection(run, sectionId);
  const rule = STAGE_RULES[stage];
  if (!rule) throw new Error(`Unknown artifact stage '${stage}'`);
  if (section.locked) throw new Error(`Section is locked: '${section.id}'`);
  requireActive(run, section);
  if (section.locks.direction && ['research', 'creative'].includes(stage)) {
    throw new Error(`Direction is locked for section '${section.id}'; reject it explicitly before changing upstream evidence`);
  }
  if (!rule.allowed.has(section.status)) {
    if (stage === 'implementation') throw new Error(`Implementation requires direction approval for section '${section.id}'`);
    throw new Error(`Cannot record ${stage} artifact while section '${section.id}' is '${section.status}'`);
  }
  if (stage === 'creative') {
    for (const requiredKind of ['evidence-ledger', 'media-ledger']) {
      const requiredArtifact = currentArtifactByKind(section, requiredKind);
      if (!requiredArtifact) throw new Error(`Creative work requires current '${requiredKind}'`);
      await inspectArtifact(run, section, requiredArtifact);
    }
  }
  if (stage === 'browser') await validateSectionContracts(run, section);
  const digest = await hashArtifact(run.project.root, path);
  const candidate = { stage, kind, path: digest.path };
  const contract = contractSchemaName(stage, kind)
    ? await loadContractArtifact(run, section, candidate)
    : null;
  for (const prior of section.artifacts) {
    if (prior.stage === stage
      && (prior.kind === kind || ['browser', 'red-team'].includes(stage))
      && !prior.stale) prior.stale = true;
  }
  const recordedAt = timestamp(now);
  const entry = {
    id: stableId('artifact', `${run.run.id}\0${section.id}\0${stage}\0${kind}\0${digest.sha256}\0${recordedAt}`),
    stage,
    kind,
    path: digest.path,
    sha256: digest.sha256,
    recorded_at: recordedAt,
    stale: false,
  };
  section.artifacts.push(entry);
  if (stage === 'red-team') syncRedTeamFindings(run, section, contract, recordedAt);
  section.status = rule.next;
  section.stale = false;
  touch(run, recordedAt);
  await atomicWrite(absolute, run);
  return entry;
}

export async function reopenSection({ file = '.landing-studio/run.yaml', sectionId, to, by, note, now, __locked = false }) {
  const absolute = resolve(file);
  if (!__locked) return withRunLock(absolute, () => reopenSection({ file: absolute, sectionId, to, by, note, now, __locked: true }));
  const run = await loadRun(absolute);
  const section = findSection(run, sectionId);
  requireActive(run, section);
  if (section.locked) throw new Error(`Section is locked: '${section.id}'`);
  if (!['implementation', 'browser', 'red-team'].includes(to)) throw new Error(`Reopen target must be implementation, browser, or red-team`);
  const target = {
    implementation: { allowed: ['implemented', 'browser_verified', 'red_team_reviewed'], status: 'direction_approved', stale: ['implementation', 'browser', 'red-team'] },
    browser: { allowed: ['browser_verified', 'red_team_reviewed'], status: 'implemented', stale: ['browser', 'red-team'] },
    'red-team': { allowed: ['red_team_reviewed'], status: 'browser_verified', stale: ['red-team'] },
  }[to];
  if (!target.allowed.includes(section.status)) throw new Error(`Cannot reopen '${section.id}' to ${to} from '${section.status}'`);
  decision({ stage: 'section', by, note, now });
  for (const artifact of section.artifacts) if (target.stale.includes(artifact.stage)) artifact.stale = true;
  for (const artifact of run.page.final_artifacts) artifact.stale = true;
  section.status = target.status;
  section.stale = false;
  section.stale_reasons.push(`Reopened to ${to} by ${by}: ${note}`);
  touch(run, now);
  await atomicWrite(absolute, run);
  return run;
}

function decision({ stage, by, note, now }) {
  if (!by?.trim()) throw new Error('Decision requires --by');
  if (!note?.trim()) throw new Error('Decision requires --note');
  return { stage, by, note, recorded_at: timestamp(now) };
}

function openBlockingFindings(run, sectionId) {
  return run.findings.filter((finding) => {
    if (finding.section_id !== sectionId && finding.section_id !== null) return false;
    if (['P0', 'P1'].includes(finding.severity)) {
      return finding.disposition !== 'fixed' || !finding.owner || !finding.note
        || !finding.resolved_by || !finding.verification_artifact;
    }
    if (finding.severity === 'P2') {
      return !(finding.disposition === 'fixed'
        || finding.disposition === 'rejected'
        || (finding.disposition === 'accepted' && finding.owner && finding.note));
    }
    return false;
  });
}

export async function approve({ file = '.landing-studio/run.yaml', sectionId, stage, by, note, now, __locked = false }) {
  const absolute = resolve(file);
  if (!__locked) {
    return withRunLock(absolute, () => approve({ file: absolute, sectionId, stage, by, note, now, __locked: true }));
  }
  const run = await loadRun(absolute);
  const section = findSection(run, sectionId);
  requireActive(run, section);
  if (stage === 'direction') {
    if (section.status !== 'direction_ready') throw new Error(`Direction approval requires creative directions for section '${section.id}'`);
    const directions = currentArtifactByKind(section, 'creative-directions');
    if (!directions) throw new Error(`Direction approval requires a valid creative-directions contract for '${section.id}'`);
    await inspectArtifact(run, section, directions);
    section.status = 'direction_approved';
    section.locks.direction = true;
  } else if (stage === 'section') {
    if (section.status !== 'red_team_reviewed') {
      throw new Error(`Section approval requires browser evidence and red-team review for '${section.id}'`);
    }
    await validateSectionContracts(run, section);
    const browserArtifact = currentArtifact(section, 'browser');
    const redTeamArtifact = currentArtifact(section, 'red-team');
    if (!browserArtifact || !redTeamArtifact) throw new Error(`Section '${section.id}' lacks current browser or red-team evidence`);
    const browser = await inspectArtifact(run, section, browserArtifact);
    const redTeam = await inspectArtifact(run, section, redTeamArtifact);
    validateReviewSequence(run, browserArtifact, browser, redTeamArtifact, redTeam);
    if (browser.decision !== 'PASS') throw new Error(`Browser evidence blocks section '${section.id}'`);
    if (redTeam.decision !== 'PASS') throw new Error(`Red-team evidence blocks section '${section.id}'`);
    const blockers = openBlockingFindings(run, section.id);
    if (blockers.length) throw new Error(`Section '${section.id}' has unresolved blocking findings: ${blockers.map(({ id }) => id).join(', ')}`);
    section.status = 'approved';
    section.locked = true;
  } else {
    throw new Error(`Approval stage must be 'direction' or 'section', received '${stage}'`);
  }
  section.approvals.push(decision({ stage, by, note, now }));
  if (stage === 'section') {
    const next = [...run.page.sections].sort((a, b) => a.order - b.order).find(({ status }) => status !== 'approved');
    run.page.active_section_id = next?.id ?? null;
  }
  touch(run, now);
  await atomicWrite(absolute, run);
  return run;
}

export async function reject({ file = '.landing-studio/run.yaml', sectionId, stage, by, note, now, __locked = false }) {
  const absolute = resolve(file);
  if (!__locked) {
    return withRunLock(absolute, () => reject({ file: absolute, sectionId, stage, by, note, now, __locked: true }));
  }
  const run = await loadRun(absolute);
  const section = findSection(run, sectionId);
  if (!['direction', 'section'].includes(stage)) throw new Error(`Rejection stage must be 'direction' or 'section'`);
  section.rejections.push(decision({ stage, by, note, now }));
  section.status = 'rejected';
  section.locked = false;
  section.stale = false;
  section.locks.direction = false;
  for (const artifact of section.artifacts) artifact.stale = true;
  run.page.active_section_id = section.id;

  for (const downstream of run.page.sections.filter(({ order }) => order > section.order)) {
    downstream.status = 'stale';
    downstream.locked = false;
    downstream.stale = true;
    downstream.locks.direction = false;
    downstream.stale_reasons.push(`Upstream section '${section.id}' was rejected: ${note}`);
    for (const artifact of downstream.artifacts) artifact.stale = true;
  }
  stalePageAudits(run);
  touch(run, now);
  await atomicWrite(absolute, run);
  return run;
}

export async function recordFinding({
  file = '.landing-studio/run.yaml',
  id,
  sectionId,
  severity,
  summary,
  evidence,
  acceptanceTest,
  disposition = 'open',
  owner,
  note,
  reportedBy,
  resolvedBy,
  verificationPath,
  now,
  __locked = false,
}) {
  const absolute = resolve(file);
  if (!__locked) {
    return withRunLock(absolute, () => recordFinding({
      file: absolute,
      id,
      sectionId,
      severity,
      summary,
      evidence,
      acceptanceTest,
      disposition,
      owner,
      note,
      reportedBy,
      resolvedBy,
      verificationPath,
      now,
      __locked: true,
    }));
  }
  const run = await loadRun(absolute);
  stalePageAudits(run);
  const recordedAt = timestamp(now);
  const existing = run.findings.find((finding) => finding.id === id);
  if (!existing && disposition !== 'open') throw new Error(`New finding '${id}' must start open`);
  const closesFinding = ['fixed', 'accepted', 'rejected'].includes(disposition);
  if (closesFinding && (!(owner ?? existing?.owner)?.trim() || !(note ?? existing?.note)?.trim())) {
    throw new Error(`Finding '${id}' disposition '${disposition}' requires owner and note`);
  }
  if (existing) {
    if (sectionId !== undefined || severity !== undefined || summary !== undefined || evidence !== undefined || acceptanceTest !== undefined) {
      throw new Error(`Finding '${id}' already exists; updates may change only disposition, owner, and note`);
    }
    if (disposition === 'fixed') {
      if (!resolvedBy?.trim()) throw new Error(`Fixed finding '${id}' requires resolvedBy`);
      if (resolvedBy === run.run.producer_context_id) throw new Error(`Producer cannot independently close finding '${id}'`);
      if (!verificationPath) throw new Error(`Fixed finding '${id}' requires a verification artifact`);
      const verification = await hashArtifact(run.project.root, verificationPath);
      existing.resolved_by = resolvedBy;
      existing.verification_artifact = verification;
    } else if (disposition === 'open') {
      existing.resolved_by = null;
      existing.verification_artifact = null;
    }
    existing.disposition = disposition;
    existing.owner = owner ?? existing.owner;
    existing.note = note ?? existing.note;
    existing.updated_at = recordedAt;
  } else {
    if (!id || !severity || !summary || !evidence || !acceptanceTest) {
      throw new Error('New finding requires id, severity, summary, evidence, and acceptanceTest');
    }
    if (sectionId !== undefined && sectionId !== null) findSection(run, sectionId);
    run.findings.push({
      id,
      section_id: sectionId ?? null,
      severity,
      summary,
      evidence,
      acceptance_test: acceptanceTest,
      disposition,
      owner: owner ?? null,
      note: note ?? null,
      reported_by: reportedBy?.trim() || run.run.producer_context_id,
      resolved_by: null,
      verification_artifact: null,
      created_at: recordedAt,
      updated_at: recordedAt,
    });
  }
  touch(run, recordedAt);
  await atomicWrite(absolute, run);
  return run.findings.find((finding) => finding.id === id);
}

export async function releaseCheck({ file = '.landing-studio/run.yaml', now, __locked = false } = {}) {
  const absolute = resolve(file);
  if (!__locked) {
    return withRunLock(absolute, () => releaseCheck({ file: absolute, now, __locked: true }));
  }
  const run = await loadRun(absolute);
  const blockers = [];
  if (!run.page.frame.approval || !run.page.frame.artifact) blockers.push('Page frame is not recorded and approved');
  else {
    try { await inspectPageArtifact(run, run.page.frame.artifact, 'page-frame'); }
    catch (error) { blockers.push(`Page frame integrity failed: ${error.message}`); }
  }
  for (const capability of ['current_research', 'screenshot_evidence', 'independent_critic']) {
    if (!['native', 'fallback'].includes(run.capabilities[capability].status)) {
      blockers.push(`Required capability '${capability}' is '${run.capabilities[capability].status}'`);
    }
  }
  const candidate = gitCandidate(run.project.root);
  if (!candidate) blockers.push('Project is not a Git worktree; release evidence cannot be bound to a candidate revision');
  else if (candidate.dirty) blockers.push('Project working tree is dirty; release evidence is not bound to a clean candidate');
  for (const section of run.page.sections) {
    if (section.stale || section.status === 'stale') blockers.push(`Section '${section.id}' is stale`);
    else if (section.status !== 'approved' || !section.locked) blockers.push(`Section '${section.id}' is not approved and locked`);
    const currentStages = new Set(section.artifacts.filter(({ stale }) => !stale).map(({ stage }) => stage));
    if (!currentStages.has('browser')) blockers.push(`Section '${section.id}' has no current browser evidence`);
    if (!currentStages.has('red-team')) blockers.push(`Section '${section.id}' has no current red-team evidence`);
    try {
      await validateSectionContracts(run, section);
    } catch (error) {
      blockers.push(`Section '${section.id}' contract gate failed: ${error.message}`);
    }
    for (const artifact of section.artifacts.filter(({ stale }) => !stale)) {
      try {
        const contract = await inspectArtifact(run, section, artifact);
        if (contract && ['browser', 'red-team'].includes(artifact.stage) && contract.decision !== 'PASS') {
          blockers.push(`Section '${section.id}' ${artifact.stage} decision is ${contract.decision}`);
        }
        if (contract && artifact.stage === 'browser' && candidate && contract.commit !== candidate.revision) {
          blockers.push(`Section '${section.id}' browser commit '${contract.commit}' does not match candidate '${candidate.revision}'`);
        }
      } catch (error) {
        blockers.push(`Section '${section.id}' ${artifact.stage} evidence failed integrity: ${error.message}`);
      }
    }
    const browserArtifact = currentArtifact(section, 'browser');
    const redTeamArtifact = currentArtifact(section, 'red-team');
    if (browserArtifact && redTeamArtifact) {
      try {
        const browser = await inspectArtifact(run, section, browserArtifact);
        const redTeam = await inspectArtifact(run, section, redTeamArtifact);
        validateReviewSequence(run, browserArtifact, browser, redTeamArtifact, redTeam);
      } catch (error) {
        blockers.push(`Section '${section.id}' review sequence failed: ${error.message}`);
      }
    }
  }
  for (const finding of run.findings) {
    if (['P0', 'P1'].includes(finding.severity)
      && (finding.disposition !== 'fixed' || !finding.owner || !finding.note
        || !finding.resolved_by || !finding.verification_artifact)) {
      blockers.push(`${finding.severity} finding '${finding.id}' blocks release until fixed`);
    }
    if (finding.severity === 'P2'
      && !(finding.disposition === 'fixed'
        || finding.disposition === 'rejected'
        || (finding.disposition === 'accepted' && finding.owner && finding.note))) {
      blockers.push(`P2 finding '${finding.id}' requires explicit owner acceptance or a fix`);
    }
    if (finding.severity === 'P3' && finding.disposition === 'open' && (!finding.owner || !finding.note)) {
      blockers.push(`P3 finding '${finding.id}' requires a backlog owner and note`);
    }
    if (finding.verification_artifact) {
      try {
        const digest = await hashArtifact(run.project.root, finding.verification_artifact.path);
        if (digest.sha256 !== finding.verification_artifact.sha256) blockers.push(`Finding '${finding.id}' verification artifact changed`);
      } catch (error) {
        blockers.push(`Finding '${finding.id}' verification failed: ${error.message}`);
      }
    }
  }
  for (const kind of PAGE_AUDIT_KINDS) {
    const artifact = [...run.page.final_artifacts].reverse().find((item) => item.kind === kind && !item.stale);
    if (!artifact) {
      blockers.push(`Missing whole-page audit '${kind}'`);
      continue;
    }
    try {
      const audit = await inspectPageArtifact(run, artifact, 'page-audit');
      if (audit.decision !== 'PASS') blockers.push(`Whole-page audit '${kind}' decision is ${audit.decision}`);
      if (candidate && audit.commit !== candidate.revision) blockers.push(`Whole-page audit '${kind}' commit does not match candidate`);
    } catch (error) {
      blockers.push(`Whole-page audit '${kind}' failed integrity: ${error.message}`);
    }
  }
  const checkedAt = timestamp(now);
  run.release = {
    decision: blockers.length ? 'BLOCK' : 'SHIP',
    checked_at: checkedAt,
    blockers,
    unresolved_risks: run.findings
      .filter(({ severity, disposition }) => (severity === 'P3' && disposition === 'open')
        || (severity === 'P2' && disposition === 'accepted'))
      .map(({ id, summary, owner, note }) => `${id}: ${summary} (owner: ${owner ?? 'unassigned'}; ${note ?? 'no note'})`),
  };
  run.run.updated_at = checkedAt;
  await atomicWrite(absolute, run);
  return { ok: blockers.length === 0, blockers };
}

export async function exportRun({ file = '.landing-studio/run.yaml', out, now } = {}) {
  if (!out) throw new Error('Export requires --out outside the ignored .landing-studio directory');
  const absoluteFile = resolve(file);
  const run = await loadRun(absoluteFile);
  const destination = resolve(out);
  const ignoredRoot = resolve(run.project.root, '.landing-studio');
  if (destination === ignoredRoot || destination.startsWith(`${ignoredRoot}${sep}`)) {
    throw new Error('Export destination must be outside the ignored .landing-studio directory');
  }
  try { await stat(destination); throw new Error(`Export destination already exists: ${destination}`); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const staging = `${destination}.tmp-${process.pid}-${randomBytes(4).toString('hex')}`;
  const files = new Map();
  const retain = async (absolutePath) => {
    const root = resolve(run.project.root);
    const resolved = resolve(absolutePath);
    if (resolved !== root && !resolved.startsWith(`${root}${sep}`)) throw new Error(`Export source escapes project root: ${resolved}`);
    const digest = await hashArtifact(root, resolved);
    files.set(resolved, { path: digest.path, sha256: digest.sha256 });
  };
  const retainContractEvidence = async (artifact, contract) => {
    await retain(absoluteArtifactPath(run, artifact.path));
    const reportRoot = dirname(absoluteArtifactPath(run, artifact.path));
    for (const item of contract?.artifacts ?? contract?.evidence_bundle ?? contract?.evidence ?? []) {
      if (item.path) await retain(resolve(reportRoot, item.path));
    }
    for (const asset of contract?.assets ?? []) await retain(resolve(run.project.root, asset.local_path));
    if (contract?.proof?.path) await retain(resolve(run.project.root, contract.proof.path));
    for (const ref of [...(contract?.source_files ?? []), contract?.build?.evidence, contract?.tests?.evidence].filter(Boolean)) {
      await retain(resolve(run.project.root, ref.path));
    }
  };
  if (run.page.frame.artifact) {
    const contract = await inspectPageArtifact(run, run.page.frame.artifact, 'page-frame');
    await retainContractEvidence(run.page.frame.artifact, contract);
  }
  for (const section of run.page.sections) {
    for (const artifact of section.artifacts.filter(({ stale }) => !stale)) {
      const contract = await inspectArtifact(run, section, artifact);
      await retainContractEvidence(artifact, contract);
    }
  }
  for (const artifact of run.page.final_artifacts.filter(({ stale }) => !stale)) {
    const contract = await inspectPageArtifact(run, artifact, 'page-audit');
    await retainContractEvidence(artifact, contract);
  }
  for (const finding of run.findings) {
    if (finding.verification_artifact) await retain(resolve(run.project.root, finding.verification_artifact.path));
  }
  await mkdir(join(staging, 'files'), { recursive: true });
  await copyFile(absoluteFile, join(staging, 'run.yaml'));
  for (const [source, entry] of files) {
    const target = join(staging, 'files', entry.path);
    await copyArtifactSafely(run.project.root, source, target, entry.sha256);
  }
  const generatedAt = timestamp(now);
  const manifest = {
    schema_version: '1.0.0', run_id: run.run.id, page_id: run.project.page_id,
    generated_at: generatedAt, source_root: run.project.root, files: [...files.values()].sort((a, b) => a.path.localeCompare(b.path)),
  };
  await writeFile(join(staging, 'export.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  const sums = [`${createHash('sha256').update(await readFile(absoluteFile)).digest('hex')}  run.yaml`]
    .concat(manifest.files.map(({ path, sha256 }) => `${sha256}  files/${path}`));
  await writeFile(join(staging, 'SHA256SUMS'), `${sums.join('\n')}\n`);
  await mkdir(dirname(destination), { recursive: true });
  await rename(staging, destination);
  return { destination, files: manifest.files.length + 1 };
}

function parseArgs(argv) {
  const command = argv[0];
  const options = {};
  for (let index = 1; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (!flag?.startsWith('--') || value === undefined || value.startsWith('--')) {
      throw new Error(`Expected --name value pairs; invalid argument near '${flag ?? '<end>'}'`);
    }
    options[flag.slice(2)] = value;
  }
  return { command, options };
}

function required(options, key) {
  if (!options[key]) throw new Error(`Missing required option --${key}`);
  return options[key];
}

function parseSections(value) {
  return value.split(',').map((entry, index) => {
    const [id, title = id] = entry.split(':');
    return { id, title, order: index + 1 };
  });
}

function printUsage() {
  console.log(`Landing Studio run state

Usage:
  studio-state.mjs init --file <run.yaml> --root <project> --route <route> --test-base-url <url> --page <page-id> --outcome <text> --success-metric <metric> --producer-context <id> --sections <id:title,...> --capabilities <json>
  studio-state.mjs status --file <run.yaml> [--json true]
  studio-state.mjs record-page-frame --file <run.yaml> --path <page-frame.yaml>
  studio-state.mjs approve-page-frame --file <run.yaml> --by <name> --note <decision>
  studio-state.mjs set-capability --file <run.yaml> --name <capability> --status <status> --evidence <evidence>
  studio-state.mjs record-skip --file <run.yaml> --stage <stage> --reason <reason> --evidence <evidence> --risk <risk> --substitute <substitute> --approved-by <name>
  studio-state.mjs record-artifact --file <run.yaml> --section <id> --stage <research|creative|implementation|browser|red-team> --kind <kind> --path <artifact>
  studio-state.mjs reopen --file <run.yaml> --section <id> --to <implementation|browser|red-team> --by <name> --note <reason>
  studio-state.mjs approve --file <run.yaml> --section <id> --stage <direction|section> --by <name> --note <decision>
  studio-state.mjs reject --file <run.yaml> --section <id> --stage <direction|section> --by <name> --note <reason>
  studio-state.mjs record-finding --file <run.yaml> --id <id> [new-finding fields or disposition update]
  studio-state.mjs record-page-artifact --file <run.yaml> --kind <full-page-browser|search-audits|final-red-team> --path <page-audit>
  studio-state.mjs export --file <run.yaml> --out <tracked-or-external-directory>
  studio-state.mjs release-check --file <run.yaml>`);
}

async function main(argv) {
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
    printUsage();
    return;
  }
  const { command, options } = parseArgs(argv);
  const file = options.file ?? '.landing-studio/run.yaml';
  if (command === 'init') {
    const run = await initializeRun({
      file,
      projectRoot: options.root ?? process.cwd(),
      route: required(options, 'route'),
      testBaseUrl: required(options, 'test-base-url'),
      pageId: required(options, 'page'),
      outcome: required(options, 'outcome'),
      successMetric: required(options, 'success-metric'),
      producerContextId: required(options, 'producer-context'),
      sections: parseSections(required(options, 'sections')),
      capabilities: JSON.parse(required(options, 'capabilities')),
    });
    console.log(`${run.run.id} initialized at ${resolve(file)}`);
  } else if (command === 'status') {
    const run = await loadRun(file);
    if (options.json === 'true') console.log(JSON.stringify(run, null, 2));
    else {
      console.log(`Run: ${run.run.id}`);
      console.log(`Page frame: ${run.page.frame.approval ? 'approved' : run.page.frame.artifact ? 'recorded' : 'missing'}`);
      console.log(`Active section: ${run.page.active_section_id ?? 'none'}`);
      for (const section of [...run.page.sections].sort((a, b) => a.order - b.order)) {
        console.log(`${section.order}. ${section.id}: ${section.status}${section.locked ? ' [locked]' : ''}`);
      }
    }
  } else if (command === 'record-page-frame') {
    const entry = await recordPageFrame({ file, path: required(options, 'path') });
    console.log(`${entry.id} ${entry.sha256} ${entry.path}`);
  } else if (command === 'approve-page-frame') {
    await approvePageFrame({ file, by: required(options, 'by'), note: required(options, 'note') });
  } else if (command === 'set-capability') {
    await setCapability({ file, name: required(options, 'name'), status: required(options, 'status'), evidence: required(options, 'evidence') });
  } else if (command === 'record-skip') {
    await recordSkip({
      file,
      stage: required(options, 'stage'), reason: required(options, 'reason'), evidence: required(options, 'evidence'),
      risk: required(options, 'risk'), substitute: required(options, 'substitute'), approvedBy: required(options, 'approved-by'),
    });
  } else if (command === 'approve') {
    await approve({ file, sectionId: required(options, 'section'), stage: required(options, 'stage'), by: required(options, 'by'), note: required(options, 'note') });
  } else if (command === 'reject') {
    await reject({ file, sectionId: required(options, 'section'), stage: required(options, 'stage'), by: required(options, 'by'), note: required(options, 'note') });
  } else if (command === 'record-artifact') {
    const entry = await recordArtifact({ file, sectionId: required(options, 'section'), stage: required(options, 'stage'), kind: required(options, 'kind'), path: required(options, 'path') });
    console.log(`${entry.id} ${entry.sha256} ${entry.path}`);
  } else if (command === 'reopen') {
    await reopenSection({ file, sectionId: required(options, 'section'), to: required(options, 'to'), by: required(options, 'by'), note: required(options, 'note') });
  } else if (command === 'record-finding') {
    await recordFinding({
      file,
      id: required(options, 'id'),
      sectionId: options.section,
      severity: options.severity,
      summary: options.summary,
      evidence: options.evidence,
      acceptanceTest: options['acceptance-test'],
      disposition: options.disposition,
      owner: options.owner,
      note: options.note,
      reportedBy: options['reported-by'],
      resolvedBy: options['resolved-by'],
      verificationPath: options['verification-path'],
    });
  } else if (command === 'record-page-artifact') {
    const entry = await recordPageArtifact({ file, kind: required(options, 'kind'), path: required(options, 'path') });
    console.log(`${entry.id} ${entry.sha256} ${entry.path}`);
  } else if (command === 'export') {
    const result = await exportRun({ file, out: required(options, 'out') });
    console.log(`Exported ${result.files} retained files to ${result.destination}`);
  } else if (command === 'release-check') {
    const result = await releaseCheck({ file });
    console.log(result.ok ? 'SHIP' : `BLOCK\n${result.blockers.map((item) => `- ${item}`).join('\n')}`);
    if (!result.ok) process.exitCode = 1;
  } else {
    throw new Error(`Unknown command '${command}'. Run with --help for usage.`);
  }
}

if (process.argv[1]
  && realpathSync(resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url))) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(`studio-state: ${error.message}`);
    process.exitCode = 1;
  });
}

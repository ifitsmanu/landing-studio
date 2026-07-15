import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { test } from 'node:test';

import {
  approve,
  approvePageFrame,
  exportRun,
  initializeRun,
  loadRun,
  recordArtifact,
  recordFinding,
  recordPageArtifact,
  recordPageFrame,
  recordSkip,
  reopenSection,
  reject,
  releaseCheck,
  setCapability,
} from '../scripts/studio-state.mjs';

const NOW = '2026-07-15T12:00:00.000Z';
const STATE_CLI = join(import.meta.dirname, '..', 'scripts', 'studio-state.mjs');
const CAPABILITIES = {
  current_research: { status: 'native', evidence: 'test fixture' },
  interactive_browser: { status: 'fallback', evidence: 'test fixture' },
  screenshot_evidence: { status: 'fallback', evidence: 'test fixture' },
  image_generation: { status: 'not-needed', evidence: 'test fixture' },
  video_generation: { status: 'not-needed', evidence: 'test fixture' },
  independent_critic: { status: 'native', evidence: 'test fixture' },
  webgl_3d: { status: 'not-needed', evidence: 'test fixture' },
};

async function fixture(sectionIds = ['hero', 'proof']) {
  const root = await mkdtemp(join(tmpdir(), 'landing-studio-state-'));
  const stateDirectory = join(root, '.landing-studio');
  const file = join(stateDirectory, 'run.yaml');
  await writeFile(join(root, '.gitignore'), '.landing-studio/\nartifacts/\n');
  for (const args of [
    ['init', '-q'],
    ['config', 'user.email', 'landing-studio@example.invalid'],
    ['config', 'user.name', 'Landing Studio Test'],
    ['add', '.gitignore'],
    ['commit', '-qm', 'fixture'],
  ]) {
    const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
  }
  await mkdir(stateDirectory, { recursive: true });
  await initializeRun({
    file,
    projectRoot: root,
    route: '/',
    testBaseUrl: 'http://127.0.0.1:3000',
    pageId: 'home',
    outcome: 'Convert qualified visitors',
    successMetric: 'qualified_signup',
    producerContextId: 'producer-context',
    capabilities: CAPABILITIES,
    sections: sectionIds.map((id, index) => ({ id, title: id, order: index + 1 })),
    now: NOW,
  });
  const run = await loadRun(file);
  const framePath = await artifact(root, 'page-frame.json', `${JSON.stringify({
    schema_version: '1.0.0', run_id: run.run.id, page_id: 'home', created_at: NOW,
    audience: 'Qualified fixture visitor', page_job: 'Convert qualified visitors',
    incoming_promise: 'Fixture promise', awareness_state: 'Problem aware', business_outcome: 'Qualified conversion',
    primary_cta: { label: 'Start', destination: '/start' }, thesis: 'Verified fixture thesis', proof_ids: [],
    objections: ['Trust'], constraints: ['Accessibility'],
    sections: sectionIds.map((id) => ({ id, title: id, job: `Do ${id} job`, acceptance: `${id} passes` })), unknowns: [],
  }, null, 2)}\n`);
  await recordPageFrame({ file, path: framePath, now: NOW });
  await approvePageFrame({ file, by: 'owner', note: 'Approve fixture frame', now: NOW });
  return { file, root };
}

async function artifact(root, name, contents = name) {
  const path = join(root, 'artifacts', name);
  await mkdir(join(root, 'artifacts'), { recursive: true });
  await writeFile(path, contents);
  return relative(root, path);
}

async function contractArtifact({ file, root, sectionId, stage, decision = 'PASS', findings = [], freshContext = true }) {
  const run = await loadRun(file);
  let value;
  if (stage === 'browser') {
    const evidenceFiles = [];
    for (const [type, name] of [
      ['screenshot', `${sectionId}-viewport.png`],
      ['screenshot', `${sectionId}-full-page.png`],
      ['screenshot', `${sectionId}-section.png`],
      ['screenshot', `${sectionId}-journey-state.png`],
      ['trace', `${sectionId}-trace.zip`],
    ]) {
      const relativePath = await artifact(root, name, `${name}-evidence`);
      const contents = await readFile(join(root, relativePath));
      evidenceFiles.push({
        type,
        path: name,
        sha256: createHash('sha256').update(contents).digest('hex'),
      });
    }
    const journey = { passed: decision === 'PASS', steps: [{ name: 'primary-cta', passed: decision === 'PASS' }], error: decision === 'PASS' ? null : 'blocked' };
    const projectCases = [
      { id: 'desktop-light', width: 1440, height: 900, reducedMotion: 'no-preference' },
      { id: 'mobile-light', width: 390, height: 844, reducedMotion: 'no-preference' },
      { id: 'desktop-reduced-motion', width: 1440, height: 900, reducedMotion: 'reduce' },
    ].map(({ id, width, height, reducedMotion }) => ({
      id,
      name: `chromium-${id}`,
      browser: 'chromium',
      viewport: { width, height },
      preferences: { colorScheme: 'light', reducedMotion },
      journey,
      accessibility: { url: `http://127.0.0.1:3000${run.project.route}`, violations: [], blocking_violations: 0 },
      console: { messages: [], errors: [], pageErrors: [] },
      network: { failed: [], failed_first_party: [] },
      evidence: {
        viewport: { width, height },
        screenshots: evidenceFiles.filter(({ type }) => type === 'screenshot').map(({ path }) => path),
        trace: evidenceFiles.find(({ type }) => type === 'trace').path,
        missing: [],
        section_screenshot_count: 1,
        journey_screenshot_count: 1,
      },
      blockers: decision === 'PASS' ? [] : [{ category: 'primary-journey' }],
    }));
    const revision = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).stdout.trim();
    value = {
        schema_version: '1.0.0',
        run_id: run.run.id,
        section_id: sectionId,
        url: `http://127.0.0.1:3000${run.project.route}`,
        commit: revision,
        captured_at: NOW,
        projects: projectCases,
        journeys: projectCases.map(({ name }) => ({ project: name, ...journey })),
        console_errors: [],
        failed_requests: [],
        axe: { blocking_violations: 0, violations: [] },
        artifacts: projectCases.flatMap(({ name }) => evidenceFiles.map((item) => ({ project: name, ...item }))),
        decision,
      };
  } else {
    const browserPath = join(root, 'artifacts', `${sectionId}-browser.json`);
    const browserContents = await readFile(browserPath);
    value = {
        schema_version: '1.0.0',
        run_id: run.run.id,
        section_id: sectionId,
        reviewer: 'independent-reviewer',
        reviewer_context_id: 'reviewer-context',
        producer_context_id: 'producer-context',
        fresh_context: freshContext,
        reviewed_at: NOW,
        evidence_bundle: [{
          kind: 'browser-report',
          path: `${sectionId}-browser.json`,
          sha256: createHash('sha256').update(browserContents).digest('hex'),
        }],
        findings,
        decision,
      };
  }
  return artifact(root, `${sectionId}-${stage}.json`, `${JSON.stringify(value, null, 2)}\n`);
}

async function recordRequiredResearchAndCreative({ file, root, sectionId, record = true }) {
  const run = await loadRun(file);
  const evidencePath = await artifact(root, `${sectionId}-evidence-ledger.json`, `${JSON.stringify({
    schema_version: '1.0.0',
    run_id: run.run.id,
    section_id: sectionId,
    entries: [{
      id: `${sectionId}-claim-1`,
      statement_or_asset: 'Verified fixture claim',
      status: 'VERIFIED',
      source: 'fixture source',
      accessed: '2026-07-15',
      owner: 'fixture owner',
      approved_by: 'fixture approver',
      approved_at: NOW,
      allowed_use: ['public-landing-page'],
      caveat: null,
    }],
  }, null, 2)}\n`);
  if (record) await recordArtifact({ file, sectionId, stage: 'research', kind: 'evidence-ledger', path: evidencePath, now: NOW });
  const mediaPath = await artifact(root, `${sectionId}-media-ledger.json`, `${JSON.stringify({
    schema_version: '1.0.0', run_id: run.run.id, section_id: sectionId, assets: [],
  }, null, 2)}\n`);
  if (record) await recordArtifact({ file, sectionId, stage: 'research', kind: 'media-ledger', path: mediaPath, now: NOW });
  const creativePath = await artifact(root, `${sectionId}-creative-directions.json`, `${JSON.stringify({
    schema_version: '1.0.0',
    run_id: run.run.id,
    section_id: sectionId,
    territories: ['a', 'b', 'c'].map((suffix) => ({
      id: `territory-${suffix}`,
      name: `Territory ${suffix.toUpperCase()}`,
      governing_idea: `Distinct governing idea ${suffix}`,
      proof_claim_ids: [`${sectionId}-claim-1`],
      responsive_behavior: 'Explicit narrow and wide composition',
      motion_and_static_behavior: 'Static proof remains equivalent',
      media_asset_ids: [],
      dependency_ids: [],
    })),
    pairwise_audit: [
      { left: 'territory-a', right: 'territory-b', difference: 'Different proof staging', pass: true },
      { left: 'territory-a', right: 'territory-c', difference: 'Different hierarchy', pass: true },
      { left: 'territory-b', right: 'territory-c', difference: 'Different interaction grammar', pass: true },
    ],
    selected_territory_id: 'territory-b',
    selected_by: 'owner',
    selected_at: NOW,
  }, null, 2)}\n`);
  if (record) await recordArtifact({ file, sectionId, stage: 'creative', kind: 'creative-directions', path: creativePath, now: NOW });
  return { evidencePath, mediaPath, creativePath };
}

async function recordRequiredImplementation({ file, root, sectionId, record = true }) {
  const run = await loadRun(file);
  const sourcePath = await artifact(root, `${sectionId}.html`, '<section>Verified fixture claim</section>');
  const buildPath = await artifact(root, `${sectionId}-build.log`, 'build passed\n');
  const testPath = await artifact(root, `${sectionId}-test.log`, 'tests passed\n');
  const reference = async (path) => ({
    path,
    sha256: createHash('sha256').update(await readFile(join(root, path))).digest('hex'),
  });
  const reportPath = await artifact(root, `${sectionId}-implementation.json`, `${JSON.stringify({
    schema_version: '1.0.0',
    run_id: run.run.id,
    section_id: sectionId,
    route: run.project.route,
    source_files: [await reference(sourcePath)],
    build: { command: 'fixture build', exit_code: 0, evidence: await reference(buildPath) },
    tests: { command: 'fixture test', exit_code: 0, evidence: await reference(testPath) },
    claims_used: [`${sectionId}-claim-1`],
    media_assets_used: [],
    dependencies_used: [],
  }, null, 2)}\n`);
  if (record) await recordArtifact({ file, sectionId, stage: 'implementation', kind: 'implementation-report', path: reportPath, now: NOW });
  return reportPath;
}

async function progressToApproved({ file, root, sectionId }) {
  await recordRequiredResearchAndCreative({ file, root, sectionId });
  await approve({ file, sectionId, stage: 'direction', by: 'owner', note: 'Territory B', now: NOW });
  await recordRequiredImplementation({ file, root, sectionId });
  await recordArtifact({
    file,
    sectionId,
    stage: 'browser',
    kind: 'browser-report',
    path: await contractArtifact({ file, root, sectionId, stage: 'browser' }),
    now: NOW,
  });
  await recordArtifact({
    file,
    sectionId,
    stage: 'red-team',
    kind: 'red-team-report',
    path: await contractArtifact({ file, root, sectionId, stage: 'red-team' }),
    now: NOW,
  });
  await approve({ file, sectionId, stage: 'section', by: 'owner', note: 'Approved', now: NOW });
}

async function recordSinglePageAudit({ file, root, kind, findings = [], linkPrior = true, capturedAt = NOW }) {
  const run = await loadRun(file);
  const revision = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).stdout.trim();
  const evidencePath = await artifact(root, `${kind}-evidence.txt`, `${kind} passed\n`);
  const evidenceContents = await readFile(join(root, evidencePath));
  const evidence = [{ path: `${kind}-evidence.txt`, sha256: createHash('sha256').update(evidenceContents).digest('hex') }];
  const requiredChecks = {
    'full-page-browser': ['responsive-mobile', 'responsive-desktop', 'reduced-motion', 'primary-journey', 'accessibility', 'console-network', 'performance', 'privacy-consent', 'forms', 'metadata'],
    'search-audits': ['seo', 'aeo', 'geo', 'crawl-index-canonical', 'raw-html', 'metadata', 'structured-data'],
    'final-red-team': ['five-second-comprehension', 'copy-claims', 'design-originality', 'interaction-conversion', 'accessibility', 'performance-resilience', 'rights-privacy-deception', 'source-html-consistency'],
  };
  if (kind === 'full-page-browser') {
    const browserPath = await contractArtifact({ file, root, sectionId: 'page', stage: 'browser' });
    const contents = await readFile(join(root, browserPath));
    evidence.push({ path: browserPath.replace(/^artifacts\//u, ''), sha256: createHash('sha256').update(contents).digest('hex') });
  }
  if (kind === 'search-audits') {
    for (const lane of ['seo', 'aeo', 'geo']) {
      const lanePath = await artifact(root, `${lane}-audit.md`, `# ${lane.toUpperCase()} audit\nPASS\n`);
      const contents = await readFile(join(root, lanePath));
      evidence.push({ path: lanePath.replace(/^artifacts\//u, ''), sha256: createHash('sha256').update(contents).digest('hex') });
    }
  }
  if (kind === 'final-red-team' && linkPrior) {
    for (const prior of run.page.final_artifacts.filter(({ kind: priorKind, stale }) =>
      ['full-page-browser', 'search-audits'].includes(priorKind) && !stale)) {
      evidence.push({ path: prior.path.replace(/^artifacts\//u, ''), sha256: prior.sha256 });
    }
  }
  const reportPath = await artifact(root, `${kind}.json`, `${JSON.stringify({
    schema_version: '1.0.0', run_id: run.run.id, page_id: run.project.page_id,
    url: `http://127.0.0.1:3000${run.project.route}`, kind, decision: 'PASS',
    captured_at: capturedAt, commit: revision,
    checks: requiredChecks[kind].map((name) => ({ name, passed: true, evidence: `${name} passed` })), evidence,
    producer_context_id: run.run.producer_context_id,
    reviewer_context_id: kind === 'final-red-team' ? 'final-reviewer-context' : null,
    fresh_context: kind === 'final-red-team', findings,
  }, null, 2)}\n`);
  return recordPageArtifact({ file, kind, path: reportPath, now: capturedAt });
}

async function recordPageAudits({ file, root }) {
  for (const kind of ['full-page-browser', 'search-audits', 'final-red-team']) {
    await recordSinglePageAudit({ file, root, kind });
  }
}

test('init writes a schema-valid manifest with one active section using atomic replacement', async () => {
  const { file } = await fixture();
  const run = await loadRun(file);

  assert.match(run.run.id, /^ls_[a-f0-9]{16}$/);
  assert.equal(run.schema_version, '1.0.0');
  assert.equal(run.page.active_section_id, 'hero');
  assert.deepEqual(
    run.page.sections.map(({ id, status, locked }) => ({ id, status, locked })),
    [
      { id: 'hero', status: 'queued', locked: false },
      { id: 'proof', status: 'queued', locked: false },
    ],
  );
  assert.equal((await readdir(join(file, '..'))).some((name) => name.includes('.tmp-')), false);
  assert.match(await readFile(file, 'utf8'), /^schema_version: 1\.0\.0/m);
});

test('artifact stages enforce legal order and store a sha256 hash of the real file', async () => {
  const { file, root } = await fixture();
  const implementationPath = await artifact(root, 'hero.html', '<main>Hero</main>');

  await assert.rejects(
    recordArtifact({
      file,
      sectionId: 'hero',
      stage: 'implementation',
      kind: 'implementation',
      path: implementationPath,
      now: NOW,
    }),
    /requires direction approval/i,
  );

  const researchPath = await artifact(root, 'hero-research.md', 'primary evidence');
  const recorded = await recordArtifact({
    file,
    sectionId: 'hero',
    stage: 'research',
    kind: 'section-research',
    path: researchPath,
    now: NOW,
  });

  assert.equal(recorded.sha256, '11a4a6e55003e979050f288b89ae1eaa8dfb59d75eeb3137bb46093b53f6420b');
  assert.equal((await loadRun(file)).page.sections[0].status, 'research_ready');
});

test('direction and section approvals lock upstream decisions', async () => {
  const { file, root } = await fixture();
  const { evidencePath: researchPath } = await recordRequiredResearchAndCreative({ file, root, sectionId: 'hero' });
  await approve({ file, sectionId: 'hero', stage: 'direction', by: 'owner', note: 'Select B', now: NOW });

  await assert.rejects(
    recordArtifact({ file, sectionId: 'hero', stage: 'research', kind: 'section-research', path: researchPath, now: NOW }),
    /direction is locked/i,
  );

  await recordRequiredImplementation({ file, root, sectionId: 'hero' });
  await recordArtifact({
    file,
    sectionId: 'hero',
    stage: 'browser',
    kind: 'browser-report',
    path: await contractArtifact({ file, root, sectionId: 'hero', stage: 'browser' }),
    now: NOW,
  });
  await recordArtifact({
    file,
    sectionId: 'hero',
    stage: 'red-team',
    kind: 'red-team-report',
    path: await contractArtifact({ file, root, sectionId: 'hero', stage: 'red-team' }),
    now: NOW,
  });
  await approve({ file, sectionId: 'hero', stage: 'section', by: 'owner', note: 'Lock section', now: NOW });

  await assert.rejects(
    recordArtifact({
      file,
      sectionId: 'hero',
      stage: 'implementation',
      kind: 'implementation',
      path: await artifact(root, 'hero-v2.html'),
      now: NOW,
    }),
    /section is locked/i,
  );
});

test('rejecting an approved upstream section unlocks it and marks downstream sections stale', async () => {
  const { file, root } = await fixture();
  await progressToApproved({ file, root, sectionId: 'hero' });
  await progressToApproved({ file, root, sectionId: 'proof' });

  await reject({ file, sectionId: 'hero', stage: 'section', by: 'owner', note: 'Positioning changed', now: NOW });
  const run = await loadRun(file);

  assert.equal(run.page.sections[0].status, 'rejected');
  assert.equal(run.page.sections[0].locked, false);
  assert.equal(run.page.sections[1].status, 'stale');
  assert.equal(run.page.sections[1].stale, true);
  assert.match(run.page.sections[1].stale_reasons[0], /hero.*Positioning changed/i);
});

test('release check blocks unresolved P0/P1 and unaccepted P2 findings', async () => {
  const { file, root } = await fixture(['hero']);
  await progressToApproved({ file, root, sectionId: 'hero' });

  await recordFinding({
    file,
    id: 'finding-1',
    sectionId: 'hero',
    severity: 'P1',
    summary: 'Primary CTA fails',
    evidence: 'trace.zip',
    acceptanceTest: 'CTA completes in the browser harness',
    disposition: 'open',
    now: NOW,
  });
  let result = await releaseCheck({ file, now: NOW });
  assert.equal(result.ok, false);
  assert.match(result.blockers.join('\n'), /P1.*finding-1/i);

  const verificationPath = await artifact(root, 'finding-1-rerun.txt', 'verified by independent rerun\n');
  await recordFinding({
    file, id: 'finding-1', disposition: 'fixed', owner: 'qa-owner', note: 'Verified by rerun',
    resolvedBy: 'reviewer-context', verificationPath, now: NOW,
  });
  await recordFinding({
    file,
    id: 'finding-2',
    sectionId: 'hero',
    severity: 'P2',
    summary: 'Secondary viewport crop is weak',
    evidence: 'section.png',
    acceptanceTest: 'Owner accepts or crop is corrected',
    disposition: 'open',
    now: NOW,
  });
  result = await releaseCheck({ file, now: NOW });
  assert.equal(result.ok, false);
  assert.match(result.blockers.join('\n'), /P2.*acceptance/i);

  await recordFinding({ file, id: 'finding-2', disposition: 'accepted', owner: 'owner', note: 'Backlogged', now: NOW });
  await recordPageAudits({ file, root });
  result = await releaseCheck({ file, now: NOW });
  assert.deepEqual(result, { ok: true, blockers: [] });
});

test('browser BLOCK can reopen to implementation, rerun, and reach approval without discarding upstream contracts', async () => {
  const { file, root } = await fixture(['hero']);
  await recordRequiredResearchAndCreative({ file, root, sectionId: 'hero' });
  await approve({ file, sectionId: 'hero', stage: 'direction', by: 'owner', note: 'Select A', now: NOW });
  await recordRequiredImplementation({ file, root, sectionId: 'hero' });
  await recordArtifact({
    file, sectionId: 'hero', stage: 'browser', kind: 'browser-report',
    path: await contractArtifact({ file, root, sectionId: 'hero', stage: 'browser', decision: 'BLOCK' }), now: NOW,
  });
  await reopenSection({ file, sectionId: 'hero', to: 'implementation', by: 'producer', note: 'Fix failed journey', now: NOW });
  await recordRequiredImplementation({ file, root, sectionId: 'hero' });
  await recordArtifact({
    file, sectionId: 'hero', stage: 'browser', kind: 'browser-report',
    path: await contractArtifact({ file, root, sectionId: 'hero', stage: 'browser' }), now: NOW,
  });
  await recordArtifact({
    file, sectionId: 'hero', stage: 'red-team', kind: 'red-team-report',
    path: await contractArtifact({ file, root, sectionId: 'hero', stage: 'red-team' }), now: NOW,
  });
  await approve({ file, sectionId: 'hero', stage: 'section', by: 'owner', note: 'Rerun passed', now: NOW });
  const run = await loadRun(file);
  assert.equal(run.page.sections[0].status, 'approved');
  assert.ok(run.page.sections[0].artifacts.some(({ stage, stale }) => stage === 'research' && !stale));
  assert.equal(run.page.sections[0].artifacts.filter(({ stage, stale }) => stage === 'browser' && !stale).length, 1);
});

test('capability and skip updates are atomic CLI-governed state', async () => {
  const { file } = await fixture(['hero']);
  await setCapability({ file, name: 'video_generation', status: 'fallback', evidence: 'Remotion is installed', now: NOW });
  await recordSkip({
    file, stage: 'webgl-3d', reason: 'No 3D value', evidence: 'Approved static concept', risk: 'Lower spectacle',
    substitute: 'Static product render', approvedBy: 'owner', now: NOW,
  });
  const run = await loadRun(file);
  assert.equal(run.capabilities.video_generation.status, 'fallback');
  assert.equal(run.skips[0].approved_by, 'owner');
});

test('new findings cannot arrive closed and P1 fixes need independent hashed verification', async () => {
  const { file, root } = await fixture(['hero']);
  await assert.rejects(recordFinding({
    file, id: 'premature', sectionId: 'hero', severity: 'P1', summary: 'Broken', evidence: 'trace',
    acceptanceTest: 'Pass', disposition: 'fixed', owner: 'producer', note: 'done', now: NOW,
  }), /must start open/i);
  await recordFinding({
    file, id: 'independent', sectionId: 'hero', severity: 'P1', summary: 'Broken', evidence: 'trace',
    acceptanceTest: 'Pass', now: NOW,
  });
  const verificationPath = await artifact(root, 'independent-rerun.txt', 'pass\n');
  await assert.rejects(recordFinding({
    file, id: 'independent', disposition: 'fixed', owner: 'producer', note: 'done',
    resolvedBy: 'producer-context', verificationPath, now: NOW,
  }), /cannot independently close/i);
});

test('browser and red-team evidence must be schema-valid and match the active run', async () => {
  const { file, root } = await fixture(['hero']);
  await recordRequiredResearchAndCreative({ file, root, sectionId: 'hero' });
  await approve({ file, sectionId: 'hero', stage: 'direction', by: 'owner', note: 'Select A', now: NOW });
  await recordRequiredImplementation({ file, root, sectionId: 'hero' });
  await assert.rejects(
    recordArtifact({
      file,
      sectionId: 'hero',
      stage: 'browser',
      kind: 'browser-report',
      path: await artifact(root, 'invalid-browser.json', '{}'),
      now: NOW,
    }),
    /browser contract.*invalid/i,
  );
});

test('section approval rejects blocked or self-certified evidence', async () => {
  const { file, root } = await fixture(['hero']);
  await recordRequiredResearchAndCreative({ file, root, sectionId: 'hero' });
  await approve({ file, sectionId: 'hero', stage: 'direction', by: 'owner', note: 'Select A', now: NOW });
  await recordRequiredImplementation({ file, root, sectionId: 'hero' });
  await recordArtifact({
    file,
    sectionId: 'hero',
    stage: 'browser',
    kind: 'browser-report',
    path: await contractArtifact({ file, root, sectionId: 'hero', stage: 'browser' }),
    now: NOW,
  });
  await assert.rejects(
    recordArtifact({
      file,
      sectionId: 'hero',
      stage: 'red-team',
      kind: 'red-team-report',
      path: await contractArtifact({ file, root, sectionId: 'hero', stage: 'red-team', freshContext: false }),
      now: NOW,
    }),
    /fresh_context|equal to constant/i,
  );
});

test('release check detects evidence modified after section approval', async () => {
  const { file, root } = await fixture(['hero']);
  await progressToApproved({ file, root, sectionId: 'hero' });
  const run = await loadRun(file);
  const report = run.page.sections[0].artifacts.find(({ stage }) => stage === 'browser');
  await writeFile(join(root, report.path), '{"tampered":true}\n');
  const result = await releaseCheck({ file, now: NOW });
  assert.equal(result.ok, false);
  assert.match(result.blockers.join('\n'), /changed after recording/i);
});

test('release check blocks when a nested browser screenshot is deleted', async () => {
  const { file, root } = await fixture(['hero']);
  await progressToApproved({ file, root, sectionId: 'hero' });
  const run = await loadRun(file);
  const artifactEntry = run.page.sections[0].artifacts.find(({ stage }) => stage === 'browser');
  const reportPath = join(root, artifactEntry.path);
  const report = JSON.parse(await readFile(reportPath, 'utf8'));
  await rm(join(dirname(reportPath), report.artifacts.find(({ type }) => type === 'screenshot').path));
  const result = await releaseCheck({ file, now: NOW });
  assert.equal(result.ok, false);
  assert.match(result.blockers.join('\n'), /evidence is missing/i);
});

test('concurrent finding writes are serialized without losing blockers', async () => {
  const { file } = await fixture(['hero']);
  await Promise.all(Array.from({ length: 20 }, (_, index) => recordFinding({
    file,
    id: `race-${index}`,
    sectionId: 'hero',
    severity: 'P1',
    summary: `Concurrent blocker ${index}`,
    evidence: `trace-${index}.zip`,
    acceptanceTest: `Rerun case ${index}`,
    now: NOW,
  })));
  const run = await loadRun(file);
  assert.equal(run.findings.length, 20);
  assert.deepEqual(
    new Set(run.findings.map(({ id }) => id)),
    new Set(Array.from({ length: 20 }, (_, index) => `race-${index}`)),
  );
});

test('init safely adds the canonical state directory to gitignore in a plain repository', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'landing-studio-ignore-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeFile(join(root, 'README.md'), '# Fixture\n');
  for (const args of [['init', '-q'], ['config', 'user.email', 'test@example.invalid'], ['config', 'user.name', 'Test'], ['add', 'README.md'], ['commit', '-qm', 'initial']]) {
    assert.equal(spawnSync('git', args, { cwd: root }).status, 0);
  }
  await initializeRun({
    file: join(root, '.landing-studio', 'run.yaml'), projectRoot: root, route: '/', testBaseUrl: 'http://127.0.0.1:3000',
    pageId: 'home', outcome: 'Convert', successMetric: 'signup', producerContextId: 'producer-context',
    capabilities: CAPABILITIES, sections: [{ id: 'hero', title: 'Hero' }], now: NOW,
  });
  assert.match(await readFile(join(root, '.gitignore'), 'utf8'), /^\.landing-studio\/$/m);
  assert.doesNotMatch(spawnSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).stdout, /run\.yaml/);
});

test('public claim contracts reject unresolved owners and impossible dates', async () => {
  const { file, root } = await fixture(['hero']);
  const run = await loadRun(file);
  const path = await artifact(root, 'bad-evidence.json', `${JSON.stringify({
    schema_version: '1.0.0', run_id: run.run.id, section_id: 'hero', entries: [{
      id: 'claim-bad', statement_or_asset: 'Unproven public claim', status: 'VERIFIED', source: 'https://example.com/source',
      accessed: '2026-99-99', owner: 'unknown', approved_by: 'unknown', approved_at: NOW,
      allowed_use: ['public-landing-page'], caveat: null,
    }],
  })}\n`);
  await assert.rejects(recordArtifact({ file, sectionId: 'hero', stage: 'research', kind: 'evidence-ledger', path, now: NOW }), /unresolved owner|invalid.*accessed/i);
});

test('release-ready media rejects unknown rights and expired grants', async () => {
  const { file, root } = await fixture(['hero']);
  const run = await loadRun(file);
  const localPath = await artifact(root, 'licensed.png', 'image');
  const sha256 = createHash('sha256').update(await readFile(join(root, localPath))).digest('hex');
  const path = await artifact(root, 'bad-media.json', `${JSON.stringify({
    schema_version: '1.0.0', run_id: run.run.id, section_id: 'hero', assets: [{
      id: 'asset-bad', role: 'hero', source_url: 'https://example.com/image', creator: 'unknown', rights_holder: 'unknown',
      license_id: 'unknown', license_snapshot_url: 'https://example.com/license', acquired_at: '2026-07-15',
      allowed_channels: ['public-landing-page'], attribution: null, restrictions: [], modifications_allowed: true,
      model_release: 'not-applicable', property_release: 'not-applicable', territory: null, expires_at: '2020-01-01',
      sha256, local_path: localPath, generative_provenance: null, privacy_review: 'approved', approved_by: 'unknown',
      approved_at: NOW, release_ready: true,
    }],
  })}\n`);
  await assert.rejects(recordArtifact({ file, sectionId: 'hero', stage: 'research', kind: 'media-ledger', path, now: NOW }), /unresolved creator|expired/i);
});

test('impossible browser timestamps cannot bypass review ordering', async () => {
  const { file, root } = await fixture(['hero']);
  await recordRequiredResearchAndCreative({ file, root, sectionId: 'hero' });
  await approve({ file, sectionId: 'hero', stage: 'direction', by: 'owner', note: 'A', now: NOW });
  await recordRequiredImplementation({ file, root, sectionId: 'hero' });
  const reportPath = await contractArtifact({ file, root, sectionId: 'hero', stage: 'browser' });
  const absolute = join(root, reportPath);
  const report = JSON.parse(await readFile(absolute, 'utf8'));
  report.captured_at = '9999-99-99T99:99:99Z';
  await writeFile(absolute, `${JSON.stringify(report)}\n`);
  await assert.rejects(recordArtifact({ file, sectionId: 'hero', stage: 'browser', kind: 'browser-report', path: reportPath, now: NOW }), /invalid browser captured_at/i);
});

test('whole-page red team must hash-link current browser and search audits and run after them', async () => {
  const { file, root } = await fixture(['hero']);
  await progressToApproved({ file, root, sectionId: 'hero' });
  await recordSinglePageAudit({ file, root, kind: 'full-page-browser' });
  await recordSinglePageAudit({ file, root, kind: 'search-audits' });
  await assert.rejects(recordSinglePageAudit({ file, root, kind: 'final-red-team', linkPrior: false }), /hash-link current/i);
  await assert.rejects(recordSinglePageAudit({
    file, root, kind: 'final-red-team', capturedAt: '2026-07-15T11:00:00.000Z',
  }), /predates/i);
});

test('a generic looks-good check cannot certify the full-page browser release gate', async () => {
  const { file, root } = await fixture(['hero']);
  await progressToApproved({ file, root, sectionId: 'hero' });
  const run = await loadRun(file);
  const revision = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).stdout.trim();
  const evidencePath = await artifact(root, 'looks-good.txt', 'looks good\n');
  const contents = await readFile(join(root, evidencePath));
  const reportPath = await artifact(root, 'generic-full-page.json', `${JSON.stringify({
    schema_version: '1.0.0', run_id: run.run.id, page_id: run.project.page_id,
    url: 'http://127.0.0.1:3000/', kind: 'full-page-browser', decision: 'PASS', captured_at: NOW,
    commit: revision, checks: [{ name: 'looks-good', passed: true, evidence: 'opinion' }],
    evidence: [{ path: 'looks-good.txt', sha256: createHash('sha256').update(contents).digest('hex') }],
    producer_context_id: run.run.producer_context_id, reviewer_context_id: null, fresh_context: false, findings: [],
  })}\n`);
  await assert.rejects(recordPageArtifact({ file, kind: 'full-page-browser', path: reportPath, now: NOW }), /lacks required check/i);
});

test('later critic reports cannot downgrade or repurpose an existing finding id', async () => {
  const { file, root } = await fixture(['hero']);
  await progressToApproved({ file, root, sectionId: 'hero' });
  await recordFinding({
    file, id: 'IMMUTABLE', sectionId: 'hero', severity: 'P1', summary: 'Primary blocker',
    evidence: 'original trace', acceptanceTest: 'Original exact rerun', reportedBy: 'reviewer-context', now: NOW,
  });
  await recordSinglePageAudit({ file, root, kind: 'full-page-browser' });
  await recordSinglePageAudit({ file, root, kind: 'search-audits' });
  await assert.rejects(recordSinglePageAudit({
    file, root, kind: 'final-red-team', findings: [{
      id: 'IMMUTABLE', severity: 'P3', summary: 'Polish only', evidence: 'different evidence',
      impact: 'Minor', acceptance_test: 'Ignore', disposition: 'open', owner: 'producer', disposition_note: 'Backlog',
    }],
  }), /immutable field/i);
  assert.equal((await loadRun(file)).findings.find(({ id }) => id === 'IMMUTABLE').severity, 'P1');
});

test('repo-local artifact symlinks cannot read or export files outside the project root', async (t) => {
  const { file, root } = await fixture(['hero']);
  const outside = await mkdtemp(join(tmpdir(), 'landing-studio-outside-'));
  t.after(() => rm(outside, { recursive: true, force: true }));
  const secret = join(outside, 'secret.txt');
  await writeFile(secret, 'must not be retained\n');
  await mkdir(join(root, 'artifacts'), { recursive: true });
  const link = join(root, 'artifacts', 'outside-link.txt');
  await symlink(secret, link);
  await assert.rejects(recordArtifact({
    file, sectionId: 'hero', stage: 'research', kind: 'section-research',
    path: relative(root, link), now: NOW,
  }), /symlink|outside project root/i);
});

test('owned whole-page P3 findings remain visible as release residual risks', async () => {
  const { file, root } = await fixture(['hero']);
  await progressToApproved({ file, root, sectionId: 'hero' });
  await recordSinglePageAudit({ file, root, kind: 'full-page-browser' });
  await recordSinglePageAudit({ file, root, kind: 'search-audits' });
  await recordSinglePageAudit({
    file, root, kind: 'final-red-team', findings: [{
      id: 'PAGE-P3', severity: 'P3', summary: 'Optional polish remains', evidence: 'final screenshot',
      impact: 'Minor craft opportunity', acceptance_test: 'Backlog review', disposition: 'open',
      owner: 'design-owner', disposition_note: 'Backlog for next iteration',
    }],
  });
  const result = await releaseCheck({ file, now: NOW });
  assert.equal(result.ok, true);
  const run = await loadRun(file);
  assert.match(run.release.unresolved_risks.join('\n'), /PAGE-P3.*design-owner/i);
  assert.equal(run.findings.find(({ id }) => id === 'PAGE-P3').section_id, null);
});

test('export retains the authoritative run, current contracts, nested evidence, and checksums outside ignored state', async () => {
  const { file, root } = await fixture(['hero']);
  await progressToApproved({ file, root, sectionId: 'hero' });
  await recordPageAudits({ file, root });
  const out = join(root, 'release-audit');
  const result = await exportRun({ file, out, now: NOW });
  assert.ok(result.files > 10);
  assert.match(await readFile(join(out, 'SHA256SUMS'), 'utf8'), /run\.yaml/);
  assert.ok((await readFile(join(out, 'export.json'), 'utf8')).includes('full-page-browser.json'));
  await assert.rejects(exportRun({ file, out: join(root, '.landing-studio', 'export'), now: NOW }), /outside.*ignored/i);
});

test('documented specialist contracts complete an agent-free CLI section lifecycle', async () => {
  const { file, root } = await fixture(['hero']);
  const runCli = (...args) => {
    const result = spawnSync(process.execPath, [STATE_CLI, ...args], { cwd: root, encoding: 'utf8' });
    assert.equal(result.status, 0, `CLI failed: ${result.stderr}\n${result.stdout}`);
  };
  const research = await recordRequiredResearchAndCreative({ file, root, sectionId: 'hero', record: false });
  runCli('record-artifact', '--file', file, '--section', 'hero', '--stage', 'research', '--kind', 'evidence-ledger', '--path', research.evidencePath);
  runCli('record-artifact', '--file', file, '--section', 'hero', '--stage', 'research', '--kind', 'media-ledger', '--path', research.mediaPath);
  runCli('record-artifact', '--file', file, '--section', 'hero', '--stage', 'creative', '--kind', 'creative-directions', '--path', research.creativePath);
  runCli('approve', '--file', file, '--section', 'hero', '--stage', 'direction', '--by', 'owner', '--note', 'Select territory B');
  const implementation = await recordRequiredImplementation({ file, root, sectionId: 'hero', record: false });
  runCli('record-artifact', '--file', file, '--section', 'hero', '--stage', 'implementation', '--kind', 'implementation-report', '--path', implementation);
  const browser = await contractArtifact({ file, root, sectionId: 'hero', stage: 'browser' });
  runCli('record-artifact', '--file', file, '--section', 'hero', '--stage', 'browser', '--kind', 'browser-report', '--path', browser);
  const redTeam = await contractArtifact({ file, root, sectionId: 'hero', stage: 'red-team' });
  runCli('record-artifact', '--file', file, '--section', 'hero', '--stage', 'red-team', '--kind', 'red-team-report', '--path', redTeam);
  runCli('approve', '--file', file, '--section', 'hero', '--stage', 'section', '--by', 'owner', '--note', 'Evidence reviewed');
  assert.equal((await loadRun(file)).page.sections[0].status, 'approved');
});

import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const runner = join(root, 'tools/browser-qa/run.mjs');
const smokeConfig = join(root, 'tools/browser-qa/fixtures/smoke.config.json');
const declarativeConfig = join(root, 'tools/browser-qa/fixtures/declarative.config.json');
const browserSchema = JSON.parse(readFileSync(join(root, 'schemas/browser-report.schema.json'), 'utf8'));
const validateReport = new Ajv({ allErrors: true }).compile(browserSchema);

function runHarness(args, timeout = 60_000) {
  return spawnSync(process.execPath, [runner, ...args], {
    cwd: root,
    encoding: 'utf8',
    timeout,
  });
}

function readReport(directory) {
  const report = JSON.parse(readFileSync(join(directory, 'browser-report.json'), 'utf8'));
  assert.equal(validateReport(report), true, JSON.stringify(validateReport.errors, null, 2));
  return report;
}

function assertEvidenceFile(path) {
  assert.equal(existsSync(path), true, `missing evidence: ${path}`);
  assert.ok(statSync(path).size > 0, `empty evidence: ${path}`);
}

test('bundled Chromium fixture emits complete passing browser evidence', () => {
  const out = mkdtempSync(join(tmpdir(), 'landing-studio-browser-positive-'));
  const result = runHarness(['--config', smokeConfig, '--out', out]);

  assert.equal(result.status, 0, `stdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  const report = readReport(out);
  assert.equal(report.schema_version, '1.0.0');
  assert.equal(report.decision, 'PASS');
  assert.equal(report.run_id, 'browser-qa-smoke');
  assert.equal(report.section_id, 'fixture');
  assert.deepEqual(
    report.projects.map(({ id }) => id),
    ['desktop-light', 'mobile-light', 'desktop-reduced-motion', 'desktop-dark'],
  );

  for (const current of report.projects) {
    assert.equal(current.journey.passed, true, `${current.id} journey failed`);
    assert.equal(current.accessibility.blocking_violations, 0, `${current.id} has blocking axe violations`);
    assert.deepEqual(current.console.errors, [], `${current.id} has console errors`);
    assert.deepEqual(current.network.failed_first_party, [], `${current.id} has failed first-party requests`);
    assert.equal(current.evidence.viewport.width, current.viewport.width);
    assert.equal(current.evidence.viewport.height, current.viewport.height);
    assert.ok(current.evidence.screenshots.length >= 3, `${current.id} needs full-page and section screenshots`);
    for (const relativePath of current.evidence.screenshots) {
      assertEvidenceFile(join(out, relativePath));
    }
    assertEvidenceFile(join(out, current.evidence.trace));
  }
});

test('negative fixture writes evidence and exits nonzero for console and request blockers', () => {
  const out = mkdtempSync(join(tmpdir(), 'landing-studio-browser-negative-'));
  const result = runHarness([
    '--fixture',
    'negative',
    '--browser',
    'chromium',
    '--profiles',
    'desktop-light',
    '--out',
    out,
  ]);

  assert.equal(result.status, 1, `stdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  const report = readReport(out);
  assert.equal(report.decision, 'BLOCK');
  assert.equal(report.projects[0].journey.passed, true, 'negative mode must still prove the CTA journey');
  assert.deepEqual(report.projects[0].evidence.missing, []);
  assert.ok(report.projects[0].evidence.screenshots.length >= 3);
  assert.ok(report.projects[0].blockers.some(({ category }) => category === 'console'));
  assert.ok(report.projects[0].blockers.some(({ category }) => category === 'first-party-request'));
  assert.ok(report.console_errors.length > 0);
  assert.ok(report.failed_requests.length > 0);
  assertEvidenceFile(join(out, report.projects[0].evidence.trace));
});

test('declarative journey engine verifies a configured real-page contract without fixture IDs in code', () => {
  const out = mkdtempSync(join(tmpdir(), 'landing-studio-browser-declarative-'));
  const result = runHarness(['--config', declarativeConfig, '--out', out]);

  assert.equal(result.status, 0, `stdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  const report = readReport(out);
  assert.equal(report.decision, 'PASS');
  assert.deepEqual(
    report.projects[0].journey.steps.slice(0, 3).map(({ name }) => name),
    ['hero-visible', 'request-demo', 'confirmation-visible'],
  );
  assert.ok(report.projects[0].evidence.section_screenshot_count >= 1);
  assert.ok(report.projects[0].evidence.journey_screenshot_count >= 2, 'mutating and final journey states must be retained');
});

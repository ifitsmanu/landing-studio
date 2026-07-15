import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '..');
const installer = path.join(root, 'scripts', 'install.mjs');

test('project install creates a portable suite and uninstall removes owned files', () => {
  const project = mkdtempSync(path.join(os.tmpdir(), 'landing-studio-install-'));
  try {
    const install = spawnSync(process.execPath, [installer, '--runtime', 'neutral', '--scope', 'project', '--project', project], {
      cwd: root,
      encoding: 'utf8',
    });
    assert.equal(install.status, 0, install.stderr);

    const skillsRoot = path.join(project, '.agents', 'skills');
    const manifestPath = path.join(skillsRoot, '.landing-studio.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    assert.equal(manifest.version, '1.0.0');
    assert.equal(manifest.runtime, 'neutral');
    assert.ok(existsSync(path.join(skillsRoot, 'landing-page-build', 'SKILL.md')));
    assert.ok(existsSync(path.join(manifest.install_root, 'scripts', 'install.mjs')));
    assert.ok(existsSync(path.join(manifest.install_root, 'brand-kit.template.md')));
    assert.ok(existsSync(path.join(manifest.install_root, 'node_modules', 'ajv', 'package.json')));
    assert.equal(existsSync(path.join(manifest.install_root, 'tools', 'browser-qa', 'node_modules')), false);
    assert.equal(existsSync(path.join(manifest.install_root, 'skills', 'motion-video', 'assets', 'scene-templates', 'node_modules')), false);
    const portableCli = spawnSync(process.execPath, [path.join(manifest.install_root, 'scripts', 'studio-state.mjs'), '--help'], {
      cwd: project,
      encoding: 'utf8',
    });
    assert.equal(portableCli.status, 0, portableCli.stderr);
    assert.match(portableCli.stdout, /Landing Studio run state/);

    const uninstall = spawnSync(process.execPath, [installer, '--action', 'uninstall', '--runtime', 'neutral', '--scope', 'project', '--project', project], {
      cwd: root,
      encoding: 'utf8',
    });
    assert.equal(uninstall.status, 0, uninstall.stderr);
    assert.equal(existsSync(path.join(skillsRoot, 'landing-page-build')), false);
    assert.equal(existsSync(manifestPath), false);
    assert.equal(existsSync(manifest.install_root), false);
  } finally {
    rmSync(project, { recursive: true, force: true });
  }
});

test('copy installs are idempotent and uninstall preserves a modified copied skill', () => {
  const project = mkdtempSync(path.join(os.tmpdir(), 'landing-studio-conflict-'));
  try {
    const first = spawnSync(process.execPath, [installer, '--runtime', 'neutral', '--scope', 'project', '--project', project, '--copy'], {
      cwd: root,
      encoding: 'utf8',
    });
    assert.equal(first.status, 0, first.stderr);

    const second = spawnSync(process.execPath, [installer, '--runtime', 'neutral', '--scope', 'project', '--project', project, '--copy'], {
      cwd: root,
      encoding: 'utf8',
    });
    assert.equal(second.status, 0, second.stderr);

    const copiedSkill = path.join(project, '.agents', 'skills', 'landing-page-build', 'SKILL.md');
    writeFileSync(copiedSkill, `${readFileSync(copiedSkill, 'utf8')}\nLocal edit.\n`);
    const third = spawnSync(process.execPath, [installer, '--runtime', 'neutral', '--scope', 'project', '--project', project, '--copy'], {
      cwd: root,
      encoding: 'utf8',
    });
    assert.equal(third.status, 1);
    assert.match(third.stderr, /exists; rerun with --force/);

    const uninstall = spawnSync(process.execPath, [installer, '--action', 'uninstall', '--runtime', 'neutral', '--scope', 'project', '--project', project], {
      cwd: root,
      encoding: 'utf8',
    });
    assert.equal(uninstall.status, 1, uninstall.stderr);
    assert.ok(existsSync(copiedSkill));
    assert.match(uninstall.stderr, /refusing to orphan 1 modified copied skill/i);
    const manifestPath = path.join(project, '.agents', 'skills', '.landing-studio.json');
    assert.ok(existsSync(manifestPath));
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    assert.ok(existsSync(manifest.install_root));
    assert.ok(existsSync(path.join(project, '.agents', 'skills', 'landing-copywriter')));
    const portableCli = spawnSync(process.execPath, [path.join(manifest.install_root, 'scripts', 'studio-state.mjs'), '--help'], { encoding: 'utf8' });
    assert.equal(portableCli.status, 0, portableCli.stderr);
  } finally {
    rmSync(project, { recursive: true, force: true });
  }
});

test('installer refuses to overwrite an unrelated skill without force', () => {
  const project = mkdtempSync(path.join(os.tmpdir(), 'landing-studio-conflict-'));
  try {
    const destination = path.join(project, '.agents', 'skills', 'landing-page-build');
    mkdirSync(destination, { recursive: true });
    writeFileSync(path.join(destination, 'SKILL.md'), 'unrelated\n');
    const install = spawnSync(process.execPath, [installer, '--runtime', 'neutral', '--scope', 'project', '--project', project], {
      cwd: root,
      encoding: 'utf8',
    });
    assert.equal(install.status, 1);
    assert.match(install.stderr, /exists; rerun with --force/);
    assert.equal(readFileSync(path.join(destination, 'SKILL.md'), 'utf8'), 'unrelated\n');
  } finally {
    rmSync(project, { recursive: true, force: true });
  }
});

test('uninstalling one runtime preserves a shared support tree used by another runtime', () => {
  const project = mkdtempSync(path.join(os.tmpdir(), 'landing-studio-multi-runtime-'));
  try {
    for (const runtime of ['codex', 'claude']) {
      const install = spawnSync(process.execPath, [installer, '--runtime', runtime, '--scope', 'project', '--project', project], {
        cwd: root,
        encoding: 'utf8',
      });
      assert.equal(install.status, 0, install.stderr);
    }
    const codexManifestPath = path.join(project, '.agents', 'skills', '.landing-studio.json');
    const support = JSON.parse(readFileSync(codexManifestPath, 'utf8')).install_root;
    const uninstallClaude = spawnSync(process.execPath, [installer, '--action', 'uninstall', '--runtime', 'claude', '--scope', 'project', '--project', project], {
      cwd: root,
      encoding: 'utf8',
    });
    assert.equal(uninstallClaude.status, 0, uninstallClaude.stderr);
    assert.ok(existsSync(support));
    assert.ok(existsSync(path.join(project, '.agents', 'skills', 'landing-page-build', 'SKILL.md')));

    const uninstallCodex = spawnSync(process.execPath, [installer, '--action', 'uninstall', '--runtime', 'codex', '--scope', 'project', '--project', project], {
      cwd: root,
      encoding: 'utf8',
    });
    assert.equal(uninstallCodex.status, 0, uninstallCodex.stderr);
    assert.equal(existsSync(support), false);
  } finally {
    rmSync(project, { recursive: true, force: true });
  }
});

test('uninstall rejects a path-traversing manifest without touching outside files', () => {
  const project = mkdtempSync(path.join(os.tmpdir(), 'landing-studio-manifest-safety-'));
  try {
    const install = spawnSync(process.execPath, [installer, '--runtime', 'neutral', '--scope', 'project', '--project', project, '--copy'], {
      cwd: root,
      encoding: 'utf8',
    });
    assert.equal(install.status, 0, install.stderr);
    const manifestPath = path.join(project, '.agents', 'skills', '.landing-studio.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const outside = path.join(project, 'outside');
    mkdirSync(outside, { recursive: true });
    writeFileSync(path.join(outside, 'keep.txt'), 'keep\n');
    manifest.skills = [{ name: '../../outside', digest: '0'.repeat(64) }];
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

    const uninstall = spawnSync(process.execPath, [installer, '--action', 'uninstall', '--runtime', 'neutral', '--scope', 'project', '--project', project], {
      cwd: root,
      encoding: 'utf8',
    });
    assert.equal(uninstall.status, 1);
    assert.match(uninstall.stderr, /unsafe skill name/i);
    assert.equal(readFileSync(path.join(outside, 'keep.txt'), 'utf8'), 'keep\n');
  } finally {
    rmSync(project, { recursive: true, force: true });
  }
});

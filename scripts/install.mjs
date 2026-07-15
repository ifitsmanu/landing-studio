#!/usr/bin/env node
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

const sourceRoot = path.resolve(import.meta.dirname, '..');
const { version } = JSON.parse(readFileSync(path.join(sourceRoot, 'package.json'), 'utf8'));

const runtimePaths = {
  neutral: { project: '.agents/skills', user: '.agents/skills' },
  codex: { project: '.agents/skills', user: '.agents/skills' },
  gemini: { project: '.agents/skills', user: '.agents/skills' },
  copilot: { project: '.agents/skills', user: '.agents/skills' },
  opencode: { project: '.agents/skills', user: '.agents/skills' },
  claude: { project: '.claude/skills', user: '.claude/skills' },
  cursor: { project: '.cursor/skills', user: '.cursor/skills' },
  windsurf: { project: '.windsurf/skills', user: '.codeium/windsurf/skills' },
  cline: { project: '.cline/skills', user: '.cline/skills' },
};

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const options = { action: 'install', runtime: 'neutral', scope: 'project', mode: 'link', force: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--force') options.force = true;
    else if (arg === '--copy') options.mode = 'copy';
    else if (arg === '--help' || arg === '-h') options.help = true;
    else if (['--action', '--runtime', '--scope', '--project'].includes(arg)) {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) fail(`${arg} requires a value`);
      options[arg.slice(2)] = value;
      index += 1;
    } else fail(`unknown argument '${arg}'`);
  }
  return options;
}

function usage() {
  console.log(`Landing Studio ${version}

Usage:
  node scripts/install.mjs --runtime <name> --scope <project|user> [--project <path>] [--copy] [--force]
  node scripts/install.mjs --action uninstall --runtime <name> --scope <project|user> [--project <path>]

Runtimes: ${Object.keys(runtimePaths).join(', ')}

Default installation uses links to one versioned support tree. Use --copy when links are unavailable.`);
}

function destinations(options) {
  if (!(options.runtime in runtimePaths)) fail(`unsupported runtime '${options.runtime}'`);
  if (!['project', 'user'].includes(options.scope)) fail(`scope must be 'project' or 'user'`);
  if (!['install', 'uninstall'].includes(options.action)) fail(`action must be 'install' or 'uninstall'`);

  const projectRoot = path.resolve(options.project ?? process.cwd());
  const relativeSkills = runtimePaths[options.runtime][options.scope];
  const skillsRoot = options.scope === 'user'
    ? path.join(os.homedir(), relativeSkills)
    : path.join(projectRoot, relativeSkills);
  const installRoot = options.scope === 'user'
    ? path.join(os.homedir(), '.local', 'share', 'landing-studio', version)
    : path.join(projectRoot, '.landing-studio', 'vendor', version);
  return { projectRoot, skillsRoot, installRoot };
}

function removeOwnedSkill(skillPath, expectedTarget) {
  if (!existsSync(skillPath)) return;
  const stat = lstatSync(skillPath);
  if (!stat.isSymbolicLink()) return;
  const actual = path.resolve(path.dirname(skillPath), readlinkSync(skillPath));
  if (actual === path.resolve(expectedTarget)) rmSync(skillPath);
}

function readManifest(skillsRoot) {
  const manifestPath = path.join(skillsRoot, '.landing-studio.json');
  if (!existsSync(manifestPath)) return null;
  try {
    return JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    fail(`cannot read owned-install manifest ${manifestPath}: ${error.message}`);
  }
}

function treeDigest(root) {
  const digest = createHash('sha256');
  function visit(current, relative = '') {
    for (const entry of readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const child = path.join(current, entry.name);
      const key = path.posix.join(relative.split(path.sep).join('/'), entry.name);
      if (entry.isDirectory()) {
        digest.update(`directory\0${key}\0`);
        visit(child, key);
      } else if (entry.isSymbolicLink()) {
        digest.update(`symlink\0${key}\0${readlinkSync(child)}\0`);
      } else {
        digest.update(`file\0${key}\0`);
        digest.update(readFileSync(child));
        digest.update('\0');
      }
    }
  }
  visit(root);
  return digest.digest('hex');
}

function ownedSkill(manifest, name) {
  return manifest?.skills?.find((skill) => skill.name === name) ?? null;
}

function validateOwnedSkillName(name) {
  if (typeof name !== 'string' || !/^[a-z0-9][a-z0-9-]*$/u.test(name)) {
    fail(`unsafe skill name in install manifest: ${JSON.stringify(name)}`);
  }
  return name;
}

function supportUsedElsewhere(options, installRoot, currentSkillsRoot) {
  const projectRoot = path.resolve(options.project ?? process.cwd());
  const base = options.scope === 'user' ? os.homedir() : projectRoot;
  const roots = new Set(Object.values(runtimePaths).map((paths) => path.join(base, paths[options.scope])));
  roots.delete(currentSkillsRoot);
  for (const skillsRoot of roots) {
    const manifest = readManifest(skillsRoot);
    if (manifest?.install_root === installRoot) return true;
  }
  return false;
}

function uninstall(options) {
  const { skillsRoot, installRoot } = destinations(options);
  const manifestPath = path.join(skillsRoot, '.landing-studio.json');
  const manifest = readManifest(skillsRoot);
  if (manifest && manifest.install_root !== installRoot) {
    fail(`manifest at ${manifestPath} belongs to a different installation`);
  }
  const sourceSkills = path.join(installRoot, 'skills');
  const skills = manifest?.skills ?? (existsSync(sourceSkills)
    ? readdirSync(sourceSkills).map((name) => ({ name, digest: null }))
    : []);
  const preserved = [];
  if (manifest?.mode === 'copy') {
    for (const skill of skills) {
      const name = validateOwnedSkillName(skill.name);
      const destination = path.join(skillsRoot, name);
      if (!existsSync(destination)) continue;
      const source = path.join(sourceSkills, name);
      if (!existsSync(source) || !skill.digest || treeDigest(source) !== skill.digest) {
        fail(`owned copy metadata does not match support source for '${name}'`);
      }
      if (treeDigest(destination) !== skill.digest) preserved.push(destination);
    }
    if (preserved.length && !options.force) {
      fail(`refusing to orphan ${preserved.length} modified copied skill(s); manifest and support runtime were preserved. Back up or revert the files, or rerun uninstall with --force:\n${preserved.map((entry) => `- ${entry}`).join('\n')}`);
    }
  }
  for (const skill of skills) {
    const name = validateOwnedSkillName(skill.name);
    const destination = path.join(skillsRoot, name);
    if (manifest?.mode === 'copy') {
      if (!existsSync(destination)) continue;
      const source = path.join(sourceSkills, name);
      if (!existsSync(source) || !skill.digest || treeDigest(source) !== skill.digest) {
        fail(`owned copy metadata does not match support source for '${name}'`);
      }
      if (treeDigest(destination) === skill.digest || options.force) rmSync(destination, { recursive: true, force: true });
    } else {
      removeOwnedSkill(destination, path.join(sourceSkills, name));
    }
  }
  if (manifest) rmSync(manifestPath);
  if (!supportUsedElsewhere(options, installRoot, skillsRoot)) {
    rmSync(installRoot, { recursive: true, force: true });
  }
  console.log(`Removed Landing Studio ${version} from ${skillsRoot}`);
}

function copyDistribution(installRoot) {
  const stagingRoot = `${installRoot}.tmp-${process.pid}`;
  rmSync(stagingRoot, { recursive: true, force: true });
  mkdirSync(stagingRoot, { recursive: true });
  for (const entry of [
    '.claude-plugin',
    'skills',
    'scripts',
    'schemas',
    'templates',
    'tools',
    'evals',
    'brand-kit.template.md',
    'package.json',
    'package-lock.json',
    'LICENSE',
    'README.md',
  ]) {
    const source = path.join(sourceRoot, entry);
    if (existsSync(source)) {
      cpSync(source, path.join(stagingRoot, entry), {
        recursive: true,
        filter(candidate) {
          const parts = path.relative(sourceRoot, candidate).split(path.sep);
          return !parts.includes('node_modules')
            && !parts.includes('.landing-studio')
            && !parts.includes('test-results')
            && !parts.includes('playwright-report');
        },
      });
    }
  }
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const dependencies = spawnSync(
    npm,
    ['ci', '--omit=dev', '--ignore-scripts', '--no-audit', '--no-fund'],
    { cwd: stagingRoot, encoding: 'utf8' },
  );
  if (dependencies.status !== 0) {
    rmSync(stagingRoot, { recursive: true, force: true });
    fail(`support dependency install failed:\n${dependencies.stderr || dependencies.stdout}`);
  }
  rmSync(installRoot, { recursive: true, force: true });
  renameSync(stagingRoot, installRoot);
}

function install(options) {
  const { skillsRoot, installRoot } = destinations(options);
  mkdirSync(skillsRoot, { recursive: true });
  const previousManifest = readManifest(skillsRoot);
  const skillNames = readdirSync(path.join(sourceRoot, 'skills'))
    .filter((name) => lstatSync(path.join(sourceRoot, 'skills', name)).isDirectory());

  for (const name of skillNames) {
    const destination = path.join(skillsRoot, name);
    if (!existsSync(destination)) continue;
    const expectedTarget = path.join(installRoot, 'skills', name);
    const sameLink = lstatSync(destination).isSymbolicLink()
      && path.resolve(path.dirname(destination), readlinkSync(destination)) === expectedTarget;
    const prior = ownedSkill(previousManifest, name);
    const sameCopy = previousManifest?.install_root === installRoot
      && previousManifest?.mode === 'copy'
      && prior?.digest
      && !lstatSync(destination).isSymbolicLink()
      && treeDigest(destination) === prior.digest;
    if (!sameLink && !sameCopy && !options.force) {
      fail(`${destination} exists; rerun with --force only after reviewing it`);
    }
  }

  copyDistribution(installRoot);
  const installedSkills = [];

  for (const name of readdirSync(path.join(installRoot, 'skills'))) {
    const source = path.join(installRoot, 'skills', name);
    if (!lstatSync(source).isDirectory()) continue;
    const destination = path.join(skillsRoot, name);
    if (existsSync(destination)) {
      const sameLink = lstatSync(destination).isSymbolicLink()
        && path.resolve(path.dirname(destination), readlinkSync(destination)) === source;
      if (sameLink) {
        installedSkills.push({ name, digest: treeDigest(source) });
        continue;
      }
      rmSync(destination, { recursive: true, force: true });
    }
    if (options.mode === 'copy') cpSync(source, destination, { recursive: true });
    else symlinkSync(source, destination, process.platform === 'win32' ? 'junction' : 'dir');
    installedSkills.push({ name, digest: treeDigest(source) });
  }

  writeFileSync(path.join(skillsRoot, '.landing-studio.json'), `${JSON.stringify({
    version,
    runtime: options.runtime,
    scope: options.scope,
    mode: options.mode,
    install_root: installRoot,
    skills: installedSkills,
    installed_at: new Date().toISOString(),
  }, null, 2)}\n`);

  console.log(`Installed Landing Studio ${version}`);
  console.log(`Skills: ${skillsRoot}`);
  console.log(`Support: ${installRoot}`);
  console.log(`Verify: inspect ${path.join(skillsRoot, 'landing-page-build', 'SKILL.md')}`);
}

const options = parseArgs(process.argv.slice(2));
if (options.help) usage();
else if (options.action === 'uninstall') uninstall(options);
else install(options);

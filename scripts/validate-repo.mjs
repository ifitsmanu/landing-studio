#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const errors = [];
const warnings = [];

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() && entry.name !== '.git' && entry.name !== 'node_modules'
      ? walk(path)
      : [path];
  });
}

function text(path) {
  return readFileSync(path, 'utf8');
}

const files = walk(root).filter((path) => statSync(path).isFile());
const relativeFiles = new Set(files.map((path) => relative(root, path)));
const skills = files.filter((path) => path.endsWith('/SKILL.md'));
const names = new Map();

for (const path of skills) {
  const source = text(path);
  const rel = relative(root, path);
  const lines = source.split('\n');
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatter) {
    errors.push(`${rel}: missing YAML frontmatter`);
    continue;
  }

  const name = frontmatter[1].match(/^name:\s*(\S+)\s*$/m)?.[1];
  if (!name) errors.push(`${rel}: missing frontmatter name`);
  if (!/^description:\s*(>|\S)/m.test(frontmatter[1])) {
    errors.push(`${rel}: missing frontmatter description`);
  }

  const directoryName = rel.split('/').at(-2);
  if (name && name !== directoryName) {
    errors.push(`${rel}: name '${name}' does not match directory '${directoryName}'`);
  }
  if (name) {
    if (names.has(name)) errors.push(`${rel}: duplicate skill name '${name}' also in ${names.get(name)}`);
    names.set(name, rel);
  }
  if (lines.length > 500) errors.push(`${rel}: ${lines.length} lines; SKILL.md should stay under 500`);
  if (lines.length > 400) warnings.push(`${rel}: ${lines.length} lines; consider progressive disclosure`);
}

for (const path of files.filter((candidate) => candidate.endsWith('.md'))) {
  const source = text(path);
  const rel = relative(root, path);
  const links = [...source.matchAll(/\[[^\]]*\]\((\.\.?\/[^)#]+)(?:#[^)]+)?\)/g)];
  for (const [, target] of links) {
    const absolute = resolve(dirname(path), target);
    if (!relativeFiles.has(relative(root, absolute))) {
      errors.push(`${rel}: broken local link '${target}'`);
    }
  }
}

// Skill references are commonly written as backticked paths rather than Markdown links.
// Resolve them from the current file, repository root, and owning skill root.
for (const path of files.filter((candidate) => candidate.endsWith('.md'))) {
  const source = text(path);
  const rel = relative(root, path);
  const skillRoot = rel.startsWith('skills/')
    ? join(root, ...rel.split('/').slice(0, 2))
    : root;
  const references = [...source.matchAll(/`([^`\n]+)`/g)].map((match) => match[1]);
  for (const target of references) {
    if (!/^(?:\.\.?\/|skills\/|scripts\/|evals\/|assets\/|references\/|\.claude-plugin\/)/.test(target)) continue;
    if (/[<>*|…]/.test(target) || /\s/.test(target)) continue;
    const clean = target.replace(/[.,;:]$/, '');
    const candidates = [resolve(dirname(path), clean), resolve(root, clean), resolve(skillRoot, clean)];
    if (!candidates.some((candidate) => existsSync(candidate))) {
      errors.push(`${rel}: broken backticked repository path '${clean}'`);
    }
  }
}

for (const path of files.filter((candidate) => candidate.endsWith('.DS_Store'))) {
  errors.push(`${relative(root, path)}: macOS metadata must not be committed`);
}

try {
  const manifest = JSON.parse(text(join(root, '.claude-plugin', 'plugin.json')));
  if (manifest.name !== 'landing-studio') errors.push('plugin.json: expected name landing-studio');
  if (!/^\d+\.\d+\.\d+$/.test(manifest.version ?? '')) {
    errors.push('plugin.json: version must be semver x.y.z');
  }
} catch (error) {
  errors.push(`plugin.json: invalid JSON (${error.message})`);
}

try {
  const suite = JSON.parse(text(join(root, 'evals', 'evals.json')));
  if (suite.skill_name !== 'landing-studio') errors.push('evals.json: expected skill_name landing-studio');
  if (!Array.isArray(suite.evals) || suite.evals.length < 5) {
    errors.push('evals.json: expected at least five eval scenarios');
  } else {
    const ids = new Set();
    for (const scenario of suite.evals) {
      if (!Number.isInteger(scenario.id) || ids.has(scenario.id)) {
        errors.push(`evals.json: invalid or duplicate scenario id '${scenario.id}'`);
      }
      ids.add(scenario.id);
      if (typeof scenario.prompt !== 'string' || typeof scenario.expected_output !== 'string') {
        errors.push(`evals.json: scenario ${scenario.id} needs prompt and expected_output strings`);
      }
      if (!Array.isArray(scenario.assertions) || scenario.assertions.length < 3) {
        errors.push(`evals.json: scenario ${scenario.id} needs at least three assertions`);
      }
    }
  }
} catch (error) {
  errors.push(`evals.json: invalid JSON (${error.message})`);
}

const canonicalKit = text(join(root, 'brand-kit.template.md'));
for (const field of [
  'kit_version:',
  'brand:',
  'product:',
  'one_liner:',
  'ui_material:',
  'voice:',
  'proof:',
  'forbidden_claims:',
  'cta:',
  'competitors:',
  'research:',
  'analytics:',
  'motion:',
  'constraints:',
  'launch_date:',
]) {
  if (!canonicalKit.includes(field)) errors.push(`brand-kit.template.md: missing canonical field '${field}'`);
}

const readme = text(join(root, 'README.md'));
for (const name of names.keys()) {
  if (!readme.includes(`\`${name}\``)) warnings.push(`README.md: skill '${name}' is not listed`);
}

const banned = [
  ['two asks halve both', /two asks halve both/i],
  ['universal scroll-loss claim', /every screenful[^\n]*loses a third to half/i],
  ['unsupported half-scroll claim', /roughly half[^\n]*(reach|visitors|them)/i],
  ['monotonic attention claim', /attention decays monotonically/i],
  ['unsupported muted-majority claim', /most feed plays/i],
  ['unsupported three-second prediction', /first 3 seconds predict/i],
  ['obsolete FAQ recommendation', /write FAQPage markup anyway/i],
  ['obsolete FAQ mirroring recommendation', /mirror(?:ing)? with FAQPage/i],
  ['false zero-dependency claim', /zero-dependency floor/i],
  ['duplicate campaign launch date contract', /campaign:\s*\n\s+launch_date:/i],
  ['noncanonical bare claims path', /row in `claims`/i],
  ['accepted P1 release policy', /accepted P1|explicitly accepted P1/i],
  ['unsupported campaign benchmark table', /benchmark sanity ranges/i],
];

for (const path of files.filter((candidate) => candidate.endsWith('.md'))) {
  const source = text(path);
  for (const [label, pattern] of banned) {
    if (pattern.test(source)) errors.push(`${relative(root, path)}: ${label}`);
  }
}

console.log(`Validated ${skills.length} skills and ${files.length} repository files.`);
for (const warning of warnings) console.warn(`WARN: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);
if (errors.length) process.exit(1);
console.log('Repository validation passed.');

import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const scenes = join(root, 'skills/motion-video/assets/scene-templates');
const capture = join(scenes, 'capture.mjs');
const encode = join(scenes, 'encode.sh');
const cutdowns = join(scenes, 'cutdowns.sh');

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: scenes,
    encoding: 'utf8',
    timeout: options.timeout ?? 30_000,
  });
}

function assertSuccess(result) {
  assert.equal(
    result.status,
    0,
    `status=${result.status} signal=${result.signal}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  );
}

function probeDimensions(path) {
  const result = run('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height',
    '-of', 'csv=s=x:p=0', path,
  ]);
  assertSuccess(result);
  return result.stdout.trim();
}

function assertFile(path) {
  assert.equal(existsSync(path), true, `missing ${path}`);
  assert.ok(statSync(path).size > 0, `empty ${path}`);
}

test('seek capture writes logical-size frames and a nonblank explicit poster', () => {
  const out = mkdtempSync(join(tmpdir(), 'landing-studio-motion-seek-'));
  const frames = join(out, 'frames');
  const result = run(process.execPath, [
    capture,
    '--url', 'kinetic-type-card.html?text=Proof%2C%20not%20promises.',
    '--out', frames,
    '--fps', '4',
    '--duration', '1',
    '--width', '640',
    '--height', '360',
    '--poster-time', '0.75',
  ]);

  assertSuccess(result);
  assert.equal(probeDimensions(join(frames, 'frame_00000.png')), '640x360');
  assert.equal(probeDimensions(join(frames, 'poster.png')), '640x360');
  const metadata = JSON.parse(readFileSync(join(frames, 'capture-metadata.json'), 'utf8'));
  assert.deepEqual(metadata.output, { width: 640, height: 360, scale: 1 });
  assert.equal(metadata.poster.timeSeconds, 0.75);
  assert.equal(metadata.poster.nonblank, true);
  assert.ok(metadata.poster.luminanceRange >= 8, JSON.stringify(metadata.poster));
});
test('virtual-time capture terminates and writes every requested frame', () => {
  const out = mkdtempSync(join(tmpdir(), 'landing-studio-motion-vtime-'));
  const result = run(process.execPath, [
    capture,
    '--url', 'kinetic-type-card.html?text=Virtual%20time',
    '--out', out,
    '--fps', '2',
    '--duration', '1',
    '--width', '320',
    '--height', '180',
    '--poster-time', '0.5',
    '--mode', 'vtime',
    '--frame-timeout', '2000',
  ], { timeout: 10_000 });

  assertSuccess(result);
  assertFile(join(out, 'frame_00000.png'));
  assertFile(join(out, 'frame_00001.png'));
  assertFile(join(out, 'poster.png'));
});

test('capture, encode, metadata inspection, and cutdowns use compatible filenames', () => {
  const out = mkdtempSync(join(tmpdir(), 'landing-studio-motion-e2e-'));
  const frames = join(out, 'frames');
  const master = join(out, 'dist', 'master');
  const cuts = join(out, 'dist', 'cutdowns');

  assertSuccess(run(process.execPath, [
    capture,
    '--url', 'kinetic-type-card.html?text=One%20working%20pipeline',
    '--out', frames,
    '--fps', '4',
    '--duration', '1',
    '--width', '640',
    '--height', '360',
    '--poster-time', '0.75',
  ]));
  assertSuccess(run(encode, [frames, '4', master, '--poster', join(frames, 'poster.png')]));

  assert.equal(probeDimensions(`${master}.mp4`), '640x360');
  assert.equal(probeDimensions(`${master}.webm`), '640x360');
  assertFile(`${master}-poster.jpg`);
  const metadata = JSON.parse(readFileSync(`${master}-metadata.json`, 'utf8'));
  assert.equal(metadata.video.width, 640);
  assert.equal(metadata.video.height, 360);
  assert.equal(metadata.video.pixelFormat, 'yuv420p');

  assertSuccess(run(cutdowns, [`${master}.mp4`, cuts]));
  for (const name of ['cut-1x1.mp4', 'cut-4x5.mp4', 'cut-9x16.mp4', 'cutdowns-metadata.json']) {
    assertFile(join(cuts, name));
  }
  const cutMetadata = JSON.parse(readFileSync(join(cuts, 'cutdowns-metadata.json'), 'utf8'));
  assert.equal(cutMetadata.input.file, basename(`${master}.mp4`));
  assert.equal(cutMetadata.input.width, 640);
  assert.equal(cutMetadata.input.height, 360);
});

test('capture rejects a poster timestamp outside the scene duration', () => {
  const out = mkdtempSync(join(tmpdir(), 'landing-studio-motion-poster-range-'));
  const result = run(process.execPath, [
    capture,
    '--url', 'kinetic-type-card.html?text=Invalid',
    '--out', out,
    '--fps', '2',
    '--duration', '1',
    '--poster-time', '2',
  ]);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /poster-time.*duration/i);
});

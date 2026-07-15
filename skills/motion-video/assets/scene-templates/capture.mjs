#!/usr/bin/env node
/**
 * Deterministic frame capture for Landing Studio scene templates and live URLs.
 *
 * Usage:
 *   node capture.mjs --url <file.html|https://...> --out <dir>
 *     --poster-time <seconds> [--fps 30] [--duration 8]
 *     [--width 1920] [--height 1080] [--scale 1]
 *     [--mode seek|vtime] [--wait-selector <css>]
 *     [--timeout 30000] [--frame-timeout 5000]
 */
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

function fail(message) {
  console.error(`capture: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (!flag?.startsWith('--') || value === undefined || value.startsWith('--')) {
      fail(`expected --name value pairs; invalid argument near ${flag ?? '<end>'}`);
    }
    const key = flag.slice(2);
    if (result[key] !== undefined) fail(`duplicate option --${key}`);
    result[key] = value;
  }
  return result;
}

function numberOption(value, name, fallback, { integer = false, allowZero = false } = {}) {
  const parsed = Number(value ?? fallback);
  const validSign = allowZero ? parsed >= 0 : parsed > 0;
  if (!Number.isFinite(parsed) || !validSign || (integer && !Number.isInteger(parsed))) {
    fail(`--${name} must be a ${allowZero ? 'non-negative' : 'positive'} ${integer ? 'integer' : 'number'}`);
  }
  return parsed;
}

function normalizeUrl(input) {
  if (/^https?:\/\//i.test(input)) return input;
  const queryIndex = input.search(/[?#]/);
  const pathname = queryIndex === -1 ? input : input.slice(0, queryIndex);
  const suffix = queryIndex === -1 ? '' : input.slice(queryIndex);
  return `${pathToFileURL(resolve(pathname)).href}${suffix}`;
}

function inspectPoster(buffer) {
  const png = PNG.sync.read(buffer);
  let min = 255;
  let max = 0;
  for (let index = 0; index < png.data.length; index += 4) {
    const luminance = Math.round(
      png.data[index] * 0.2126 + png.data[index + 1] * 0.7152 + png.data[index + 2] * 0.0722,
    );
    min = Math.min(min, luminance);
    max = Math.max(max, luminance);
  }
  const luminanceRange = max - min;
  return { nonblank: luminanceRange >= 8, luminanceRange, minimumLuminance: min, maximumLuminance: max };
}

async function setAnimationTime(page, timeMs) {
  await page.evaluate((time) => {
    document.documentElement.classList.add('play');
    for (const animation of document.getAnimations({ subtree: true })) {
      animation.pause();
      animation.currentTime = time;
    }
  }, timeMs);
}

async function advanceVirtualTime(cdp, budget, timeout) {
  let timer;
  let handler;
  const expired = new Promise((resolveExpired, rejectExpired) => {
    handler = () => {
      clearTimeout(timer);
      resolveExpired();
    };
    cdp.once('Emulation.virtualTimeBudgetExpired', handler);
    timer = setTimeout(() => {
      cdp.off('Emulation.virtualTimeBudgetExpired', handler);
      rejectExpired(new Error(`virtual-time frame did not advance within ${timeout}ms`));
    }, timeout);
  });
  await cdp.send('Emulation.setVirtualTimePolicy', { policy: 'advance', budget });
  await expired;
}

const args = parseArgs(process.argv.slice(2));
if (!args.url || !args.out) {
  fail('usage: node capture.mjs --url <file|url> --out <dir> --poster-time <seconds>');
}
if (args['poster-time'] === undefined) {
  fail('--poster-time is required so the static/reduced-motion frame is intentional');
}

const fps = numberOption(args.fps, 'fps', 30);
const duration = numberOption(args.duration, 'duration', 8);
const width = numberOption(args.width, 'width', 1920, { integer: true });
const height = numberOption(args.height, 'height', 1080, { integer: true });
const scale = numberOption(args.scale, 'scale', 1, { integer: true });
const timeout = numberOption(args.timeout, 'timeout', 30000, { integer: true });
const frameTimeout = numberOption(args['frame-timeout'], 'frame-timeout', 5000, { integer: true });
const posterTime = numberOption(args['poster-time'], 'poster-time', undefined, { allowZero: true });
const mode = args.mode ?? 'seek';
if (!['seek', 'vtime'].includes(mode)) fail('--mode must be seek or vtime');
if (width % 2 !== 0 || height % 2 !== 0) fail('--width and --height must be even for yuv420p encoding');
if (scale > 3) fail('--scale must be between 1 and 3');
if (posterTime > duration) fail(`--poster-time (${posterTime}s) exceeds --duration (${duration}s)`);

const total = Math.round(duration * fps);
if (total < 1) fail('--duration and --fps must produce at least one frame');
const frameMs = 1000 / fps;
const url = normalizeUrl(args.url);
const pad = (number) => String(number).padStart(5, '0');

mkdirSync(args.out, { recursive: true });
const existingFrames = readdirSync(args.out).filter((name) => /^frame_\d{5}\.png$/.test(name));
if (existingFrames.length > 0) {
  fail(`--out already contains ${existingFrames.length} frame file(s); use a fresh or cleared directory`);
}

const browser = await chromium.launch();
let posterInspection;
let actualPosterTime = posterTime;
let captureError;
try {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: scale,
    reducedMotion: 'no-preference',
  });
  page.setDefaultTimeout(timeout);
  page.setDefaultNavigationTimeout(timeout);

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
  try {
    await page.waitForLoadState('networkidle', { timeout: Math.min(timeout, 5000) });
  } catch {
    console.warn('capture: network did not become idle; continuing after DOM load');
  }
  await page.evaluate(() => document.fonts.ready);
  if (args['wait-selector']) await page.waitForSelector(args['wait-selector'], { timeout });

  if (mode === 'seek') {
    await setAnimationTime(page, 0);
    for (let frame = 0; frame < total; frame += 1) {
      await setAnimationTime(page, frame * frameMs);
      await page.screenshot({ path: `${args.out}/frame_${pad(frame)}.png` });
    }
    await setAnimationTime(page, posterTime * 1000);
    const poster = await page.screenshot({ path: `${args.out}/poster.png` });
    posterInspection = inspectPoster(poster);
  } else {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setVirtualTimePolicy', { policy: 'pause' });
    await page.evaluate(() => document.documentElement.classList.add('play'));
    const posterFrame = Math.min(total - 1, Math.round(posterTime * fps));
    actualPosterTime = posterFrame / fps;
    for (let frame = 0; frame < total; frame += 1) {
      if (frame > 0) await advanceVirtualTime(cdp, frameMs, frameTimeout);
      await page.screenshot({ path: `${args.out}/frame_${pad(frame)}.png` });
    }
    const posterSource = `${args.out}/frame_${pad(posterFrame)}.png`;
    copyFileSync(posterSource, `${args.out}/poster.png`);
    // Inspect the selected file, not whichever virtual-time frame is currently visible.
    posterInspection = inspectPoster(readFileSync(posterSource));
  }
} catch (error) {
  captureError = error;
} finally {
  await browser.close();
}
if (captureError) fail(captureError.message);

if (!posterInspection.nonblank) {
  fail(`poster at ${actualPosterTime}s is visually blank (luminance range ${posterInspection.luminanceRange}); choose a visible --poster-time`);
}

const metadata = {
  schemaVersion: 1,
  source: url,
  mode,
  fps,
  durationSeconds: duration,
  frameCount: total,
  logicalViewport: { width, height },
  output: { width: width * scale, height: height * scale, scale },
  poster: { timeSeconds: actualPosterTime, file: 'poster.png', ...posterInspection },
};
writeFileSync(`${args.out}/capture-metadata.json`, `${JSON.stringify(metadata, null, 2)}\n`);

console.log(`${total} frames + poster.png -> ${args.out}/`);
console.log(`Encode: ./encode.sh ${args.out} ${fps} dist/master --poster ${args.out}/poster.png`);

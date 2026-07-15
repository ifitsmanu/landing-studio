#!/usr/bin/env node
/**
 * Deterministic frame capture for the Landing Studio scene templates.
 *
 * Usage:
 *   node capture.mjs --url <file.html|https://...> --out <dir>
 *     [--fps 30] [--duration 8] [--width 1920] [--height 1080]
 *     [--scale 2] [--mode seek|vtime] [--wait-selector <css>]
 *     [--timeout 30000]
 */
import { chromium } from 'playwright';
import { mkdirSync, readdirSync } from 'node:fs';
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

function positiveNumber(value, name, fallback, { integer = false } = {}) {
  const parsed = Number(value ?? fallback);
  if (!Number.isFinite(parsed) || parsed <= 0 || (integer && !Number.isInteger(parsed))) {
    fail(`--${name} must be a positive ${integer ? 'integer' : 'number'}`);
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

const args = parseArgs(process.argv.slice(2));
if (!args.url || !args.out) {
  fail('usage: node capture.mjs --url <file|url> --out <dir> [--fps N] [--duration S]');
}

const fps = positiveNumber(args.fps, 'fps', 30);
const duration = positiveNumber(args.duration, 'duration', 8);
const width = positiveNumber(args.width, 'width', 1920, { integer: true });
const height = positiveNumber(args.height, 'height', 1080, { integer: true });
const scale = positiveNumber(args.scale, 'scale', 2);
const timeout = positiveNumber(args.timeout, 'timeout', 30000, { integer: true });
const mode = args.mode ?? 'seek';
if (!['seek', 'vtime'].includes(mode)) fail('--mode must be seek or vtime');

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
try {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: scale,
    reducedMotion: 'no-preference',
  });
  page.setDefaultTimeout(timeout);
  page.setDefaultNavigationTimeout(timeout);

  let cdp;
  if (mode === 'vtime') {
    cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setVirtualTimePolicy', {
      policy: 'pauseIfNetworkFetchesPending',
      budget: 5000,
    });
  }

  await page.goto(url, { waitUntil: 'domcontentloaded' });
  try {
    await page.waitForLoadState('networkidle', { timeout });
  } catch {
    console.warn(`capture: network did not become idle within ${timeout}ms; continuing after DOM load`);
  }
  await page.evaluate(() => document.fonts.ready);
  if (args['wait-selector']) await page.waitForSelector(args['wait-selector']);

  if (mode === 'seek') {
    await page.evaluate(() => {
      document.documentElement.classList.add('play');
      for (const animation of document.getAnimations({ subtree: true })) {
        animation.pause();
        animation.currentTime = 0;
      }
    });

    for (let frame = 0; frame < total; frame += 1) {
      await page.evaluate((time) => {
        for (const animation of document.getAnimations({ subtree: true })) {
          animation.pause();
          animation.currentTime = time;
        }
      }, frame * frameMs);
      await page.screenshot({ path: `${args.out}/frame_${pad(frame)}.png` });
    }
  } else {
    for (let frame = 0; frame < total; frame += 1) {
      const expired = new Promise((resolveExpired) => {
        cdp.once('Emulation.virtualTimeBudgetExpired', resolveExpired);
      });
      await cdp.send('Emulation.setVirtualTimePolicy', {
        policy: 'advance',
        budget: frameMs,
      });
      await expired;
      await page.screenshot({ path: `${args.out}/frame_${pad(frame)}.png` });
    }
  }
} finally {
  await browser.close();
}

console.log(`${total} frames -> ${args.out}/`);
console.log(`Encode: ./encode.sh ${args.out} ${fps} dist/scene`);

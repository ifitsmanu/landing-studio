#!/usr/bin/env node
import { mkdirSync, readFileSync, realpathSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { chromium, firefox, webkit } from 'playwright';
import { startFixtureServer } from './fixture/server.mjs';

const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');

const profiles = {
  'desktop-light': {
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light',
    reducedMotion: 'no-preference',
  },
  'mobile-light': {
    viewport: { width: 390, height: 844 },
    colorScheme: 'light',
    reducedMotion: 'no-preference',
    isMobile: true,
    hasTouch: true,
  },
  'desktop-reduced-motion': {
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light',
    reducedMotion: 'reduce',
  },
  'desktop-dark': {
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
    reducedMotion: 'no-preference',
  },
};

const engines = { chromium, firefox, webkit };

function fail(message) {
  throw new Error(message);
}

export function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (!flag.startsWith('--')) fail(`unexpected argument: ${flag}`);
    const value = argv[index + 1];
    if (value === undefined || value.startsWith('--')) fail(`${flag} requires a value`);
    result[flag.slice(2)] = value;
    index += 1;
  }
  return result;
}

export function loadOptions(argv) {
  const commandLine = parseArgs(argv);
  let options = commandLine;
  let baseDirectory = process.cwd();
  if (commandLine.config) {
    const configPath = resolve(commandLine.config);
    let config;
    try {
      config = JSON.parse(readFileSync(configPath, 'utf8'));
    } catch (error) {
      fail(`unable to read config ${configPath}: ${error.message}`);
    }
    if (!config || Array.isArray(config) || typeof config !== 'object') {
      fail(`config must contain a JSON object: ${configPath}`);
    }
    const { config: _ignored, ...overrides } = commandLine;
    options = { ...config, ...overrides };
    baseDirectory = dirname(configPath);
  }
  if (options['journey-file']) {
    const journeyPath = resolve(baseDirectory, options['journey-file']);
    try {
      const journey = JSON.parse(readFileSync(journeyPath, 'utf8'));
      options.journey = Array.isArray(journey) ? journey : journey.steps;
    } catch (error) {
      fail(`unable to read journey ${journeyPath}: ${error.message}`);
    }
  }
  if (options.journey !== undefined && !Array.isArray(options.journey)) {
    fail('journey must be an array of declarative steps');
  }
  return options;
}

function toRelative(root, path) {
  return relative(root, path).split(sep).join('/');
}

function safeName(value) {
  return String(value).replace(/[^a-z0-9._-]+/gi, '-').replace(/^-|-$/g, '');
}

function evidenceExists(path) {
  try {
    return statSync(path).size > 0;
  } catch {
    return false;
  }
}

function fileSha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

async function executeJourney(page, steps, captureState) {
  if (!Array.isArray(steps) || steps.length === 0) fail('no primary journey configured');
  const results = [];
  for (const [index, step] of steps.entries()) {
    const name = step.name ?? `step-${index + 1}`;
    const timeout = step.timeout ?? 10_000;
    const locator = step.selector ? page.locator(step.selector).first() : null;
    if (!['wait-for-url', 'screenshot'].includes(step.action) && !locator) fail(`${name}: ${step.action} requires selector`);
    if (step.action === 'click') await locator.click({ timeout });
    else if (step.action === 'fill') await locator.fill(String(step.value ?? ''), { timeout });
    else if (step.action === 'press') await locator.press(String(step.key), { timeout });
    else if (step.action === 'select') await locator.selectOption(step.value, { timeout });
    else if (step.action === 'check-visible') await locator.waitFor({ state: 'visible', timeout });
    else if (step.action === 'check-text') {
      await locator.filter({ hasText: String(step.text) }).waitFor({ state: 'visible', timeout });
    } else if (step.action === 'check-attribute') {
      await locator.waitFor({ state: 'attached', timeout });
      const actual = await locator.getAttribute(step.attribute);
      if (actual !== String(step.value)) fail(`${name}: expected ${step.attribute}=${step.value}, received ${actual}`);
    } else if (step.action === 'wait-for-url') {
      await page.waitForURL(String(step.value), { timeout });
    } else if (step.action === 'screenshot') {
      await captureState(name, step.selector ?? null);
    } else {
      fail(`${name}: unsupported journey action '${step.action}'`);
    }
    let evidence = null;
    if (['click', 'fill', 'press', 'select'].includes(step.action)) evidence = await captureState(name, step.evidence_selector ?? null);
    results.push({ name, action: step.action, passed: true, ...(evidence ? { evidence } : {}) });
  }
  return results;
}

async function runCase({ browser, browserName, caseId, config, options, fixtureMode, url, out }) {
  const caseDirectory = join(out, browserName, caseId);
  const screenshotDirectory = join(caseDirectory, 'screenshots');
  const tracePath = join(caseDirectory, 'trace.zip');
  mkdirSync(screenshotDirectory, { recursive: true });

  const context = await browser.newContext({
    viewport: config.viewport,
    colorScheme: config.colorScheme,
    reducedMotion: config.reducedMotion,
    isMobile: config.isMobile ?? false,
    hasTouch: config.hasTouch ?? false,
    locale: 'en-US',
  });
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  const page = await context.newPage();
  const consoleMessages = [];
  const pageErrors = [];
  const requests = [];
  const targetOrigin = new URL(url).origin;

  page.on('console', (message) => {
    consoleMessages.push({ type: message.type(), text: message.text() });
  });
  page.on('pageerror', (error) => {
    pageErrors.push({ message: error.message });
  });
  page.on('requestfailed', (request) => {
    const requestUrl = request.url();
    requests.push({
      url: requestUrl,
      method: request.method(),
      status: null,
      failure: request.failure()?.errorText ?? 'request failed',
      firstParty: new URL(requestUrl).origin === targetOrigin,
    });
  });
  page.on('response', (response) => {
    if (response.status() < 400) return;
    const requestUrl = response.url();
    requests.push({
      url: requestUrl,
      method: response.request().method(),
      status: response.status(),
      failure: null,
      firstParty: new URL(requestUrl).origin === targetOrigin,
    });
  });

  const screenshots = [];
  const journey = { passed: false, steps: [], error: null };
  let accessibility = { url, violations: [], blockingViolations: 0 };
  let sectionScreenshotCount = 0;
  let journeyScreenshotCount = 0;

  const captureJourneyState = async (name, selector = null) => {
    const nextCount = journeyScreenshotCount + 1;
    const path = join(screenshotDirectory, `journey-${String(nextCount).padStart(2, '0')}-${safeName(name)}.png`);
    if (selector) await page.locator(selector).first().screenshot({ path });
    else await page.screenshot({ path });
    journeyScreenshotCount = nextCount;
    const stored = toRelative(out, path);
    screenshots.push(stored);
    return stored;
  };

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    // Marketing pages often keep analytics or intentionally failed diagnostics open.
    // Network idle is a settling hint, not a precondition for collecting evidence.
    await page.waitForLoadState('networkidle', { timeout: 2_000 }).catch(() => {});

    const auditedUrl = page.url();
    const preferences = await page.evaluate((motionSelector) => ({
      reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
      dark: matchMedia('(prefers-color-scheme: dark)').matches,
      motionAnimation: motionSelector && document.querySelector(motionSelector)
        ? getComputedStyle(document.querySelector(motionSelector)).animationName
        : null,
    }), options['reduced-motion-selector'] ?? (fixtureMode ? '#motion-proof' : null));
    if (config.reducedMotion === 'reduce' && !preferences.reducedMotion) fail('reduced-motion media preference was not applied');
    if (config.reducedMotion === 'reduce' && preferences.motionAnimation && preferences.motionAnimation !== 'none') {
      fail('reduced-motion profile did not produce the configured static state');
    }

    await page.addScriptTag({ path: axePath });
    const axe = await page.evaluate(async () => globalThis.axe.run(document, { resultTypes: ['violations'] }));
    const violations = axe.violations.map((violation) => ({
      id: violation.id, impact: violation.impact, description: violation.description,
      help: violation.help, helpUrl: violation.helpUrl,
      nodes: violation.nodes.map((node) => ({ target: node.target, failureSummary: node.failureSummary })),
    }));
    accessibility = {
      url: auditedUrl,
      violations,
      blockingViolations: violations.filter(({ impact }) => impact === 'critical' || impact === 'serious').length,
    };

    const fullPage = join(screenshotDirectory, 'full-page.png');
    await page.screenshot({ path: fullPage, fullPage: true });
    screenshots.push(toRelative(out, fullPage));

    const viewportPath = join(screenshotDirectory, 'viewport.png');
    await page.screenshot({ path: viewportPath });
    screenshots.push(toRelative(out, viewportPath));

    const sectionSelector = options['section-selector'] ?? '[data-qa-section]';
    const sections = await page.locator(sectionSelector).all();
    sectionScreenshotCount = sections.length;
    for (const [index, section] of sections.entries()) {
      const name = safeName(
        await section.getAttribute('data-qa-section')
        ?? await section.getAttribute('id')
        ?? `target-${index + 1}`,
      );
      const path = join(screenshotDirectory, `section-${name}.png`);
      await section.scrollIntoViewIfNeeded();
      await section.screenshot({ path });
      screenshots.push(toRelative(out, path));
    }

    if (fixtureMode && options['journey-mode'] !== 'declarative') {
      const menu = page.locator('#menu-button');
      if (await menu.isVisible()) {
        await menu.click();
        const expanded = await menu.getAttribute('aria-expanded');
        if (expanded !== 'true') fail('responsive menu did not expose its expanded state');
        journey.steps.push({ name: 'open-responsive-menu', passed: true });
        await captureJourneyState('open-responsive-menu', '#site-nav');
      } else {
        journey.steps.push({ name: 'desktop-navigation-visible', passed: await page.locator('#site-nav').isVisible() });
      }

      const cta = page.locator('#primary-cta');
      await cta.scrollIntoViewIfNeeded();
      const [ctaResponse] = await Promise.all([
        page.waitForResponse((response) => response.url().endsWith('/api/cta') && response.request().method() === 'POST'),
        cta.click(),
      ]);
      if (!ctaResponse.ok()) fail(`primary CTA returned ${ctaResponse.status()}`);
      await page.locator('#cta-status').filter({ hasText: 'Fixture demo requested' }).waitFor();
      journey.steps.push({ name: 'primary-cta-completion', passed: true, status: ctaResponse.status() });
      await captureJourneyState('primary-cta-completion', '#cta-status');
    } else {
      journey.steps.push(...await executeJourney(page, options.journey, captureJourneyState));
    }
    await captureJourneyState('final-state');
    journey.passed = journey.steps.every(({ passed }) => passed);
  } catch (error) {
    journey.error = error.message;
    await captureJourneyState('failure-state').catch(() => {});
  } finally {
    await context.tracing.stop({ path: tracePath });
    await context.close();
  }

  const consoleErrors = consoleMessages.filter(({ type }) => type === 'error');
  const failedFirstParty = requests.filter(({ firstParty }) => firstParty);
  const missingEvidence = [tracePath, ...screenshots.map((path) => join(out, path))]
    .filter((path) => !evidenceExists(path))
    .map((path) => toRelative(out, path));

  return {
    id: caseId,
    browser: browserName,
    viewport: config.viewport,
    preferences: { colorScheme: config.colorScheme, reducedMotion: config.reducedMotion },
    journey,
    accessibility,
    console: { messages: consoleMessages, errors: consoleErrors, pageErrors },
    network: { failed: requests, failedFirstParty },
    evidence: {
      viewport: config.viewport,
      screenshots,
      trace: toRelative(out, tracePath),
      missing: missingEvidence,
      section_screenshot_count: sectionScreenshotCount,
      journey_screenshot_count: journeyScreenshotCount,
    },
  };
}

function blockersForCase(current) {
  const blockers = [];
  if (!current.journey.passed) blockers.push({ category: 'primary-journey', case: current.id, evidence: current.journey.error });
  if (current.accessibility.blockingViolations > 0) {
    blockers.push({ category: 'accessibility', case: current.id, evidence: `${current.accessibility.blockingViolations} serious/critical violation(s)` });
  }
  if (current.console.errors.length > 0 || current.console.pageErrors.length > 0) {
    blockers.push({ category: 'console', case: current.id, evidence: [...current.console.errors, ...current.console.pageErrors] });
  }
  if (current.network.failedFirstParty.length > 0) {
    blockers.push({ category: 'first-party-request', case: current.id, evidence: current.network.failedFirstParty });
  }
  if (current.evidence.missing.length > 0
    || current.evidence.screenshots.length < 3
    || current.evidence.section_screenshot_count < 1
    || current.evidence.journey_screenshot_count < 1) {
    blockers.push({ category: 'missing-evidence', case: current.id, evidence: current.evidence.missing });
  }
  return blockers;
}

function serializeProject(current) {
  return {
    id: current.id,
    name: `${current.browser}-${current.id}`,
    browser: current.browser,
    viewport: current.viewport,
    preferences: current.preferences,
    journey: current.journey,
    accessibility: {
      url: current.accessibility.url,
      violations: current.accessibility.violations,
      blocking_violations: current.accessibility.blockingViolations,
    },
    console: current.console,
    network: {
      failed: current.network.failed,
      failed_first_party: current.network.failedFirstParty,
    },
    evidence: current.evidence,
    blockers: blockersForCase(current),
  };
}

export async function runBrowserQa(options) {
  const out = resolve(options.out);
  mkdirSync(out, { recursive: true });
  let fixture;
  let targetUrl = options.url;
  if (options.fixture) {
    if (!['positive', 'negative'].includes(options.fixture)) fail('--fixture must be positive or negative');
    fixture = await startFixtureServer();
    targetUrl = `${fixture.origin}/${options.fixture === 'negative' ? '?negative=1' : ''}`;
  }
  if (!targetUrl) fail('provide --url or --fixture positive|negative');
  if (!/^https?:\/\//i.test(targetUrl)) fail('browser QA URL must use http or https');

  const requestedBrowsers = options.browser === 'all'
    ? Object.keys(engines)
    : (options.browser ?? 'chromium').split(',');
  const requestedProfiles = options.profiles
    ? options.profiles.split(',')
    : Object.keys(profiles);
  for (const name of requestedBrowsers) if (!engines[name]) fail(`unsupported browser: ${name}`);
  for (const id of requestedProfiles) if (!profiles[id]) fail(`unsupported profile: ${id}`);

  const cases = [];
  try {
    for (const browserName of requestedBrowsers) {
      let browser;
      try {
        browser = await engines[browserName].launch({ headless: true });
      } catch (error) {
        fail(`unable to launch ${browserName}; install it with npx playwright install ${browserName}: ${error.message}`);
      }
      try {
        for (const caseId of requestedProfiles) {
          cases.push(await runCase({
            browser,
            browserName,
            caseId,
            config: profiles[caseId],
            options,
            fixtureMode: Boolean(fixture),
            url: targetUrl,
            out,
          }));
        }
      } finally {
        await browser.close();
      }
    }
  } finally {
    await fixture?.close();
  }

  const projects = cases.map(serializeProject);
  const blockers = projects.flatMap(({ blockers }) => blockers);
  const consoleErrors = projects.flatMap((project) => [
    ...project.console.errors.map((error) => ({
      project: project.name,
      source: 'console',
      ...error,
    })),
    ...project.console.pageErrors.map((error) => ({
      project: project.name,
      source: 'pageerror',
      ...error,
    })),
  ]);
  const failedRequests = projects.flatMap((project) => project.network.failed.map((request) => ({
    project: project.name,
    ...request,
  })));
  const artifacts = projects.flatMap((project) => [
    ...project.evidence.screenshots.map((path) => ({
      project: project.name,
      type: 'screenshot',
      path,
      sha256: fileSha256(join(out, path)),
    })),
    {
      project: project.name,
      type: 'trace',
      path: project.evidence.trace,
      sha256: fileSha256(join(out, project.evidence.trace)),
    },
  ]);
  const report = {
    schema_version: '1.0.0',
    run_id: options['run-id'] ?? `browser-qa-${Date.now()}`,
    section_id: options['section-id'] ?? 'page',
    url: targetUrl,
    commit: options.commit ?? process.env.GITHUB_SHA ?? 'working-tree',
    captured_at: new Date().toISOString(),
    projects,
    journeys: projects.map((project) => ({
      project: project.name,
      ...project.journey,
    })),
    console_errors: consoleErrors,
    failed_requests: failedRequests,
    axe: {
      blocking_violations: projects.reduce(
        (sum, project) => sum + project.accessibility.blocking_violations,
        0,
      ),
      violations: projects.flatMap((project) => project.accessibility.violations.map((violation) => ({
        project: project.name,
        ...violation,
      }))),
    },
    artifacts,
    decision: blockers.length === 0 ? 'PASS' : 'BLOCK',
  };
  const reportPath = join(out, 'browser-report.json');
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  return { report, reportPath };
}

async function main() {
  try {
    const args = loadOptions(process.argv.slice(2));
    const { report, reportPath } = await runBrowserQa(args);
    console.log(`${report.decision}: ${report.projects.length} case(s) -> ${reportPath}`);
    const blockers = report.projects.flatMap(({ blockers }) => blockers);
    if (blockers.length > 0) {
      for (const blocker of blockers) {
        console.error(`[${blocker.category}] ${blocker.case}`);
      }
      process.exitCode = 1;
    }
  } catch (error) {
    console.error(`browser-qa: ${error.message}`);
    process.exitCode = 2;
  }
}

if (process.argv[1]
  && realpathSync(resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url))) {
  await main();
}

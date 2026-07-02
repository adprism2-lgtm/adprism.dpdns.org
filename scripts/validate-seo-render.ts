/**
 * Deep SEO validator — renders each public route in a headless browser and
 * asserts the ACTUAL DOM head (after react-helmet-async runs) contains a
 * self-referencing canonical, og:url, and valid JSON-LD.
 *
 * This complements scripts/validate-seo.ts (static/source checks). Run it
 * locally before a release:
 *
 *   npm run build && npm run preview &   # serve the built app
 *   npm run validate:seo:render          # then run this
 *
 * It requires Playwright (a devDependency) and a running server on
 * VALIDATE_BASE_URL (default http://localhost:4173).
 *
 * PERFORMANCE: the headless deep check is expensive, so results are cached
 * per route in .cache/seo-render.json. A route is only re-rendered when the
 * SEO-relevant "metadata" source files change. We hash those files once per
 * run; each route stores the metadata hash of its last passing check and is
 * skipped while that hash is unchanged. Pass --force (or set SEO_RENDER_FORCE=1)
 * to bypass the cache and re-check every route.
 *
 * REPORTS: every run writes a machine-readable JSON report and a human-friendly
 * HTML report (default .cache/seo-report.json / .cache/seo-report.html, override
 * with SEO_REPORT_DIR) listing every route, which metadata checks ran, their
 * status, and precise expected-vs-actual diffs when canonical or JSON-LD fails.
 */

import { chromium } from "playwright";
import { createHash } from "node:crypto";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { CITIES } from "../src/data/cities";

const BASE = process.env.VALIDATE_BASE_URL ?? "http://localhost:4173";
const SITE_URL = "https://frame-stories-film.lovable.app";
const FORCE = process.argv.includes("--force") || process.env.SEO_RENDER_FORCE === "1";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CACHE_FILE = resolve(ROOT, ".cache/seo-render.json");
const REPORT_DIR = process.env.SEO_REPORT_DIR ?? resolve(ROOT, ".cache");
const REPORT_JSON = resolve(REPORT_DIR, "seo-report.json");
const REPORT_HTML = resolve(REPORT_DIR, "seo-report.html");

/**
 * Files whose contents determine the rendered SEO output. If none of these
 * change, previously-passing routes don't need to be re-rendered.
 */
const METADATA_FILES = [
  "index.html",
  "src/components/Seo.tsx",
  "src/data/cities.ts",
  "src/data/content.ts",
  "src/pages/CityLanding.tsx",
  "src/pages/Index.tsx",
  "src/pages/Gallery.tsx",
  "src/pages/Reel.tsx",
  "src/App.tsx",
];

function metadataHash(): string {
  const hash = createHash("sha256");
  for (const rel of METADATA_FILES) {
    const abs = resolve(ROOT, rel);
    hash.update(rel);
    hash.update("\0");
    hash.update(existsSync(abs) ? readFileSync(abs) : Buffer.from("<missing>"));
    hash.update("\0");
  }
  return hash.digest("hex");
}

type Cache = { hash: string; passed: string[] };

function loadCache(): Cache {
  try {
    const parsed = JSON.parse(readFileSync(CACHE_FILE, "utf8"));
    if (parsed && typeof parsed.hash === "string" && Array.isArray(parsed.passed)) {
      return parsed as Cache;
    }
  } catch {
    /* no/invalid cache — start fresh */
  }
  return { hash: "", passed: [] };
}

function saveCache(cache: Cache) {
  mkdirSync(dirname(CACHE_FILE), { recursive: true });
  writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

const paths = [
  "/",
  "/gallery",
  "/reel",
  ...CITIES.map((c) => `/videography-${c.slug}`),
  ...CITIES.filter((c) => c.photography).map((c) => `/photography-${c.slug}`),
];

const jsonLdRequired = new Set(
  paths.filter((p) => p === "/" || /^\/(videography|photography)-/.test(p))
);

type CheckStatus = "pass" | "fail" | "skipped";

interface Diff {
  expected: string;
  actual: string;
}

interface CheckResult {
  name: string;
  status: CheckStatus;
  message: string;
  /** Present only for failing canonical/JSON-LD checks. */
  diff?: Diff;
}

interface RouteResult {
  path: string;
  url: string;
  source: "rendered" | "cache";
  status: CheckStatus; // pass | fail (cache => pass)
  checks: CheckResult[];
}

/** Absolute URL a self-referencing tag should carry for this route. */
function expectedUrl(path: string): string {
  return `${SITE_URL}${path === "/" ? "/" : path}`;
}

async function checkRoute(page: import("playwright").Page, path: string): Promise<RouteResult> {
  const url = `${BASE}${path}`;
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(300); // let Helmet flush

  const checks: CheckResult[] = [];
  const expUrl = expectedUrl(path);

  // --- canonical -----------------------------------------------------------
  const canonical = await page.getAttribute('link[rel="canonical"]', "href").catch(() => null);
  if (!canonical) {
    checks.push({
      name: "canonical",
      status: "fail",
      message: "Missing <link rel=\"canonical\">",
      diff: { expected: expUrl, actual: "(none)" },
    });
  } else if (!canonical.endsWith(path === "/" ? "/" : path)) {
    checks.push({
      name: "canonical",
      status: "fail",
      message: "Canonical does not self-reference this route",
      diff: { expected: expUrl, actual: canonical },
    });
  } else {
    checks.push({ name: "canonical", status: "pass", message: canonical });
  }

  // --- og:url --------------------------------------------------------------
  const ogUrl = await page.getAttribute('meta[property="og:url"]', "content").catch(() => null);
  if (!ogUrl) {
    checks.push({
      name: "og:url",
      status: "fail",
      message: "Missing og:url",
      diff: { expected: expUrl, actual: "(none)" },
    });
  } else if (!ogUrl.endsWith(path === "/" ? "/" : path)) {
    checks.push({
      name: "og:url",
      status: "fail",
      message: "og:url does not self-reference this route",
      diff: { expected: expUrl, actual: ogUrl },
    });
  } else {
    checks.push({ name: "og:url", status: "pass", message: ogUrl });
  }

  // --- title ---------------------------------------------------------------
  const title = await page.title();
  if (!title || title.length < 5) {
    checks.push({
      name: "title",
      status: "fail",
      message: "Empty or too-short <title>",
      diff: { expected: "length >= 5 chars", actual: JSON.stringify(title ?? "") },
    });
  } else {
    checks.push({ name: "title", status: "pass", message: title });
  }

  // --- JSON-LD -------------------------------------------------------------
  const ldNodes = await page.$$eval('script[type="application/ld+json"]', (els) =>
    els.map((e) => e.textContent ?? "")
  );
  const required = jsonLdRequired.has(path);
  if (ldNodes.length === 0) {
    if (required) {
      checks.push({
        name: "json-ld",
        status: "fail",
        message: "Expected JSON-LD, found none",
        diff: { expected: "at least one <script type=application/ld+json>", actual: "(none)" },
      });
    } else {
      checks.push({ name: "json-ld", status: "skipped", message: "No JSON-LD required for this route" });
    }
  } else {
    ldNodes.forEach((raw, i) => {
      const label = ldNodes.length > 1 ? `json-ld[${i}]` : "json-ld";
      const snippet = raw.trim().slice(0, 400) + (raw.trim().length > 400 ? "…" : "");
      try {
        const obj = JSON.parse(raw);
        const missing: string[] = [];
        if (!obj["@context"]) missing.push("@context");
        if (!obj["@type"]) missing.push("@type");
        if (missing.length) {
          checks.push({
            name: label,
            status: "fail",
            message: `JSON-LD missing ${missing.join(" & ")}`,
            diff: {
              expected: `object containing ${missing.join(" & ")}`,
              actual: snippet,
            },
          });
        } else {
          checks.push({
            name: label,
            status: "pass",
            message: `@type: ${JSON.stringify(obj["@type"])}`,
          });
        }
      } catch (err) {
        checks.push({
          name: label,
          status: "fail",
          message: `JSON-LD is not valid JSON (${(err as Error).message})`,
          diff: { expected: "parseable JSON", actual: snippet },
        });
      }
    });
  }

  const status: CheckStatus = checks.some((c) => c.status === "fail") ? "fail" : "pass";
  return { path, url, source: "rendered", status, checks };
}

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
}

function renderHtml(report: {
  generatedAt: string;
  base: string;
  totals: { routes: number; passed: number; failed: number; rendered: number; cached: number };
  routes: RouteResult[];
}): string {
  const badge = (s: CheckStatus) =>
    `<span class="badge ${s}">${s}</span>`;

  const rows = report.routes
    .map((r) => {
      const checkRows = r.checks
        .map((c) => {
          const diff = c.diff
            ? `<div class="diff"><div class="exp"><span>expected</span><code>${esc(c.diff.expected)}</code></div><div class="act"><span>actual</span><code>${esc(c.diff.actual)}</code></div></div>`
            : "";
          return `<tr class="check ${c.status}"><td class="cname">${esc(c.name)}</td><td>${badge(c.status)}</td><td class="cmsg">${esc(c.message)}${diff}</td></tr>`;
        })
        .join("");
      return `<section class="route ${r.status}">
        <h2><code>${esc(r.path)}</code> ${badge(r.status)} <span class="src">${r.source}</span></h2>
        <table><tbody>${checkRows}</tbody></table>
      </section>`;
    })
    .join("");

  const t = report.totals;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>SEO Render Report</title>
<style>
  :root { color-scheme: light dark; }
  body { font: 15px/1.5 -apple-system, Segoe UI, Roboto, sans-serif; margin: 0; padding: 2rem; background: #0f1712; color: #e6f2ec; }
  h1 { margin: 0 0 .25rem; }
  .meta { color: #8fae9f; margin-bottom: 1.5rem; font-size: 13px; }
  .summary { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; }
  .stat { background: #16241c; border: 1px solid #24382c; border-radius: 12px; padding: .75rem 1.25rem; }
  .stat b { display: block; font-size: 1.6rem; }
  .route { background: #131d17; border: 1px solid #23342a; border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1rem; }
  .route.fail { border-color: #7c2d2d; }
  .route h2 { font-size: 1rem; margin: 0 0 .5rem; display: flex; align-items: center; gap: .5rem; }
  .src { font-size: 11px; color: #8fae9f; text-transform: uppercase; letter-spacing: .05em; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: .4rem .5rem; vertical-align: top; border-top: 1px solid #1e2b23; }
  .cname { font-family: ui-monospace, monospace; color: #a7d8bf; white-space: nowrap; }
  .cmsg { width: 100%; }
  code { font-family: ui-monospace, monospace; background: #0c1410; padding: .1rem .35rem; border-radius: 5px; word-break: break-all; }
  .badge { font-size: 11px; text-transform: uppercase; letter-spacing: .05em; padding: .1rem .5rem; border-radius: 999px; }
  .badge.pass { background: #14351f; color: #6ee7a0; }
  .badge.fail { background: #3a1414; color: #ff8f8f; }
  .badge.skipped { background: #29302c; color: #a9bcb2; }
  .diff { margin-top: .5rem; display: grid; gap: .35rem; }
  .diff .exp code { border-left: 3px solid #6ee7a0; }
  .diff .act code { border-left: 3px solid #ff8f8f; }
  .diff span { display: inline-block; width: 70px; font-size: 11px; color: #8fae9f; text-transform: uppercase; }
</style></head>
<body>
  <h1>SEO Render Report</h1>
  <div class="meta">Generated ${esc(report.generatedAt)} · base ${esc(report.base)}</div>
  <div class="summary">
    <div class="stat"><b>${t.routes}</b>routes</div>
    <div class="stat"><b style="color:#6ee7a0">${t.passed}</b>passed</div>
    <div class="stat"><b style="color:#ff8f8f">${t.failed}</b>failed</div>
    <div class="stat"><b>${t.rendered}</b>re-rendered</div>
    <div class="stat"><b>${t.cached}</b>from cache</div>
  </div>
  ${rows}
</body></html>`;
}

async function main() {
  const hash = metadataHash();
  const cache = loadCache();
  const cacheValid = !FORCE && cache.hash === hash;
  const cachedPass = new Set(cacheValid ? cache.passed : []);

  const toCheck = paths.filter((p) => !cachedPass.has(p));

  if (FORCE) {
    console.log("⚡ --force: bypassing render cache.");
  } else if (cacheValid) {
    console.log(`⚡ Metadata unchanged — skipping ${cachedPass.size} cached route(s).`);
  } else {
    console.log("♻️  Metadata changed — re-checking all routes.");
  }

  const results: RouteResult[] = [];
  const passedThisRun: string[] = [];

  if (toCheck.length > 0) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    for (const path of toCheck) {
      const r = await checkRoute(page, path);
      results.push(r);
      if (r.status === "pass") passedThisRun.push(path);
      console.log(`checked ${path} — ${r.status}`);
    }
    await browser.close();
  }

  // Cached (unchecked) routes appear in the report as passing-from-cache.
  for (const path of paths) {
    if (!toCheck.includes(path)) {
      results.push({
        path,
        url: `${BASE}${path}`,
        source: "cache",
        status: "pass",
        checks: [{ name: "cache", status: "skipped", message: "Unchanged since last passing render" }],
      });
    }
  }

  // Keep the report ordered like `paths`.
  results.sort((a, b) => paths.indexOf(a.path) - paths.indexOf(b.path));

  // Persist the union of still-valid cached passes and this run's passes.
  const passed = Array.from(new Set([...cachedPass, ...passedThisRun]));
  saveCache({ hash, passed });

  const failed = results.filter((r) => r.status === "fail").length;
  const report = {
    generatedAt: new Date().toISOString(),
    base: BASE,
    metadataHash: hash,
    totals: {
      routes: results.length,
      passed: results.length - failed,
      failed,
      rendered: toCheck.length,
      cached: paths.length - toCheck.length,
    },
    routes: results,
  };

  mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2));
  writeFileSync(REPORT_HTML, renderHtml(report));
  console.log(`\n📄 Reports written:\n  ${REPORT_JSON}\n  ${REPORT_HTML}`);

  if (failed > 0) {
    for (const r of results.filter((x) => x.status === "fail")) {
      for (const c of r.checks.filter((x) => x.status === "fail")) {
        console.error(`❌ ${r.path} [${c.name}] ${c.message}`);
        if (c.diff) {
          console.error(`     expected: ${c.diff.expected}`);
          console.error(`     actual:   ${c.diff.actual}`);
        }
      }
    }
    console.error(`\nFAILED with ${failed} route(s) having SEO errors.`);
    process.exit(1);
  }
  console.log(`\n✅ ${paths.length} routes passed SEO checks (${toCheck.length} re-rendered).`);
}

main();

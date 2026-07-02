/**
 * Build-time SEO & structured-data validator.
 *
 * Runs as a `prebuild` gate so missing canonical tags, absent JSON-LD,
 * broken index.html metadata, or an out-of-sync sitemap fail the build
 * BEFORE anything is deployed.
 *
 * It is intentionally dependency-free and browser-free so it runs in any
 * CI/deploy environment. For a deeper DOM-level check that renders each
 * route in a real browser, run `npm run validate:seo:render`.
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { CITIES } from "../src/data/cities";

const SITE_URL = "https://frame-stories-film.lovable.app";
const root = process.cwd();

const errors: string[] = [];
const warnings: string[] = [];

const read = (rel: string) => readFileSync(resolve(root, rel), "utf8");

/** A public, indexable route mapped to the source file that renders it. */
interface RouteCheck {
  path: string;
  file: string;
  /** JSON-LD is required on this route. */
  requiresJsonLd: boolean;
}

const routes: RouteCheck[] = [
  { path: "/", file: "src/pages/Index.tsx", requiresJsonLd: true },
  { path: "/gallery", file: "src/pages/Gallery.tsx", requiresJsonLd: false },
  { path: "/reel", file: "src/pages/Reel.tsx", requiresJsonLd: false },
  ...CITIES.map((c) => ({
    path: `/videography-${c.slug}`,
    file: "src/pages/CityLanding.tsx",
    requiresJsonLd: true,
  })),
  ...CITIES.filter((c) => c.photography).map((c) => ({
    path: `/photography-${c.slug}`,
    file: "src/pages/CityLanding.tsx",
    requiresJsonLd: true,
  })),
];

// ---------------------------------------------------------------------------
// 1. Per-route source checks: <Seo> (canonical + og) and JSON-LD presence.
// ---------------------------------------------------------------------------
for (const route of routes) {
  let src: string;
  try {
    src = read(route.file);
  } catch {
    errors.push(`Route ${route.path}: source file ${route.file} not found.`);
    continue;
  }

  if (!/<Seo\b/.test(src)) {
    errors.push(
      `Route ${route.path}: ${route.file} does not render <Seo /> — canonical/og tags will be missing.`
    );
  } else if (!/path=/.test(src)) {
    errors.push(`Route ${route.path}: <Seo /> in ${route.file} is missing the "path" prop.`);
  }

  if (route.requiresJsonLd && !/application\/ld\+json/.test(src)) {
    errors.push(`Route ${route.path}: ${route.file} is missing JSON-LD structured data.`);
  }
}

// The Seo component itself must emit a canonical link + og:url.
const seoSrc = read("src/components/Seo.tsx");
if (!/rel="canonical"/.test(seoSrc)) {
  errors.push('src/components/Seo.tsx no longer emits <link rel="canonical" />.');
}
if (!/property="og:url"/.test(seoSrc)) {
  errors.push('src/components/Seo.tsx no longer emits og:url.');
}

// ---------------------------------------------------------------------------
// 2. JSON-LD must be serialized with JSON.stringify (guarantees valid JSON).
// ---------------------------------------------------------------------------
for (const file of ["src/pages/Index.tsx", "src/pages/CityLanding.tsx"]) {
  const src = read(file);
  const blocks = src.match(/application\/ld\+json[\s\S]*?dangerouslySetInnerHTML=\{\{([\s\S]*?)\}\}/g) ?? [];
  for (const block of blocks) {
    if (!/JSON\.stringify/.test(block)) {
      errors.push(
        `${file}: a JSON-LD block is hand-written instead of JSON.stringify(...) — output may be invalid JSON.`
      );
    }
  }
  if (blocks.length === 0) {
    errors.push(`${file}: expected at least one JSON-LD block, found none.`);
  }
}

// ---------------------------------------------------------------------------
// 3. index.html head metadata.
// ---------------------------------------------------------------------------
const html = read("index.html");
const headChecks: [RegExp, string][] = [
  [/<title>[^<]+<\/title>/, "index.html is missing a <title>."],
  [/<meta\s+name="description"\s+content="[^"]+"/, "index.html is missing a meta description."],
  [/<meta\s+property="og:title"/, "index.html is missing og:title."],
  [/<meta\s+property="og:description"/, "index.html is missing og:description."],
  [/<meta\s+property="og:url"/, "index.html is missing og:url."],
  [/<meta\s+property="og:type"/, "index.html is missing og:type."],
  [/<meta\s+name="twitter:card"/, "index.html is missing twitter:card."],
];
for (const [re, msg] of headChecks) {
  if (!re.test(html)) errors.push(msg);
}
if (/Lovable App|Lovable Generated Project|@Lovable/.test(html)) {
  errors.push("index.html still contains a Lovable placeholder value (title/description/handle).");
}

// ---------------------------------------------------------------------------
// 4. Sitemap: well-formed, self-consistent, covers every public route.
// ---------------------------------------------------------------------------
const sitemap = read("public/sitemap.xml");
if (!/<\?xml/.test(sitemap) || !/<urlset[\s>]/.test(sitemap)) {
  errors.push("public/sitemap.xml is not a well-formed <urlset> document.");
}
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const sitemapPaths = new Set(locs.map((u) => u.replace(SITE_URL, "") || "/"));

for (const route of routes) {
  if (!sitemapPaths.has(route.path)) {
    errors.push(`Sitemap is missing public route: ${route.path}`);
  }
}
for (const loc of locs) {
  if (!loc.startsWith(SITE_URL)) {
    errors.push(`Sitemap <loc> does not use the canonical domain: ${loc}`);
  }
}
// Non-indexable routes must NOT be in the sitemap.
for (const bad of ["/auth", "/admin/testimonials", "/admin/inquiries"]) {
  if (sitemapPaths.has(bad)) warnings.push(`Sitemap should not list non-indexable route: ${bad}`);
}

// ---------------------------------------------------------------------------
// Report.
// ---------------------------------------------------------------------------
const label = "[validate-seo]";
if (warnings.length) {
  for (const w of warnings) console.warn(`${label} ⚠️  ${w}`);
}
if (errors.length) {
  for (const e of errors) console.error(`${label} ❌ ${e}`);
  console.error(`\n${label} FAILED with ${errors.length} error(s). Fix the above before deploying.`);
  process.exit(1);
}
console.log(
  `${label} ✅ ${routes.length} routes validated — canonical, JSON-LD, head metadata, and sitemap all OK.`
);

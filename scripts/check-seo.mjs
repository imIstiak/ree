import assert from "node:assert/strict";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";

// Check rendered HTML, not just metadata objects. Run against a local dev or production server.
const origin = process.argv[2] ?? "http://localhost:3001";
const publicPaths = ["/", "/about", "/contact"];
const previewPaths = ["/landing", "/shop", "/collections", "/men", "/women", "/kids", "/journal", "/cart", "/checkout", "/legal/privacy", "/legal/terms", "/legal/cookies", "/products/life-is-short-tee", "/products/satin-cowl-blouse", "/collections/handloom"];
const decode = (text) => text.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#(?:x27|39);/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key, decode(value)]));
const titles = new Set();
const documents = new Map();

for (const path of [...publicPaths, ...previewPaths]) {
  const response = await fetch(new URL(path, origin), { headers: { "user-agent": "Googlebot" } });
  assert.equal(response.status, 200, `${path}: HTTP status`);
  const html = await response.text();
  documents.set(path, html);
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? "";
  const metas = [...head.matchAll(/<meta\b[^>]*>/g)].map(([tag]) => attributes(tag));
  const meta = (name) => metas.find((tag) => tag.name === name || tag.property === name)?.content;
  const canonical = [...head.matchAll(/<link\b[^>]*>/g)].map(([tag]) => attributes(tag)).filter((tag) => tag.rel === "canonical");
  const expected = `https://ree.bd${path === "/" ? "/" : path}`;
  assert.equal(canonical.length, 1, `${path}: one canonical URL`);
  assert.equal(new URL(canonical[0].href).href, expected, `${path}: canonical`);
  const title = decode(head.match(/<title>(.*?)<\/title>/s)?.[1] ?? "");
  assert.ok(title.includes("Ree") && !titles.has(title), `${path}: unique branded title`);
  titles.add(title);
  assert.ok(meta("description")?.length > 40, `${path}: description`);
  assert.equal(meta("og:title"), title, `${path}: Open Graph title`);
  assert.equal(meta("twitter:title"), title, `${path}: Twitter title`);
  assert.equal(new URL(meta("og:url")).href, expected, `${path}: Open Graph URL`);
  assert.equal(meta("og:description"), meta("description"), `${path}: Open Graph description`);
  assert.equal(meta("og:locale"), "en_BD", `${path}: locale`);
  assert.equal(meta("twitter:card"), "summary_large_image", `${path}: social card`);
  assert.ok(meta("og:image")?.startsWith("https://"), `${path}: absolute sharing image`);
  for (const bot of ["robots", "googlebot"]) {
    const rule = publicPaths.includes(path) ? /(^|,\s*)index(,|$)/ : /(^|,\s*)noindex(,|$)/;
    assert.match(meta(bot) ?? "", rule, `${path}: ${bot} indexing`);
  }
}

const structured = (path) => [...documents.get(path).matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(([, json]) => JSON.parse(json)["@graph"] ?? []);
const organization = structured("/").find((node) => node["@type"] === "Organization");
assert.equal(organization.url, "https://ree.bd/");
assert.deepEqual(new Set(organization.sameAs), new Set(["https://www.facebook.com/ree.threads", "https://www.instagram.com/ree.threads/", "https://www.linkedin.com/company/ree-threads"]));
assert.ok(structured("/").some((node) => node["@type"] === "WebSite"));
for (const path of ["/about", "/contact"]) {
  assert.ok(structured(path).some((node) => node["@type"] === "BreadcrumbList"), `${path}: breadcrumbs`);
}
assert.ok(documents.get("/").includes('href="/about"'), "Home links to the brand story");
assert.ok(documents.get("/about").includes("Old is gold"), "Brand story is visible page content");

const sitemapResponse = await fetch(new URL("/sitemap.xml", origin));
assert.equal(sitemapResponse.status, 200);
const sitemap = await sitemapResponse.text();
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => url).sort(), publicPaths.map((path) => `https://ree.bd${path}`).sort());
const robotsResponse = await fetch(new URL("/robots.txt", origin));
assert.equal(robotsResponse.status, 200);
const robots = await robotsResponse.text();
assert.match(robots, /Sitemap: https:\/\/ree\.bd\/sitemap\.xml/);
assert.doesNotMatch(robots, /Disallow: \/(?:$|cart|checkout|products|collections)/m, "Noindex pages must remain crawlable");

for (const [file, width, height] of [["ree-social.png", 1200, 630], ["ree-logo.png", 512, 512]]) {
  const response = await fetch(new URL(`/seo/${file}`, origin));
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /image\/png/);
  const image = Buffer.from(await response.arrayBuffer());
  assert.equal(image.readUInt32BE(16), width);
  assert.equal(image.readUInt32BE(20), height);
}
// Node fetch may override Host; use the HTTP client to exercise host-based routing.
const redirectUrl = new URL("/about?source=seo-check", origin);
const redirect = await new Promise((resolve, reject) => {
  const request = (redirectUrl.protocol === "https:" ? httpsRequest : httpRequest)(redirectUrl, { headers: { host: "www.ree.bd" } }, (response) => {
    response.resume();
    resolve({ status: response.statusCode, location: response.headers.location });
  });
  request.on("error", reject);
  request.end();
});
assert.equal(redirect.status, 308, "www permanently redirects");
assert.equal(redirect.location, "https://ree.bd/about?source=seo-check");
const missing = await fetch(new URL("/products/not-a-real-ree-piece", origin), { headers: { "user-agent": "Googlebot" } });
assert.equal(missing.status, 404, "Unknown product returns a real 404");
console.log(`SEO checks passed: ${titles.size} pages, structured data, sitemap, robots, social images, www redirect and 404 handling.`);

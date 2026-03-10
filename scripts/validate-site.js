#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const outputDir = process.argv[2];
if (!outputDir) {
  console.error("Usage: node scripts/validate-site.js <built-site-path>");
  process.exit(1);
}

const configPath = path.join(process.cwd(), "_config.yml");
const configRaw = fs.readFileSync(configPath, "utf8");
const urlMatch = configRaw.match(/^url:\s*"?([^"\n]+)"?\s*$/m);
const siteUrl = urlMatch ? urlMatch[1].trim().replace(/\/$/, "") : "";

function readFile(relativePath) {
  const fullPath = path.join(outputDir, relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing build artifact: ${relativePath}`);
  }
  return fs.readFileSync(fullPath, "utf8");
}

function getMetaContent(html, matcher) {
  const match = html.match(matcher);
  return match ? match[1] : "";
}

function assert(condition, message, errors) {
  if (!condition) errors.push(message);
}

function validateHtmlPage(html, pageName, isArticle, errors) {
  const canonical = getMetaContent(html, /<link rel="canonical" href="([^"]+)"\s*\/?/i);
  const ogUrl = getMetaContent(html, /<meta property="og:url" content="([^"]+)"\s*\/?/i);
  const ogImage = getMetaContent(html, /<meta property="og:image" content="([^"]+)"\s*\/?/i);
  const twitterImage = getMetaContent(html, /<meta property="twitter:image" content="([^"]+)"\s*\/?/i);

  assert(Boolean(canonical), `${pageName}: missing canonical`, errors);
  assert(Boolean(ogUrl), `${pageName}: missing og:url`, errors);
  assert(Boolean(ogImage), `${pageName}: missing og:image`, errors);
  assert(Boolean(twitterImage), `${pageName}: missing twitter:image`, errors);

  if (siteUrl) {
    assert(canonical.startsWith(siteUrl), `${pageName}: canonical is not absolute on configured domain (${canonical})`, errors);
    assert(ogUrl.startsWith(siteUrl), `${pageName}: og:url is not absolute on configured domain (${ogUrl})`, errors);
  }

  const h1Count = (html.match(/<h1\b/gi) || []).length;
  assert(h1Count === 1, `${pageName}: expected exactly one <h1>, found ${h1Count}`, errors);
  assert(/href="#main-content"/.test(html), `${pageName}: missing skip link`, errors);
  assert(/<main id="main-content"/.test(html), `${pageName}: missing main landmark`, errors);

  if (isArticle) {
    assert(/<meta property="og:type" content="article"/.test(html), `${pageName}: missing article OG type`, errors);
    assert(/data-post-toc/.test(html), `${pageName}: missing TOC scaffold`, errors);
    assert(/data-share-tools/.test(html), `${pageName}: missing share tools scaffold`, errors);
  }
}

function toOutputPage(urlPath) {
  const clean = urlPath.replace(/^\//, "").replace(/\/$/, "");
  if (!clean) return "index.html";
  return path.join(clean, "index.html");
}

function main() {
  const errors = [];

  let homeHtml;
  let searchJson;
  let feedXml;
  let sitemapXml;
  let robotsTxt;

  try {
    homeHtml = readFile("index.html");
    searchJson = JSON.parse(readFile("search.json"));
    feedXml = readFile("feed.xml");
    sitemapXml = readFile("sitemap.xml");
    robotsTxt = readFile("robots.txt");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  validateHtmlPage(homeHtml, "home", false, errors);

  assert(Array.isArray(searchJson), "search.json: expected JSON array", errors);
  assert(searchJson.length > 0, "search.json: expected at least one post", errors);

  if (Array.isArray(searchJson) && searchJson.length > 0) {
    const first = searchJson[0];
    const postPath = toOutputPage(first.url || "");
    try {
      const postHtml = readFile(postPath);
      validateHtmlPage(postHtml, `post(${first.url})`, true, errors);
    } catch (error) {
      errors.push(`Unable to validate first post page from search.json: ${error.message}`);
    }
  }

  assert(/Sitemap:/i.test(robotsTxt), "robots.txt: missing Sitemap directive", errors);
  assert(/<urlset/i.test(sitemapXml), "sitemap.xml: missing urlset", errors);
  assert(/<feed/i.test(feedXml), "feed.xml: missing feed root", errors);

  if (siteUrl) {
    assert(sitemapXml.includes(siteUrl), "sitemap.xml: expected absolute URLs on configured domain", errors);
    assert(feedXml.includes(siteUrl), "feed.xml: expected absolute URLs on configured domain", errors);
  }

  if (errors.length > 0) {
    errors.forEach((message) => console.error(message));
    process.exit(1);
  }

  console.log("Built site validation passed (SEO metadata, discovery artifacts, and accessibility scaffolding).");
}

main();

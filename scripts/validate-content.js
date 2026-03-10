#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const postsDir = path.join(root, "_posts");
const configPath = path.join(root, "_config.yml");
const cnamePath = path.join(root, "CNAME");

function fail(message) {
  console.error(message);
}

function parseFrontMatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    return null;
  }

  return {
    frontMatter: match[1],
    body: match[2]
  };
}

function getScalar(frontMatter, key) {
  const quoted = frontMatter.match(new RegExp(`^${key}:\\s*\"([\\s\\S]*?)\"\\s*$`, "m"));
  if (quoted) return quoted[1].trim();

  const bare = frontMatter.match(new RegExp(`^${key}:\\s*(.+)\\s*$`, "m"));
  if (!bare) return "";
  return bare[1].trim();
}

function parseTags(frontMatter) {
  const blockMatch = frontMatter.match(/^tags:\s*\n((?:\s+-\s+.+\n?)*)/m);
  if (!blockMatch) return [];

  return blockMatch[1]
    .split("\n")
    .map((line) => line.match(/^\s+-\s+(.+)\s*$/))
    .filter(Boolean)
    .map((match) => match[1].trim())
    .filter(Boolean);
}

function validatePost(filePath, errors) {
  const raw = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");
  const parsed = parseFrontMatter(raw);
  const name = path.basename(filePath);

  if (!parsed) {
    errors.push(`${name}: missing front matter`);
    return;
  }

  if (!/^\d{4}-\d{2}-\d{2}-.+\.md$/.test(name)) {
    errors.push(`${name}: invalid post filename/permalink pattern`);
  }

  const description = getScalar(parsed.frontMatter, "description");
  const summary = getScalar(parsed.frontMatter, "summary");
  const tags = parseTags(parsed.frontMatter);

  if (!description) {
    errors.push(`${name}: missing description`);
  }

  if (!summary) {
    errors.push(`${name}: missing summary`);
  }

  if (tags.length === 0) {
    errors.push(`${name}: missing tags`);
  }

  if (/!\[(?:\s*|silvrback blog image\s*)\]\(/i.test(parsed.body)) {
    errors.push(`${name}: generic alt text still present`);
  }
}

function validateSiteConfig(errors) {
  if (!fs.existsSync(configPath)) {
    errors.push("Missing _config.yml");
    return;
  }

  const configRaw = fs.readFileSync(configPath, "utf8");
  const urlMatch = configRaw.match(/^url:\s*"?([^"\n]+)"?\s*$/m);

  if (!urlMatch) {
    errors.push("_config.yml: missing url");
    return;
  }

  const url = urlMatch[1].trim();
  if (!/^https:\/\//.test(url)) {
    errors.push(`_config.yml: url must be https absolute (${url})`);
  }

  if (/example\.com|localhost|your-domain/i.test(url)) {
    errors.push(`_config.yml: url appears to be placeholder (${url})`);
  }

  if (!fs.existsSync(cnamePath)) {
    errors.push("Missing CNAME file for custom domain setup");
    return;
  }

  const cname = fs.readFileSync(cnamePath, "utf8").trim();
  if (!cname) {
    errors.push("CNAME file is empty");
  }

  try {
    const host = new URL(url).host;
    if (host !== cname) {
      errors.push(`CNAME (${cname}) does not match site.url host (${host})`);
    }
  } catch (error) {
    errors.push(`_config.yml: invalid url format (${url})`);
  }
}

function main() {
  const errors = [];

  validateSiteConfig(errors);

  const files = fs.readdirSync(postsDir).filter((name) => name.endsWith(".md"));
  files.forEach((fileName) => validatePost(path.join(postsDir, fileName), errors));

  if (errors.length > 0) {
    errors.forEach(fail);
    process.exit(1);
  }

  console.log(`Validated ${files.length} posts, metadata contract and custom domain settings.`);
}

main();

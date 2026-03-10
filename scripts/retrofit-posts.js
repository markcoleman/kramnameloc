#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const postsDir = path.join(process.cwd(), "_posts");
const isCheck = process.argv.includes("--check");

const TOPIC_RULES = [
  {
    tag: "cloud",
    keywords: ["azure", "aws", "gcp", "terraform", "cloud", "container", "docker", "registry"]
  },
  {
    tag: "automation",
    keywords: ["automation", "workflow", "script", "cron", "schedule", "pipedream", "github actions"]
  },
  {
    tag: "devops",
    keywords: ["deploy", "deployment", "pipeline", "infrastructure", "ci", "cd", "octopus", "gitlab"]
  },
  {
    tag: "javascript",
    keywords: ["javascript", "node", "nodejs", "angular", "protractor", "gulp", "webstorm"]
  },
  {
    tag: "dotnet",
    keywords: [".net", "c#", "asp.net", "visual studio", "tfs", "ncrunch", "nuget"]
  },
  {
    tag: "testing",
    keywords: ["test", "testing", "unit test", "load test", "qa"]
  },
  {
    tag: "raspberry-pi",
    keywords: ["raspberry", "homebridge", "wiring", "relay", "gpio", "vnc"]
  },
  {
    tag: "web",
    keywords: ["jekyll", "html", "css", "seo", "rss", "frontend", "blog"]
  },
  {
    tag: "career",
    keywords: ["career", "conference", "barcamp", "cposc", "learning", "resolution", "resources"]
  },
  {
    tag: "creative",
    keywords: ["drawing", "coloring", "inking", "astrophotography", "photo", "christmas", "kid"]
  }
];

const GENERIC_ALT_PATTERNS = [
  /^\s*$/,
  /^silvrback blog image\s*$/i,
  /^blog image\s*$/i,
  /^image\s*$/i,
  /^photo\s*$/i
];

function readPosts() {
  if (!fs.existsSync(postsDir)) {
    throw new Error(`Missing posts directory: ${postsDir}`);
  }

  return fs
    .readdirSync(postsDir)
    .filter((name) => name.endsWith(".md"))
    .sort()
    .map((name) => path.join(postsDir, name));
}

function parseScalar(value) {
  const trimmed = value.trim();
  if (trimmed === "[]") return [];

  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  }

  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function parseFrontMatter(frontMatterRaw) {
  const lines = frontMatterRaw.replace(/\r/g, "").split("\n");
  const data = {};
  const order = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim()) continue;

    const keyMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!keyMatch) continue;

    const key = keyMatch[1];
    const rawValue = keyMatch[2];

    if (!order.includes(key)) order.push(key);

    if (rawValue.trim() === "") {
      const list = [];
      let scan = index + 1;
      while (scan < lines.length) {
        const listMatch = lines[scan].match(/^\s*-\s*(.+?)\s*$/);
        if (!listMatch) break;
        list.push(parseScalar(listMatch[1]));
        scan += 1;
      }

      if (list.length > 0) {
        data[key] = list;
        index = scan - 1;
      } else {
        data[key] = "";
      }
      continue;
    }

    data[key] = parseScalar(rawValue);
  }

  return { data, order };
}

function escapeYamlString(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function serializeFrontMatter(data, originalOrder) {
  const orderedKeys = ["layout", "title", "date", "description", "summary", "subtitle", "tags", "image"];
  const extraKeys = originalOrder.filter((key) => !orderedKeys.includes(key));
  const keys = orderedKeys.concat(extraKeys).filter((key, index, arr) => arr.indexOf(key) === index && key in data);

  const lines = ["---"];
  keys.forEach((key) => {
    const value = data[key];
    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      value.forEach((item) => lines.push(`  - ${item}`));
      return;
    }

    if (key === "date") {
      lines.push(`${key}: ${String(value).trim()}`);
      return;
    }

    lines.push(`${key}: \"${escapeYamlString(String(value || ""))}\"`);
  });
  lines.push("---", "");
  return lines.join("\n");
}

function markdownToPlainText(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^>+/gm, "")
    .replace(/[>#*_~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sentenceSummary(text, maxLength) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "";

  const sentence = clean.match(/^(.{1,260}?[.!?])\s/);
  const selected = sentence ? sentence[1] : clean;

  if (selected.length <= maxLength) return selected;
  return selected.slice(0, maxLength - 1).trimEnd() + "…";
}

function deriveDescription(subtitle, body) {
  if (subtitle && subtitle.trim()) {
    return sentenceSummary(subtitle.trim(), 160);
  }

  return sentenceSummary(markdownToPlainText(body), 160);
}

function deriveSummary(subtitle, description, body) {
  if (subtitle && subtitle.trim()) {
    return sentenceSummary(subtitle.trim(), 220);
  }

  if (description && description.trim()) {
    return sentenceSummary(description.trim(), 220);
  }

  return sentenceSummary(markdownToPlainText(body), 220);
}

function scoreTopics(text) {
  const lower = text.toLowerCase();

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function hasKeyword(keyword) {
    const normalized = keyword.toLowerCase();
    if (/^[a-z0-9-]+$/.test(normalized)) {
      const pattern = new RegExp(`\\b${escapeRegExp(normalized)}\\b`, "i");
      return pattern.test(lower);
    }
    return lower.includes(normalized);
  }

  const ranked = TOPIC_RULES.map((rule) => {
    const score = rule.keywords.reduce((count, keyword) => {
      if (hasKeyword(keyword)) return count + 1;
      return count;
    }, 0);

    return { tag: rule.tag, score };
  })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.tag.localeCompare(b.tag);
    });

  const selected = ranked.slice(0, 3).map((entry) => entry.tag);
  if (selected.length === 0) return ["engineering"];
  return selected;
}

function looksGenericAlt(alt) {
  const value = String(alt || "").trim();
  return GENERIC_ALT_PATTERNS.some((pattern) => pattern.test(value));
}

function classifyImage(imageUrl, extension, title) {
  const name = path.basename(imageUrl).toLowerCase();

  if (name.includes("screen-shot") || name.includes("screenshot")) {
    return `Screenshot from ${title}`;
  }
  if (extension === ".gif") {
    return `Animated image from ${title}`;
  }
  if (name.includes("img_") || name.includes("dsc_") || name.includes("photo")) {
    return `Photo from ${title}`;
  }
  if (name.includes("diagram") || name.includes("chart") || name.includes("preview") || name.includes("calendar")) {
    return `Diagram from ${title}`;
  }

  return `Illustration from ${title}`;
}

function normalizeImageAltText(body, title) {
  let imageIndex = 0;
  return body.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, target) => {
    if (!looksGenericAlt(alt)) {
      return match;
    }

    const targetParts = target.trim().split(/\s+/);
    const imageUrl = targetParts[0];
    const extension = path.extname(imageUrl.split("?")[0]).toLowerCase();
    imageIndex += 1;
    const base = classifyImage(imageUrl, extension, title);
    const nextAlt = `${base} (${imageIndex})`;

    return `![${nextAlt}](${target})`;
  });
}

function demoteH1ToH2(body) {
  const lines = body.split("\n");
  let inFence = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (/^```/.test(trimmed) || /^~~~/.test(trimmed)) {
      inFence = !inFence;
      continue;
    }

    if (!inFence && /^#\s+/.test(line)) {
      lines[index] = line.replace(/^#\s+/, "## ");
    }
  }

  return lines.join("\n");
}

function normalizePost(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return null;

  const frontMatterRaw = match[1];
  let body = match[2].replace(/\s+$/, "") + "\n";

  const parsed = parseFrontMatter(frontMatterRaw);
  const data = parsed.data;

  const title = String(data.title || path.basename(filePath, ".md")).trim();
  const subtitle = String(data.subtitle || "").trim();

  body = demoteH1ToH2(body);
  body = normalizeImageAltText(body, title);

  const generatedDescription = deriveDescription(subtitle, body);
  const generatedSummary = deriveSummary(subtitle, generatedDescription, body);

  data.layout = String(data.layout || "post").trim() || "post";
  data.title = title;
  data.description = String(data.description || "").trim() || generatedDescription;
  data.summary = String(data.summary || "").trim() || generatedSummary;
  data.tags = scoreTopics([title, subtitle, data.description, body].join(" "));

  if (!data.description) {
    data.description = generatedDescription;
  }
  if (!data.summary) {
    data.summary = generatedSummary;
  }

  const next = serializeFrontMatter(data, parsed.order) + body;
  if (next === raw) {
    return null;
  }

  return next;
}

function main() {
  const files = readPosts();
  const changed = [];

  files.forEach((filePath) => {
    const updated = normalizePost(filePath);
    if (!updated) return;

    changed.push(filePath);
    if (!isCheck) {
      fs.writeFileSync(filePath, updated, "utf8");
    }
  });

  if (isCheck) {
    if (changed.length > 0) {
      console.error(`Post retrofit drift detected in ${changed.length} file(s). Run: node scripts/retrofit-posts.js`);
      process.exit(1);
    }

    console.log("Post retrofit check passed.");
    return;
  }

  console.log(`Updated ${changed.length} post file(s).`);
}

main();

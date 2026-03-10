#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const https = require('node:https');
const { pipeline } = require('node:stream/promises');

const inputPath = process.argv[2] || 'blog.xml';
const outputDir = process.argv[3] || '_posts';
const imageOutputDir = process.argv[4] || path.join('assets', 'blog-images');
const imageWebRoot = `/${imageOutputDir.replace(/\\/g, '/').replace(/^\/+/, '')}`;

const TOPIC_RULES = [
  {
    tag: 'cloud',
    keywords: ['azure', 'aws', 'gcp', 'terraform', 'cloud', 'container', 'docker', 'registry']
  },
  {
    tag: 'automation',
    keywords: ['automation', 'workflow', 'script', 'cron', 'schedule', 'pipedream', 'github actions']
  },
  {
    tag: 'devops',
    keywords: ['deploy', 'deployment', 'pipeline', 'infrastructure', 'ci', 'cd', 'octopus', 'gitlab']
  },
  {
    tag: 'javascript',
    keywords: ['javascript', 'node', 'nodejs', 'angular', 'protractor', 'gulp', 'webstorm']
  },
  {
    tag: 'dotnet',
    keywords: ['.net', 'c#', 'asp.net', 'visual studio', 'tfs', 'ncrunch', 'nuget']
  },
  {
    tag: 'testing',
    keywords: ['test', 'testing', 'unit test', 'load test', 'qa']
  },
  {
    tag: 'raspberry-pi',
    keywords: ['raspberry', 'homebridge', 'wiring', 'relay', 'gpio', 'vnc']
  },
  {
    tag: 'web',
    keywords: ['jekyll', 'html', 'css', 'seo', 'rss', 'frontend', 'blog']
  },
  {
    tag: 'career',
    keywords: ['career', 'conference', 'barcamp', 'cposc', 'learning', 'resolution', 'resources']
  },
  {
    tag: 'creative',
    keywords: ['drawing', 'coloring', 'inking', 'astrophotography', 'photo', 'christmas', 'kid']
  }
];

function decodeEntities(value) {
  const named = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' '
  };

  return value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity) => {
    if (entity[0] === '#') {
      const hex = entity[1] && entity[1].toLowerCase() === 'x';
      const codePoint = parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10);
      if (!Number.isFinite(codePoint)) {
        return match;
      }
      return String.fromCodePoint(codePoint);
    }

    return named[entity] || match;
  });
}

function yamlEscape(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function slugify(value) {
  const slug = decodeEntities(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || 'post';
}

function markdownToPlainText(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^>+/gm, '')
    .replace(/[>#*_~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sentenceSummary(text, maxLength) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return '';

  const sentence = clean.match(/^(.{1,260}?[.!?])\s/);
  const selected = sentence ? sentence[1] : clean;

  if (selected.length <= maxLength) return selected;
  return `${selected.slice(0, maxLength - 1).trimEnd()}…`;
}

function toDescription(subtitle, body) {
  if (subtitle && subtitle.trim().length > 0) {
    return sentenceSummary(subtitle.trim(), 160);
  }

  return sentenceSummary(markdownToPlainText(body), 160);
}

function toSummary(subtitle, description, body) {
  if (subtitle && subtitle.trim().length > 0) {
    return sentenceSummary(subtitle.trim(), 220);
  }

  if (description && description.trim().length > 0) {
    return sentenceSummary(description.trim(), 220);
  }

  return sentenceSummary(markdownToPlainText(body), 220);
}

function inferTags(post) {
  const searchText = [post.title, post.subtitle, post.body].join(' ').toLowerCase();

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function hasKeyword(keyword) {
    const normalized = keyword.toLowerCase();
    if (/^[a-z0-9-]+$/.test(normalized)) {
      const pattern = new RegExp(`\\b${escapeRegExp(normalized)}\\b`, 'i');
      return pattern.test(searchText);
    }
    return searchText.includes(normalized);
  }

  const ranked = TOPIC_RULES.map((rule) => {
    const score = rule.keywords.reduce((count, keyword) => {
      if (hasKeyword(keyword)) return count + 1;
      return count;
    }, 0);

    return { tag: rule.tag, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.tag.localeCompare(b.tag);
    });

  const selected = ranked.slice(0, 3).map((item) => item.tag);
  return selected.length > 0 ? selected : ['engineering'];
}

function parsePosts(raw) {
  const postRegex =
    /^\s{2}<title>([\s\S]*?)<\/title>\s*^\s{2}<subtitle>([\s\S]*?)<\/subtitle>\s*^\s{2}<published_at>([\s\S]*?)<\/published_at>\s*^\s{2}<body>([\s\S]*?)<\/body>/gm;

  const posts = [];
  let match;

  while ((match = postRegex.exec(raw)) !== null) {
    const title = decodeEntities(match[1].trim());
    const subtitle = decodeEntities(match[2].trim());
    const publishedAt = match[3].trim();
    const body = decodeEntities(match[4].trim());

    posts.push({ title, subtitle, publishedAt, body });
  }

  return posts;
}

function ensureDirForFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function safeFileName(value) {
  return value
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function getOriginalImageParts(url) {
  const parsed = new URL(url);
  const original = decodeURIComponent(path.posix.basename(parsed.pathname));
  const ext = path.extname(original) || '.bin';
  const base = path.basename(original, ext) || 'image';
  return { base: safeFileName(base) || 'image', ext: ext.toLowerCase() };
}

function downloadToFile(url, destinationPath, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) {
      reject(new Error(`Too many redirects for ${url}`));
      return;
    }

    https
      .get(url, (response) => {
        const status = response.statusCode || 0;
        if (status >= 300 && status < 400 && response.headers.location) {
          const redirected = new URL(response.headers.location, url).toString();
          response.resume();
          downloadToFile(redirected, destinationPath, redirects + 1)
            .then(resolve)
            .catch(reject);
          return;
        }

        if (status < 200 || status >= 300) {
          response.resume();
          reject(new Error(`Failed downloading ${url} (HTTP ${status})`));
          return;
        }

        ensureDirForFile(destinationPath);
        const writeStream = fs.createWriteStream(destinationPath);
        pipeline(response, writeStream).then(resolve).catch(reject);
      })
      .on('error', reject);
  });
}

async function toLocalImagePath(url, localRelativePath, downloadCache) {
  const cacheKey = `${localRelativePath}|${url}`;
  if (downloadCache.has(cacheKey)) {
    return downloadCache.get(cacheKey);
  }

  const localPath = path.join(imageOutputDir, localRelativePath);
  const webPath = `${imageWebRoot}/${localRelativePath.replace(/\\/g, '/')}`;

  if (!fs.existsSync(localPath)) {
    await downloadToFile(url, localPath);
  }

  downloadCache.set(cacheKey, webPath);
  return webPath;
}

function buildPostImageRelativePath(postKey, index, url, usedFileNames) {
  const { base, ext } = getOriginalImageParts(url);
  const prefix = String(index).padStart(2, '0');
  let candidate = `${prefix}-${base}${ext}`;
  let n = 2;
  while (usedFileNames.has(candidate)) {
    candidate = `${prefix}-${base}-${n}${ext}`;
    n += 1;
  }
  usedFileNames.add(candidate);
  return path.join(postKey, candidate);
}

async function localizeBodyImages(body, postKey, downloadCache) {
  const urls = [
    ...new Set(
      [...body.matchAll(/https:\/\/silvrback\.s3\.amazonaws\.com\/uploads\/[^)\s"'<>]+/g)].map(
        (match) => match[0]
      )
    )
  ];

  let localizedBody = body;
  const usedFileNames = new Set();
  let index = 1;
  for (const url of urls) {
    const relativePath = buildPostImageRelativePath(postKey, index, url, usedFileNames);
    const localPath = await toLocalImagePath(url, relativePath, downloadCache);
    localizedBody = localizedBody.split(url).join(localPath);
    index += 1;
  }

  return localizedBody;
}

function classifyImage(imageUrl, extension, title) {
  const name = path.basename(imageUrl).toLowerCase();

  if (name.includes('screen-shot') || name.includes('screenshot')) {
    return `Screenshot from ${title}`;
  }
  if (extension === '.gif') {
    return `Animated image from ${title}`;
  }
  if (name.includes('img_') || name.includes('dsc_') || name.includes('photo')) {
    return `Photo from ${title}`;
  }
  if (name.includes('diagram') || name.includes('chart') || name.includes('preview') || name.includes('calendar')) {
    return `Diagram from ${title}`;
  }

  return `Illustration from ${title}`;
}

function normalizeImageAltText(body, title) {
  let imageIndex = 0;

  return body.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, target) => {
    const value = String(alt || '').trim();
    if (value && !/^silvrback blog image$/i.test(value) && !/^image$/i.test(value)) {
      return match;
    }

    const targetParts = target.trim().split(/\s+/);
    const imageUrl = targetParts[0];
    const extension = path.extname(imageUrl.split('?')[0]).toLowerCase();
    imageIndex += 1;

    return `![${classifyImage(imageUrl, extension, title)} (${imageIndex})](${target})`;
  });
}

function demoteH1ToH2(body) {
  const lines = body.split('\n');
  let inFence = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (/^```/.test(trimmed) || /^~~~/.test(trimmed)) {
      inFence = !inFence;
      continue;
    }

    if (!inFence && /^#\s+/.test(line)) {
      lines[index] = line.replace(/^#\s+/, '## ');
    }
  }

  return lines.join('\n');
}

function toFrontMatter(post, body) {
  const description = toDescription(post.subtitle, body);
  const summary = toSummary(post.subtitle, description, body);
  const tags = inferTags({ ...post, body });

  const lines = [
    '---',
    'layout: post',
    `title: "${yamlEscape(post.title)}"`,
    `date: ${post.publishedAt}`,
    `description: "${yamlEscape(description)}"`,
    `summary: "${yamlEscape(summary)}"`
  ];

  if (post.subtitle) {
    lines.push(`subtitle: "${yamlEscape(post.subtitle)}"`);
  }

  lines.push('tags:');
  tags.forEach((tag) => lines.push(`  - ${tag}`));

  lines.push('---', '');
  return lines.join('\n');
}

async function run() {
  const raw = fs.readFileSync(inputPath, 'utf8').replace(/^\uFEFF/, '');
  const posts = parsePosts(raw);

  if (posts.length === 0) {
    throw new Error('No posts found. Check input format.');
  }

  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(imageOutputDir, { recursive: true });

  const usedNames = new Map();
  const downloadCache = new Map();

  for (const post of posts) {
    const datePart = post.publishedAt.slice(0, 10);
    const baseSlug = slugify(post.title);
    const key = `${datePart}-${baseSlug}`;
    const seenCount = (usedNames.get(key) || 0) + 1;
    usedNames.set(key, seenCount);
    const suffix = seenCount > 1 ? `-${seenCount}` : '';
    const fileName = `${datePart}-${baseSlug}${suffix}.md`;
    const postKey = `${datePart}-${baseSlug}${suffix}`;

    const fullPath = path.join(outputDir, fileName);
    let localizedBody = await localizeBodyImages(post.body, postKey, downloadCache);
    localizedBody = normalizeImageAltText(localizedBody, post.title);
    localizedBody = demoteH1ToH2(localizedBody);

    const markdown = `${toFrontMatter(post, localizedBody)}${localizedBody.trim()}\n`;
    fs.writeFileSync(fullPath, markdown, 'utf8');
  }

  console.log(
    `Imported ${posts.length} posts into ${outputDir} and localized ${downloadCache.size} images into ${imageOutputDir}`
  );
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

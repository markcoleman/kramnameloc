#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const https = require('node:https');
const { pipeline } = require('node:stream/promises');

const inputPath = process.argv[2] || 'blog.xml';
const outputDir = process.argv[3] || '_posts';
const imageOutputDir = process.argv[4] || path.join('assets', 'blog-images');
const imageWebRoot = `/${imageOutputDir.replace(/\\/g, '/').replace(/^\/+/, '')}`;

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

function toDescription(subtitle, body) {
  const raw = subtitle && subtitle.trim().length > 0 ? subtitle : body;

  const cleaned = decodeEntities(raw)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, ' ')
    .replace(/[>#*_~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned.slice(0, 160);
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

function toFrontMatter(post) {
  const lines = [
    '---',
    'layout: post',
    `title: "${yamlEscape(post.title)}"`,
    `date: ${post.publishedAt}`,
    `description: "${yamlEscape(toDescription(post.subtitle, post.body))}"`
  ];

  if (post.subtitle) {
    lines.push(`subtitle: "${yamlEscape(post.subtitle)}"`);
  }

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
    const localizedBody = await localizeBodyImages(post.body, postKey, downloadCache);
    const markdown = `${toFrontMatter(post)}${localizedBody.trim()}\n`;
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

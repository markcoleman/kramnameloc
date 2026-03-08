#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const https = require('node:https');
const { createHash } = require('node:crypto');
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

function getLocalImageName(url) {
  const parsed = new URL(url);
  const original = decodeURIComponent(path.posix.basename(parsed.pathname));
  const ext = path.extname(original) || '.bin';
  const base = path.basename(original, ext) || 'image';
  const shortHash = createHash('sha1').update(url).digest('hex').slice(0, 12);
  return `${shortHash}-${safeFileName(base)}${ext.toLowerCase()}`;
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

async function toLocalImagePath(url, downloadCache) {
  if (downloadCache.has(url)) {
    return downloadCache.get(url);
  }

  const fileName = getLocalImageName(url);
  const localPath = path.join(imageOutputDir, fileName);
  const webPath = `${imageWebRoot}/${fileName}`;

  if (!fs.existsSync(localPath)) {
    await downloadToFile(url, localPath);
  }

  downloadCache.set(url, webPath);
  return webPath;
}

async function localizeBodyImages(body, downloadCache) {
  const urls = new Set(
    [...body.matchAll(/https:\/\/silvrback\.s3\.amazonaws\.com\/uploads\/[^)\s"'<>]+/g)].map(
      (match) => match[0]
    )
  );

  let localizedBody = body;
  for (const url of urls) {
    const localPath = await toLocalImagePath(url, downloadCache);
    localizedBody = localizedBody.split(url).join(localPath);
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

    const fullPath = path.join(outputDir, fileName);
    const localizedBody = await localizeBodyImages(post.body, downloadCache);
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

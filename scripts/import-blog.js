#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const inputPath = process.argv[2] || 'blog.xml';
const outputDir = process.argv[3] || '_posts';

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

function run() {
  const raw = fs.readFileSync(inputPath, 'utf8').replace(/^\uFEFF/, '');
  const posts = parsePosts(raw);

  if (posts.length === 0) {
    throw new Error('No posts found. Check input format.');
  }

  fs.mkdirSync(outputDir, { recursive: true });

  const usedNames = new Map();

  posts.forEach((post) => {
    const datePart = post.publishedAt.slice(0, 10);
    const baseSlug = slugify(post.title);
    const key = `${datePart}-${baseSlug}`;
    const seenCount = (usedNames.get(key) || 0) + 1;
    usedNames.set(key, seenCount);
    const suffix = seenCount > 1 ? `-${seenCount}` : '';
    const fileName = `${datePart}-${baseSlug}${suffix}.md`;

    const fullPath = path.join(outputDir, fileName);
    const markdown = `${toFrontMatter(post)}${post.body.trim()}\n`;
    fs.writeFileSync(fullPath, markdown, 'utf8');
  });

  console.log(`Imported ${posts.length} posts into ${outputDir}`);
}

run();

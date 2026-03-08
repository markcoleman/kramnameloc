# Kramnameloc Blog (GitHub Pages)

This repository now contains a Jekyll-powered GitHub Pages site generated from `blog.xml`.

## What was imported

- All posts were converted into Markdown files in `_posts/`
- Original publish datetime and timezone are preserved in each post front matter

## Local development

1. Install Ruby and Bundler
2. Run:

```bash
bundle install
bundle exec jekyll serve
```

Then open `http://127.0.0.1:4000`.

## Create a new post

```bash
./scripts/new-post.sh "My New Post"
```

This creates a correctly named Markdown file with current timestamp in `_posts/`.

## Re-import from XML

If you update `blog.xml`, regenerate `_posts` by running:

```bash
node scripts/import-blog.js blog.xml _posts
```

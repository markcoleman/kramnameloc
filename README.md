# Kramnameloc Blog (GitHub Pages)

This repository now contains a Jekyll-powered GitHub Pages site generated from `blog.xml`.

## Platform features

- Featured homepage story plus scan-friendly discovery cards
- Dedicated archive and topics pages
- Client-side search/filter discovery (`q`, `tag`, `year`) powered by `search.json`
- Light and dark mode (system-aware with manual toggle and persistence)
- Post reading enhancements (TL;DR summary, TOC, reading time, share actions)
- SEO stack (`jekyll-seo-tag`, `jekyll-sitemap`, `jekyll-feed`) with metadata validation
- GitHub Actions for PR build validation and Pages deploy

## Imported content

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

To verify a production-style build:

```bash
bundle exec jekyll build
```

To run all retrofit and validation checks locally:

```bash
node scripts/retrofit-posts.js --check
node scripts/validate-content.js
bundle exec jekyll build --destination /tmp/kramnameloc-site
node scripts/validate-site.js /tmp/kramnameloc-site
```

## SEO options

Set these in `_config.yml` for full metadata:

- `url` and `baseurl`
- `author.name` and optional `author.twitter`
- `twitter.username`
- `social.links` (GitHub, LinkedIn, etc.)
- `logo`, `image`, and `keywords`

## Create a new post

```bash
./scripts/new-post.sh "My New Post"
```

This creates a correctly named Markdown file with current timestamp and required metadata scaffold (`description`, `summary`, `tags`).

## Retrofit existing posts

To normalize legacy content metadata and accessibility defaults:

```bash
node scripts/retrofit-posts.js
```

This script is idempotent and updates front matter/tagging plus generic image alt text.

## Re-import from XML

If you update `blog.xml`, regenerate `_posts` by running:

```bash
node scripts/import-blog.js blog.xml _posts
```

The import script now emits `description`, `summary`, `tags`, and improved default image alt text.

## GitHub Actions

- `.github/workflows/pr-build.yml` runs Jekyll build checks on pull requests.
- `.github/workflows/pages.yml` builds and deploys to GitHub Pages on `main`.

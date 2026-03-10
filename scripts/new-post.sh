#!/usr/bin/env bash

set -euo pipefail

if [[ $# -eq 0 ]]; then
  echo "Usage: ./scripts/new-post.sh \"Post Title\""
  exit 1
fi

title="$*"
slug="$(echo "$title" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g')"

if [[ -z "$slug" ]]; then
  slug="post"
fi

date_part="$(date +%Y-%m-%d)"
timestamp="$(date +'%Y-%m-%d %H:%M:%S %z')"

file="_posts/${date_part}-${slug}.md"
count=2
while [[ -f "$file" ]]; do
  file="_posts/${date_part}-${slug}-${count}.md"
  count=$((count + 1))
done

safe_title="${title//\"/\\\"}"

cat > "$file" <<EOF
---
layout: post
title: "${safe_title}"
date: ${timestamp}
description: ""
summary: ""
tags:
  - engineering
---

Start your post here.

## TL;DR

Add a concise summary for quick readers.

## Main content

Use descriptive alt text for every image, for example:
![Screenshot from ${safe_title}](./path-to-image.png)
EOF

echo "Created ${file}"

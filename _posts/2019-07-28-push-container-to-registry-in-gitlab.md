---
layout: post
title: "Push Container to Registry in GitLab"
date: 2019-07-28 11:58:46 -0400
description: "Generate Personal Access Token for Docker Login Navigate over to the access token section in your profile. Scope to and set your expiration date. store this key"
---
## Generate Personal Access Token for Docker Login

Navigate over to the [access token](https://gitlab.com/profile/personal_access_tokens) section in your profile.

Scope to `api` and set your expiration date.

_store this key in your favorite password vault as it is not accessible after the generation process_

## docker login

```bash
docker login registry.gitlab.com

username: {your username for gitlab}
password: {the access toke you just crated}
```

## build and push your image

```bash
cd site && bundle exec jekyll build
cd ..
docker build . -t registry.gitlab.com/markcoleman/vikingmill:1.0 -t registry.gitlab.com/markcoleman/vikingmill:latest
docker push registry.gitlab.com/markcoleman/vikingmill
```

_tagged via a version and also latest_

## Container Registry

![Silvrback blog image ](/assets/blog-images/79fbdeb68717-screen-shot-2019-07-28-at-11.55.18-am.png)

---
layout: post
title: "Setting Up a GitLab Pipeline"
date: 2019-07-27 11:38:19 -0400
description: "I have been slowly exploring the free tier of gitlab and today wanted to setup a build in the job. The following steps are taken to create a build of a static s"
---
I have been slowly exploring the free tier of [gitlab](https://www.gitlab.com) and today wanted to setup a build in the `CI` job.  The following steps are taken to create a build of a static site via jekyll. 

## Create `.gitlab-ci.yml `

```bash
touch .gitlab-ci.yml 
```

### Edit the file

As with any build script I simply put the steps I ran locally and placed them into the `yml` file.

```yaml
image: "ruby:2.5"
build:
  script:
    - cd ./site/ && bundle install
    - bundle exec jekyll build
    - zip -r site-build.zip ./_site
```

_note, unlike circleci each script execution will persist directory structure, e.g. `cd site` now puts you in the `site` folder for any  proceeding script items._

### The first Error

```bash
$ zip -r site-build.zip ./_site
/bin/bash: line 90: zip: command not found
```

It appears our image does not contain, `zip` so we will need to install it via a `before_script` block.

```yaml
image: "ruby:2.5"
before_script:
  - apt-get install -y p7zip
build:
  script:
    - cd ./site/ && bundle install
    - ls
    - bundle exec jekyll build
    - zip -r site-build.zip ./_site
```
### Another Error

```bash
root@item:/# apt-get install p7zip
Reading package lists... Done
Building dependency tree       
Reading state information... Done
E: Unable to locate package p7zip
```

I learned that since this is a fresh image you also need to run the `update` command first.

```bash
image: "ruby:2.5"
before_script:
  - apt-get update -qy
  - apt-get -y install zip unzip
```

_Don't forget to add in `-y` to auto answer the prompt._

### The final build `yml` file

```yaml
image: "ruby:2.5"
before_script:
  - apt-get update -qy
  - apt-get -y install zip unzip
build:
  script:
    - cd ./site/ && bundle install
    - bundle exec jekyll build
    - zip -r site-build.zip ./_site
```

## Artifacts

Now we have all of your pieces in order and our build is successful next up getting an [artifact](https://docs.gitlab.com/ee/user/project/pipelines/job_artifacts.html) of the build which happens to be the rendered site from `jekyll`.

### Storing the contents of the zip as an artifact

```bash
  artifacts:
    name: "viking-mill"
    paths:
      - ./site/site-build.zip
    expire_in: 30 days
```

_note, this new block will reset to the root working folder so you need to specify the full path from the root_

## The Final `.gitlab-ci.yml`

```yaml
image: "ruby:2.5"
before_script:
  - apt-get update -qy
  - apt-get -y install zip unzip
build:
  script:
    - cd ./site/ && bundle install
    - bundle exec jekyll build
    - zip -r site-build.zip ./_site
  artifacts:
    name: "viking-mill"
    paths:
      - ./site/site-build.zip
    expire_in: 30 days
```

## Finish

Now we have a build setup inside of gitlab for the static jekyll site

---
layout: post
title: "My First Dockerfile"
date: 2019-07-21 20:15:01 -0400
description: "Doing something with docker"
subtitle: "Doing something with docker"
---
I have been experimenting with docker over the years off and on but never took the time to apply it to a real project.  Today that was going to change with a quick experiment building up a an `nginx` image and apply the output of a Jekyll site.  

### `Dockerfile`

A `Dockerfile` is a document that specifies a source image and commands you wish to apply to that image where each command is a delta from the previous action.  This allows you to have a repeatable process of getting your image created.  

```
FROM nginx:1.17.1
COPY site/_site /usr/share/nginx/html
```

This a rather trivial example but takes a [`tag`](https://docs.docker.com/engine/reference/commandline/tag/) of [`nginix`](https://hub.docker.com/_/nginx) version `1.17.1`.  I wanted to be sure to specify a known version as using `latest` while helpful could result in an image that no longer works as you have not control over what `latest` actually is when building.  The `COPY` command simply copies files from a source location to a destination location inside of the image.

### `build-container.sh`

Since the Dockerfile can only execute commands inside of the image I was unsure how to get the `Jekyll` site built from the start.  After a bit of searching it was recommended to create a simple `sh` script that executes the commands and then the corresponding `docker build .` command at the end. 

```
cd site && bundle exec jekyll build
cd ..
docker build . -t markcoleman/viking-mill:latest
```

### `run-site.sh`

Now that we have the image built and tagged lets run it like any other image we have pulled and map a port of exposed port `8080` to container port `80` which is exposed by `nginix`.

```
docker run -d -p 8080:80 -i -t markcoleman/viking-mill:latest
```

_Site running in an ngnix container_
![Viking Mill ]({{ '/assets/blog-images/2019-07-21-my-first-dockerfile/01-screen-shot-2019-07-21-at-12.44.57-pm.png' | relative_url }})

Simple but yet very effective and allowed me to learn a bit more, next up how to automate this using gitlab.

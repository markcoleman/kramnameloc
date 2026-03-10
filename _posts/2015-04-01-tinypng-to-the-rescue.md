---
layout: "post"
title: "TinyPng to the Rescue"
date: 2015-04-01 10:18:37 -0400
description: "Performance gains don't always mean refactoring"
summary: "Performance gains don't always mean refactoring"
subtitle: "Performance gains don't always mean refactoring"
tags:
  - web
---
Over here at [Members 1st FCU](https://myonline.members1st.org) we have been focusing on improving overall performance of our application so we reply to user requests faster.  Over the past few weeks we have been refactoring, hacking, and slashing our code base and saw some great gains.  Today I remembered that performance doesn't always mean refactoring code it can also mean optimization of requests and particularly that means image size.

The easiest solution to optimize your sites image payload is run the files through [TinyPng](http://www.tinypng.com)

![Tinypng]({{ '/assets/blog-images/2015-04-01-tinypng-to-the-rescue/01-tinypng_large.png' | relative_url }})

We processed all of our images and ended up saving about 200k which is a great savings in bandwidth and users data costs.

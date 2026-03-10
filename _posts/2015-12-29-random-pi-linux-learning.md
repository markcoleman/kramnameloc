---
layout: "post"
title: "Random Pi/Linux Learning"
date: 2015-12-29 22:27:08 -0500
description: "randr? C LOG 29"
summary: "randr?"
subtitle: "randr? C_LOG_29"
tags:
  - raspberry-pi
  - career
  - javascript
---
Tonight I was feeling scatter brained on what to learn about and came up with a few random ideas which so far were unsuccessful.

 - I tried building [vscode](https://github.com/Microsoft/vscode) on a raspberry pi inspired by [Marc Gravell](https://twitter.com/marcgravell/status/680023468327497731).  I was able to clone the repository, install the dependencies and build it with the appropriate ``--arch= armhf`` flag. 
 - The ``gulp watch`` command executed (took quite a long time) however ``./scripts/code.sh`` fails with an error which appears to be something about headless mode.

>Xlib extension “RANDR” missing on display “:1”

**hmmmmmmm**

*mental recap*

 - Learned how to build something from source, even though the last step failed
 - I think I need to find a new vnc server, something with this randr seems to be missing from tightvncserver 
 - I didn't really create much tonight, but did accomplish...something...so that is a win at least? Right?

---
layout: "post"
title: "Removing server side scripts, gulp-preprocess"
date: 2015-11-23 16:03:55 -0500
description: "Sometimes you need to process first"
summary: "Sometimes you need to process first"
subtitle: "Sometimes you need to process first"
tags:
  - dotnet
  - javascript
  - web
---
Problem, we want to remove server side asp.net scripts from our aspx page and covert them to plain html.

#Old Way

In our old index.aspx page we had a few server rendered scripts for example a simple welcome message that is set by some method in code behind.

```
<h1><%:WelcomeMessage%></h1>
```

index.aspx.cs

```
WelcomeMessage = "Hello Asp.net";
```

Now if we want to remove this rendered value we need to find a way to process our page so the variable is replaced with our message.

#New Way
Since we are using gulp as our task runner we are going to use [gulp-preprocess](https://github.com/mallowigi/gulp-preprocess) to preprocess our html.

We echo out the welcome message

```
<h1><!-- @echo WelcomeMessage --></h1>

```

And the gulp task

```
var gulp = require('gulp'),
    preprocess = require('gulp-preprocess');

gulp.task('html', function() {
    gulp.src('./app/*.html')
        .pipe(preprocess({
            context: {
                WelcomeMessage : 'Hello Preprocess'
            }
        })) //To set environment variables in-line
        .pipe(gulp.dest('./dist/'))
});
```

*the context contains our variable to echo out*

The resulting processed html file.

```
<h1>Hello Preprocess</h1>
```

There we have it, we were able to remove our server rendered tag with a simple gulp task.

---
layout: post
title: "Using gulp-inject"
date: 2015-11-24 15:22:18 -0500
description: "Replacing cassette bundle helpers"
subtitle: "Replacing cassette bundle helpers"
---
Previously on this series I showed how we could use ``gulp-preprocess`` to remove the server rendered tags from our aspx page.  Next up on the list is how can we remove the cassette bundle helpers.  First thing is we need to do is find the equivalent [gulp-inject](https://github.com/klei/gulp-inject) syntax.

**Cassette**

```
@Bundles.RenderScripts()
```

**gulp-inject**

```
<!-- inject:js -->
<!-- endinject -->
```

**Cassette**

```
@Bundles.RenderStylesheets()
```

**gulp-inject**

```
<!-- inject:css -->
<!-- endinject -->
```

**The Task**

In most cases the example found on the github page will be our basic scaffolding.


```
var gulp = require('gulp');
var inject = require('gulp-inject');

gulp.task('index', function () {
  var target = gulp.src('./src/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var sources = gulp.src(['./src/**/*.js', './src/**/*.css'], {read: false});

  return target.pipe(inject(sources))
    .pipe(gulp.dest('./src'));
});
```

###Things we ran into/learned

 - We had to use [``ignorePath:'dist'``](https://github.com/klei/gulp-inject#optionsignorepath) we ended up having to use this because of the folder structure while converting our app to use gulp
 - We had to name our [injectables](https://github.com/klei/gulp-inject#optionsignorepath) since we had files hosted on a cdn and order was important and this allowed us to group files together.
 - We didn't use broad *'glob'* matching since we had to maintain some sort of order
 - Before we injected css and js we had to generate them via typescript and less processors. **Pipe the result stream from these processors into gulp-inject no need to write to disk only to scoop them back up.**
 - Do not commit the processed files to source control allow the tasks to generate the resulting markup.  *Your html is unprocessed source.*

There you have it no more cassette bundle helpers and you are doing everything with gulp.

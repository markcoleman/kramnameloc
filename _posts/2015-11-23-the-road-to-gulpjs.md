---
layout: post
title: "The road to gulpjs"
date: 2015-11-23 15:23:39 -0500
description: "Embracing webapp builds"
subtitle: "Embracing webapp builds"
---
Since the inception of the web app we have been using asp.net ideas inside of our angular application.  This was a logical choice at the start since we were .net developers at heart.   During the past year we came to the realization we needed to change things and embrace modern web app tooling for our angular site.

#Old Way

 - [cassette](https://www.nuget.org/packages/Cassette/) was our bundling and uglification framework of choice.
    - We used a bundle.txt to get all of our bundles to behave correctly.
 - Javascript was in source (even though we were using TypeScript)
  - **Please do not commit compiled js into source control**
 - [cassette.msbuild](https://www.nuget.org/packages/Cassette.MSBuild/)
  - msbuild file to turn on concatenation, uglification, and caching via cassette-cache.
 - Server side tags were used to output configuration and help with rendering the bundles via cassette.

#Why
 - Using asp.net frameworks in a full angular site we ended up using only a minimal amount of asp.net in the web app and introduced an unneeded dependency. (we still needed it for the api but the web app didn't need it)
 - The build process was not as refined, web project was just a dump of assets.
 - We had random build issues with versions of msbuild.  Msbuild, cassette.msbuild, and tfs appears (to us) to be very fragile)
  - We also had msbuild tasks for C# compilation and intermixed nodejs execution of js unit tests which caused confusion on what was executing what.
 - The web app was tightly coupled to the api and it was not easily deployable just by itself.
 - It just felt wrong.

#New Way
 - [gulp](http://gulpjs.com) will be our task runner for the web app builds.
 - Many *many* gulp plugins
  - [gulp-uglify](https://github.com/terinjokes/gulp-uglify), used to uglify the js in production deployments.
  - [gulp-concat](https://github.com/contra/gulp-concat), used to create our bundles.
  - [gulp-preprocess](https://github.com/jas/gulp-preprocess), preprocess our html so we can remove server side tags.
  - [gulp-typescript](https://github.com/ivogabe/gulp-typescript), compile our typescript files to javascript for deployment.
  - [gulp-inject](https://github.com/klei/gulp-inject), getting our css and js files into our html so we can remove the cassette bundle helpers.
  - [gulp-if](https://github.com/robrich/gulp-if), help with setting up dev/staging/production builds.
  - [gulp-less](https://github.com/plus3network/gulp-less), getting our ``less`` files to ``css``

More to come....

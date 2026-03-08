---
layout: post
title: "Gated Checkins"
date: 2015-04-21 11:17:47 -0400
description: "When sometimes you are not sure..."
subtitle: "When sometimes you are not sure..."
---
This might be old news for some but figured I would share.

One feature of TFS is it allows you to perform a [gated checkin](https://msdn.microsoft.com/en-us/library/dd787631.aspx) where the checkin will only occur if the build/tests are successful.  I used this in the past a few times when I was making some changes that were conjecture if it would fix the problem on the build server.  (binding redirects, path issues, and failures that only seem to occur on the build server)


#Create a shelve of your changes
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/d6b60418-e883-45c6-b6e8-66997e3505f2/01%20-%20shelve_large.png)

#Queue Build
 - Go to the build tab in team explorer and right click on “Development” then click on “Queue New Build…”
 - Under the general tab, adjust the “What do you want to build?” to be “Latest sources with shelveset”
 - Pick the shelveset name
 - Tick the “Check in changes after successful build”
 - Click “Queue"

![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/a1b29f38-d910-4755-be12-4b23f8ed0ab0/02%20-%20queue_large.png)

This will cause a build to start on the build server with the latest sources in source control and your shelve set changes.  If all goes well the shelveset will be checked in at the end of the build.

![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/83fa7bc3-83cf-49b3-bd52-b2ed3a5f6b4a/03%20-%20history_large.png)


*note: Your changes will remain checked out locally, but if you get latest your checked out changes will match what is in source control and will now be synchronized*

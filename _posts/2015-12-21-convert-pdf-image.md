---
layout: "post"
title: "Convert pdf->image"
date: 2015-12-21 16:30:00 -0500
description: "C LOG 22"
summary: "C_LOG_22"
subtitle: "C_LOG_22"
tags:
  - career
  - testing
---
Pdf pdf, oh the pdf.  Every now and again I have to deal with a pdf file and do *something* with it.  Today was converting it to an image.  Now usually I just fire up preview on the mac and export as an image.  Today let's find another way a way that is on windows.  After a quick google search [stack overflow was to the rescue and pointed towards imagemagick](http://stackoverflow.com/questions/6605006/convert-pdf-to-image-with-high-resolution)

**Get it all installed**

 - Install [ghostscript](http://ghostscript.com/)
 - Install [imagemagick](http://www.imagemagick.org)

Now that it is installed we can run the command ``convert -density 300 -trim 1.pdf -quality 100 test.jpg``

Success!

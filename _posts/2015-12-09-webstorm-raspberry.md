---
layout: post
title: "Webstorm -> Raspberry"
date: 2015-12-09 22:33:19 -0500
description: "Deploy to Raspberry from WebStorm C LOG 10"
subtitle: "Deploy to Raspberry from WebStorm C_LOG_10"
---
I have been using ``nano`` for my early development musing for the raspberry pi now it is time to find another way.  I like [WebStorm](http://jetbrains.com/webstorm) so let's see how I can deploy a small express app to the raspberry.

#Create the app

*from the guide on [expressjs](http://expressjs.com/en/starter/hello-world.html)*

```
var express = require('express');

var app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
```

#Configure SFTP
Inside of webstorm configure the dialog with the details of your pi. 
*Tools->Deployment->Configuration*
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/da4af91f-3613-4f15-888c-0d8a75d8a108/Screen%20Shot%202015-12-09%20at%209.34.34%20PM_large.png)


Right click on the project and then upload your changes with the pi.
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/f2297680-750d-4299-9963-29a2417a0a2e/Screen%20Shot%202015-12-09%20at%2010.02.22%20PM_large.png)

This next step is manual ``ssh`` into the pi and run ``npm install`` and then ``node server.js``. Once that runs I hoped over to a browser and was able to view the Hello World response served from the express app.

#Made a change
Now I added a new route of ``/red`` if you do synchronize changes to the pi you get a nice dialog that will shows the difference between the remote server and your local copy.

![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/73015ec2-490a-4c7c-8420-629ee8168b8c/Screen%20Shot%202015-12-09%20at%2010.06.59%20PM_large.png)

*mental recap*

 - I now have a nicer IDE
 - You can sync changes easily with webstorm

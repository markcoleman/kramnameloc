---
layout: "post"
title: "Running script forever with foreverjs"
date: 2015-12-26 22:14:23 -0500
description: "Reboot! C LOG 26"
summary: "Reboot!"
subtitle: "Reboot! C_LOG_26"
tags:
  - raspberry-pi
  - automation
  - javascript
---
My next challenge is to figure out how to make sure our node script is running on boot of the raspberry pi.

**Simplified Script**
This is our simplified script we want to run at system boot.

```
var wpi = require('wiring-pi');

var express = require('express');
var app = express();

wpi.wiringPiSetup();
var relaySwitchOne = 0;
wpi.pinMode(relaySwitchOne, wpi.OUTPUT);

app.get('/status', function(req, res){
    var result = !+ wpi.digitalRead(relaySwitchOne);
    res.send(''+ result);
});
app.get('/on', function (req, res) {
    wpi.digitalWrite(relaySwitchOne, 0);
    res.send('on');
});

app.get('/off', function(req, res){
    off();
    res.send('off');
});

function off(){
    wpi.digitalWrite(relaySwitchOne, 1);
}

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
```

---

**running it**
After a bit of searching online I located [foreverjs](https://github.com/foreverjs/forever) which seems very promising.

>A simple CLI tool for ensuring that a given script runs continuously (i.e. forever).

Using ``sudo forever start index.js`` I could see the express server startup.  This would allow the script to run forever, but what about on reboot.  Additional searching I was brought to another [question/answer](http://stackoverflow.com/a/25423770/181776) that directs me to using  [forever-service](https://github.com/zapty/forever-service).  Looking at the docs I was able to execute the command ``sudo forever-service install pi-switch --script index.js`` which did its magic.

>Commands to interact with service pi-switch
Start   - "sudo service pi-switch start"
Stop    - "sudo service pi-switch stop"
Status  - "sudo service pi-switch status"
Restart - "sudo service pi-switch restart"


**reboot**
I rebooted the pi and the relay switched on (success) and running curl shows the express server is up.  Double Success!

---

*mental recap*

 - There is a library or package to do anything
 - This package is doing some magic and it might be better to understand the [higher upvoted answer as well](http://stackoverflow.com/a/13388741/181776).

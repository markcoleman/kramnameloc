---
layout: post
title: "Homebridge -> LED"
date: 2015-12-15 20:48:00 -0500
description: "C LOG 16"
subtitle: "C_LOG_16"
---
Tonight was a big night.  I had the goal of using home kit to turn on and off the LED attached to the raspberry pi.  This was accomplished by the open source project [homebridge](https://github.com/nfarina/homebridge) which I [setup previously on my iMac](http://www.kramnameloc.com/setting-up-homebridge).   The documentation on creating a plugin is is sparse but I was able to piece together a working accessory that worked with homebridge.

---

**The LED API**
The first thing we needed to do is piece together an api for our raspberry pi so we can control the GPIO which illuminates the LED.  I was able to do this by using [the wiring-pi app](http://www.kramnameloc.com/trying-out-wiring-pi) and the [express app](http://www.kramnameloc.com/webstorm-raspberry) I played with already.  This resulted in a single node app that exposed ``on``, ``off``, and ``status`` endpoints.

```
var wpi = require('wiring-pi');

var express = require('express');
var app = express();

wpi.wiringPiSetup();
var pin = 0;
wpi.pinMode(pin, wpi.OUTPUT);
var value = 0;
var handler;
var flashing = false;
app.get('/status', function(req, res){
    res.send(''+ flashing);
});
app.get('/on', function (req, res) {
    flashing = true;
    off();
    handler = setInterval(function() {
        wpi.digitalWrite(pin, value);
        value = +!value;
    }, 500);
    res.send('on');
});

app.get('/off', function(req, res){
    flashing = false;
    off();
    res.send('off');
});

function off(){
    if(handler){
        clearInterval(handler);
    }
    wpi.digitalWrite(pin, 0);
}

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});


function exitHandler(options, err) {
    if (options.cleanup) {
        if(wpi){
            wpi.digitalWrite(pin, 0);
        }
    }
    if (err) {
        console.log(err.stack);
    }
    if (options.exit) {
        process.exit();
    }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

console.log('Press any key to exit');

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));
```

---

**The Plugin**
Our next step is to create a homebridge plugin that talks to the API we just created.  This was probably the most challenging part of the puzzle.  

At first I read over the [example plugin](https://github.com/nfarina/homebridge/tree/master/example-plugins/homebridge-lockitron) and also [homebridge sonos](https://github.com/nfarina/homebridge-sonos).  This lead me down the path of creating a switch service but after looking over the
 [homekit accessory server](https://github.com/KhaosT/HAP-NodeJS) source a Lightbulb was the logical choice.  This resulted in a plugin that follows the same pattern as the example but renamed to ``LedAccessory``.

```
var request = require("request");
var Service, Characteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory("homebridge-led", "PiLight", LedAccessory);
}

function LedAccessory(log, config) {
    this.log = log;
    this.config = config;
    this.name = config["name"];

    this.service = new Service.Lightbulb(this.name);
    this.service
        .getCharacteristic(Characteristic.On)
        .on('get', this.getOn.bind(this))
        .on('set', this.setOn.bind(this));
}

LedAccessory.prototype.getOn = function(callback) {
    request.get({
        url: 'http://192.168.1.171:3000/status'
    }, function(err, response, body) {
        var status = body == 'true' ? true : false;
        callback(null, status);
    }.bind(this));
}

LedAccessory.prototype.setOn = function(on, callback) {
    var url = on ? "on": "off";
    request.get({
        url: 'http://192.168.1.171:3000/' + url
    }, function(err, response, body) {
        callback(null, on);
    }.bind(this));
}

LedAccessory.prototype.getServices = function() {
    return [this.service];
}
```

*make sure the ``callback()`` is called otherwise things won't work correctly*

Now that we have our plugin created we need to install it globally as we did with the example plugin.  To accomplish this we have to create a ``package.json`` file.

```
{
  "name": "homebridge-led",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "homebridge-plugin"
  ],
  "engines": {
    "node": ">=0.12.0",
    "homebridge": ">=0.2.0"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "request": "^2.67.0"
  }
}
```

*notes*

 - Add keywords so ``homebridge`` can find it.
 - Add engines -> homebridge 
 - Package name should match the name in the plugin.

---
**Config**

Once we have all of that in place we can run ``sudo npm install -g`` which will allow homebridge access to the plugin.

Now we can adjust our homebridge config file to use our led plugin.

```
{
    "bridge": {
        "name": "Homebridge",
        "username": "CC:22:3D:E3:CE:30",
        "port": 51826,
        "pin": "031-45-154"
    },
    
    "description": "Config file",

    "accessories": [
        {
            "accessory": "PiLight",
            "name": "Led"
        }
    ]
}
```


*notes*
 -  The ``accessory`` is the name from the plugin source
 -  The ``name`` is **any** name you want to give your accessory (this will show up inside of siri and the home kit app)
 - The ``name`` can be kind of tricky as siri tends to want to search google so simple descriptive names seem to work better like bedroom, etc.

---
**Turning On the LED**
Now if you have everything running, node express server (on the pi), plugin installed, and homebridge (on the iMac) if we jump over to our iPhone app we will see our accessory.

![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/5f2ef396-d6bc-414e-adf7-5f2832a0de8c/Screen%20Shot%202015-12-15%20at%207.41.54%20PM_large.png)

From there you can ask Siri to turn on and off our light

![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/28182f93-87a2-4b75-b7ff-373795f36b9f/Screen%20Shot%202015-12-15%20at%207.42.15%20PM_large.png)

*mental recap*

 - you can install a node module globally by ``npm install -g``
 - callbacks are important
 - homekit and siri interaction is foreign to me and takes some getting used to.

---
layout: post
title: "Trying out Wiring Pi"
date: 2015-12-11 17:00:09 -0500
description: "Write to that GPIO real good, C LOG 12"
subtitle: "Write to that GPIO real good, C_LOG_12"
---
Previously I tried out the [pi-gpio](https://www.npmjs.com/package/pi-gpio) package to get my led to flash, but wanted to explore other options.  After a bit of searching around the internets I stumbled upon [wiringPi](http://wiringpi.com) and a corresponding [node wrapper](https://github.com/eugeneware/wiring-pi).

The documentation didn't have any apparent quick start examples but after reading a [few examples](http://www.gorkem-ercan.com/2015/01/gpio-with-nodejs-in-pidora.html).  I clobbered together an example that worked with the latest version of the package.  I loaded up [web storm with automatic upload](http://www.kramnameloc.com/webstorm-raspberry) and pasted in the code.

```
var wpi = require('wiring-pi');
wpi.wiringPiSetup();
var pin = 0;
wpi.pinMode(pin, wpi.OUTPUT);
var value = 0;
setInterval(function() {
    wpi.digitalWrite(pin, value);
    value = +!value;
}, 500);
```
*I needed to look at the [pin layout table](http://wiringpi.com/pins/) again to make sure I was using the right pin number.*

I then ssh into the pi, ran ``sudo node led.js``, and off went the flashing led. :-)

It was a success so I hit ``ctrl-c`` to terminate the app and the led stayed on, which thinking about it makes sense as I killed the application while the LED was on.  

Time to research ways to run a function when a nodejs app terminates.  As usual stack overflow was the go to place to [learn how to execute a clean up function](http://stackoverflow.com/a/14032965/181776) and also how to use [Any key to exit](http://stackoverflow.com/a/19692588/181776).

Putting it all together

```
var wpi = require('wiring-pi');


wpi.wiringPiSetup();
var pin = 0;
wpi.pinMode(pin, wpi.OUTPUT);
var value = 0;
setInterval(function() {
    wpi.digitalWrite(pin, value);
    value = +!value;
}, 500);


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
Now when the app exits I can verify that the LED is in the off state.

*Mental recap*

 - wiringPi seems like the way to go for future GPIO adventures
 - clean up after yourself when your app terminates
 - web storm is way easier compared to nano.

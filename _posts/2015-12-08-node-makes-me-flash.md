---
layout: "post"
title: "Node makes me Flash"
date: 2015-12-08 20:35:26 -0500
description: "Using Node to flash my led, C LOG 9"
summary: "Using Node to flash my led, C_LOG_9"
subtitle: "Using Node to flash my led, C_LOG_9"
tags:
  - javascript
  - raspberry-pi
  - automation
---
Tonight I want to get an LED to flash via nodejs.  After  quick google search I found a package with a small [guide](https://www.npmjs.com/package/pi-gpio).

After setting things up and attempting to run the ``quick2wire-gpio-admin`` it said it was already setup?

Install the package and get create the sample script

```
npm install pi-gpio
```

```
nano led_flash.js
```

```
var gpio = require("pi-gpio");
 
gpio.open(11, "output", function(err) {
	gpio.write(11, 1, function() {
		gpio.close(11);
	});
});
```
*I was using pin 11 for my setup*

run it

```
node led_flash.js
```

I ran into an error that was described in this [troubleshooting guide](https://github.com/nickfloyd/raspberry-beacons)

---

*The Guide*
``gpio-admin: failed to change group ownership of /sys/devices/virtual/gpio/gpio22/direction: No such file or directory``

This is a know issue and there is currently a PR on the quick2wire-gpio-admin repo that addresses it. While we are waiting for that to get pulled in we can fix it ourselves.

On your Pi navigate to:

``/home/pi/gpio-admin/src``
Open and modify the ``gpio-admin.c`` file:

Change this:

```
int size = snprintf(path, PATH_MAX, "/sys/devices/virtual/gpio/gpio%u/%s", pin, filename);
```

To this:

```
int size = snprintf(path, PATH_MAX, "/sys/class/gpio/gpio%u/%s", pin, filename);
Once you are done you will have to rebuid and install gpio-admin. Navigate to /home/pi/gpio-admin and execute the following:
```

```
make
sudo make install 
```

---

*Does it now work?*
If I run ``node led_flash.js``, yes it does.

Next I wanted to make sure this is not a fluke and want to do it again with  using ``setTimeOut()`` so I can offer in a delay.

```
var gpio = require("pi-gpio");

gpio.open(11, "output", function(err) {
        setTimeout(function(){
                gpio.write(11, 1, function(){
                        gpio.close(11);
                });
        }, 2000);
});
```

```
node led_flash.js
```

If I watch the LED after two seconds it illuminates and then turns off.

#Success!

*Mental Recap*

 - I read this package is old and [not supported](https://github.com/quick2wire/quick2wire-gpio-admin/issues/5), I must do research on another way to do this interaction. (Maybe [rpi-gpio](https://www.npmjs.com/package/rpi-gpio))
 - Typing up a node app via ssh and nano is not Ideal I need to find a better way!
 - I got a LED to flash via node!
 - Pin layout and what a Pin means is confusing?!

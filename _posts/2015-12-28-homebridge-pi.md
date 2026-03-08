---
layout: post
title: "Homebridge -> Pi"
date: 2015-12-28 18:43:42 -0500
description: "C LOG 27"
subtitle: "C_LOG_27"
---
I am getting closer to my goal of using the Pi to turn devices on and off, however before I finish up I need to get homebridge running fully on the Pi(that way it acts as a dedicated homebridge device).  To get started I head over to the how to [install on a raspberry pi guide](https://github.com/nfarina/homebridge/wiki/Running-HomeBridge-on-a-Raspberry-Pi)

I already has jessie installed and didn't have to worry about upgrading to C++14.

Now I can install the other dependency.

```
sudo apt-get install libavahi-compat-libdnssd-dev
```

I attempted to install [homebridge using the normal instructions](https://github.com/nfarina/homebridge), however soon realized I also needed to upgrade the node version installed on the Pi.

Since I was not sure of the easiest way to install the latest version I was able to follow [this guide](https://davidwalsh.name/upgrade-nodejs) to get to the latest version by using npm.

```
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
```

Now I was able to get homebridge installed using ``sudo npm install homebridge -g``.  

---

**Does my express app still work?**
No, it doesn't.  Attempting to run ``sudo node index.js`` I received an error stating that the module did not self register which brought me to this [question](http://stackoverflow.com/questions/28486891/uncaught-error-module-did-not-self-register).  

```
npm rebuild
```

*in the directory of the node app*

After that completed my app sprung back to life as foreverjs restarted the failed service.  

Now I can get the rest of [homebridge](http://www.kramnameloc.com/setting-up-homebridge) configured on the pi.

*mental recap*

 - You can use ``n`` to upgrade your version of node
 - If you upgrade node you might need to run ``npm rebuild`` for node modules already installed.

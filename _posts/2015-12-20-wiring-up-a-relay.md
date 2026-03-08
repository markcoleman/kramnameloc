---
layout: post
title: "Wiring up a Relay"
date: 2015-12-20 09:14:06 -0500
description: "C LOG 21"
subtitle: "C_LOG_21"
---
A couple weeks ago I purchased a [SunFounder 2channel 5v relay](http://www.amazon.com/SunFounder-Channel-Shield-Arduino-Raspberry/dp/B00E0NTPP4) so I can use the Pi to control a device remotely (I am looking at you Mr. Christmas Tree)

**The Relay**
![Silvrback blog image](/assets/blog-images/e1e9263a13e6-image_large.jpeg)

This was the first time pulling it out of the box and immediately I was confused on how to hook this thing up as there were no diagrams or instructions. After much googling, reading and discovery this [video](https://www.youtube.com/watch?v=OQyntQLazMU) explained exactly how I can hook this relay up to the PI.

**Improvise** 
![Using jumpers](/assets/blog-images/a15496c1e9a7-img_0809_large.jpg)
I didn't have any female to female jumper wires this morning (ordered some though) I was able to use my existing pieces along with a few jumpers to get the relay wired. 

**Wired Up**
![Silvrback blog image](/assets/blog-images/64b5e75038ac-img_0817_large.jpg)
Going back to the [pin layout table](http://wiringpi.com/pins/) I hooked up the wires from the relay to the gpio breakout on the breadboard. 

The next step was to modify the [led node app to control both gpio pins](http://www.kramnameloc.com/control-led-with-homebridge).

**Action Shot**
![Silvrback blog image](/assets/blog-images/f8f8dfee060b-attachment-1_large.gif)

*Mental Recap*

 - As always a lot of resources out there on the internet
 - This was fairly easy to setup once I was able to find the right guide.
 - I need to a lot more reading before I hook this up to a control an outlet :-)

---
layout: "post"
title: "Controlling the Flow"
date: 2015-12-23 16:22:09 -0500
description: "Relay tied into an extension cord, C LOG 23"
summary: "Relay tied into an extension cord, C_LOG_23"
subtitle: "Relay tied into an extension cord, C_LOG_23"
tags:
  - raspberry-pi
  - automation
  - javascript
---
Now that I have the [relay hooked](http://www.kramnameloc.com/wiring-up-a-relay) up I was able to make the small LEDs on the relay flash it is now time to use it to switch power.  Before we get started I would like to state I really don't know what I am doing but do have some basic electrical experience and need to state we are now dealing with 120v which is dangerous.  Please be careful and use caution when touching or hooking up anything.  Since we have that out of the way time to get to work.

**the cord**
![The Cord]({{ '/assets/blog-images/2015-12-23-controlling-the-flow/01-img_0854_large.jpg' | relative_url }})
I picked up the most basic extension cord I could find since there was a high probability this whole thing might not work and it could be a throw away purchase.  

**cutting it**
Before I cut one side of the cable I had to make sure I was cutting the right wire.  The one side was ribbed which I knew meant something but until I [searched](http://diy.stackexchange.com/questions/29496/which-side-of-a-two-wire-cable-should-be-used-for-hot) I learned the smooth side is normally the hot wire.
![Cut]({{ '/assets/blog-images/2015-12-23-controlling-the-flow/02-img_0855_large.jpg' | relative_url }})
*smooth side cut and shielding stripped*

**Into the relay**
The relay I purchased did not come with any type  of instructions so after searching I learned about the [common, normally open, and normally closed terminals](http://www.instructables.com/id/Controlling-AC-light-using-Arduino-with-relay-modu/).
![wired to relay]({{ '/assets/blog-images/2015-12-23-controlling-the-flow/03-img_0856_large.jpg' | relative_url }})
*not totally sure if this is correct, but it works.*

**add control wires**
Now that we have the extension cord wired up it is time to re-connect the relay to the raspberry pi.
![relay hooked back up]({{ '/assets/blog-images/2015-12-23-controlling-the-flow/04-img_0857_large.jpg' | relative_url }})
*I am now using my female-female wires*

**Strobe Light**
I plugged the floor lamp into the extension cord and loaded up my little node script that toggles the relay every 500ms.  This step now turned my floor lamp into a flashing light.
![Flashing]({{ '/assets/blog-images/2015-12-23-controlling-the-flow/05-image_large.gif' | relative_url }})
*success!*


*mental recap*

 - The relay works, score!
 - We are now dealing with 120v, use caution, double and triple check things so you don't get hurt
 - Time to think about how to mount this in my project box
 - Is this safe? Need to do some more research

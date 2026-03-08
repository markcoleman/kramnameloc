---
layout: post
title: "Setting up HomeBridge"
date: 2015-12-12 07:33:08 -0500
description: "C LOG 13"
subtitle: "C_LOG_13"
---
This week I [read about homebridge](http://appleinsider.com/articles/15/12/08/open-source-homebridge-links-3rd-party-smart-home-devices-like-nest-to-apples-homekit).  This immediately peaked my interest in my adventures with the Raspberry Pi.  I wonder if I could ask siri to flash the led?  I suppose the easiest way is to see if we can get [homebridge setup based on the readme.md](https://github.com/nfarina/homebridge).

```
sudo npm install -g homebridge
```

After a few seconds I ran the command ``homebridge`` and just as the guide said I received an error about setting up the config file.

```
Marks-iMac:HomeBridge markcoleman$ homebridge
No plugins found. See the README for information on installing plugins.
Couldn't find a config.json file at '/Users/xxxxxxx/.homebridge/config.json'. Look at config-sample.json for examples of how to format your config.js and add your home accessories.
```


Next I navigated to the directory in the error message and ran ``touch config.json`` to create the file and then ``nano config.json``.  Now what should this config file look like?  In the root of the repo there is a sample [config file](https://github.com/nfarina/homebridge/blob/master/config-sample.json).

Running the command ``homebridge`` again resulted in an error which I sort of expected since I didn't install any plugins.  Let's back track a bit and install the sample lock first.

```
sudo npm install -g homebridge-lockitron
```

Now I think we need to alter the ``config.json`` 

But what do we adjust?  The install plugin section references

>Plugins can publish Accessories and/or Platforms. Accessories are individual devices, like a smart switch or a garage door. Platforms act like a single device but can expose a set of devices, like a house full of smart lightbulbs.

Looking into the [source of lockitron](https://github.com/nfarina/homebridge/blob/master/example-plugins/homebridge-lockitron/index.js) we can see the values required.

Adjusted config

```
{
    "bridge": {
        "name": "Homebridge",
        "username": "CC:22:3D:E3:CE:30",
        "port": 51826,
        "pin": "031-45-154"
    },
    
    "description": "Config file with just lockitron",

    "accessories": [
        {
            "accessory": "Lockitron",
            "name": "homebridge-lockitron"
        }
    ]
}
```

Now to run ``homebridge`` again.
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/8cf7e622-9d61-460b-ad22-26ab1105f32e/Screen%20Shot%202015-12-12%20at%206.51.23%20AM_large.png)

**Success**, now to figure out the app section.

>If you are a member of the iOS developer program, I highly recommend Apple's [HomeKit Catalog app](https://developer.apple.com/library/ios/samplecode/HomeKitCatalog/Introduction/Intro.html), as it is reliable and comprehensive and free (and open source).

I downloaded the code and loaded it in Xcode.
Pressing play was of no luck as I ran into a few issues.

>No matching provisioning profiles found: None of the valid provisioning profiles allowed the specified entitlements: com.apple.external-accessory.wireless-configuration, com.apple.developer.homekit.

On the capabilities tab for the project file clicking fix issue did resolve the one issue but still ran into the problem of  *App ID with identifier .... is not available.*

Over to stack overflow this [answer seemed promising](http://stackoverflow.com/a/20565597/181776).  I went to the general tab on the project file, came up with a new bundle identifier, back to the capabilities tab, and clicked fix issue.  Wonderful! all issues should now be fixed, let's press play.

**It is running!** now what?

 - Inside of the app I added a new home
 - Added a new accessory which discovered homebridge
 - I had to type in the code manually, the camera might have worked but this was easier.

![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/b7aaef82-592d-45cd-abc7-46b904783fcc/Screen%20Shot%202015-12-12%20at%207.13.17%20AM_medium.png)

We now appear to be all linked together.  If I go under the control tab of the app and adjust the lockitron state I receive the expected errors in the terminal window where ``homebridge`` is running.  I think the first phase of this process is complete.

*Mental recap*

 - ``homebridge`` is fairly easy to get setup once the pieces are installed
 - app id's need to be unique and clicking fix issue *most* of the time will fix your issue
 - I am curious how to interact with home kit devices with siri.

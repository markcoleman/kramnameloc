---
layout: post
title: "Raspberry Wifi"
date: 2015-12-02 22:55:23 -0500
description: "C LOG 3, setting up wifi via command line huh?"
subtitle: "C_LOG_3, setting up wifi via command line huh?"
---
So far my experience with the [raspberry pi has been fairly minimal](http://www.kramnameloc.com/raspberry-pi-setup). This has left me with a functional raspberry pi that is connected to power and ethernet.  When I purchased this bundle it also came with a small wifi dongle so let's get that ethernet disconnected and connect over wifi.

#Task Setup Wifi

Off to the google on [how to configure wifi via command line (ssh)](https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md)

**ssh into your raspberry**

I know about ``ifconfig`` which will list network interfaces

```
wlan0     Link encap:Ethernet
```
*the wireless dongle*

Time to scan

```
sudo iwlist wlan0 scan
```

*results*

```
wlan0     Scan completed :
          Cell 01 - Address: 48:D7:05:F0:D6:0C
                    ESSID:"Apple Xtreme "
                    Protocol:IEEE 802.11bgn
                    Mode:Master
                    Frequency:2.412 GHz (Channel 1)
```

Next up editing the configuration file as we follow along with the guide.

```
sudo nano /etc/wpa_supplicant/wpa_supplicant.conf
```

I didn't have any network={} section so had to add it towards the end.

```
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
network={
        ssid="super_secret_wifi"
        psk="super_secret_password"
}
```
---
Now the guide says the unencrypted password, not sure how I feel about that so let's if we have other options...to the google and I found an [article about wpa](https://wiki.archlinux.org/index.php/WPA_supplicant#Connecting_with_wpa_passphrase).

If we run ``wpa_passphrase`` we will get our encrypted value.

 ```
wpa_passphrase super_secret_wifi super_secret_password
```

```
network={
	ssid="super_secret_wifi"
	#psk="super_secret_password"
	psk=e1bbe303847b6b70e3550fd0f485c68dd92226e0332dde376ba7c5c79684f903
}
```


We have the configuration block we can put into the ``wpa_supplicant.conf`` file.
 *I removed the # line so only the encrypted value is present in the file*


Recycle the ``wlan0`` interface with ``sudo ifdown wlan0`` and ``sudo ifup wlan0``


If we run ``ifconfig`` we now see ``wlan0`` has an ip address!
*I also setup dhcp from this [article](http://omarriott.com/aux/raspberry-pi-wifi/)*

```
wlan0     Link encap:Ethernet  HWaddr 00:00:00:00:00:00  
          inet addr:xxx.xxx.xxx.xxx  Bcast:xxx.xxx.xxx.xxx  Mask:255.255.255.0
``` 
---
##Disconnected and reboot

I disconnected ethernet and ran the nmap command again to see if we have ssh listening on the wireless ip.

```
nmap -p 22 --open -sV 192.168.1.*
```
#Yes 

```
Nmap scan report for raspberrypi (xxx.xxx.xxx.xxx)
```

![Silvrback blog image](/assets/blog-images/2015-12-02-raspberry-wifi/01-img_0647_large.jpg)
*mmmmm flashing blue lights*


*Mental recap*

 - Configure wifi via command line modifying the file ``wpa_supplicant.conf``
 - Creating pass phrase using ``wpa_passphrase``
 - Taking interfaces up/down with ``ifdown`` ``ifup``

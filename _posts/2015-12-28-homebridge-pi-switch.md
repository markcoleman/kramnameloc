---
layout: post
title: "Homebridge -> pi-switch"
date: 2015-12-28 21:14:23 -0500
description: "Putting it all together, C LOG 28"
subtitle: "Putting it all together, C_LOG_28"
---
Tonight I put it all together to make a working homebridge setup on the pi to control the relay. 

**pi-switch-plugin**
I took my [led plugin](http://www.kramnameloc.com/control-led-with-homebridge) and adjusted it so it behaves like a switch.

```
var request = require("request");
var Service, Characteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory("homebridge-pi-switch", "PiSwitch", PiSwitch);
}

function PiSwitch(log, config) {
    this.log = log;
    this.config = config;
    this.name = config["name"];

    this.service = new Service.Switch(this.name);
    this.service
        .getCharacteristic(Characteristic.On)
        .on('get', this.getOn.bind(this))
        .on('set', this.setOn.bind(this));
}

PiSwitch.prototype.getOn = function(callback) {
    request.get({
        url: 'http://192.168.1.171:3000/status'
    }, function(err, response, body) {
        var status = body == 'true' ? true : false;
        callback(null, status);
    }.bind(this));
}

PiSwitch.prototype.setOn = function(on, callback) {
    var url = on ? "on": "off";
    request.get({
        url: 'http://192.168.1.171:3000/' + url
    }, function(err, response, body) {
        callback(null, on);
    }.bind(this));
}

PiSwitch.prototype.getServices = function() {
    return [this.service];
}
```

*almost identical to a lightbulb but registers as a switch**

I then installed the plugin via ``npm install -g`` and configured the rest of homebridge like I did [previously](http://www.kramnameloc.com/control-led-with-homebridge). 

**running at startup**
Now that homebridge is setup and working I now need to make sure it runs on startup.  The [guide](https://github.com/nfarina/homebridge/wiki/Running-HomeBridge-on-a-Raspberry-Pi#running-homebridge-on-bootup) on the homebridge site works flawlessly.

*the full script*

```
#!/bin/sh
### BEGIN INIT INFO
# Provides: homebridge
# Required-Start:    $network $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Start daemon at boot time
# Description:       Enable service provided by daemon.
### END INIT INFO

dir="/home/pi"
cmd="DEBUG=* /usr/local/bin/homebridge"
user="pi"
name=`basename $0`
pid_file="/var/run/$name.pid"
stdout_log="/var/log/$name.log"
stderr_log="/var/log/$name.err"

get_pid() {
    cat "$pid_file"
}

is_running() {
    [ -f "$pid_file" ] && ps `get_pid` > /dev/null 2>&1
}

case "$1" in
    start)
    if is_running; then
        echo "Already started"
    else
        echo "Starting $name"
        cd "$dir"
        if [ -z "$user" ]; then
            sudo $cmd >> "$stdout_log" 2>> "$stderr_log" &
        else
            sudo -u "$user" $cmd >> "$stdout_log" 2>> "$stderr_log" &
        fi
        echo $! > "$pid_file"
        if ! is_running; then
            echo "Unable to start, see $stdout_log and $stderr_log"
            exit 1
        fi
    fi
    ;;
    stop)
    if is_running; then
        echo -n "Stopping $name.."
        kill `get_pid`
        for i in {1..10}
        do
            if ! is_running; then
                break
            fi

            echo -n "."
            sleep 1
        done
        echo

        if is_running; then
            echo "Not stopped; may still be shutting down or shutdown may have failed"
            exit 1
        else
            echo "Stopped"
            if [ -f "$pid_file" ]; then
                rm "$pid_file"
            fi
        fi
    else
        echo "Not running"
    fi
    ;;
    restart)
    $0 stop
    if is_running; then
        echo "Unable to stop, will not attempt to start"
        exit 1
    fi
    $0 start
    ;;
    status)
    if is_running; then
        echo "Running"
    else
        echo "Stopped"
        exit 1
    fi
    ;;
    *)
    echo "Usage: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac

exit 0
```

Following the rest of the guide:

```
sudo chmod 755 /etc/init.d/homebridge
sudo update-rc.d homebridge defaults
```

Testing it out.

```
sudo /etc/init.d/homebridge start
```

It is all working!

*mental recap*

 - The project is coming to an end

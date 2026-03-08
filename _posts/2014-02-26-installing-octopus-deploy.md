---
layout: post
title: "Installing Octopus Deploy"
date: 2014-02-26 22:28:39 -0500
description: "Adventures in automated deployment"
subtitle: "Adventures in automated deployment"
---
Now that [I have two VMs setup inside of azure](https://markcoleman.silvrback.com/my-first-azure-vm) it is time to install [Octopus Deploy](http://octopusdeploy.com) to begin my attempt at automated deployment.  I am going to show the basic steps I went through to see if I can figure things out without reading my documentation (for now).

#Install The Server
###License and download
The first thing have to do is get a trial license to octopus so I can install the server. This license was obtained on the website [here](http://octopusdeploy.com/licenses/trial) .  When you submit the form you can download the [server install here](http://octopusdeploy.com/downloads) .

###Run the installer
I like installers like this, no configuration, just a simple install location!

###Getting Started
Now that we have it installed let's see what we need to do next to get things running.  Here are the screens I captured during the server install process.

###Welcome
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/ce2e492f-37cf-4f29-9bf8-a892a787bfb5/01-welcome%20-%20server_large.png)

###License
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/aa53ebf6-6e51-4af3-8b50-3ee36277565f/02-Lic%20-%20Server_large.png)
Simply paste in the license you received via email into the text area.

###Storage
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/c93f8b2a-25d1-4da1-948d-20913f6065f5/03-%20storage%20-%20server_large.png)
I changed the value to ```D:\Octopus``` not really sure why I did this but felt like a good idea.

###Web Portal
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/927bc9f1-8c75-49cb-b25b-b78e33170a89/04-%20portal%20-%20server_large.png)
I left the default settings for the web portal since I have nothing else installed on this fresh azure vm.

###Authentication
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/d07f72ef-27a9-4820-9eac-516046e6cce7/05%20-%20auth%20-%20server_large.png)
Since I have only two simple vms azure I decided to go with the username/password authentication.  When we install this on the production server we will probably leverage active directory.

###Install
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/baf8b73f-6bbf-4a62-b1d8-9ed02786c5c6/06%20-%20install%20-%20server_large.png)
The one thing I thought was interesting is the ability to view the install script which means you must be able to install this via command line which is cool.  

##Manager
After you have it all installed you are presented with a manager window for the Octopus Server.
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/ad255740-8a1d-4827-aae1-34cbe9dd443c/07%20-%20manager%20-%20server_large.png)

Now that we have this installed let's see how we install a tentacle.

#Install A Tentacle
###Download tentacle software
If you go back to the [download page](http://octopusdeploy.com/downloads), download, and install the tentacle.  Once again no configuration during setup, nice!

**Screens captured during the tentacle setup.**

###Welcome
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/4ac09ef2-c01f-406c-b871-ecc248d172f4/08%20-%20welcome%20-%20tent_large.png)

###Storage
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/e7dea5cf-8946-4717-9e8d-90458499b9d1/09%20-%20storage%20-%20tent_large.png)
I let these values as the defaults for now and will need to do a bit more research on what these values mean for a production install.

###Communication
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/8ceae60a-0204-4e1e-906e-a2896747cc3e/10%20-%20comm%20-%20tent_large.png)
This is the one setting I decided to research to understand the difference between listening or polling.  The documentation and install recommends listening as it is less cpu intensive.  Next screen asks for the thumbprint value which can be obtained from the octopus server, so back to the server we go.

###Add Environment on Octopus Server
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/4ae305c2-3b65-424a-9eea-63c0c4c2bc01/11%20-%20add%20env%20-%20server_large.png)
Since this is a fresh install I was able to click on Environment and create an Octopus environment.

###Add Machine to Environment
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/5b8a9302-c23e-4b6e-a689-4fb40608ad22/12%20-%20add%20machine%20-%20server_large.png)
Once I had an environment setup now I need to add a machine to that environment.  This step also displays the thumbprint value mentioned in the tentacle install.

###Back to Tentacle Configuration
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/729a23ba-f324-462a-9a3e-cfe2784a36d4/13%20-%20add%20print%20-%20tent_large.png)
With the newly obtained thumbprint value I pasted the value into the tentacle configuration.

###Install
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/eb76c9f3-bbb1-4d69-bbfc-e0ae7e12c9da/14%20-%20install%20-%20tent_large.png)
Now we are able to install the tentacle configuration.

###Manager
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/b8e96dde-172f-465d-9491-4f0cffab8365/15%20-%20manager%20-%20tent_large.png)
After the configuration is applied we are displayed a similar manager screen for the tentacle.

###Back to Server
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/af66c110-0972-4834-adc4-34043c9967f5/16%20-%20machine%20setting%20-%20server_large.png)
Now that the tentacle is configured I clicked on "Discover" to connect the Server to the Tentacle. **I did run into an error the first time because my fresh VM didn't have the port opened up for the communication from the server to the tentacle.  To fix simply open up Windows Firewall and allow communication over the port you configured**

###Configured
![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/312454be-5b11-4cfc-84dd-56de992b7801/17%20-%20machine%20-%20server_large.png)
It now looks like we have an Octopus Server and one tentacle configured.  This wasn't hard at all.

#Conclusion
So far installation was painless and very straight foreword.  This is the first step for my goal of automated deployment.  Next up let's see what this thing can do, but for now I will consider this a win for tonight!

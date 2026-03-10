---
layout: "post"
title: "I Just Deployed to Azure via Git!"
date: 2014-02-19 20:34:41 -0500
description: "This is automagical"
summary: "This is automagical"
subtitle: "This is automagical"
tags:
  - devops
  - cloud
  - web
---
I know I am a little late to the party but recently started to learn more about azure.  One of the first things I wanted to learn about is how to deploy my site via git.  I saw this in a few demos in the past but decided to do it myself to see how easy or hard this process is to get setup and running with a very basic example.

*The next steps are the raw process I went through to get my sample site setup and configured.*

##Azure
* Log into management portal
* Click websites
* Click Add New
* Click Web Site
* Click Quick Create
* Enter in your custom url
* Select your region from the drop down list
* Select your subscription from the drop down list
* Click  "CREATE WEBSTE ✔"

##GitHub
* Create your git repository
* Create a simple index.html file containing the following

```
<html>
	<head>
		<title>Hello from Azure!</title>
	</head>
	<body>
		<h1>Hello from Azure!</h1>
	</body>
</html>
```

* Commit your change locally and sync to github


##Back to Azure
* Log into the management portal
* Click Websites
* Click the website you want to setup for git deploy
* Go to Quick Glance on the dashboard view (Lower left)
* Select  "→ Setup deployment from source control" 
* Click github
* Authorize your github account
* Select the reposiotry you wish to setup for deployment
* After a few seconds your site will now be live


##Watching the magic
* Make a change to your local repository

```
<html>
	<head>
		<title>Hello from Azure!</title>
	</head>
	<body>
		<h1>Hello from Azure!</h1>
		<p>
			This was published via azure!
		</p>
	</body>
</html>
```

* Sync changes to github
* Go back to the website dashboard and click on the deployment tab
* See the magic, the change was picked up and deployed.

##I Made a Mistake!
* Simple go back into the deployment tab on your website and click on the correct deployed version
* Click  "↶REDEPLOY" (bottom black bar) and your site will be reverted back to the previous state.
* Your site is back to the previous state

#This stuff is magic

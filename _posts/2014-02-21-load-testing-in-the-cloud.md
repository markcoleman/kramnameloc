---
layout: post
title: "Load Testing In The Cloud"
date: 2014-02-21 13:08:37 -0500
description: "Visual Studio Online and TFS makes this process easy."
subtitle: "Visual Studio Online and TFS makes this process easy."
---
Recently I attended an event discussing how to leverage Azure for development and test scenarios.  The event was presented at a high level and covered topics like setting up virtual machines, creating cloud services, web roles, worker roles, and a bit on visual studio online.  The one topic presented about visual studio online was load testing in the cloud.  I dabbled with load testing a few months ago setting up a local agent and local test controllers which was time consuming so making this process easy peaking my interest quickly.

#Setup
- Since we are talking about the cloud, we might as well use the website I setup inside of azure [previously](https://markcoleman.silvrback.com/i-just-deployed-to-azure-via-git).  I did however make a few changes to include a top navigation and a few additional pages so our webtest performs a few actions.
![Website Home](/assets/blog-images/1c709e20863a-ijustdeployed_site_large.png)
- You have access to Visual Studio Online with TFS and connected in Team Explorer
- You can create a Load Test inside of Visual Studio Ultimate

#Creating the WebTest
####Creating the Project
The first thing that we need to do is create the web test. This is accomplished by creating a new "Web Performance Load Test" Project inside of Visual Studio.
![Creating the WebTest](/assets/blog-images/010800a228fa-02-add-webtest_large.png)

####Solution View
Once the project is created you will see one file that ends in ```.webtest```.  This is the file were will create our web test.
![Silvrback blog image](/assets/blog-images/3d94a862ae6d-03-solutionview_large.png)

####Add Recording
Next thing we need to do is create a recording of the actions we want to perform on our web site.  This is done by opening up the ```.webtest``` file and clicking on the "Add Recording" button.
![Silvrback blog image](/assets/blog-images/5c1ad5a78089-04-addrecording_large.png)

####Recording View
Once you clicked on the button Internet Explorer will launch with an add-on enabled that tracks your actions.  (If this is not shown make sure the add-on is enabled inside of Internet Explorer)
![Silvrback blog image](/assets/blog-images/0c05cf67ad90-05-recordingview_large.png)

####Recording Output
After you are done recording your actions click stop recording in the add-on and you will return to the ```.webtest``` file.  Looking over the file you will see all the actions that you performed on the website.
![Silvrback blog image](/assets/blog-images/34f05ae07fe3-06-recordingoutput_large.png)

####Running Local
Before we start running our load test it is a good idea to verify that your webtest functions correctly and run the test locally.  
![Silvrback blog image](/assets/blog-images/d02393ee1f7d-07-runninglocal_large.png)

#Create Load Test
####Add LoadTest
Now that we see the webtest is validated we need to add a "Load Test".  This is done by adding a new file to your project.
![Silvrback blog image](/assets/blog-images/2902c0973eab-08-add-load-test_large.png)

####Add Load Test Dialog
After the load test is added to your project you will be presented with a dialog to configure your test.  We are only concerned about a few items in this test.
![Silvrback blog image](/assets/blog-images/3737ac2e4e0a-09-load-test-dialog_large.png)

####Change Step Load
One of the options we want to alter is the load we are going to put on our site.  I decided to do a Step Load which starts at 10 users and steps up every 10sec by 10 users until a maximum of 200 concurrent users.
![Silvrback blog image](/assets/blog-images/35ea82753700-10-change-step-load_large.png)

####Add Web Test
The next part and the most important part is adding in your webtest to your load test.  You can add in multiple web tests but since we only created one we only have access to this one webtest.
![Silvrback blog image](/assets/blog-images/9808c5810769-11-add-web-test_large.png)

####Duration
I also decided to change the duration to 5minutes so we can capture data inside of the portal while the load test is running.
![Silvrback blog image](/assets/blog-images/9a4e71683635-12-duration_large.png)

####Load Test
After you have all the settings changed you can see the configuration tree in the load test file inside of visual studio.
![Silvrback blog image](/assets/blog-images/64f3056c053c-13-load-test_large.png)

#Configure for the Cloud
####Add Test Settings
Next we need to create a separate "Test Settings" file so we can configure our load test to run on Visual Studio Online.
![Silvrback blog image](/assets/blog-images/73f787f8ff0a-14-add-test-settings_large.png)

####Change Test Settings
The most important setting we need to change is to select the radio button to "Run tests using Visual Studio Team Foundation Service"  After that selection is made you can click apply and close down the dialog.
![Silvrback blog image](/assets/blog-images/b60116a01782-15-run-tests-using-visual-studio-team-foundation-service_large.png)

####Select Load Test Settings
Now that we have our Tests Settings we need to tell the Load Test to use this file.  This is done by clicking on "Load Test" and selecting the new test settings file.
![Silvrback blog image](/assets/blog-images/36a0dd40083d-16-select-load-test-settings-file_large.png)

#Running Your Test
####Run Load Test
We are now ready to get started by clicking on Run under "Load Test"
![Silvrback blog image](/assets/blog-images/e6acdf6361f2-17-run-load-test_large.png)

####Load Test is Running
At first your load test will be queued for execution and after a few moments your test will begin running.
![Silvrback blog image](/assets/blog-images/bf035df38033-18-it-is-running_large.png)

####View in Dashboard
If you go into the portal inside of Azure and select your website you can see the results of your currently running load test.
![Silvrback blog image](/assets/blog-images/9c8e5a2c4a20-19-view-in-dashboard_large.png)

####LoadTest Results
After the test is complete a report is generated that you can use to view various stats and any errors that were encountered during the test.
![Silvrback blog image](/assets/blog-images/2d495d438a37-20-load-results_large.png)

#Conclusion
Once again Azure and Visual Studio Online makes this process painless.  If you have access to these tools in our organization there the reasons to contract with an outside load test vendor decrease greatly.

[Further Reading on visualstudio.com](http://www.visualstudio.com/en-us/get-started/load-test-your-app-vs.aspx)

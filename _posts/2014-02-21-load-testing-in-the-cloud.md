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
![Website Home]({{ '/assets/blog-images/2014-02-21-load-testing-in-the-cloud/01-ijustdeployed_site_large.png' | relative_url }})
- You have access to Visual Studio Online with TFS and connected in Team Explorer
- You can create a Load Test inside of Visual Studio Ultimate

#Creating the WebTest
####Creating the Project
The first thing that we need to do is create the web test. This is accomplished by creating a new "Web Performance Load Test" Project inside of Visual Studio.
![Creating the WebTest]({{ '/assets/blog-images/2014-02-21-load-testing-in-the-cloud/02-02-add-webtest_large.png' | relative_url }})

####Solution View
Once the project is created you will see one file that ends in ```.webtest```.  This is the file were will create our web test.
![Silvrback blog image]({{ '/assets/blog-images/2014-02-21-load-testing-in-the-cloud/03-03-solutionview_large.png' | relative_url }})

####Add Recording
Next thing we need to do is create a recording of the actions we want to perform on our web site.  This is done by opening up the ```.webtest``` file and clicking on the "Add Recording" button.
![Silvrback blog image]({{ '/assets/blog-images/2014-02-21-load-testing-in-the-cloud/04-04-addrecording_large.png' | relative_url }})

####Recording View
Once you clicked on the button Internet Explorer will launch with an add-on enabled that tracks your actions.  (If this is not shown make sure the add-on is enabled inside of Internet Explorer)
![Silvrback blog image]({{ '/assets/blog-images/2014-02-21-load-testing-in-the-cloud/05-05-recordingview_large.png' | relative_url }})

####Recording Output
After you are done recording your actions click stop recording in the add-on and you will return to the ```.webtest``` file.  Looking over the file you will see all the actions that you performed on the website.
![Silvrback blog image]({{ '/assets/blog-images/2014-02-21-load-testing-in-the-cloud/06-06-recordingoutput_large.png' | relative_url }})

####Running Local
Before we start running our load test it is a good idea to verify that your webtest functions correctly and run the test locally.  
![Silvrback blog image]({{ '/assets/blog-images/2014-02-21-load-testing-in-the-cloud/07-07-runninglocal_large.png' | relative_url }})

#Create Load Test
####Add LoadTest
Now that we see the webtest is validated we need to add a "Load Test".  This is done by adding a new file to your project.
![Silvrback blog image]({{ '/assets/blog-images/2014-02-21-load-testing-in-the-cloud/08-08-add-load-test_large.png' | relative_url }})

####Add Load Test Dialog
After the load test is added to your project you will be presented with a dialog to configure your test.  We are only concerned about a few items in this test.
![Silvrback blog image]({{ '/assets/blog-images/2014-02-21-load-testing-in-the-cloud/09-09-load-test-dialog_large.png' | relative_url }})

####Change Step Load
One of the options we want to alter is the load we are going to put on our site.  I decided to do a Step Load which starts at 10 users and steps up every 10sec by 10 users until a maximum of 200 concurrent users.
![Silvrback blog image]({{ '/assets/blog-images/2014-02-21-load-testing-in-the-cloud/10-10-change-step-load_large.png' | relative_url }})

####Add Web Test
The next part and the most important part is adding in your webtest to your load test.  You can add in multiple web tests but since we only created one we only have access to this one webtest.
![Silvrback blog image]({{ '/assets/blog-images/2014-02-21-load-testing-in-the-cloud/11-11-add-web-test_large.png' | relative_url }})

####Duration
I also decided to change the duration to 5minutes so we can capture data inside of the portal while the load test is running.
![Silvrback blog image]({{ '/assets/blog-images/2014-02-21-load-testing-in-the-cloud/12-12-duration_large.png' | relative_url }})

####Load Test
After you have all the settings changed you can see the configuration tree in the load test file inside of visual studio.
![Silvrback blog image]({{ '/assets/blog-images/2014-02-21-load-testing-in-the-cloud/13-13-load-test_large.png' | relative_url }})

#Configure for the Cloud
####Add Test Settings
Next we need to create a separate "Test Settings" file so we can configure our load test to run on Visual Studio Online.
![Silvrback blog image]({{ '/assets/blog-images/2014-02-21-load-testing-in-the-cloud/14-14-add-test-settings_large.png' | relative_url }})

####Change Test Settings
The most important setting we need to change is to select the radio button to "Run tests using Visual Studio Team Foundation Service"  After that selection is made you can click apply and close down the dialog.
![Silvrback blog image]({{ '/assets/blog-images/2014-02-21-load-testing-in-the-cloud/15-15-run-tests-using-visual-studio-team-foundation-service_large.png' | relative_url }})

####Select Load Test Settings
Now that we have our Tests Settings we need to tell the Load Test to use this file.  This is done by clicking on "Load Test" and selecting the new test settings file.
![Silvrback blog image]({{ '/assets/blog-images/2014-02-21-load-testing-in-the-cloud/16-16-select-load-test-settings-file_large.png' | relative_url }})

#Running Your Test
####Run Load Test
We are now ready to get started by clicking on Run under "Load Test"
![Silvrback blog image]({{ '/assets/blog-images/2014-02-21-load-testing-in-the-cloud/17-17-run-load-test_large.png' | relative_url }})

####Load Test is Running
At first your load test will be queued for execution and after a few moments your test will begin running.
![Silvrback blog image]({{ '/assets/blog-images/2014-02-21-load-testing-in-the-cloud/18-18-it-is-running_large.png' | relative_url }})

####View in Dashboard
If you go into the portal inside of Azure and select your website you can see the results of your currently running load test.
![Silvrback blog image]({{ '/assets/blog-images/2014-02-21-load-testing-in-the-cloud/19-19-view-in-dashboard_large.png' | relative_url }})

####LoadTest Results
After the test is complete a report is generated that you can use to view various stats and any errors that were encountered during the test.
![Silvrback blog image]({{ '/assets/blog-images/2014-02-21-load-testing-in-the-cloud/20-20-load-results_large.png' | relative_url }})

#Conclusion
Once again Azure and Visual Studio Online makes this process painless.  If you have access to these tools in our organization there the reasons to contract with an outside load test vendor decrease greatly.

[Further Reading on visualstudio.com](http://www.visualstudio.com/en-us/get-started/load-test-your-app-vs.aspx)

---
title: Deploying scripts using ConfigMgr
date: 2023-03-24
lastModified: 2023-03-24
author: Scott McAllister
tags:
  - ConfigMgr
  - Intune
  - Scripts
draft: false
---

**Check out how to deploy scripts to your devices through ConfigMgr**

At the time of writing this, ConfigMgr 2211 has a bug where you cannot add scripts. So the following screenshots are from CM2203, and I'll update them when the bug is resolved - [Twitter post](https://twitter.com/ScotScottMcA/status/1639226559218298880)


Deploying custom scripts in ConfigMgr isn't necessarily the most difficult thing, but the first time you do something it can maybe be daunting. In this post, we'll go through how to add and run a custom PowerShell script on your devices using ConfigMgr

Using ConfigMgr to run PowerShell scripts against your devices allows you to easily automate tasks that may otherwise take considerable amounts of time and effort to do manually. 

ConfigMgr will show allow you to manage these scripts through the use of roles and security scopes as well as monitor the execution of your scripts against your devices. 

![Script Approval Warning](/images/ConfigMgr-Scripts/Script_Approval_Warning.png)

## Prerequisites

- PowerShell 3.0 or later
- ConfigMgr client 1706 or later
- Using scripts requires you to be a member of the appropriate ConfigMgr security role
    - Importing and Authoring scripts require the **Create**** permission for **SMS Scripts**
    - Approval and Denying of scripts requires the **Approve** permission for **SMS Scripts**
    - Running scripts requires the **Run Script** permission for **Collections**

**It is possible to allow users to approve their own scripts. This is not best practice and should only be used in a lab environment, I'll cover how to achieve this later.**

## Actually do something cool!

Now that that's all out of the way, Let's import a script and deploy it to our clients.

In this short gif, we can see how quickly you can import a script into ConfigMgr and have it approved for deployment.

![Script Gif](/images/ConfigMgr-Scripts/SCCM_Script.gif)

How to do it, step by step

In this example, we will be using a [script](https://github.com/PatchMyPCTeam/Community-Scripts/blob/main/Uninstall/Pre-Uninstall/Uninstall-Software/Uninstall-Software.ps1) written by [Adam Cook](https://twitter.com/codaamok) which "*searches the registry for installed software, matching the supplied DisplayName value in the -DisplayName parameter with that of the DisplayName in the registry. If one match is found, it uninstalls the software using the UninstallString.*"


## Create Script
Firstly, we want to navigate to the **Software Library** view > **Scripts** then right-click and click **Create Script**

![Create Script](/images/ConfigMgr-Scripts/1_Create_Script.png)

On the Create Script screen, we will 
- Provide a Script Name (How it will be named in ConfigMgr, this does not need to be the name of the script)
- A description of the purpose of the script
- The script language (we'll stick with PowerShell for now) 
- Import the script. 
After this, We will be prompted to specify any script parameters that ConfigMgr has detected in our script. 
- Here, all we are concerned with is DisplayName. Architecture and HivesToSearch are set by default but can be changed if needed. 

![Import Script](/images/ConfigMgr-Scripts/2_3_Import_Script.png)

As mentioned previously, there is a bug in 2211 that stops you from creating scripts within ConfigMgr. Because of that, these screenshots are taken from CM2203 which means the option for Script Timeout Seconds is not visible, but in CM2211 you can use this option to specify a timeout value to monitor script execution status, between 60 and 1800 seconds.

![Import Script Timeout](/images/ConfigMgr-Scripts/2_Import_Script_Timeout.png)

Summary, Progress and Details just confirm all the information you entered previously, as well as whether or not creating your script was successful. 
Provided it completes successfully we can move on. 

![Script Summary](/images/ConfigMgr-Scripts/4_5_Script_Summary.png)

## Approve or Deny Script
Script approval is where we will circle back to talking about approving your scripts. 
By default this is disabled in ConfigMgr, You must ensure that someone in your organization has the **Approve** permission for **SMS Scripts** or disable the option that stops you from approving them yourself. 

As you can see here, I cannot currently approve my script so the Approve/Deny button is greyed out. 
To allow self-approval, Navigate to **Administration** > **Site Configuration** > **Sites** > **Hierarchy Settings** and untick **Script authors require additional script approver**

![Script Approver Optional](/images/ConfigMgr-Scripts/7_Script_Approver_Optional.png)

Now, after navigating back to the **Software Library** and **Scripts**, I can approve my own script. 

![8 Approve Script](/images/ConfigMgr-Scripts/8_Approve_Script.png)

The Approve or Deny Script wizard shows us the same screens as shown during the Create Script process, but we're just reviewing this time to ensure everything entered checks out. 

![pprove Script](/images/ConfigMgr-Scripts/9_10_Approve_Script.png)

You can then decide whether or not to Approve or Deny, and leave a nice wee message with it. 

![Approve Deny](/images/ConfigMgr-Scripts/11_12_Approve_Deny.png)

## Run Script
When it comes to running our newly created script, we can either run it against a collection, a selection of devices or a single device. For now, let's look at a collection!

Let's navigate to **Assets and Compliance** > **Device Collections** > right-click on the device collection you wish to run this script against and select **Run Script**

![un Script](/images/ConfigMgr-Scripts/13_Run_Script.png)

Select the script which you wish to run, in this case, Uninstall-Software and Confirm the script parameters on the next screen

![Select Script](/images/ConfigMgr-Scripts/14_15_Select_Script.png)

You will then be presented with the Script Status window, which will show you the results of the script being run against the devices in the selected collection. 

![Script Status](/images/ConfigMgr-Scripts/16_Script_Status.png)

And if we watch a client device with Google Chrome installed, we can see in script.log that the script runs, we see Chrome be uninstalled and the results sent back to CM. 

![Client Script](/images/ConfigMgr-Scripts/Client_Script.gif)

Just like that, you've removed Chrome from all your devices!

-----

## Gotchas

I encountered an issue on my client when watching scripts.log, I could see the following error presented. 

![Parameter hash verification](/images/ConfigMgr-Scripts/Parameter_hash_verification_2.png)

After some reading I found this in the Microsoft documentation

![Parameter hash verification](/images/ConfigMgr-Scripts/Parameter_hash_verification_3.png)

From this, I modified the Script Parameters and reapproved my script 

![Parameter hash verification](/images/ConfigMgr-Scripts/Parameter_hash_verification_1.png)

-----

## What's next?
There will be part 2 of this, showing you how to do the same thing but using Intune instead of ConfigMgr. 

-----

Want to see something else added? <a href="https://github.com/smcallister594/scotscottmca/issues/new">Open an issue.</a>
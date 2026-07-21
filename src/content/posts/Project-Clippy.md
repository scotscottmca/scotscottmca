---
title: MEM Patching Optimizer (Project Clippy)
date: 2023-01-05
lastModified: 2023-01-06
author: Scott McAllister
tags:
  - WSUS
  - ConfigMgr
  - Patch My PC
  - 3rd Party Updates
draft: false
---

**Check out this cool tool I helped write that tells you what's wrong with your WSUS configuration and how to fix it**

This is a follow up post to the one I wrote for Patch Tuesday [MEM Patching Optimizer (Project-Clippy)](https://patchtuesday.com/project-clippy/) and talks about my personal experience with this project

To keep things simple, I'll refer to MEM Patching Optimizer as MEMPO. 

I've always had an interest in writing code, automation and writing my own apps but I never really had the drive or motiviation to do it until I started working at Patch My PC. 

After expressing an interest in it to [David James](https://twitter.com/djammmer) he came up with the idea of a tool that takes the most common issues we see in customer environments and writing a tool that finds those issues, reports on them and eventually offers remediation, Kind of like a "clippy" for WSUS (hence the name, Project Clippy). 2 other Patch My PC Engineers, [Priscilla](https://twitter.com/LearnLeon) and [Spencer](https://twitter.com/OGTekie), had expressed interest in development as well so we got together every week, planned things out, talked about ideas and made a tonne of notes on how we would do what we wanted to do. 

All this led me to sink numerous hours into various different rabbit holes and had me waking up at 3am with a eureka! moment more times than I care to admit and I sort of ran away with this project and its been a bit of a rollercoaster for me but I feel I've learned quite a lot over the last 4-5 months about coding and WSUS!

The very first working iteration of the tool was far from pretty, just a simple winform with a pile of code behind it, but it worked and it was a start. 

**v0.1**
![v0.1](/images/project-clippy/v1-3.png)

**v0.?** *(I can't remember which version this was but it was > v0.1 but < v1.0)*
![v0.?](/images/project-clippy/v1-2.png)

Then I was introduced to MVVM and WPF by [Cody Mathis](https://twitter.com/CodyMathis123) and [Ben Reader](https://twitter.com/powers_hell), and I can safely say I hate and love them both equally for it. 

![breath](/images/project-clippy/breath.gif)

I tried to dive head first into MVVM and WPF by migrating what I had done already in winforms and after about a week of firefighting I deleted all the code I'd written and start from scratch and here we are, MEMPO is now v1.1.0.0 and looks a dam sight better than its first iteration

![clippy](/images/project-clippy/clippy.gif)

## **What does it do**
A whole load of things, Run it and see! :)

![doit](/images/project-clippy/doit.gif)

### **Tests**
Starting off by taking the most common things we saw wrong in enviornments, they were turned them into tests

At the time of writing this, the test list is as follows

- Test SUSDB Response Time
- Check that nclLocalizedPropertyID & nclSupercededUpdateID Indexes exist in SUSDB
- Validating the WSUSContent directory
- Validating WSUSContent and UpdateServicesPackages permissions
- Checking that the WSUS App Pool is running
- Ensuring your WSUS App Pool advanced settings match the Microsoft recommended configuration
- Checking that the total number of superseded & undeclined updates are within the Microsoft recommended limit
- Validate that your IIS WSUSContent directory has the correct authentication configured
- Checking WSUS is still on a supported version

More information on these tests can be found [here](https://patchtuesday.com/project-clippy/)

All these tests have predefined, expected results, based on Microsofts best practices and the appropriate documentation for each test is linked in with the results. 

Some of these tests may not be applicable to your environment but they have been generalised as much as possible as every environment is different and all those differences can't really be accoutned for. 

### **Logging**
Initally I had everything writing out to the UI, that included test results and full error traces. The error traces quickly became annoying and provided no real value within the UI so to tidy that up I added a log writer and threw all those error traces, test results and everything the tool does into a neat little log file!

![logfile](/images/project-clippy/logfile.png)

As you can see in the above screenshot, log lines have their severity tagged (Informational, Warning & Error) so that CMTrace highlights them accordingly. 


### **Continuous development**
Adding more features, tests and bug fixes has been an ongoing task in my spare time, and I don't have an plans to slow down on this tool either!

v1.1.0.0 which was released on 3rd Jan 2023 had some nice new featuers in it! 
- Added Warning as test result
    - Initially MEMPO only had Failed and Passed Tests but not all tests that fail mean they need fixed, for example Ping being enabled is more of a warning. So I added in Warning as a test result.
- Added option to export test results to CSV
    - Exporting test results to CSV lets you keep a track of the tests you have ran previously
- Added support for WID hosted SUSDB
    - Initially I stuck to just SQL hosted SUSDB's because SQL was all I knew. Once I learned that all the queries were exactly the same for WID I added WID support. If you are using WID, MEMPO auto detects your WID version and the connection string for you. 
- Added logging, Log now writes out to install directory
    - As mentioned previously, everything was just written out to the UI, it was messy and difficult to read at times. MEMPO now writes out to a log file which shows all the error messages, test names, test results and all other relevant things

### **Staying up to date**
MEMPO has a built in updater to help keep it up to date! Any time you click "About", MEMPO will reach out to GitHub to check if there is a newer production release available, and if there is it will give you the option to download and install, as well as link you out to the release notes!

In the next release, the updater will poll each time MEMPO starts and notify you of new releases as well, but ensuring the updater was at least there was required for v1.0

## **The future**
I have a list of maybe 20-30 additional tests to add to MEMPO, which will include some pre-flight checks specific to the Patch My PC Publisher. Some of those new tests include

- Support for environments running multiple WSUS servers
    - scan multiple WSUS Servers at once, rather than installing MEMPO on multiple servers.
- Dark Mode
- Running individual tests / Selecting which tests to run
- Check SUP for unsupported & duplicate products
- Remediation of found issues
    - This is the biggest one!
- Determine if system resources are sufficient

This is just a few of the ones I have noted down, and the full list isn't definitive so if you have any ideas or feedback just reach out to me :)

## **Logging an issue**
You can log issues with the MEM Patching Optimizer through its [GitHub page](https://github.com/PatchMyPCTeam/MEM-Patching-Optimizer/issues)

## **Documentation**
All documentation around installation and usage can be found on the [Patch My PC Docs page](https://docs.patchmypc.com/get-help/mem-patching-optimizer/)

## **Download**
You can get the latest release of the MEM Patching Optimizer [here](https://github.com/PatchMyPCTeam/MEM-Patching-Optimizer/releases/latest)

## **The End**
That's pretty much it! If you want to know more, hit me up on [Twitter](https://twitter.com/ScotScottMcA)

Just want to add an extra thank you to Ben and Cody for answering my "5 minute questions" that turned into multiple hour long conversations, telling me I'm a sausage when I was over-complicating something and just generally helping me along in this rollercoaster of a ride. 

And thanks to everyone else at Patch My PC for their input, support and interest in seeing MEMPO become a thing! It's definitely helped keep me motivated in working on this!

![salute](/images/project-clippy/salute.gif)
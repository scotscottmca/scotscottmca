---
title: Sleeping 120 More Seconds
date: 2023-10-18
lastModified: 2023-10-18
author: Scott McAllister
tags:
  - ConfigMgr
  - WSUS
  - wsyncmgr
  - software update point
  - SUP Sync
draft: false
---

## Snooze

![snooze](/images/Sleeping120MoreSeconds/snooze.gif)

While this post isn't about how you could sleep 120 more seconds, it may actually help you fall asleep. 

## WSUS Sync Manager

This is a bit of a personal one, because I've been really invested in it. 

For the last few years, Something that has always annoyed me was waiting for a SUP sync to finish, seeing "Sleeping 120 more seconds" in the wsyncmgr.log and just having to wait for it, never really knowing what it's actually doing during that snooze.

![Sync Grace Period Default](/images/Sleeping120MoreSeconds/SyncGracePeriod_Default.png)

I poked around at it a bit, tried to monitor SUSDB for changes and Procmon for file changes, as well as asking some colleagues if they had any insight. 
But at the end of the day, it was just a thing that happened and that was that. 

But everytime I saw it, I always wondered what it was actually doing. 

## Finding The Answer

It was suggested that I ask Meghan Stewart ([@WSUSN3RD](https://x.com/WSUSN3RD)), THE WSUS Nerd. Because if anyone was going to know it would probably be her. 

So I reached out to her, piqued her curiosity and she delivered. 

Sometime back around 2007~ the sleep was added purely to make sure that WSUS had enough time to finish processing new updates post-sync so that it could make them available, especially for underspecced WSUS servers. 

And that's it. All this time wondering about it and it is literally just taking a wee nap. 

![nap](/images/Sleeping120MoreSeconds/nap.gif)

## Brucie Bonus

![surprise](/images/Sleeping120MoreSeconds/surprise.gif)

Meghan shared with me that it is actually possible to configure the length of time the WSUS Sync Manager sleeps for, not that you should though. 120 seconds is usually enough. 

Anoop actually mentioned this in a blog post about partial WSUS Sync issues back in 2014, but I haven't found many other references to changing it really. [Anoop C Nair - Fix SCCM Management Pont MP Rotation Issue Partial WSUS Sync Issue](https://www.anoopcnair.com/sccm-mp-rotation-issue-sup-rotation-fix/). 

To make the sleep longer, all that is needed is a registry key addition! 

By default, the required key does not exist, which makes it default to 120 seconds (120000 Milliseconds).

![Sync Grace Period Default Registry](/images/Sleeping120MoreSeconds/SyncGracePeriod_Default_Registry.png)

We can add in this key and make it shorter or longer! 

You want to add a DWORD key called SyncGracePeriod here, **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\SMS\COMPONENTS\SMS_WSUS_SYNC_MANAGER**, and give it a millisecond decimal value equating to the length of time you want to sleep to be. 

Here you can see it set to 10 minutes!

![Sync Grace Period 10 Minutes Registry](/images/Sleeping120MoreSeconds/SyncGracePeriod_10_Minutes_Registry.png)

![Sync Grace Period 10 Minutes Log](/images/Sleeping120MoreSeconds/SyncGracePeriod_10_Minutes_Log.png)

10 minutes is the maximum, and 2 minutes is the minimum, so you can't get too wild with it and if you try to it will complain and default back to 120 seconds. 

![Sync Grace Period Max](/images/Sleeping120MoreSeconds/SyncGracePeriod_Max.png)

Annnnnnnnnnnnnd that's that. 

A few of us at Patch My PC were super invested in this, and the idea of some super niche stickers was float. 

So, we did. 

![Sticker](/images/Sleeping120MoreSeconds/Sticker.png)

If you ever see me, and want one, just ask! 

## Summary

![sleep](/images/Sleeping120MoreSeconds/sleep.gif)
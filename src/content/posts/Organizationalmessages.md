---
title: Using Organizational messages to interact with with your users
date: 2023-08-07
lastModified: 2023-08-07
author: Scott McAllister
tags:
  - Intune
  - Organizational Messages
  - Notifications
  - Endpoint
  - Windows 11
draft: false
---

## Using Organizational messages to interact with with your users

Throughout the years of being a SysAdmin, I regularly saw weird and horrifying ways to display notifications to users; usually revolving around VB logon scripts and scheduled tasks :nauseated_face:

You can also display notifications with PowerShell, I'll share some really useful blogs related to PowerShell notifications at the end.

Let's talk about Organizational messages.

## What are Organizational messages? 

Well, they're a pretty cool feature that let's you get information out to targetted users easier by displaying branded content in visible areas of the desktop.

Currently, There are 3 areas you can display messages; The Taskbar, The Notification area and the Getting Started App. 

## Prerequisites
Before we dive into the 3 areas, you will need to check a few prerequisites to ensure you can make use of Organizational messages.

[Link to Organizational message settings](https://endpoint.microsoft.com/#view/Microsoft_Intune_DeviceSettings/TenantAdminMenu/~/message)

![Organizational Messages Start](/images/Organizationalmessages/Organizationalmessagesstart.png)

### Licencing
The licence types that allow the use of Organizational messages are:
- Microsoft 365 E3
- Microsoft 365 E5
- Windows 10/11 Enterprise E3 with Intune Plan 1
- Windows 10/11 Enterprise E5 with Intune Plan 1.

### Organizational messages delivery policy
There are certain experience and Windows Spotlight policies in Microsoft Intune that block the delivery of organizational messages. You will want to review the Microsoft documentation on enabling the relevant policies - [Policy documentation](https://learn.microsoft.com/en-gb/mem/intune/remote-actions/organizational-messages-prerequisites#policy-requirements)

### Microsoft messages
You get to decide whether or not to allow Microsoft messages to be shown - [Microsoft messaging policy](https://learn.microsoft.com/en-gb/mem/intune/remote-actions/organizational-messages-prerequisites#policy-requirements)

### OS version
Organizational messages are supported on devices running Windows 11, version 22H2 or later.

### Branding
You'll need three sizes of logo, in PNG format with transparent backgrounds:
- 48 x 48 pixels used for messages in the Notifications area
- 64 x 64 pixel images used for messages attached to the Taskbar
- 50 x 50-100 pixels used for Get Started app messages

## Lets look at the areas

### The Taskbar & Notificaiton area
We'll look at these 2 areas together, as they're almost identical for configuration. 
| Taskbar | Notification area |
| ------ | ----------- |
| ![](/images/Organizationalmessages/Taskbar_1.png)   | ![](/images/Organizationalmessages/NotificationArea_1.png) |

#### Themes
When creating your Taskbar or Notification area message you can choose a theme, each theme has a slightly different look & feel for displaying different information.
- Taskbar
    - Mandatory update
    - Security update
    - Important action
    - Important information
    - Key meeting
    - Latest video
    - Leadership updates
    - Team updates
    - Planned outage
- Notification area
    - Organizational HR training
    - Organizational skills training
    - Organizational training
    - Organizational update
    - Update browser
    - Update device

#### Scheduling
Scheduling the notifications is fairly simple, with only 3 options. 

> 💡 **Note**
>
> Messages may start delivering up to 24 hours after scheduling.


| Option | Description |
|:------:| -----------|
| First day to show message | You need to finish creating your message at least 1 day before this date. |
| Last day to show message | Last day to show message (must be at least 7 days after start date) |
| Message repeat frequency | The message appears for the entire time until the user takes the recommended action.<br/> If they dismiss the message, it will reappear according to the frequency you select. |

### The Getting Started App

The Getting Started app is slightly different to the Taskbar and Notification areas because it is only ever shown the first time a user runs it after their device is enrolled in Intune. It's really useful for welcoming new users to your organizations, as you can send them information on getting started, useful apps, policies and tips. They are also links to help them personalize their device and setting up their profile.  

> 💡 **Note**
>
> The app automatically opens during the first seven days after a device is enrolled. Message stay visible for 30 days.


<!-- ![image](https://github.com/smcallister594/scotscottmca/blob/main/assets/images/Organizationalmessages/GetStartedApp.png?raw=true) -->
![Getting Started App](/images/Organizationalmessages/GetStartedApp_1.png)

#### Messages
You're able to add 2 messages to the Getting Started App, each of which will require a URL to redirect to.
- First Message
    - Review benefits
    - Review organization
    - Get started with device
- Second message
    - Organizational training
    - Organization policies
    - Help resources
    - Update VPN

## What now?

Well once your Organizational messages are out in the wild, you can see their stats, which is kinda neat! The Organizational messages dashboard will show you things like
- Message type
- Message theme
- Status
- Times shown
- Times clicked
- Click-through rate

![Organizational Messages Dashboard](/images/Organizationalmessages/Organizationalmessagesdashboard.png)

## Additional resources

While Organizational messages are limited to just Windows 11, you are still able to deploy toast notifications to your Windows 10 & 11 devices using PowerShell. Here are some great blog posts that talk about that process

- [ByteBen - Deploy Service Announcement Toast Notifications in Windows 10 with MEMCM](https://byteben.com/bb/deploy-service-announcement-toast-notifications-in-windows-10-with-memcm/)
- [MSEndpoint Manager - Proactive Remediations - Getting your messages across with repeated Toast Notifications](https://msendpointmgr.com/2021/06/06/proactive-remediations-getting-your-message-across-with-repeated-toast-notifications/)
- [imab.dk - Windows 10 Toast Notification Script](https://www.imab.dk/windows-10-toast-notification-script/)

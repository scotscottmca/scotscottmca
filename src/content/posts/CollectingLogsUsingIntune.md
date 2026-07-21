---
title: Collecting logs using Intune
date: 2023-07-13
lastModified: 2023-07-13
author: Scott McAllister
tags:
  - Intune
  - Error Codes
  - logs
  - log collection
  - graph api
  - graph
draft: false
---

## Why do we need logs?

In many support roles, when troubleshooting an issue, logs are critical, especially troubleshooting Intune-related issues.

My day-to-day role sees me looking at logs for Intune-managed devices, and Win32 Apps, and collecting those logs can be a pain for the admins I speak with for various reasons.

- The device is offline
- The user is "busy."
- No remote access to the device
- [Insert other generic reason here]

It may seem reasonable to say, "X isn't working" or "Y gives me an error message", but these statements are not always helpful without the context provided by log files. Log files give us a detailed view of most things that happened in the run-up to the error and potentially a more helpful error message than was presented to a user. 

Thankfully Intune provides us with a handy Collect diagnostics button that remedies most of these. 

## Where can you find Collect diagnostics?

You can find the Collect diagnostics button under Devices > Windows > [device name]
![Collect Diagnostics](/images/CollectDiagnostics/CollectDiagnostics_1.png)

When you click Collect diagnostics, you will be prompted to confirm that you want to proceed, and informed that you can see the progress of your diagnostic collection under Monitor > Device diagnostics
![Collect Diagnostics](/images/CollectDiagnostics/CollectDiagnostics_2.png)

![Collect Diagnostics](/images/CollectDiagnostics/CollectDiagnostics_3.png)

> 💡 **Note**
>
> Collect diagnostics can take anywhere between 5 and 20 minutes to complete.


Once the diagnostic results are availalbe, you'll be presented with a download button

![Collect Diagnostics](/images/CollectDiagnostics/CollectDiagnostics_4.png)

## What does Collect diagnostics give me?

Well, once we've downloaded our diagnostic bundle, we can see a whole host of data that has been collected. If we open up results.xml, we get a complete list.

```XML
<Collection HRESULT="0">
<ID>d88051d0-acce-41e7-a7ce-d864a753e2c7</ID>
    <SasUrl>SasUrlPlaceHolder</SasUrl>
    <RegistryKey HRESULT="-2147024893">HKLM\SOFTWARE\Microsoft\CloudManagedUpdate</RegistryKey>
    <RegistryKey HRESULT="-2147024895">HKLM\SOFTWARE\Microsoft\EPMAgent</RegistryKey>
    <RegistryKey HRESULT="-2147024893">HKLM\Software\Microsoft\IntuneManagementExtension</RegistryKey>
    <RegistryKey HRESULT="-2147024893">HKLM\SOFTWARE\Microsoft\SystemCertificates\AuthRoot</RegistryKey>
    <RegistryKey HRESULT="-2147024893">"HKLM\SOFTWARE\Microsoft\Windows Advanced Threat Protection"</RegistryKey>
    <RegistryKey HRESULT="-2147024893">"HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\AppCompatFlags"</RegistryKey>
    <RegistryKey HRESULT="-2147024893">"HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon"</RegistryKey>
    <RegistryKey HRESULT="-2147024893">HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Authentication\LogonUI</RegistryKey>
    <RegistryKey HRESULT="-2147024893">HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\CloudExperienceHost</RegistryKey>
    <RegistryKey HRESULT="-2147024893">HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\DeviceAccess</RegistryKey>
    <RegistryKey HRESULT="-2147024893">"HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Internet Settings"</RegistryKey>
    <RegistryKey HRESULT="-2147024895">HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\NDUP</RegistryKey>
    <RegistryKey HRESULT="-2147024893">HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\OOBE</RegistryKey>
    <RegistryKey HRESULT="-2147024893">HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Setup</RegistryKey>
    <RegistryKey HRESULT="-2147024893">HKLM\Software\Microsoft\Windows\CurrentVersion\Uninstall</RegistryKey>
    <RegistryKey HRESULT="-2147024893">HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Orchestrator</RegistryKey>
    <RegistryKey HRESULT="-2147024893">HKLM\Software\Policies</RegistryKey>
    <RegistryKey HRESULT="-2147024893">HKLM\SOFTWARE\Policies\Microsoft\Cryptography\Configuration\SSL</RegistryKey>
    <RegistryKey HRESULT="-2147024893">"HKLM\SOFTWARE\Policies\Microsoft\Windows Advanced Threat Protection"</RegistryKey>
    <RegistryKey HRESULT="-2147024893">HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall</RegistryKey>
    <RegistryKey HRESULT="-2147024893">HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL</RegistryKey>
    <RegistryKey HRESULT="-2147024893">HKLM\SYSTEM\CurrentControlSet\Services\SharedAccess\Parameters\FirewallPolicy\MDM</RegistryKey>
    <RegistryKey HRESULT="-2147024893">HKLM\SYSTEM\Setup</RegistryKey>
    <Command HRESULT="0">%programfiles%\windows defender\mpcmdrun.exe -GetFiles</Command>
    <Command HRESULT="0">%windir%\system32\certutil.exe -store</Command>
    <Command HRESULT="0">%windir%\system32\certutil.exe -store -user my</Command>
    <Command HRESULT="-2147418113">%windir%\system32\dism.exe /online /get-packages</Command>
    <Command HRESULT="-2147418113">%windir%\system32\dism.exe /online /get-ProvisionedAppxPackages</Command>
    <Command HRESULT="0">%windir%\system32\Dsregcmd.exe /status</Command>
    <Command HRESULT="0">%windir%\system32\ipconfig.exe /all</Command>
    <Command HRESULT="0">%windir%\system32\mdmdiagnosticstool.exe -area Autopilot;deviceprovisioning;deviceenrollment;tpm;HololensFallbackDeviceOwner -cab %temp%\MDMDiagnostics\mdmlogs-2023-07-13-14-27-15.cab</Command>
    <Command HRESULT="0">%windir%\system32\msinfo32.exe /report %temp%\MDMDiagnostics\msinfo32.log</Command>
    <Command HRESULT="0">%windir%\system32\netsh.exe advfirewall show allprofiles</Command>
    <Command HRESULT="0">%windir%\system32\netsh.exe advfirewall show global</Command>
    <Command HRESULT="-2147024895">%windir%\system32\netsh.exe lan show profiles</Command>
    <Command HRESULT="0">%windir%\system32\netsh.exe winhttp show proxy</Command>
    <Command HRESULT="-2147024895">%windir%\system32\netsh.exe wlan show profiles</Command>
    <Command HRESULT="0">%windir%\system32\netsh.exe wlan show wlanreport</Command>
    <Command HRESULT="0">%windir%\system32\ping.exe -n 50 localhost</Command>
    <Command HRESULT="0">%windir%\system32\pnputil.exe /enum-drivers</Command>
    <Command HRESULT="0">%windir%\system32\powercfg.exe /batteryreport /output %temp%\MDMDiagnostics\battery-report.html</Command>
    <Command HRESULT="0">%windir%\system32\powercfg.exe /energy /output %temp%\MDMDiagnostics\energy-report.html</Command>
    <Events HRESULT="0">Application</Events>
    <Events HRESULT="0">Microsoft-Windows-AppLocker/EXE and DLL</Events>
    <Events HRESULT="0">Microsoft-Windows-AppLocker/MSI and Script</Events>
    <Events HRESULT="0">Microsoft-Windows-AppLocker/Packaged app-Deployment</Events>
    <Events HRESULT="0">Microsoft-Windows-AppLocker/Packaged app-Execution</Events>
    <Events HRESULT="0">Microsoft-Windows-AppXDeployment/Operational</Events>
    <Events HRESULT="0">Microsoft-Windows-AppXDeploymentServer/Operational</Events>
    <Events HRESULT="0">Microsoft-Windows-AppxPackaging/Operational</Events>
    <Events HRESULT="0">Microsoft-Windows-Bitlocker/Bitlocker Management</Events>
    <Events HRESULT="0">Microsoft-Windows-HelloForBusiness/Operational</Events>
    <Events HRESULT="0">Microsoft-Windows-SENSE/Operational</Events>
    <Events HRESULT="0">Microsoft-Windows-SenseIR/Operational</Events>
    <Events HRESULT="0">Microsoft-Windows-Shell-Core/Operational</Events>
    <Events HRESULT="0">Microsoft-Windows-Windows Firewall With Advanced Security/Firewall</Events>
    <Events HRESULT="0">Microsoft-Windows-WinRM/Operational</Events>
    <Events HRESULT="0">Microsoft-Windows-WMI-Activity/Operational</Events>
    <Events HRESULT="0">Setup</Events>
    <Events HRESULT="0">System</Events>
    <FoldersFiles HRESULT="0">%ProgramData%\Microsoft\DiagnosticLogCSP\Collectors\*.etl</FoldersFiles>
    <FoldersFiles HRESULT="0">%ProgramData%\Microsoft\IntuneManagementExtension\Logs\*.*</FoldersFiles>
    <FoldersFiles HRESULT="0">%ProgramData%\Microsoft\Windows Defender\Support\MpSupportFiles.cab</FoldersFiles>
    <FoldersFiles HRESULT="0">%ProgramData%\Microsoft\Windows\WlanReport\wlan-report-latest.html</FoldersFiles>
    <FoldersFiles HRESULT="0">%programdata%\usoshared\logs\System\*.*</FoldersFiles>
    <FoldersFiles HRESULT="-2147024893">%ProgramFiles%\Microsoft EPM Agent\Logs\*.*</FoldersFiles>
    <FoldersFiles HRESULT="0">%ProgramFiles%\Microsoft Update Health Tools\Logs\*.etl</FoldersFiles>
    <FoldersFiles HRESULT="0">%temp%\MDMDiagnostics\battery-report.html</FoldersFiles>
    <FoldersFiles HRESULT="0">%temp%\MDMDiagnostics\energy-report.html</FoldersFiles>
    <FoldersFiles HRESULT="0">%temp%\MDMDiagnostics\mdmlogs-2023-07-13-14-27-15.cab</FoldersFiles>
    <FoldersFiles HRESULT="0">%temp%\MDMDiagnostics\msinfo32.log</FoldersFiles>
    <FoldersFiles HRESULT="-2147024893">%temp%\winget\defaultstate\*.log</FoldersFiles>
    <FoldersFiles HRESULT="-2147024893">%windir%\ccm\logs\*.log</FoldersFiles>
    <FoldersFiles HRESULT="-2147024893">%windir%\ccmsetup\logs\*.log</FoldersFiles>
    <FoldersFiles HRESULT="0">%windir%\logs\CBS\cbs.log</FoldersFiles>
    <FoldersFiles HRESULT="0">%windir%\logs\measuredboot\*.*</FoldersFiles>
    <FoldersFiles HRESULT="0">%windir%\Logs\WindowsUpdate\*.etl</FoldersFiles>
    <FoldersFiles HRESULT="0">%windir%\panther\setupact.log</FoldersFiles>
    <FoldersFiles HRESULT="0">%windir%\panther\unattendgc\setupact.log</FoldersFiles>
    <FoldersFiles HRESULT="0">%windir%\SoftwareDistribution\ReportingEvents.log</FoldersFiles>
    <FoldersFiles HRESULT="-2147024894">%windir%\system32\config\systemprofile\AppData\Local\mdm\*.log</FoldersFiles>
    <FoldersFiles HRESULT="-2147024894">%windir%\temp\%computername%*.log</FoldersFiles>
    <FoldersFiles HRESULT="-2147024894">%windir%\temp\officeclicktorun*.log</FoldersFiles>
    <ClientTimeoutInSeconds>5400</ClientTimeoutInSeconds>
    <OutputFileFormat>flattened</OutputFileFormat>
</Collection>
```

Now, there is a lot of data in here, like log files and reg key exports, and not all of it is necessarily useful to what you are trying to troubleshoot, so you may have to sift through it a bit, but I'll point out the ones I find helpful.

```XML
<FoldersFiles HRESULT="0">%ProgramData%\Microsoft\IntuneManagementExtension\Logs\*.*</FoldersFiles>
<RegistryKey HRESULT="-2147024893">HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall</RegistryKey>
<RegistryKey HRESULT="-2147024893">HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall</RegistryKey>
```

This gives us the following log files
- agentexecutor.log
- clienthealth.log
- healthscripts.log
- intunemanagementextension.log
- sensor.log
- win32appinventory.log
- An inventory of all system-context installed 32bit and 64bit applications

This will also include any rolled-over logs.

These logs are beneficial when troubleshooting why an application failed to install on a client device!

## How does Collect diagnostics work?

When we click the Collect Diagnostics button, it simply makes a POST request to Graph API with the following Graph call.

https://graph.microsoft.com/beta/deviceManagement/managedDevices('[DeviceID]')/createDeviceLogCollectionRequest

And once the diagnostic payload is ready and you click download, Intune generates a download URL with this Graph call. 

https://graph.microsoft.com/beta/deviceManagement/managedDevices('[DeviceID]')/logCollectionRequests('d88051d0-acce-41e7-a7ce-d864a753e2c7')/createDownloadUrl

## How can we take advantage of this?

We can use Collect Diagnostics to gather custom log files as well. However, some criteria need to be met first. 

- Any logs you want to be collected must be stored in C:\ProgramData\Microsoft\IntuneManagementExtension\Logs\
- No subfolders
- File extension must be .log

So, if we have any other logs we want copied, they just need to exist in that folder; great! But how to get them there? 

It is likely your users don't have admin rights on their device (I hope), so they can't drop files into C:\ProgramData\Microsoft\IntuneManagementExtension\Logs\ for you. Any logs generated in the user context cannot be stored here, but you can use scripts and proactive remediation to remedy this. 

Firstly, if you're already deploying any scripts to your device through Intune, which has a transcript, or generates a log file, simply change its output path to the IME logs folder, sorted. 

Secondly, we can leverage Proactive Remediation to move user logs or any other log files to the IME log folder.

### Proactive Remediation 

#### Detection
```PowerShell
# List of paths to look for logs.
$UserTemp = [System.Environment]::GetEnvironmentVariable('TEMP','User')
$SystemTemp = [System.Environment]::GetEnvironmentVariable('TEMP','Machine')
$LogToCollect = "$UserTemp", "$SystemTemp", "$env:ProgramData\PatchMyPCIntuneLogs\", "$env:ProgramData\Scappman\Logs\"

# List of log files to collect.
$logfiles = @()

foreach ($path in $LogToCollect) {
    if (Test-Path $path) {
        $logfiles += Get-ChildItem $path -Recurse -Filter "*.log"
    }
}

if ($logfiles.Count -gt 0) {
    exit 1
} else {
    exit 0
}
```

#### Remediation

```PowerShell
# List of paths to collect logs from.
$UserTemp = [System.Environment]::GetEnvironmentVariable('TEMP','User')
$SystemTemp = [System.Environment]::GetEnvironmentVariable('TEMP','Machine')
$LogToCollect = "$UserTemp", "$SystemTemp", "$env:ProgramData\PatchMyPCIntuneLogs\", "$env:ProgramData\Scappman\Logs\"

$logfiles = @()

$IntuneManagementExtensionLogs = "$env:ProgramData\Microsoft\IntuneManagementExtension\Logs\"

foreach ($path in $LogToCollect) {
    if (Test-Path $path) {
        $logfiles += Get-ChildItem $path -Recurse -Filter "*.log"
    }
}

if ($logfiles.Count -eq 0) {
    exit 0
}

try {
    $logfiles | Copy-Item -Destination $IntuneManagementExtensionLogs -Force
} catch {
    Write-Error "Unable to copy logs to $IntuneManagementExtensionLogs: $_"
    exit 1
}
```

Here's a handy video from [Intune.Training](https://Intune.Training) showing how to configure Proactive Remediation to deploy the Detection and Remediation scripts. I'll blog this process later.

[Intune Training - S02E09 - How to Configure Proactive Remediations in Microsoft Intune](https://www.youtube.com/watch?v=VOBzV6GjOvI)

## Other vendor logs

This doesn't just apply to Intune or Windows logs, we can apply the same collection to 3rd party logs as well! If it exists on disk, we can collect it!

Two examples I'm most familiar with are Patch My PC and Scappman. 

Patch My PC Intune Apps and Updates generate specific log files, which can be found in the following locations. 

- %ProgramData%\PatchMyPCIntuneLogs\PatchMyPC-ScriptRunner.log
    - This may be found in the %ProgramData%\PatchMyPC\ if the Install was initiated by the user from Company Portal.
- %ProgramData%\PatchMyPCIntuneLogs\PatchMyPC-SoftwareDetectionScript.log
- %ProgramData%\PatchMyPCIntuneLogs\PatchMyPC-SoftwareUpdateDetectionScript.log
- %ProgramData%\PatchMyPC\PatchMyPC-UserNotification.log

Additionally, Patch My PC allows you to configure [logs specific to vendor applications](https://patchmypc.com/custom-options-available-for-third-party-updates-and-applications#install-logging), and as you might expect, we can copy these logs as well!

Similarly, Scappman has unique log files, which can be found in the following location.

- %ProgramData%\Scappman\Logs\

We can collect logs from these paths using Collect diagnostics by adding them to our proactive remediation scripts.

## Summary

Collect diagnostics is a great and relatively powerful tool available to admins to make their lives just that little bit easier. Even though the process can be a tad slow, taking upwards of 20 minutes, it's still better than having no log files at all!
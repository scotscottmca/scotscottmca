---
title: ConfigMgr and Intune error codes
date: 2023-03-13
lastModified: 2023-03-13
author: Scott McAllister
tags:
  - ConfigMgr
  - Intune
  - Error Codes
draft: false
---

**Literally a list of ConfigMgr and Intune error codes, as well as how to look up what they mean**

Hey all!

This is literally just a post containing a bunch Intune and ConfigMgr error codes that I hope to keep updated over time. 

I've found it's not always straight forward finding what an error code means, maybe beacuse it's undocuemnted, outdated or sometimes you simply just don't know where to look, and even if you do the results vary, for example:

Looking up the same error code 4 different ways, returns 3 different results, which is confusing. 

**[CMTrace](https://learn.microsoft.com/en-us/mem/configmgr/core/support/cmtrace)**
![cmtrace](/images/errorCodes/cmtrace.png)

**[OneTrace](https://learn.microsoft.com/en-us/mem/configmgr/core/support/support-center-onetrace)**
![OneTrace](/images/errorCodes/OneTrace.png)

**[ErrLookup tool](https://learn.microsoft.com/en-us/windows/win32/debug/system-error-code-lookup-tool)**
![errLookup](/images/errorCodes/errLookup.png)

**PowerShell function**
![PowerShell](/images/errorCodes/PowerShell.png)

That being said, CMTrace, OneTrace and ErrLookup are extremely useful!

## PowerShell Function
The PowerShell function is something thrown together purely for this post, it queries a list of error codes which are stored in Json in my GitHub repository. I doubt that it's perfect, but it's functional. 

```powershell
function Search-JsonForErrorCodes {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$false, Position=0)]
        [string]$UrlToJsonFile = "https://raw.githubusercontent.com/smcallister594/scotscottmca/main/assets/ErrorCodes/errorCodes.json",
        
        [Parameter(Mandatory=$true, Position=1)]
        [ValidateSet('HexCode', 'SignedIntCode', 'UnsignedIntCode')]
        [string]$SearchParameter,
        
        [Parameter(Mandatory=$true, Position=2)]
        [string]$SearchValue
    )
    
    # Import the JSON file from the internet and convert it to a PowerShell object
    $JsonData = Invoke-WebRequest -Uri $UrlToJsonFile | ConvertFrom-Json
    
    # Filter the JSON data based on the specified code parameter
    switch ($SearchParameter) {
        'HexCode' {
            $FilteredData = $JsonData | Where-Object { $_.HexCode -eq $SearchValue }
        }
        'SignedIntCode' {
            $FilteredData = $JsonData | Where-Object { $_.SignedIntCode -eq [int]$SearchValue }
        }
        'UnsignedIntCode' {
            $FilteredData = $JsonData | Where-Object { $_.UnsignedIntCode -eq [uint32]$SearchValue }
        }
    }
    
    # Return the filtered data
    return $FilteredData
}
```

## Error Codes
When it comes to ConfigMgr & Intune, the list of error codes are probably longer than your arm!

Here is a fairly sizeable list of those error codes!

<table>
    <tr>
        <td>SignedIntCode</td>
        <td>UnsignedIntCode</td>
        <td>HexCode</td>
        <td>Description</td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td>0x00000000</td>
        <td>Success</td>
    </tr>
    <tr>
        <td>-1</td>
        <td>4294967295</td>
        <td>0xFFFFFFFF</td>
        <td>Script execution failed with error code -1</td>
    </tr>
    <tr>
        <td>10</td>
        <td>10</td>
        <td>0x0000000A</td>
        <td>The unit test error string</td>
    </tr>
    <tr>
        <td>131072512</td>
        <td>131072512</td>
        <td>0x07D00200</td>
        <td>The client is successfully assigned with Group Policy Site Assignment</td>
    </tr>
    <tr>
        <td>131073314</td>
        <td>131073314</td>
        <td>0x07D00522</td>
        <td>No more data</td>
    </tr>
    <tr>
        <td>131073589</td>
        <td>131073589</td>
        <td>0x07D00635</td>
        <td>The scan was skipped because history was valid</td>
    </tr>
    <tr>
        <td>-2016278002</td>
        <td>2278689294</td>
        <td>0x87D20A0E</td>
        <td>Shutdown received while compressing</td>
    </tr>
    <tr>
        <td>-2016278003</td>
        <td>2278689293</td>
        <td>0x87D20A0D</td>
        <td>Unexpected error while compressing</td>
    </tr>
    <tr>
        <td>-2016278004</td>
        <td>2278689292</td>
        <td>0x87D20A0C</td>
        <td>Already compressed</td>
    </tr>
    <tr>
        <td>-2016278005</td>
        <td>2278689291</td>
        <td>0x87D20A0B</td>
        <td>Failed to create file header while compressing</td>
    </tr>
    <tr>
        <td>-2016278006</td>
        <td>2278689290</td>
        <td>0x87D20A0A</td>
        <td>Failed to create file while compressing</td>
    </tr>
    <tr>
        <td>-2016278007</td>
        <td>2278689289</td>
        <td>0x87D20A09</td>
        <td>Failed to create folder while compressing</td>
    </tr>
    <tr>
        <td>-2016278008</td>
        <td>2278689288</td>
        <td>0x87D20A08</td>
        <td>Invalid compressed header in the file</td>
    </tr>
    <tr>
        <td>-2016278009</td>
        <td>2278689287</td>
        <td>0x87D20A07</td>
        <td>Invalid compressed file</td>
    </tr>
    <tr>
        <td>-2016278010</td>
        <td>2278689286</td>
        <td>0x87D20A06</td>
        <td>Failed to compress header</td>
    </tr>
    <tr>
        <td>-2016278011</td>
        <td>2278689285</td>
        <td>0x87D20A05</td>
        <td>The file is no more there to compress</td>
    </tr>
    <tr>
        <td>-2016278012</td>
        <td>2278689284</td>
        <td>0x87D20A04</td>
        <td>Invalid destination for compression</td>
    </tr>
    <tr>
        <td>-2016278013</td>
        <td>2278689283</td>
        <td>0x87D20A03</td>
        <td>Invalid source for compression</td>
    </tr>
    <tr>
        <td>-2016278014</td>
        <td>2278689282</td>
        <td>0x87D20A02</td>
        <td>Compression destination not found</td>
    </tr>
    <tr>
        <td>-2016278015</td>
        <td>2278689281</td>
        <td>0x87D20A01</td>
        <td>Compression source not found</td>
    </tr>
    <tr>
        <td>-2016278267</td>
        <td>2278689029</td>
        <td>0x87D20905</td>
        <td>SEDO lock request timed out</td>
    </tr>
    <tr>
        <td>-2016278268</td>
        <td>2278689028</td>
        <td>0x87D20904</td>
        <td>SEDO lock not found</td>
    </tr>
    <tr>
        <td>-2016278269</td>
        <td>2278689027</td>
        <td>0x87D20903</td>
        <td>Invalid object path for SEDO</td>
    </tr>
    <tr>
        <td>-2016278270</td>
        <td>2278689026</td>
        <td>0x87D20902</td>
        <td>SEDO request ID not found</td>
    </tr>
    <tr>
        <td>-2016278271</td>
        <td>2278689025</td>
        <td>0x87D20901</td>
        <td>SEDO needs lock ID or Rel path</td>
    </tr>
    <tr>
        <td>-2016278518</td>
        <td>2278688778</td>
        <td>0x87D2080A</td>
        <td>Certificate not found</td>
    </tr>
    <tr>
        <td>-2016278519</td>
        <td>2278688777</td>
        <td>0x87D20809</td>
        <td>Invalid data in the certificate</td>
    </tr>
    <tr>
        <td>-2016278520</td>
        <td>2278688776</td>
        <td>0x87D20808</td>
        <td>Failed to find certificate</td>
    </tr>
    <tr>
        <td>-2016278521</td>
        <td>2278688775</td>
        <td>0x87D20807</td>
        <td>Failed to decrypt the certificate</td>
    </tr>
    <tr>
        <td>-2016278522</td>
        <td>2278688774</td>
        <td>0x87D20806</td>
        <td>Failed to delete certificate store</td>
    </tr>
    <tr>
        <td>-2016278523</td>
        <td>2278688773</td>
        <td>0x87D20805</td>
        <td>Failed to write in the certificate store</td>
    </tr>
    <tr>
        <td>-2016278524</td>
        <td>2278688772</td>
        <td>0x87D20804</td>
        <td>Failed to open the certificate store</td>
    </tr>
    <tr>
        <td>-2016278525</td>
        <td>2278688771</td>
        <td>0x87D20803</td>
        <td>Error reading peer�s encoded certificate</td>
    </tr>
    <tr>
        <td>-2016278526</td>
        <td>2278688770</td>
        <td>0x87D20802</td>
        <td>Error reading certificate</td>
    </tr>
    <tr>
        <td>-2016278527</td>
        <td>2278688769</td>
        <td>0x87D20801</td>
        <td>Service Host Name property is either missing or invalid</td>
    </tr>
    <tr>
        <td>-2016278776</td>
        <td>2278688520</td>
        <td>0x87D20708</td>
        <td>The specified item to update is not found in Site Control File</td>
    </tr>
    <tr>
        <td>-2016278777</td>
        <td>2278688519</td>
        <td>0x87D20707</td>
        <td>Invalid FQDN found in Site Control File</td>
    </tr>
    <tr>
        <td>-2016278778</td>
        <td>2278688518</td>
        <td>0x87D20706</td>
        <td>Legacy type item in Site Control File</td>
    </tr>
    <tr>
        <td>-2016278779</td>
        <td>2278688517</td>
        <td>0x87D20705</td>
        <td>Site not found in Site Control File</td>
    </tr>
    <tr>
        <td>-2016278780</td>
        <td>2278688516</td>
        <td>0x87D20704</td>
        <td>Bad data in Site Control File</td>
    </tr>
    <tr>
        <td>-2016278781</td>
        <td>2278688515</td>
        <td>0x87D20703</td>
        <td>Item type not known in Site Control File</td>
    </tr>
    <tr>
        <td>-2016278782</td>
        <td>2278688514</td>
        <td>0x87D20702</td>
        <td>Item not found in Site Control File</td>
    </tr>
    <tr>
        <td>-2016278783</td>
        <td>2278688513</td>
        <td>0x87D20701</td>
        <td>Unknown property in Site Control File</td>
    </tr>
    <tr>
        <td>-2016279006</td>
        <td>2278688290</td>
        <td>0x87D20622</td>
        <td>SRS data source has been modified or deleted</td>
    </tr>
    <tr>
        <td>-2016279007</td>
        <td>2278688289</td>
        <td>0x87D20621</td>
        <td>SRS root folder is not present</td>
    </tr>
    <tr>
        <td>-2016279008</td>
        <td>2278688288</td>
        <td>0x87D20620</td>
        <td>SRS is not installed or not properly configured</td>
    </tr>
    <tr>
        <td>-2016279019</td>
        <td>2278688277</td>
        <td>0x87D20615</td>
        <td>SRS web service is not running</td>
    </tr>
    <tr>
        <td>-2016279278</td>
        <td>2278688018</td>
        <td>0x87D20512</td>
        <td>The machine is not assigned to this site</td>
    </tr>
    <tr>
        <td>-2016279279</td>
        <td>2278688017</td>
        <td>0x87D20511</td>
        <td>The machine is not an SMS client</td>
    </tr>
    <tr>
        <td>-2016279280</td>
        <td>2278688016</td>
        <td>0x87D20510</td>
        <td>Machine not found foreign key constraint</td>
    </tr>
    <tr>
        <td>-2016279529</td>
        <td>2278687767</td>
        <td>0x87D20417</td>
        <td>Auto Deployment Rule download failed</td>
    </tr>
    <tr>
        <td>-2016279530</td>
        <td>2278687766</td>
        <td>0x87D20416</td>
        <td>No rule filters specified for the Auto Deployment Rule</td>
    </tr>
    <tr>
        <td>-2016279531</td>
        <td>2278687765</td>
        <td>0x87D20415</td>
        <td>Auto Deployment Rule results exceeded the maximum number of updates</td>
    </tr>
    <tr>
        <td>-2016279532</td>
        <td>2278687764</td>
        <td>0x87D20414</td>
        <td>Cannot Configure WU/MU as an upstream server on Peer Primary</td>
    </tr>
    <tr>
        <td>-2016279533</td>
        <td>2278687763</td>
        <td>0x87D20413</td>
        <td>Active SUP not selected</td>
    </tr>
    <tr>
        <td>-2016279537</td>
        <td>2278687759</td>
        <td>0x87D2040F</td>
        <td>WSUS Server component failure</td>
    </tr>
    <tr>
        <td>-2016279538</td>
        <td>2278687758</td>
        <td>0x87D2040E</td>
        <td>WSUS Server Database connection failure</td>
    </tr>
    <tr>
        <td>-2016279539</td>
        <td>2278687757</td>
        <td>0x87D2040D</td>
        <td>Failed to set Parent WSUS Configuration on the child sites</td>
    </tr>
    <tr>
        <td>-2016279540</td>
        <td>2278687756</td>
        <td>0x87D2040C</td>
        <td>WSUS server not ready</td>
    </tr>
    <tr>
        <td>-2016279797</td>
        <td>2278687499</td>
        <td>0x87D2030B</td>
        <td>Device Setting Item not found Foreign Key Constraint</td>
    </tr>
    <tr>
        <td>-2016280054</td>
        <td>2278687242</td>
        <td>0x87D2020A</td>
        <td>SDM Type not found Foreign Key Constraint</td>
    </tr>
    <tr>
        <td>-2016280055</td>
        <td>2278687241</td>
        <td>0x87D20209</td>
        <td>Related SDM Package not found Foreign Key Constraint</td>
    </tr>
    <tr>
        <td>-2016280056</td>
        <td>2278687240</td>
        <td>0x87D20208</td>
        <td>SDM Package was not found Foreign Key Constraint</td>
    </tr>
    <tr>
        <td>-2016280057</td>
        <td>2278687239</td>
        <td>0x87D20207</td>
        <td>SDM Type not found Foreign Key Constraint</td>
    </tr>
    <tr>
        <td>-2016280058</td>
        <td>2278687238</td>
        <td>0x87D20206</td>
        <td>EULA is not found Foreign Key Constraint</td>
    </tr>
    <tr>
        <td>-2016280059</td>
        <td>2278687237</td>
        <td>0x87D20205</td>
        <td>Update Source was not found Foreign Key Constraint</td>
    </tr>
    <tr>
        <td>-2016280060</td>
        <td>2278687236</td>
        <td>0x87D20204</td>
        <td>CI Type not found Foreign Key Constraint</td>
    </tr>
    <tr>
        <td>-2016280061</td>
        <td>2278687235</td>
        <td>0x87D20203</td>
        <td>The category was not found Foreign Key Constraint</td>
    </tr>
    <tr>
        <td>-2016280062</td>
        <td>2278687234</td>
        <td>0x87D20202</td>
        <td>Configuration Item not found Foreign Key Constraint</td>
    </tr>
    <tr>
        <td>-2016280063</td>
        <td>2278687233</td>
        <td>0x87D20201</td>
        <td>Operation on Old Configuration Item when a newer instance exits in the Database</td>
    </tr>
    <tr>
        <td>-2016280319</td>
        <td>2278686977</td>
        <td>0x87D20101</td>
        <td>Collection not found foreign key constraint</td>
    </tr>
    <tr>
        <td>-2016280528</td>
        <td>2278686768</td>
        <td>0x87D20030</td>
        <td>Error while creating inbox</td>
    </tr>
    <tr>
        <td>-2016280544</td>
        <td>2278686752</td>
        <td>0x87D20020</td>
        <td>Thread is signaled to be stopped</td>
    </tr>
    <tr>
        <td>-2016280557</td>
        <td>2278686739</td>
        <td>0x87D20013</td>
        <td>Registry write error</td>
    </tr>
    <tr>
        <td>-2016280558</td>
        <td>2278686738</td>
        <td>0x87D20012</td>
        <td>Registry read error</td>
    </tr>
    <tr>
        <td>-2016280559</td>
        <td>2278686737</td>
        <td>0x87D20011</td>
        <td>Registry connection error</td>
    </tr>
    <tr>
        <td>-2016280568</td>
        <td>2278686728</td>
        <td>0x87D20008</td>
        <td>SQL send batch error</td>
    </tr>
    <tr>
        <td>-2016280569</td>
        <td>2278686727</td>
        <td>0x87D20007</td>
        <td>SQL queue row error</td>
    </tr>
    <tr>
        <td>-2016280570</td>
        <td>2278686726</td>
        <td>0x87D20006</td>
        <td>SQL table binding error</td>
    </tr>
    <tr>
        <td>-2016280571</td>
        <td>2278686725</td>
        <td>0x87D20005</td>
        <td>SQL deadlock error</td>
    </tr>
    <tr>
        <td>-2016280572</td>
        <td>2278686724</td>
        <td>0x87D20004</td>
        <td>SQL error while registering type</td>
    </tr>
    <tr>
        <td>-2016280573</td>
        <td>2278686723</td>
        <td>0x87D20003</td>
        <td>SQL Error</td>
    </tr>
    <tr>
        <td>-2016280574</td>
        <td>2278686722</td>
        <td>0x87D20002</td>
        <td>SQL connection error</td>
    </tr>
    <tr>
        <td>-2016280575</td>
        <td>2278686721</td>
        <td>0x87D20001</td>
        <td>Invalid data</td>
    </tr>
    <tr>
        <td>-2016281107</td>
        <td>2278686189</td>
        <td>0x87D1FDED</td>
        <td>Unsupported setting discovery source</td>
    </tr>
    <tr>
        <td>-2016281108</td>
        <td>2278686188</td>
        <td>0x87D1FDEC</td>
        <td>Referenced setting not found in CI</td>
    </tr>
    <tr>
        <td>-2016281109</td>
        <td>2278686187</td>
        <td>0x87D1FDEB</td>
        <td>Data type conversion failed</td>
    </tr>
    <tr>
        <td>-2016281110</td>
        <td>2278686186</td>
        <td>0x87D1FDEA</td>
        <td>Invalid parameter to CIM setting</td>
    </tr>
    <tr>
        <td>-2016281111</td>
        <td>2278686185</td>
        <td>0x87D1FDE9</td>
        <td>Not applicable for this device</td>
    </tr>
    <tr>
        <td>-2016281112</td>
        <td>2278686184</td>
        <td>0x87D1FDE8</td>
        <td>Remediation failed</td>
    </tr>
    <tr>
        <td>-2016341109</td>
        <td>2278626187</td>
        <td>0x87D1138B</td>
        <td>iOS device has returned an error</td>
    </tr>
    <tr>
        <td>-2016341110</td>
        <td>2278626186</td>
        <td>0x87D1138A</td>
        <td>iOS device has rejected the command due to incorrect format</td>
    </tr>
    <tr>
        <td>-2016341111</td>
        <td>2278626185</td>
        <td>0x87D11389</td>
        <td>iOS device has returned an unexpected Idle status</td>
    </tr>
    <tr>
        <td>-2016341112</td>
        <td>2278626184</td>
        <td>0x87D11388</td>
        <td>iOS device is currently busy</td>
    </tr>
    <tr>
        <td>-2016344008</td>
        <td>2278623288</td>
        <td>0x87D10838</td>
        <td>(1404): Certificate access denied</td>
    </tr>
    <tr>
        <td>-2016344009</td>
        <td>2278623287</td>
        <td>0x87D10837</td>
        <td>(1403): Certificate not found</td>
    </tr>
    <tr>
        <td>-2016344010</td>
        <td>2278623286</td>
        <td>0x87D10836</td>
        <td>DCMO(1402): The Operation failed</td>
    </tr>
    <tr>
        <td>-2016344011</td>
        <td>2278623285</td>
        <td>0x87D10835</td>
        <td>DCMO(1401): User chose not to accept the operation when prompted</td>
    </tr>
    <tr>
        <td>-2016344012</td>
        <td>2278623284</td>
        <td>0x87D10834</td>
        <td>DCMO(1400): Client error</td>
    </tr>
    <tr>
        <td>-2016344108</td>
        <td>2278623188</td>
        <td>0x87D107D4</td>
        <td>DCMO(1204): Device Capability is disabled, and the User is allowed to re-enable it</td>
    </tr>
    <tr>
        <td>-2016344109</td>
        <td>2278623187</td>
        <td>0x87D107D3</td>
        <td>DCMO(1203): Device Capability is disabled, and the User is not allowed to re-enable it</td>
    </tr>
    <tr>
        <td>-2016344110</td>
        <td>2278623186</td>
        <td>0x87D107D2</td>
        <td>DCMO(1202): Enable operation is performed successfully, but the Device Capability is currently detached</td>
    </tr>
    <tr>
        <td>-2016344111</td>
        <td>2278623185</td>
        <td>0x87D107D1</td>
        <td>DCMO(1201): Enable operation is performed successfully, and the Device Capability is currently attached</td>
    </tr>
    <tr>
        <td>-2016344112</td>
        <td>2278623184</td>
        <td>0x87D107D0</td>
        <td>DCMO(1200): Operation is performed successfully</td>
    </tr>
    <tr>
        <td>-2016344197</td>
        <td>2278623099</td>
        <td>0x87D1077B</td>
        <td>Operation not implemented on the client</td>
    </tr>
    <tr>
        <td>-2016344198</td>
        <td>2278623098</td>
        <td>0x87D1077A</td>
        <td>The package is an invalid upgrade</td>
    </tr>
    <tr>
        <td>-2016344199</td>
        <td>2278623097</td>
        <td>0x87D10779</td>
        <td>The target location of the package is not accessible</td>
    </tr>
    <tr>
        <td>-2016344200</td>
        <td>2278623096</td>
        <td>0x87D10778</td>
        <td>The installer is busy doing some other operation</td>
    </tr>
    <tr>
        <td>-2016344201</td>
        <td>2278623095</td>
        <td>0x87D10777</td>
        <td>This indicates that network failure aborted the operation</td>
    </tr>
    <tr>
        <td>-2016344202</td>
        <td>2278623094</td>
        <td>0x87D10776</td>
        <td>The package has no right to perform the operation</td>
    </tr>
    <tr>
        <td>-2016344203</td>
        <td>2278623093</td>
        <td>0x87D10775</td>
        <td>Install/Uninstall Unknown error</td>
    </tr>
    <tr>
        <td>-2016344204</td>
        <td>2278623092</td>
        <td>0x87D10774</td>
        <td>The mandatory file is in use and prevents the operation</td>
    </tr>
    <tr>
        <td>-2016344205</td>
        <td>2278623091</td>
        <td>0x87D10773</td>
        <td>The package cannot be installed due to missing dependency</td>
    </tr>
    <tr>
        <td>-2016344206</td>
        <td>2278623090</td>
        <td>0x87D10772</td>
        <td>The package cannot be installed due to a security error</td>
    </tr>
    <tr>
        <td>-2016344207</td>
        <td>2278623089</td>
        <td>0x87D10771</td>
        <td>Package validation failed.</td>
    </tr>
    <tr>
        <td>-2016344208</td>
        <td>2278623088</td>
        <td>0x87D10770</td>
        <td>Installation of the package is not supported</td>
    </tr>
    <tr>
        <td>-2016344209</td>
        <td>2278623087</td>
        <td>0x87D1076F</td>
        <td>Insufficient free memory in the drive to perform the operation</td>
    </tr>
    <tr>
        <td>-2016344210</td>
        <td>2278623086</td>
        <td>0x87D1076E</td>
        <td>File is corrupted</td>
    </tr>
    <tr>
        <td>-2016344211</td>
        <td>2278623085</td>
        <td>0x87D1076D</td>
        <td>User canceled the operation</td>
    </tr>
    <tr>
        <td>-2016344212</td>
        <td>2278623084</td>
        <td>0x87D1076C</td>
        <td>The application was successfully installed</td>
    </tr>
    <tr>
        <td>-2016344512</td>
        <td>2278622784</td>
        <td>0x87D10640</td>
        <td>An invalid OMA download descriptor received</td>
    </tr>
    <tr>
        <td>-2016344593</td>
        <td>2278622703</td>
        <td>0x87D105EF</td>
        <td>A maximum number of HTTP redirections has been reached.</td>
    </tr>
    <tr>
        <td>-2016344594</td>
        <td>2278622702</td>
        <td>0x87D105EE</td>
        <td>Non-download specific error</td>
    </tr>
    <tr>
        <td>-2016344595</td>
        <td>2278622701</td>
        <td>0x87D105ED</td>
        <td>Internal error occurred. Most probably a programming error.</td>
    </tr>
    <tr>
        <td>-2016344596</td>
        <td>2278622700</td>
        <td>0x87D105EC</td>
        <td>An error occurred in the transaction</td>
    </tr>
    <tr>
        <td>-2016344597</td>
        <td>2278622699</td>
        <td>0x87D105EB</td>
        <td>General storage error</td>
    </tr>
    <tr>
        <td>-2016344598</td>
        <td>2278622698</td>
        <td>0x87D105EA</td>
        <td>Not enough disk space for the content</td>
    </tr>
    <tr>
        <td>-2016344599</td>
        <td>2278622697</td>
        <td>0x87D105E9</td>
        <td>Moving content file failed</td>
    </tr>
    <tr>
        <td>-2016344600</td>
        <td>2278622696</td>
        <td>0x87D105E8</td>
        <td>Invalid download drive</td>
    </tr>
    <tr>
        <td>-2016344601</td>
        <td>2278622695</td>
        <td>0x87D105E7</td>
        <td>File not found an error</td>
    </tr>
    <tr>
        <td>-2016344602</td>
        <td>2278622694</td>
        <td>0x87D105E6</td>
        <td>File write failed</td>
    </tr>
    <tr>
        <td>-2016344603</td>
        <td>2278622693</td>
        <td>0x87D105E5</td>
        <td>Media where the download is being persisted removed</td>
    </tr>
    <tr>
        <td>-2016344604</td>
        <td>2278622692</td>
        <td>0x87D105E4</td>
        <td>Download Manager cannot handle this URL</td>
    </tr>
    <tr>
        <td>-2016344605</td>
        <td>2278622691</td>
        <td>0x87D105E3</td>
        <td>Error in the destination filename</td>
    </tr>
    <tr>
        <td>-2016344606</td>
        <td>2278622690</td>
        <td>0x87D105E2</td>
        <td>Destination file cannot be opened/created</td>
    </tr>
    <tr>
        <td>-2016344607</td>
        <td>2278622689</td>
        <td>0x87D105E1</td>
        <td>Unhandled HTTP error code</td>
    </tr>
    <tr>
        <td>-2016344608</td>
        <td>2278622688</td>
        <td>0x87D105E0</td>
        <td>404: object not found</td>
    </tr>
    <tr>
        <td>-2016344609</td>
        <td>2278622687</td>
        <td>0x87D105DF</td>
        <td>412: partial content cannot be downloaded</td>
    </tr>
    <tr>
        <td>-2016344610</td>
        <td>2278622686</td>
        <td>0x87D105DE</td>
        <td>Paused content is expired</td>
    </tr>
    <tr>
        <td>-2016344611</td>
        <td>2278622685</td>
        <td>0x87D105DD</td>
        <td>Resuming progressive download failed</td>
    </tr>
    <tr>
        <td>-2016344711</td>
        <td>2278622585</td>
        <td>0x87D10579</td>
        <td>Connection failed. No network coverage</td>
    </tr>
    <tr>
        <td>-2016344713</td>
        <td>2278622583</td>
        <td>0x87D10577</td>
        <td>Unknown error related to protocol</td>
    </tr>
    <tr>
        <td>-2016344810</td>
        <td>2278622486</td>
        <td>0x87D10516</td>
        <td>The requested operation is invalid for this protocol</td>
    </tr>
    <tr>
        <td>-2016344811</td>
        <td>2278622485</td>
        <td>0x87D10515</td>
        <td>The requested protocol is not known</td>
    </tr>
    <tr>
        <td>-2016344813</td>
        <td>2278622483</td>
        <td>0x87D10513</td>
        <td>Unknown error related to remote content</td>
    </tr>
    <tr>
        <td>-2016344907</td>
        <td>2278622389</td>
        <td>0x87D104B5</td>
        <td>Content needed to resent, but this failed</td>
    </tr>
    <tr>
        <td>-2016344908</td>
        <td>2278622388</td>
        <td>0x87D104B4</td>
        <td>Remote server required authentication but credentials supplied if any were not accepted</td>
    </tr>
    <tr>
        <td>-2016344909</td>
        <td>2278622387</td>
        <td>0x87D104B3</td>
        <td>Remote content was not found at the server</td>
    </tr>
    <tr>
        <td>-2016344910</td>
        <td>2278622386</td>
        <td>0x87D104B2</td>
        <td>The operation requested on remote content is not permitted</td>
    </tr>
    <tr>
        <td>-2016344911</td>
        <td>2278622385</td>
        <td>0x87D104B1</td>
        <td>Access to remote content denied</td>
    </tr>
    <tr>
        <td>-2016344913</td>
        <td>2278622383</td>
        <td>0x87D104AF</td>
        <td>Unknown proxy related error</td>
    </tr>
    <tr>
        <td>-2016345007</td>
        <td>2278622289</td>
        <td>0x87D10451</td>
        <td>Proxy authentication required or proxy refused the supplied credentials if any</td>
    </tr>
    <tr>
        <td>-2016345008</td>
        <td>2278622288</td>
        <td>0x87D10450</td>
        <td>Connection to the proxy timed out</td>
    </tr>
    <tr>
        <td>-2016345009</td>
        <td>2278622287</td>
        <td>0x87D1044F</td>
        <td>Invalid proxy hostname</td>
    </tr>
    <tr>
        <td>-2016345010</td>
        <td>2278622286</td>
        <td>0x87D1044E</td>
        <td>The proxy server closed the connection prematurely</td>
    </tr>
    <tr>
        <td>-2016345011</td>
        <td>2278622285</td>
        <td>0x87D1044D</td>
        <td>Connection to the proxy server was refused</td>
    </tr>
    <tr>
        <td>-2016345061</td>
        <td>2278622235</td>
        <td>0x87D1041B</td>
        <td>Detection rules not present</td>
    </tr>
    <tr>
        <td>-2016345063</td>
        <td>2278622233</td>
        <td>0x87D10419</td>
        <td>Unknown network error</td>
    </tr>
    <tr>
        <td>-2016345103</td>
        <td>2278622193</td>
        <td>0x87D103F1</td>
        <td>Remote server unavailable</td>
    </tr>
    <tr>
        <td>-2016345104</td>
        <td>2278622192</td>
        <td>0x87D103F0</td>
        <td>Network authentication failed</td>
    </tr>
    <tr>
        <td>-2016345105</td>
        <td>2278622191</td>
        <td>0x87D103EF</td>
        <td>Temporary network failure</td>
    </tr>
    <tr>
        <td>-2016345106</td>
        <td>2278622190</td>
        <td>0x87D103EE</td>
        <td>The encrypted channel could not be established</td>
    </tr>
    <tr>
        <td>-2016345107</td>
        <td>2278622189</td>
        <td>0x87D103ED</td>
        <td>The operation was canceled before it was finished</td>
    </tr>
    <tr>
        <td>-2016345108</td>
        <td>2278622188</td>
        <td>0x87D103EC</td>
        <td>Connection to the remote server timed out</td>
    </tr>
    <tr>
        <td>-2016345109</td>
        <td>2278622187</td>
        <td>0x87D103EB</td>
        <td>Invalid hostname</td>
    </tr>
    <tr>
        <td>-2016345110</td>
        <td>2278622186</td>
        <td>0x87D103EA</td>
        <td>The remote server closed the connection prematurely</td>
    </tr>
    <tr>
        <td>-2016345111</td>
        <td>2278622185</td>
        <td>0x87D103E9</td>
        <td>The remote server refused the connection</td>
    </tr>
    <tr>
        <td>-2016345112</td>
        <td>2278622184</td>
        <td>0x87D103E8</td>
        <td>Error Unknown</td>
    </tr>
    <tr>
        <td>-2016345595</td>
        <td>2278621701</td>
        <td>0x87D10205</td>
        <td>SyncML: The response to an atomic command was too large to fit in a single message.</td>
    </tr>
    <tr>
        <td>-2016345596</td>
        <td>2278621700</td>
        <td>0x87D10204</td>
        <td>SyncML: Command was inside Atomic element, and Atomic failed. This command was not rolled back successfully.</td>
    </tr>
    <tr>
        <td>-2016345598</td>
        <td>2278621698</td>
        <td>0x87D10202</td>
        <td>SyncML: The SyncML command was not completed successfully since the operation was already canceled before processing the command.</td>
    </tr>
    <tr>
        <td>-2016345599</td>
        <td>2278621697</td>
        <td>0x87D10201</td>
        <td>SyncML: The recipient does not support or refuses to support the specified version of the SyncML Synchronization Protocol used in the request SyncML Message.</td>
    </tr>
    <tr>
        <td>-2016345600</td>
        <td>2278621696</td>
        <td>0x87D10200</td>
        <td>SyncML: An application error occurred during the synchronization session.</td>
    </tr>
    <tr>
        <td>-2016345601</td>
        <td>2278621695</td>
        <td>0x87D101FF</td>
        <td>SyncML: A severe error occurred in the server while processing the request.</td>
    </tr>
    <tr>
        <td>-2016345602</td>
        <td>2278621694</td>
        <td>0x87D101FE</td>
        <td>SyncML: An error occurred while processing the request. The error is related to a failure in the recipient data store.</td>
    </tr>
    <tr>
        <td>-2016345603</td>
        <td>2278621693</td>
        <td>0x87D101FD</td>
        <td>SyncML: Reserved for future use.</td>
    </tr>
    <tr>
        <td>-2016345604</td>
        <td>2278621692</td>
        <td>0x87D101FC</td>
        <td>SyncML: An error that necessitates a refresh of the current synchronization state of the client with the server.</td>
    </tr>
    <tr>
        <td>-2016345605</td>
        <td>2278621691</td>
        <td>0x87D101FB</td>
        <td>SyncML: The error caused all SyncML commands within an Atomic element type to fail.</td>
    </tr>
    <tr>
        <td>-2016345606</td>
        <td>2278621690</td>
        <td>0x87D101FA</td>
        <td>SyncML: An application error occurred while processing the request.</td>
    </tr>
    <tr>
        <td>-2016345607</td>
        <td>2278621689</td>
        <td>0x87D101F9</td>
        <td>SyncML: The recipient does not support or refuses to support the specified version of SyncML DTD used in the request SyncML Message.</td>
    </tr>
    <tr>
        <td>-2016345608</td>
        <td>2278621688</td>
        <td>0x87D101F8</td>
        <td>SyncML: The recipient, while acting as a gateway or proxy, did not receive a timely response from the upstream recipient specified by the URI (e.g., HTTP FTP LDAP) or some other auxiliary recipient (e.g., DNS) it needed to access in attempting to complete the request.</td>
    </tr>
    <tr>
        <td>-2016345609</td>
        <td>2278621687</td>
        <td>0x87D101F7</td>
        <td>SyncML: The recipient is currently unable to handle the request due to a temporary overloading or maintenance.</td>
    </tr>
    <tr>
        <td>-2016345610</td>
        <td>2278621686</td>
        <td>0x87D101F6</td>
        <td>SyncML: The recipient, while acting as a gateway or proxy, received an invalid response from the upstream recipient it accessed to fulfill the request.</td>
    </tr>
    <tr>
        <td>-2016345611</td>
        <td>2278621685</td>
        <td>0x87D101F5</td>
        <td>SyncML: The recipient does not support the command required to fulfill the request.</td>
    </tr>
    <tr>
        <td>-2016345612</td>
        <td>2278621684</td>
        <td>0x87D101F4</td>
        <td>SyncML: The recipient encountered an unexpected condition that prevented it from fulfilling the request</td>
    </tr>
    <tr>
        <td>-2016345684</td>
        <td>2278621612</td>
        <td>0x87D101AC</td>
        <td>SyncML: Move failed</td>
    </tr>
    <tr>
        <td>-2016345685</td>
        <td>2278621611</td>
        <td>0x87D101AB</td>
        <td>SyncML: Parent cannot be deleted since it contains children.</td>
    </tr>
    <tr>
        <td>-2016345686</td>
        <td>2278621610</td>
        <td>0x87D101AA</td>
        <td>SyncML: Partial item not accepted.</td>
    </tr>
    <tr>
        <td>-2016345687</td>
        <td>2278621609</td>
        <td>0x87D101A9</td>
        <td>SyncML: The requested command failed because the sender does not have adequate access control permissions (ACL) on the recipient.</td>
    </tr>
    <tr>
        <td>-2016345688</td>
        <td>2278621608</td>
        <td>0x87D101A8</td>
        <td>SyncML: The chunked object was received, but the size of the received object did not match the size declared within the first chunk.</td>
    </tr>
    <tr>
        <td>-2016345689</td>
        <td>2278621607</td>
        <td>0x87D101A7</td>
        <td>SyncML: The requested command failed because the �Soft Deleted� item was previously �Hard Deleted� on the server.</td>
    </tr>
    <tr>
        <td>-2016345690</td>
        <td>2278621606</td>
        <td>0x87D101A6</td>
        <td>SyncML: The requested command failed on the server because the CGI scripting in the LocURI was incorrectly formed.</td>
    </tr>
    <tr>
        <td>-2016345691</td>
        <td>2278621605</td>
        <td>0x87D101A5</td>
        <td>SyncML: The requested command failed on the server because the specified search grammar was not known.</td>
    </tr>
    <tr>
        <td>-2016345692</td>
        <td>2278621604</td>
        <td>0x87D101A4</td>
        <td>SyncML: The recipient has no more storage space for the remaining synchronization data.</td>
    </tr>
    <tr>
        <td>-2016345693</td>
        <td>2278621603</td>
        <td>0x87D101A3</td>
        <td>SyncML: The client request created a conflict which was resolved by the server command winning.</td>
    </tr>
    <tr>
        <td>-2016345694</td>
        <td>2278621602</td>
        <td>0x87D101A2</td>
        <td>SyncML: The requested Put or Add command failed because the target already exists.</td>
    </tr>
    <tr>
        <td>-2016345695</td>
        <td>2278621601</td>
        <td>0x87D101A1</td>
        <td>SyncML: The request failed at this time, and the originator should retry the request later.</td>
    </tr>
    <tr>
        <td>-2016345696</td>
        <td>2278621600</td>
        <td>0x87D101A0</td>
        <td>SyncML: The request failed because the specified byte size in the request was too big.</td>
    </tr>
    <tr>
        <td>-2016345697</td>
        <td>2278621599</td>
        <td>0x87D1019F</td>
        <td>SyncML: Unsupported media type or format.</td>
    </tr>
    <tr>
        <td>-2016345698</td>
        <td>2278621598</td>
        <td>0x87D1019E</td>
        <td>SyncML: The requested command failed because the target URI is too long for what the recipient is able or willing to process.</td>
    </tr>
    <tr>
        <td>-2016345699</td>
        <td>2278621597</td>
        <td>0x87D1019D</td>
        <td>SyncML: The recipient refuses to perform the requested command because the requested item is larger than the recipient is able or willing to process.</td>
    </tr>
    <tr>
        <td>-2016345700</td>
        <td>2278621596</td>
        <td>0x87D1019C</td>
        <td>SyncML: The requested command failed on the recipient because it was incomplete or incorrectly formed.</td>
    </tr>
    <tr>
        <td>-2016345701</td>
        <td>2278621595</td>
        <td>0x87D1019B</td>
        <td>SyncML: The requested command must be accompanied by byte size or length information in the Meta element type.</td>
    </tr>
    <tr>
        <td>-2016345702</td>
        <td>2278621594</td>
        <td>0x87D1019A</td>
        <td>SyncML: The requested target is no longer on the recipient, and no forwarding URI is known.</td>
    </tr>
    <tr>
        <td>-2016345703</td>
        <td>2278621593</td>
        <td>0x87D10199</td>
        <td>SyncML: The requested failed because of an update conflict between the client and server versions of the data.</td>
    </tr>
    <tr>
        <td>-2016345704</td>
        <td>2278621592</td>
        <td>0x87D10198</td>
        <td>SyncML: An expected message was not received within the required period of time.</td>
    </tr>
    <tr>
        <td>-2016345705</td>
        <td>2278621591</td>
        <td>0x87D10197</td>
        <td>SyncML: The requested command failed because the originator must provide proper authentication.</td>
    </tr>
    <tr>
        <td>-2016345706</td>
        <td>2278621590</td>
        <td>0x87D10196</td>
        <td>SyncML: The requested command failed because an optional feature in the request was not supported.</td>
    </tr>
    <tr>
        <td>-2016345707</td>
        <td>2278621589</td>
        <td>0x87D10195</td>
        <td>SyncML: The requested command is not allowed on the target.</td>
    </tr>
    <tr>
        <td>-2016345708</td>
        <td>2278621588</td>
        <td>0x87D10194</td>
        <td>SyncML: The requested target was not found.</td>
    </tr>
    <tr>
        <td>-2016345709</td>
        <td>2278621587</td>
        <td>0x87D10193</td>
        <td>SyncML: The requested command failed, but the recipient understood the requested command.</td>
    </tr>
    <tr>
        <td>-2016345710</td>
        <td>2278621586</td>
        <td>0x87D10192</td>
        <td>SyncML: The requested command failed because proper payment is needed.</td>
    </tr>
    <tr>
        <td>-2016345711</td>
        <td>2278621585</td>
        <td>0x87D10191</td>
        <td>SyncML: The requested command failed because the requestor must provide proper authentication.</td>
    </tr>
    <tr>
        <td>-2016345712</td>
        <td>2278621584</td>
        <td>0x87D10190</td>
        <td>SyncML: The requested command could not be performed because of malformed syntax in the command.</td>
    </tr>
    <tr>
        <td>-2016345807</td>
        <td>2278621489</td>
        <td>0x87D10131</td>
        <td>SyncML: The requested target must be accessed through the specified proxy URI.</td>
    </tr>
    <tr>
        <td>-2016345808</td>
        <td>2278621488</td>
        <td>0x87D10130</td>
        <td>SyncML: The requested SyncML command was not executed on the target.</td>
    </tr>
    <tr>
        <td>-2016345809</td>
        <td>2278621487</td>
        <td>0x87D1012F</td>
        <td>SyncML: The requested target can be found at another URI.</td>
    </tr>
    <tr>
        <td>-2016345810</td>
        <td>2278621486</td>
        <td>0x87D1012E</td>
        <td>SyncML: The requested target has temporarily moved to a different URI.</td>
    </tr>
    <tr>
        <td>-2016345811</td>
        <td>2278621485</td>
        <td>0x87D1012D</td>
        <td>SyncML: The requested target has a new URI.</td>
    </tr>
    <tr>
        <td>-2016345812</td>
        <td>2278621484</td>
        <td>0x87D1012C</td>
        <td>SyncML: The requested target is one of several multiple alternatives requested target.</td>
    </tr>
    <tr>
        <td>-2016346011</td>
        <td>2278621285</td>
        <td>0x87D10065</td>
        <td>SyncML: The specified SyncML command is being carried out but has not yet been completed.</td>
    </tr>
    <tr>
        <td>-2016403452</td>
        <td>2278563844</td>
        <td>0x87D02004</td>
        <td>The software distribution policy was not found.</td>
    </tr>
    <tr>
        <td>-2016403454</td>
        <td>2278563842</td>
        <td>0x87D02002</td>
        <td>The software distribution policy for this program was not found.</td>
    </tr>
    <tr>
        <td>-2016406894</td>
        <td>2278560402</td>
        <td>0x87D01292</td>
        <td>The virtual application is in use</td>
    </tr>
    <tr>
        <td>-2016406895</td>
        <td>2278560401</td>
        <td>0x87D01291</td>
        <td>The virtual environment is not applicable</td>
    </tr>
    <tr>
        <td>-2016406896</td>
        <td>2278560400</td>
        <td>0x87D01290</td>
        <td>An error occurred when querying the App-V WMI provider</td>
    </tr>
    <tr>
        <td>-2016406897</td>
        <td>2278560399</td>
        <td>0x87D0128F</td>
        <td>The App-V time command returned failure</td>
    </tr>
    <tr>
        <td>-2016406898</td>
        <td>2278560398</td>
        <td>0x87D0128E</td>
        <td>I could not uninstall the App-V deployment type because of conflict. The published components in this DT are still published by other DTs. This DT will always be detected as long as other DTs are still installed.</td>
    </tr>
    <tr>
        <td>-2016406900</td>
        <td>2278560396</td>
        <td>0x87D0128C</td>
        <td>I could not find a streaming distribution point for the App-V package</td>
    </tr>
    <tr>
        <td>-2016406901</td>
        <td>2278560395</td>
        <td>0x87D0128B</td>
        <td>The App-V application is not installed</td>
    </tr>
    <tr>
        <td>-2016406902</td>
        <td>2278560394</td>
        <td>0x87D0128A</td>
        <td>The App-V client has reported a launch error</td>
    </tr>
    <tr>
        <td>-2016406906</td>
        <td>2278560390</td>
        <td>0x87D01286</td>
        <td>The App-V package has already installed a higher version by another deployment type, so we cannot install a lower version of the package</td>
    </tr>
    <tr>
        <td>-2016406907</td>
        <td>2278560389</td>
        <td>0x87D01285</td>
        <td>A dependent App-V package is not installed</td>
    </tr>
    <tr>
        <td>-2016406911</td>
        <td>2278560385</td>
        <td>0x87D01281</td>
        <td>A supported App-V client is not installed</td>
    </tr>
    <tr>
        <td>-2016406912</td>
        <td>2278560384</td>
        <td>0x87D01280</td>
        <td>The virtual application is currently in use</td>
    </tr>
    <tr>
        <td>-2016406959</td>
        <td>2278560337</td>
        <td>0x87D01251</td>
        <td>The application deployment type handler could not be initialized. The deployment type might not be supported on this system.</td>
    </tr>
    <tr>
        <td>-2016406960</td>
        <td>2278560336</td>
        <td>0x87D01250</td>
        <td>The computer restart cannot be initiated because a software installation job is in progress.</td>
    </tr>
    <tr>
        <td>-2016407024</td>
        <td>2278560272</td>
        <td>0x87D01210</td>
        <td>Failed to get content locations.</td>
    </tr>
    <tr>
        <td>-2016407036</td>
        <td>2278560260</td>
        <td>0x87D01204</td>
        <td>No distribution points were found for the requested content.</td>
    </tr>
    <tr>
        <td>-2016407037</td>
        <td>2278560259</td>
        <td>0x87D01203</td>
        <td>The client cache is currently in use by a running program or by a download in progress.</td>
    </tr>
    <tr>
        <td>-2016407038</td>
        <td>2278560258</td>
        <td>0x87D01202</td>
        <td>The content download cannot be performed because the total size of the client cache is smaller than the size of the requested content.</td>
    </tr>
    <tr>
        <td>-2016407039</td>
        <td>2278560257</td>
        <td>0x87D01201</td>
        <td>The content download cannot be performed because there is not enough available space in the cache or the disk is full.</td>
    </tr>
    <tr>
        <td>-2016407040</td>
        <td>2278560256</td>
        <td>0x87D01200</td>
        <td>No content request was found with the given handle.</td>
    </tr>
    <tr>
        <td>-2016407286</td>
        <td>2278560010</td>
        <td>0x87D0110A</td>
        <td>A fatal error occurred while preparing to execute the program, for example, when creating the program execution environment making a network connection impersonating the user determining the file association information or when attempting to launch the program. This program execution will not be retried.</td>
    </tr>
    <tr>
        <td>-2016407287</td>
        <td>2278560009</td>
        <td>0x87D01109</td>
        <td>Failed to verify that the given file is a valid installation package.</td>
    </tr>
    <tr>
        <td>-2016407288</td>
        <td>2278560008</td>
        <td>0x87D01108</td>
        <td>Failed to access all the provided program locations. This program will not retry.</td>
    </tr>
    <tr>
        <td>-2016407289</td>
        <td>2278560007</td>
        <td>0x87D01107</td>
        <td>Failed to access all the provided program locations. This program may retry if the maximum retry count has not been reached.</td>
    </tr>
    <tr>
        <td>-2016407290</td>
        <td>2278560006</td>
        <td>0x87D01106</td>
        <td>Failed to verify the executable file is valid or to construct the associated command line.</td>
    </tr>
    <tr>
        <td>-2016407291</td>
        <td>2278560005</td>
        <td>0x87D01105</td>
        <td>An error was encountered while getting the process information for the launched program, and the program execution will not be monitored.</td>
    </tr>
    <tr>
        <td>-2016407292</td>
        <td>2278560004</td>
        <td>0x87D01104</td>
        <td>The command line for this program is invalid.</td>
    </tr>
    <tr>
        <td>-2016407293</td>
        <td>2278560003</td>
        <td>0x87D01103</td>
        <td>A nonfatal error occurred while preparing to execute the program, for example, when creating the program execution environment making a network connection impersonating the user determining the file association information or when attempting to launch the program. This program execution will be retried if the retry count has not been exceeded.</td>
    </tr>
    <tr>
        <td>-2016407294</td>
        <td>2278560002</td>
        <td>0x87D01102</td>
        <td>An error occurred while creating the execution context.</td>
    </tr>
    <tr>
        <td>-2016407295</td>
        <td>2278560001</td>
        <td>0x87D01101</td>
        <td>A fatal error has been encountered while attempting to run the program. The program execution will not be retried.</td>
    </tr>
    <tr>
        <td>-2016407296</td>
        <td>2278560000</td>
        <td>0x87D01100</td>
        <td>A non-fatal error has been encountered while attempting to run the program. The program execution will be retried if the retry count has not been exceeded.</td>
    </tr>
    <tr>
        <td>-2016407528</td>
        <td>2278559768</td>
        <td>0x87D01018</td>
        <td>The program cannot run at this time because the client is on the internet.</td>
    </tr>
    <tr>
        <td>-2016407529</td>
        <td>2278559767</td>
        <td>0x87D01017</td>
        <td>The content hash string or hash version is empty or incorrect in the software distribution policy, or the hash verification failed.</td>
    </tr>
    <tr>
        <td>-2016407531</td>
        <td>2278559765</td>
        <td>0x87D01015</td>
        <td>Failed to notify the caller that software distribution is paused because the paused state or paused cookie does not match.</td>
    </tr>
    <tr>
        <td>-2016407532</td>
        <td>2278559764</td>
        <td>0x87D01014</td>
        <td>The program cannot run because it is targeted to a user that requires user input or is set to run in the user context.</td>
    </tr>
    <tr>
        <td>-2016407533</td>
        <td>2278559763</td>
        <td>0x87D01013</td>
        <td>This program cannot run because it depends on another program that has not run successfully before.</td>
    </tr>
    <tr>
        <td>-2016407534</td>
        <td>2278559762</td>
        <td>0x87D01012</td>
        <td>There is no program currently running.</td>
    </tr>
    <tr>
        <td>-2016407535</td>
        <td>2278559761</td>
        <td>0x87D01011</td>
        <td>The execution request was not found.</td>
    </tr>
    <tr>
        <td>-2016407536</td>
        <td>2278559760</td>
        <td>0x87D01010</td>
        <td>A system restart is in progress, or there is a pending execution for this program that requires a computer restart.</td>
    </tr>
    <tr>
        <td>-2016407543</td>
        <td>2278559753</td>
        <td>0x87D01009</td>
        <td>Failed to get data from WMI.</td>
    </tr>
    <tr>
        <td>-2016407544</td>
        <td>2278559752</td>
        <td>0x87D01008</td>
        <td>Failed to indicate the client cache is currently in use.</td>
    </tr>
    <tr>
        <td>-2016407546</td>
        <td>2278559750</td>
        <td>0x87D01006</td>
        <td>The requested program is not currently pending.</td>
    </tr>
    <tr>
        <td>-2016407547</td>
        <td>2278559749</td>
        <td>0x87D01005</td>
        <td>The policy for this program does not exist or is invalid.</td>
    </tr>
    <tr>
        <td>-2016407548</td>
        <td>2278559748</td>
        <td>0x87D01004</td>
        <td>The program is disabled.</td>
    </tr>
    <tr>
        <td>-2016407550</td>
        <td>2278559746</td>
        <td>0x87D01002</td>
        <td>Another execution for this program is already pending.</td>
    </tr>
    <tr>
        <td>-2016407551</td>
        <td>2278559745</td>
        <td>0x87D01001</td>
        <td>Another software execution is in progress, or a restart is pending.</td>
    </tr>
    <tr>
        <td>-2016409588</td>
        <td>2278557708</td>
        <td>0x87D0080C</td>
        <td>No WDS session is available.</td>
    </tr>
    <tr>
        <td>-2016409589</td>
        <td>2278557707</td>
        <td>0x87D0080B</td>
        <td>MCS Encountered WDS error.</td>
    </tr>
    <tr>
        <td>-2016409590</td>
        <td>2278557706</td>
        <td>0x87D0080A</td>
        <td>Invalid MCS configuration.</td>
    </tr>
    <tr>
        <td>-2016409591</td>
        <td>2278557705</td>
        <td>0x87D00809</td>
        <td>The package is not multicast enabled.</td>
    </tr>
    <tr>
        <td>-2016409592</td>
        <td>2278557704</td>
        <td>0x87D00808</td>
        <td>The package is not multicast shared.</td>
    </tr>
    <tr>
        <td>-2016409593</td>
        <td>2278557703</td>
        <td>0x87D00807</td>
        <td>The invalid path is specified for Package.</td>
    </tr>
    <tr>
        <td>-2016409594</td>
        <td>2278557702</td>
        <td>0x87D00806</td>
        <td>MCS Server is Busy with many clients.</td>
    </tr>
    <tr>
        <td>-2016409595</td>
        <td>2278557701</td>
        <td>0x87D00805</td>
        <td>MCS Encryption is empty</td>
    </tr>
    <tr>
        <td>-2016409596</td>
        <td>2278557700</td>
        <td>0x87D00804</td>
        <td>Error performing MCS health check</td>
    </tr>
    <tr>
        <td>-2016409597</td>
        <td>2278557699</td>
        <td>0x87D00803</td>
        <td>Error opening MCS session</td>
    </tr>
    <tr>
        <td>-2016409598</td>
        <td>2278557698</td>
        <td>0x87D00802</td>
        <td>MCS protocol version mismatch</td>
    </tr>
    <tr>
        <td>-2016409599</td>
        <td>2278557697</td>
        <td>0x87D00801</td>
        <td>General MCS Failure</td>
    </tr>
    <tr>
        <td>-2016409600</td>
        <td>2278557696</td>
        <td>0x87D00800</td>
        <td>The content transfer manager job is in an unexpected state</td>
    </tr>
    <tr>
        <td>-2016409835</td>
        <td>2278557461</td>
        <td>0x87D00715</td>
        <td>No updates specified in the requested job</td>
    </tr>
    <tr>
        <td>-2016409836</td>
        <td>2278557460</td>
        <td>0x87D00714</td>
        <td>User-based install not allowed as system restart is pending</td>
    </tr>
    <tr>
        <td>-2016409837</td>
        <td>2278557459</td>
        <td>0x87D00713</td>
        <td>Software updates detection results have not been received yet</td>
    </tr>
    <tr>
        <td>-2016409838</td>
        <td>2278557458</td>
        <td>0x87D00712</td>
        <td>A system restart is required to complete the installation</td>
    </tr>
    <tr>
        <td>-2016409839</td>
        <td>2278557457</td>
        <td>0x87D00711</td>
        <td>Software updates deployment not active yet, i.e., start time is in future</td>
    </tr>
    <tr>
        <td>-2016409840</td>
        <td>2278557456</td>
        <td>0x87D00710</td>
        <td>Failed to compare process creation time</td>
    </tr>
    <tr>
        <td>-2016409841</td>
        <td>2278557455</td>
        <td>0x87D0070F</td>
        <td>Invalid updates installer path</td>
    </tr>
    <tr>
        <td>-2016409842</td>
        <td>2278557454</td>
        <td>0x87D0070E</td>
        <td>The empty command line specified</td>
    </tr>
    <tr>
        <td>-2016409843</td>
        <td>2278557453</td>
        <td>0x87D0070D</td>
        <td>The software update failed when attempted</td>
    </tr>
    <tr>
        <td>-2016409844</td>
        <td>2278557452</td>
        <td>0x87D0070C</td>
        <td>Software update execution timeout</td>
    </tr>
    <tr>
        <td>-2016409845</td>
        <td>2278557451</td>
        <td>0x87D0070B</td>
        <td>Failed to create a process</td>
    </tr>
    <tr>
        <td>-2016409846</td>
        <td>2278557450</td>
        <td>0x87D0070A</td>
        <td>Invalid command line</td>
    </tr>
    <tr>
        <td>-2016409847</td>
        <td>2278557449</td>
        <td>0x87D00709</td>
        <td>Failed to resume the monitoring of the process</td>
    </tr>
    <tr>
        <td>-2016409848</td>
        <td>2278557448</td>
        <td>0x87D00708</td>
        <td>Software Updates Install not required</td>
    </tr>
    <tr>
        <td>-2016409849</td>
        <td>2278557447</td>
        <td>0x87D00707</td>
        <td>Job Id mismatch</td>
    </tr>
    <tr>
        <td>-2016409850</td>
        <td>2278557446</td>
        <td>0x87D00706</td>
        <td>No active job exists</td>
    </tr>
    <tr>
        <td>-2016409851</td>
        <td>2278557445</td>
        <td>0x87D00705</td>
        <td>Pause state required</td>
    </tr>
    <tr>
        <td>-2016409852</td>
        <td>2278557444</td>
        <td>0x87D00704</td>
        <td>A hard reboot is pending</td>
    </tr>
    <tr>
        <td>-2016409853</td>
        <td>2278557443</td>
        <td>0x87D00703</td>
        <td>Another software updates install job is in progress. Only one job is allowed at a time.</td>
    </tr>
    <tr>
        <td>-2016409854</td>
        <td>2278557442</td>
        <td>0x87D00702</td>
        <td>Assignment policy not found</td>
    </tr>
    <tr>
        <td>-2016409855</td>
        <td>2278557441</td>
        <td>0x87D00701</td>
        <td>Software updates download not allowed at this time</td>
    </tr>
    <tr>
        <td>-2016409856</td>
        <td>2278557440</td>
        <td>0x87D00700</td>
        <td>Software updates installation not allowed at this time</td>
    </tr>
    <tr>
        <td>-2016409959</td>
        <td>2278557337</td>
        <td>0x87D00699</td>
        <td>The scan is already in progress</td>
    </tr>
    <tr>
        <td>-2016409960</td>
        <td>2278557336</td>
        <td>0x87D00698</td>
        <td>Software update being attempted is not actionable</td>
    </tr>
    <tr>
        <td>-2016409961</td>
        <td>2278557335</td>
        <td>0x87D00697</td>
        <td>The software update is already installed but just requires a reboot to complete the installation</td>
    </tr>
    <tr>
        <td>-2016409962</td>
        <td>2278557334</td>
        <td>0x87D00696</td>
        <td>The software update is already installed</td>
    </tr>
    <tr>
        <td>-2016409963</td>
        <td>2278557333</td>
        <td>0x87D00695</td>
        <td>Incomplete scan results</td>
    </tr>
    <tr>
        <td>-2016409964</td>
        <td>2278557332</td>
        <td>0x87D00694</td>
        <td>WSUS source already exists</td>
    </tr>
    <tr>
        <td>-2016409965</td>
        <td>2278557331</td>
        <td>0x87D00693</td>
        <td>Windows Updates Agent version too low</td>
    </tr>
    <tr>
        <td>-2016409966</td>
        <td>2278557330</td>
        <td>0x87D00692</td>
        <td>Group policy conflict</td>
    </tr>
    <tr>
        <td>-2016409967</td>
        <td>2278557329</td>
        <td>0x87D00691</td>
        <td>Software update source not found</td>
    </tr>
    <tr>
        <td>-2016409968</td>
        <td>2278557328</td>
        <td>0x87D00690</td>
        <td>The software update is not applicable</td>
    </tr>
    <tr>
        <td>-2016409999</td>
        <td>2278557297</td>
        <td>0x87D00671</td>
        <td>Waiting for a third-party orchestration engine to initiate the installation</td>
    </tr>
    <tr>
        <td>-2016410006</td>
        <td>2278557290</td>
        <td>0x87D0066A</td>
        <td>None of the child software updates of a bundle are applicable</td>
    </tr>
    <tr>
        <td>-2016410007</td>
        <td>2278557289</td>
        <td>0x87D00669</td>
        <td>Not able to get software updates content locations at this time</td>
    </tr>
    <tr>
        <td>-2016410008</td>
        <td>2278557288</td>
        <td>0x87D00668</td>
        <td>Software update still detected as actionable after apply</td>
    </tr>
    <tr>
        <td>-2016410009</td>
        <td>2278557287</td>
        <td>0x87D00667</td>
        <td>No current or future service window exists to install software updates</td>
    </tr>
    <tr>
        <td>-2016410010</td>
        <td>2278557286</td>
        <td>0x87D00666</td>
        <td>Software updates cannot be installed outside the service window</td>
    </tr>
    <tr>
        <td>-2016410011</td>
        <td>2278557285</td>
        <td>0x87D00665</td>
        <td>No updates to process in the job</td>
    </tr>
    <tr>
        <td>-2016410012</td>
        <td>2278557284</td>
        <td>0x87D00664</td>
        <td>Updates handler job was canceled</td>
    </tr>
    <tr>
        <td>-2016410013</td>
        <td>2278557283</td>
        <td>0x87D00663</td>
        <td>Failed to report installation status of software updates</td>
    </tr>
    <tr>
        <td>-2016410014</td>
        <td>2278557282</td>
        <td>0x87D00662</td>
        <td>Failed to trigger the installation of software updates</td>
    </tr>
    <tr>
        <td>-2016410015</td>
        <td>2278557281</td>
        <td>0x87D00661</td>
        <td>Error while detecting updates status after installation success</td>
    </tr>
    <tr>
        <td>-2016410016</td>
        <td>2278557280</td>
        <td>0x87D00660</td>
        <td>Unable to monitor a software update�s execution</td>
    </tr>
    <tr>
        <td>-2016410023</td>
        <td>2278557273</td>
        <td>0x87D00659</td>
        <td>An error occurred reading policy for software update</td>
    </tr>
    <tr>
        <td>-2016410024</td>
        <td>2278557272</td>
        <td>0x87D00658</td>
        <td>Software updates processing was canceled</td>
    </tr>
    <tr>
        <td>-2016410025</td>
        <td>2278557271</td>
        <td>0x87D00657</td>
        <td>Error while detecting software updates status after scan success</td>
    </tr>
    <tr>
        <td>-2016410026</td>
        <td>2278557270</td>
        <td>0x87D00656</td>
        <td>Updates handler was unable to continue due to some generic internal error</td>
    </tr>
    <tr>
        <td>-2016410027</td>
        <td>2278557269</td>
        <td>0x87D00655</td>
        <td>Failed to install one or more software updates</td>
    </tr>
    <tr>
        <td>-2016410028</td>
        <td>2278557268</td>
        <td>0x87D00654</td>
        <td>Software update install failure occurred</td>
    </tr>
    <tr>
        <td>-2016410029</td>
        <td>2278557267</td>
        <td>0x87D00653</td>
        <td>Software update download failure occurred</td>
    </tr>
    <tr>
        <td>-2016410030</td>
        <td>2278557266</td>
        <td>0x87D00652</td>
        <td>Software update policy was not found</td>
    </tr>
    <tr>
        <td>-2016410031</td>
        <td>2278557265</td>
        <td>0x87D00651</td>
        <td>Post-install scan failed</td>
    </tr>
    <tr>
        <td>-2016410032</td>
        <td>2278557264</td>
        <td>0x87D00650</td>
        <td>Pre-install scan failed</td>
    </tr>
    <tr>
        <td>-2016410060</td>
        <td>2278557236</td>
        <td>0x87D00634</td>
        <td>Legacy scanner not supported</td>
    </tr>
    <tr>
        <td>-2016410061</td>
        <td>2278557235</td>
        <td>0x87D00633</td>
        <td>The offline scan is pending</td>
    </tr>
    <tr>
        <td>-2016410062</td>
        <td>2278557234</td>
        <td>0x87D00632</td>
        <td>The online scan is pending</td>
    </tr>
    <tr>
        <td>-2016410063</td>
        <td>2278557233</td>
        <td>0x87D00631</td>
        <td>Scan retry is pending</td>
    </tr>
    <tr>
        <td>-2016410064</td>
        <td>2278557232</td>
        <td>0x87D00630</td>
        <td>Maximum retries exhausted</td>
    </tr>
    <tr>
        <td>-2016410071</td>
        <td>2278557225</td>
        <td>0x87D00629</td>
        <td>Rescan of the updates is pending</td>
    </tr>
    <tr>
        <td>-2016410072</td>
        <td>2278557224</td>
        <td>0x87D00628</td>
        <td>Invalid content location</td>
    </tr>
    <tr>
        <td>-2016410073</td>
        <td>2278557223</td>
        <td>0x87D00627</td>
        <td>Process instance not found</td>
    </tr>
    <tr>
        <td>-2016410074</td>
        <td>2278557222</td>
        <td>0x87D00626</td>
        <td>Invalid process instance information</td>
    </tr>
    <tr>
        <td>-2016410104</td>
        <td>2278557192</td>
        <td>0x87D00608</td>
        <td>Invalid instance type</td>
    </tr>
    <tr>
        <td>-2016410105</td>
        <td>2278557191</td>
        <td>0x87D00607</td>
        <td>Content not found</td>
    </tr>
    <tr>
        <td>-2016410106</td>
        <td>2278557190</td>
        <td>0x87D00606</td>
        <td>Offline scan tool history not found</td>
    </tr>
    <tr>
        <td>-2016410107</td>
        <td>2278557189</td>
        <td>0x87D00605</td>
        <td>The scan tool has been removed</td>
    </tr>
    <tr>
        <td>-2016410108</td>
        <td>2278557188</td>
        <td>0x87D00604</td>
        <td>The ScanTool not found in the job queue</td>
    </tr>
    <tr>
        <td>-2016410109</td>
        <td>2278557187</td>
        <td>0x87D00603</td>
        <td>The ScanTool Policy has been removed, so cannot complete scan operation</td>
    </tr>
    <tr>
        <td>-2016410110</td>
        <td>2278557186</td>
        <td>0x87D00602</td>
        <td>Content location request timeout occurred</td>
    </tr>
    <tr>
        <td>-2016410111</td>
        <td>2278557185</td>
        <td>0x87D00601</td>
        <td>Scanning for updates timed out</td>
    </tr>
    <tr>
        <td>-2016410112</td>
        <td>2278557184</td>
        <td>0x87D00600</td>
        <td>Scan Tool Policy not found</td>
    </tr>
    <tr>
        <td>-2016410558</td>
        <td>2278556738</td>
        <td>0x87D00442</td>
        <td>An enforcement action (install/uninstall) was attempted for a simulated deployment.</td>
    </tr>
    <tr>
        <td>-2016410559</td>
        <td>2278556737</td>
        <td>0x87D00441</td>
        <td>The deployment metadata is not available on the client.</td>
    </tr>
    <tr>
        <td>-2016410560</td>
        <td>2278556736</td>
        <td>0x87D00440</td>
        <td>Expected policy documents are incomplete or missing.</td>
    </tr>
    <tr>
        <td>-2016410592</td>
        <td>2278556704</td>
        <td>0x87D00420</td>
        <td>The detection rules refer to an unsupported WMI namespace.</td>
    </tr>
    <tr>
        <td>-2016410621</td>
        <td>2278556675</td>
        <td>0x87D00403</td>
        <td>The detection rules contain an unsupported datatype.</td>
    </tr>
    <tr>
        <td>-2016410622</td>
        <td>2278556674</td>
        <td>0x87D00402</td>
        <td>The detection rules contain an invalid operator.</td>
    </tr>
    <tr>
        <td>-2016410623</td>
        <td>2278556673</td>
        <td>0x87D00401</td>
        <td>An incorrect XML expression was found when evaluating the detection rules.</td>
    </tr>
    <tr>
        <td>-2016410624</td>
        <td>2278556672</td>
        <td>0x87D00400</td>
        <td>An unexpected error occurred when evaluating the detection rules.</td>
    </tr>
    <tr>
        <td>-2016410832</td>
        <td>2278556464</td>
        <td>0x87D00330</td>
        <td>This application deployment type does not support being enforced with a required deployment</td>
    </tr>
    <tr>
        <td>-2016410838</td>
        <td>2278556458</td>
        <td>0x87D0032A</td>
        <td>The uninstall command line is invalid</td>
    </tr>
    <tr>
        <td>-2016410839</td>
        <td>2278556457</td>
        <td>0x87D00329</td>
        <td>Application requirement evaluation or detection failed</td>
    </tr>
    <tr>
        <td>-2016410840</td>
        <td>2278556456</td>
        <td>0x87D00328</td>
        <td>Configuration item digest not found</td>
    </tr>
    <tr>
        <td>-2016410841</td>
        <td>2278556455</td>
        <td>0x87D00327</td>
        <td>The script is not signed</td>
    </tr>
    <tr>
        <td>-2016410842</td>
        <td>2278556454</td>
        <td>0x87D00326</td>
        <td>The application deployment metadata was not found in WMI</td>
    </tr>
    <tr>
        <td>-2016410843</td>
        <td>2278556453</td>
        <td>0x87D00325</td>
        <td>The application was still detected after uninstalling was completed.</td>
    </tr>
    <tr>
        <td>-2016410844</td>
        <td>2278556452</td>
        <td>0x87D00324</td>
        <td>The application was not detected after the installation was completed.</td>
    </tr>
    <tr>
        <td>-2016410845</td>
        <td>2278556451</td>
        <td>0x87D00323</td>
        <td>No user is logged on.</td>
    </tr>
    <tr>
        <td>-2016410846</td>
        <td>2278556450</td>
        <td>0x87D00322</td>
        <td>Rule conflict.</td>
    </tr>
    <tr>
        <td>-2016410847</td>
        <td>2278556449</td>
        <td>0x87D00321</td>
        <td>The script execution has timed out.</td>
    </tr>
    <tr>
        <td>-2016410848</td>
        <td>2278556448</td>
        <td>0x87D00320</td>
        <td>The script host has not been installed yet.</td>
    </tr>
    <tr>
        <td>-2016410849</td>
        <td>2278556447</td>
        <td>0x87D0031F</td>
        <td>Script for discovery returned invalid data.</td>
    </tr>
    <tr>
        <td>-2016410850</td>
        <td>2278556446</td>
        <td>0x87D0031E</td>
        <td>Unsupported configuration. The application is configured to Install for User but has been targeted to a mechanical device instead of the user.</td>
    </tr>
    <tr>
        <td>-2016410851</td>
        <td>2278556445</td>
        <td>0x87D0031D</td>
        <td>Unsupported configuration. The application is targeted to a user but is configured to install when no user is logged in.</td>
    </tr>
    <tr>
        <td>-2016410858</td>
        <td>2278556438</td>
        <td>0x87D00316</td>
        <td>CI Agent job was canceled.</td>
    </tr>
    <tr>
        <td>-2016410859</td>
        <td>2278556437</td>
        <td>0x87D00315</td>
        <td>The CI version info data is not available.</td>
    </tr>
    <tr>
        <td>-2016410860</td>
        <td>2278556436</td>
        <td>0x87D00314</td>
        <td>CI Version Info timed out.</td>
    </tr>
    <tr>
        <td>-2016410983</td>
        <td>2278556313</td>
        <td>0x87D00299</td>
        <td>The client does not recognize this type of signature</td>
    </tr>
    <tr>
        <td>-2016410984</td>
        <td>2278556312</td>
        <td>0x87D00298</td>
        <td>The client�s database record could not be validated</td>
    </tr>
    <tr>
        <td>-2016410985</td>
        <td>2278556311</td>
        <td>0x87D00297</td>
        <td>Invalid key</td>
    </tr>
    <tr>
        <td>-2016410986</td>
        <td>2278556310</td>
        <td>0x87D00296</td>
        <td>The client failed to process one or more CI documents</td>
    </tr>
    <tr>
        <td>-2016410987</td>
        <td>2278556309</td>
        <td>0x87D00295</td>
        <td>Registration certificate is either missing or invalid</td>
    </tr>
    <tr>
        <td>-2016410988</td>
        <td>2278556308</td>
        <td>0x87D00294</td>
        <td>Unable to verify Policy</td>
    </tr>
    <tr>
        <td>-2016410989</td>
        <td>2278556307</td>
        <td>0x87D00293</td>
        <td>Client unable to Refresh Site server signing certificate</td>
    </tr>
    <tr>
        <td>-2016410990</td>
        <td>2278556306</td>
        <td>0x87D00292</td>
        <td>Client unable to compute message signature for InBand Auth</td>
    </tr>
    <tr>
        <td>-2016410991</td>
        <td>2278556305</td>
        <td>0x87D00291</td>
        <td>No task sequence policies assigned</td>
    </tr>
    <tr>
        <td>-2016410992</td>
        <td>2278556304</td>
        <td>0x87D00290</td>
        <td>The job contains no items</td>
    </tr>
    <tr>
        <td>-2016410999</td>
        <td>2278556297</td>
        <td>0x87D00289</td>
        <td>Failed to decompress CI documents</td>
    </tr>
    <tr>
        <td>-2016411000</td>
        <td>2278556296</td>
        <td>0x87D00288</td>
        <td>Failed to decompress configuration item</td>
    </tr>
    <tr>
        <td>-2016411001</td>
        <td>2278556295</td>
        <td>0x87D00287</td>
        <td>The signing certificate is missing</td>
    </tr>
    <tr>
        <td>-2016411002</td>
        <td>2278556294</td>
        <td>0x87D00286</td>
        <td>Invalid SMS authority</td>
    </tr>
    <tr>
        <td>-2016411003</td>
        <td>2278556293</td>
        <td>0x87D00285</td>
        <td>Search criteria verb is either missing or invalid</td>
    </tr>
    <tr>
        <td>-2016411004</td>
        <td>2278556292</td>
        <td>0x87D00284</td>
        <td>Missing subject name</td>
    </tr>
    <tr>
        <td>-2016411005</td>
        <td>2278556291</td>
        <td>0x87D00283</td>
        <td>Missing private key</td>
    </tr>
    <tr>
        <td>-2016411006</td>
        <td>2278556290</td>
        <td>0x87D00282</td>
        <td>More than one certificate was found, but �select first cert� was not set</td>
    </tr>
    <tr>
        <td>-2016411007</td>
        <td>2278556289</td>
        <td>0x87D00281</td>
        <td>No certificate matching criteria specified</td>
    </tr>
    <tr>
        <td>-2016411008</td>
        <td>2278556288</td>
        <td>0x87D00280</td>
        <td>Empty certificate store</td>
    </tr>
    <tr>
        <td>-2016411009</td>
        <td>2278556287</td>
        <td>0x87D0027F</td>
        <td>SHA could not bind as NAP Agent might not be running</td>
    </tr>
    <tr>
        <td>-2016411010</td>
        <td>2278556286</td>
        <td>0x87D0027E</td>
        <td>Bad HTTP status code</td>
    </tr>
    <tr>
        <td>-2016411011</td>
        <td>2278556285</td>
        <td>0x87D0027D</td>
        <td>CI documents download failed due to hash mismatch</td>
    </tr>
    <tr>
        <td>-2016411012</td>
        <td>2278556284</td>
        <td>0x87D0027C</td>
        <td>CI documents download timed out</td>
    </tr>
    <tr>
        <td>-2016411013</td>
        <td>2278556283</td>
        <td>0x87D0027B</td>
        <td>General CI documents download failure</td>
    </tr>
    <tr>
        <td>-2016411014</td>
        <td>2278556282</td>
        <td>0x87D0027A</td>
        <td>Configuration item download failed due to hash mismatch</td>
    </tr>
    <tr>
        <td>-2016411015</td>
        <td>2278556281</td>
        <td>0x87D00279</td>
        <td>Configuration item download timed out</td>
    </tr>
    <tr>
        <td>-2016411016</td>
        <td>2278556280</td>
        <td>0x87D00278</td>
        <td>General configuration item download failure</td>
    </tr>
    <tr>
        <td>-2016411017</td>
        <td>2278556279</td>
        <td>0x87D00277</td>
        <td>Insufficient resources to complete the operation</td>
    </tr>
    <tr>
        <td>-2016411018</td>
        <td>2278556278</td>
        <td>0x87D00276</td>
        <td>A system restart is required</td>
    </tr>
    <tr>
        <td>-2016411019</td>
        <td>2278556277</td>
        <td>0x87D00275</td>
        <td>Failed to acquire the lock</td>
    </tr>
    <tr>
        <td>-2016411020</td>
        <td>2278556276</td>
        <td>0x87D00274</td>
        <td>No callback completion interface specified</td>
    </tr>
    <tr>
        <td>-2016411021</td>
        <td>2278556275</td>
        <td>0x87D00273</td>
        <td>The component has already been requested to pause</td>
    </tr>
    <tr>
        <td>-2016411022</td>
        <td>2278556274</td>
        <td>0x87D00272</td>
        <td>Component is disabled</td>
    </tr>
    <tr>
        <td>-2016411023</td>
        <td>2278556273</td>
        <td>0x87D00271</td>
        <td>Component is paused</td>
    </tr>
    <tr>
        <td>-2016411024</td>
        <td>2278556272</td>
        <td>0x87D00270</td>
        <td>The component is not paused</td>
    </tr>
    <tr>
        <td>-2016411025</td>
        <td>2278556271</td>
        <td>0x87D0026F</td>
        <td>Pause cookie did not match</td>
    </tr>
    <tr>
        <td>-2016411026</td>
        <td>2278556270</td>
        <td>0x87D0026E</td>
        <td>Pause duration too big</td>
    </tr>
    <tr>
        <td>-2016411027</td>
        <td>2278556269</td>
        <td>0x87D0026D</td>
        <td>Pause duration too small</td>
    </tr>
    <tr>
        <td>-2016411028</td>
        <td>2278556268</td>
        <td>0x87D0026C</td>
        <td>Status not found</td>
    </tr>
    <tr>
        <td>-2016411029</td>
        <td>2278556267</td>
        <td>0x87D0026B</td>
        <td>Agent type not found</td>
    </tr>
    <tr>
        <td>-2016411030</td>
        <td>2278556266</td>
        <td>0x87D0026A</td>
        <td>Key type not found</td>
    </tr>
    <tr>
        <td>-2016411031</td>
        <td>2278556265</td>
        <td>0x87D00269</td>
        <td>Required management point not found</td>
    </tr>
    <tr>
        <td>-2016411032</td>
        <td>2278556264</td>
        <td>0x87D00268</td>
        <td>Compilation failed</td>
    </tr>
    <tr>
        <td>-2016411033</td>
        <td>2278556263</td>
        <td>0x87D00267</td>
        <td>Download failed</td>
    </tr>
    <tr>
        <td>-2016411034</td>
        <td>2278556262</td>
        <td>0x87D00266</td>
        <td>Inconsistent data</td>
    </tr>
    <tr>
        <td>-2016411035</td>
        <td>2278556261</td>
        <td>0x87D00265</td>
        <td>Invalid store state</td>
    </tr>
    <tr>
        <td>-2016411036</td>
        <td>2278556260</td>
        <td>0x87D00264</td>
        <td>Invalid operation</td>
    </tr>
    <tr>
        <td>-2016411037</td>
        <td>2278556259</td>
        <td>0x87D00263</td>
        <td>Invalid message received from DTS</td>
    </tr>
    <tr>
        <td>-2016411038</td>
        <td>2278556258</td>
        <td>0x87D00262</td>
        <td>The type of DTS message received is unknown</td>
    </tr>
    <tr>
        <td>-2016411039</td>
        <td>2278556257</td>
        <td>0x87D00261</td>
        <td>Failed to persist configuration item definition</td>
    </tr>
    <tr>
        <td>-2016411040</td>
        <td>2278556256</td>
        <td>0x87D00260</td>
        <td>Job state is not valid for the action being requested</td>
    </tr>
    <tr>
        <td>-2016411041</td>
        <td>2278556255</td>
        <td>0x87D0025F</td>
        <td>Client disconnected</td>
    </tr>
    <tr>
        <td>-2016411042</td>
        <td>2278556254</td>
        <td>0x87D0025E</td>
        <td>Encountered a message which was not sufficiently trusted to forward to an endpoint for processing</td>
    </tr>
    <tr>
        <td>-2016411043</td>
        <td>2278556253</td>
        <td>0x87D0025D</td>
        <td>Encountered invalid XML document which could not be validated by its corresponding XML schema(s)</td>
    </tr>
    <tr>
        <td>-2016411060</td>
        <td>2278556236</td>
        <td>0x87D0024C</td>
        <td>Encountered invalid XML schema document</td>
    </tr>
    <tr>
        <td>-2016411061</td>
        <td>2278556235</td>
        <td>0x87D0024B</td>
        <td>Name already exists</td>
    </tr>
    <tr>
        <td>-2016411062</td>
        <td>2278556234</td>
        <td>0x87D0024A</td>
        <td>The job is already connected</td>
    </tr>
    <tr>
        <td>-2016411063</td>
        <td>2278556233</td>
        <td>0x87D00249</td>
        <td>Property is not valid for the given configuration item type</td>
    </tr>
    <tr>
        <td>-2016411064</td>
        <td>2278556232</td>
        <td>0x87D00248</td>
        <td>There was an error in network communication</td>
    </tr>
    <tr>
        <td>-2016411065</td>
        <td>2278556231</td>
        <td>0x87D00247</td>
        <td>A component required to perform the operation was missing or not registered</td>
    </tr>
    <tr>
        <td>-2016411066</td>
        <td>2278556230</td>
        <td>0x87D00246</td>
        <td>There was an error evaluating the health of the client</td>
    </tr>
    <tr>
        <td>-2016411067</td>
        <td>2278556229</td>
        <td>0x87D00245</td>
        <td>The objector subsystem has already been initialized</td>
    </tr>
    <tr>
        <td>-2016411068</td>
        <td>2278556228</td>
        <td>0x87D00244</td>
        <td>The object or subsystem has not been initialized</td>
    </tr>
    <tr>
        <td>-2016411069</td>
        <td>2278556227</td>
        <td>0x87D00243</td>
        <td>Public key mismatch</td>
    </tr>
    <tr>
        <td>-2016411070</td>
        <td>2278556226</td>
        <td>0x87D00242</td>
        <td>Stored procedure failed</td>
    </tr>
    <tr>
        <td>-2016411071</td>
        <td>2278556225</td>
        <td>0x87D00241</td>
        <td>Failed to connect to database</td>
    </tr>
    <tr>
        <td>-2016411072</td>
        <td>2278556224</td>
        <td>0x87D00240</td>
        <td>Insufficient disk space</td>
    </tr>
    <tr>
        <td>-2016411079</td>
        <td>2278556217</td>
        <td>0x87D00239</td>
        <td>Client id not found</td>
    </tr>
    <tr>
        <td>-2016411080</td>
        <td>2278556216</td>
        <td>0x87D00238</td>
        <td>Public key not found</td>
    </tr>
    <tr>
        <td>-2016411081</td>
        <td>2278556215</td>
        <td>0x87D00237</td>
        <td>Reply mode incompatible</td>
    </tr>
    <tr>
        <td>-2016411082</td>
        <td>2278556214</td>
        <td>0x87D00236</td>
        <td>Low memory</td>
    </tr>
    <tr>
        <td>-2016411083</td>
        <td>2278556213</td>
        <td>0x87D00235</td>
        <td>Syntax error occurred while parsing</td>
    </tr>
    <tr>
        <td>-2016411084</td>
        <td>2278556212</td>
        <td>0x87D00234</td>
        <td>An internal endpoint cannot receive a remote message</td>
    </tr>
    <tr>
        <td>-2016411085</td>
        <td>2278556211</td>
        <td>0x87D00233</td>
        <td>Message not trusted</td>
    </tr>
    <tr>
        <td>-2016411086</td>
        <td>2278556210</td>
        <td>0x87D00232</td>
        <td>Message not signed</td>
    </tr>
    <tr>
        <td>-2016411087</td>
        <td>2278556209</td>
        <td>0x87D00231</td>
        <td>Transient error</td>
    </tr>
    <tr>
        <td>-2016411088</td>
        <td>2278556208</td>
        <td>0x87D00230</td>
        <td>Error logging on as given credentials</td>
    </tr>
    <tr>
        <td>-2016411095</td>
        <td>2278556201</td>
        <td>0x87D00229</td>
        <td>Failed to get credentials</td>
    </tr>
    <tr>
        <td>-2016411096</td>
        <td>2278556200</td>
        <td>0x87D00228</td>
        <td>Invalid endpoint</td>
    </tr>
    <tr>
        <td>-2016411097</td>
        <td>2278556199</td>
        <td>0x87D00227</td>
        <td>Functionality disabled</td>
    </tr>
    <tr>
        <td>-2016411098</td>
        <td>2278556198</td>
        <td>0x87D00226</td>
        <td>Invalid protocol</td>
    </tr>
    <tr>
        <td>-2016411099</td>
        <td>2278556197</td>
        <td>0x87D00225</td>
        <td>Invalid address type</td>
    </tr>
    <tr>
        <td>-2016411100</td>
        <td>2278556196</td>
        <td>0x87D00224</td>
        <td>Invalid message</td>
    </tr>
    <tr>
        <td>-2016411101</td>
        <td>2278556195</td>
        <td>0x87D00223</td>
        <td>Version mismatch</td>
    </tr>
    <tr>
        <td>-2016411102</td>
        <td>2278556194</td>
        <td>0x87D00222</td>
        <td>Operation canceled</td>
    </tr>
    <tr>
        <td>-2016411103</td>
        <td>2278556193</td>
        <td>0x87D00221</td>
        <td>Invalid user</td>
    </tr>
    <tr>
        <td>-2016411104</td>
        <td>2278556192</td>
        <td>0x87D00220</td>
        <td>Invalid type</td>
    </tr>
    <tr>
        <td>-2016411111</td>
        <td>2278556185</td>
        <td>0x87D00219</td>
        <td>Global service not set</td>
    </tr>
    <tr>
        <td>-2016411112</td>
        <td>2278556184</td>
        <td>0x87D00218</td>
        <td>Invalid service settings</td>
    </tr>
    <tr>
        <td>-2016411113</td>
        <td>2278556183</td>
        <td>0x87D00217</td>
        <td>Data is corrupt</td>
    </tr>
    <tr>
        <td>-2016411114</td>
        <td>2278556182</td>
        <td>0x87D00216</td>
        <td>Invalid service parameter</td>
    </tr>
    <tr>
        <td>-2016411115</td>
        <td>2278556181</td>
        <td>0x87D00215</td>
        <td>Item not found</td>
    </tr>
    <tr>
        <td>-2016411116</td>
        <td>2278556180</td>
        <td>0x87D00214</td>
        <td>Invalid name length</td>
    </tr>
    <tr>
        <td>-2016411117</td>
        <td>2278556179</td>
        <td>0x87D00213</td>
        <td>Timeout occurred</td>
    </tr>
    <tr>
        <td>-2016411118</td>
        <td>2278556178</td>
        <td>0x87D00212</td>
        <td>Context is closed</td>
    </tr>
    <tr>
        <td>-2016411119</td>
        <td>2278556177</td>
        <td>0x87D00211</td>
        <td>Invalid Address</td>
    </tr>
    <tr>
        <td>-2016411120</td>
        <td>2278556176</td>
        <td>0x87D00210</td>
        <td>Invalid Translator</td>
    </tr>
    <tr>
        <td>-2016411127</td>
        <td>2278556169</td>
        <td>0x87D00209</td>
        <td>Data type mismatch</td>
    </tr>
    <tr>
        <td>-2016411128</td>
        <td>2278556168</td>
        <td>0x87D00208</td>
        <td>Invalid command</td>
    </tr>
    <tr>
        <td>-2016411129</td>
        <td>2278556167</td>
        <td>0x87D00207</td>
        <td>Parsing error</td>
    </tr>
    <tr>
        <td>-2016411130</td>
        <td>2278556166</td>
        <td>0x87D00206</td>
        <td>Invalid file</td>
    </tr>
    <tr>
        <td>-2016411131</td>
        <td>2278556165</td>
        <td>0x87D00205</td>
        <td>Invalid path</td>
    </tr>
    <tr>
        <td>-2016411132</td>
        <td>2278556164</td>
        <td>0x87D00204</td>
        <td>Data too large</td>
    </tr>
    <tr>
        <td>-2016411133</td>
        <td>2278556163</td>
        <td>0x87D00203</td>
        <td>No data supplied</td>
    </tr>
    <tr>
        <td>-2016411134</td>
        <td>2278556162</td>
        <td>0x87D00202</td>
        <td>Service is shutting down</td>
    </tr>
    <tr>
        <td>-2016411135</td>
        <td>2278556161</td>
        <td>0x87D00201</td>
        <td>Incorrect name format</td>
    </tr>
    <tr>
        <td>-2016411136</td>
        <td>2278556160</td>
        <td>0x87D00200</td>
        <td>Name not found</td>
    </tr>
    <tr>
        <td>-2145058817</td>
        <td>2149908479</td>
        <td>0x8024FFFF</td>
        <td>There was a reporter error not covered by another error code.</td>
    </tr>
    <tr>
        <td>-2145062907</td>
        <td>2149904389</td>
        <td>0x8024F005</td>
        <td>The specified callback cookie is not found.</td>
    </tr>
    <tr>
        <td>-2145062908</td>
        <td>2149904388</td>
        <td>0x8024F004</td>
        <td>The server rejected an event because the server was too busy.</td>
    </tr>
    <tr>
        <td>-2145062909</td>
        <td>2149904387</td>
        <td>0x8024F003</td>
        <td>The XML in the event namespace descriptor could not be parsed.</td>
    </tr>
    <tr>
        <td>-2145062910</td>
        <td>2149904386</td>
        <td>0x8024F002</td>
        <td>The XML in the event namespace descriptor could not be parsed.</td>
    </tr>
    <tr>
        <td>-2145062911</td>
        <td>2149904385</td>
        <td>0x8024F001</td>
        <td>The event cache file was defective.</td>
    </tr>
    <tr>
        <td>-2145062913</td>
        <td>2149904383</td>
        <td>0x8024EFFF</td>
        <td>There was an expression evaluator error not covered by another WU_E_EE_* error code.</td>
    </tr>
    <tr>
        <td>-2145067001</td>
        <td>2149900295</td>
        <td>0x8024E007</td>
        <td>An expression evaluator operation could not be completed because the cluster state of the computer could not be determined.</td>
    </tr>
    <tr>
        <td>-2145067002</td>
        <td>2149900294</td>
        <td>0x8024E006</td>
        <td>An expression evaluator operation could not be completed because there was an invalid attribute.</td>
    </tr>
    <tr>
        <td>-2145067003</td>
        <td>2149900293</td>
        <td>0x8024E005</td>
        <td>The expression evaluator could not be initialized.</td>
    </tr>
    <tr>
        <td>-2145067004</td>
        <td>2149900292</td>
        <td>0x8024E004</td>
        <td>An expression evaluator operation could not be completed because the version of the serialized expression data is invalid.</td>
    </tr>
    <tr>
        <td>-2145067005</td>
        <td>2149900291</td>
        <td>0x8024E003</td>
        <td>An expression evaluator operation could not be completed because an expression contains an incorrect number of metadata nodes.</td>
    </tr>
    <tr>
        <td>-2145067006</td>
        <td>2149900290</td>
        <td>0x8024E002</td>
        <td>An expression evaluator operation could not be completed because an expression was invalid.</td>
    </tr>
    <tr>
        <td>-2145067007</td>
        <td>2149900289</td>
        <td>0x8024E001</td>
        <td>An expression evaluator operation could not be completed because an expression was unrecognized.</td>
    </tr>
    <tr>
        <td>-2145067009</td>
        <td>2149900287</td>
        <td>0x8024DFFF</td>
        <td>Windows Update Agent could not be updated because of an error not covered by another WU_E_SETUP_* error code.</td>
    </tr>
    <tr>
        <td>-2145071082</td>
        <td>2149896214</td>
        <td>0x8024D016</td>
        <td>Windows Update Agent could not be updated because of an unknown error.</td>
    </tr>
    <tr>
        <td>-2145071083</td>
        <td>2149896213</td>
        <td>0x8024D015</td>
        <td>Windows Update Agent is successfully updated, but a reboot is required to complete the setup.</td>
    </tr>
    <tr>
        <td>-2145071084</td>
        <td>2149896212</td>
        <td>0x8024D014</td>
        <td>Windows Update Agent is successfully updated, but a reboot is required to complete the setup.</td>
    </tr>
    <tr>
        <td>-2145071085</td>
        <td>2149896211</td>
        <td>0x8024D013</td>
        <td>Windows Update Agent could not be updated because the server does not contain updated information for this version.</td>
    </tr>
    <tr>
        <td>-2145071086</td>
        <td>2149896210</td>
        <td>0x8024D012</td>
        <td>Windows Update Agent must be updated before a search can continue. An administrator is required to perform the operation.</td>
    </tr>
    <tr>
        <td>-2145071087</td>
        <td>2149896209</td>
        <td>0x8024D011</td>
        <td>Windows Update Agent must be updated before a search can continue.</td>
    </tr>
    <tr>
        <td>-2145071088</td>
        <td>2149896208</td>
        <td>0x8024D010</td>
        <td>Windows Update Agent could not be updated because the registry contains invalid information.</td>
    </tr>
    <tr>
        <td>-2145071089</td>
        <td>2149896207</td>
        <td>0x8024D00F</td>
        <td>Windows Update Agent could not be updated because the setup handler failed during execution.</td>
    </tr>
    <tr>
        <td>-2145071090</td>
        <td>2149896206</td>
        <td>0x8024D00E</td>
        <td>Windows Update Agent setup package requires a reboot to complete installation.</td>
    </tr>
    <tr>
        <td>-2145071091</td>
        <td>2149896205</td>
        <td>0x8024D00D</td>
        <td>Windows Update Agent setup is already running.</td>
    </tr>
    <tr>
        <td>-2145071092</td>
        <td>2149896204</td>
        <td>0x8024D00C</td>
        <td>Windows Update Agent could not be updated because a restart of the system is required.</td>
    </tr>
    <tr>
        <td>-2145071093</td>
        <td>2149896203</td>
        <td>0x8024D00B</td>
        <td>Windows Update Agent could not be updated because the system is configured to block the update.</td>
    </tr>
    <tr>
        <td>-2145071094</td>
        <td>2149896202</td>
        <td>0x8024D00A</td>
        <td>Windows Update Agent could not be updated because the current system configuration is not supported.</td>
    </tr>
    <tr>
        <td>-2145071095</td>
        <td>2149896201</td>
        <td>0x8024D009</td>
        <td>An update to the Windows Update Agent was skipped due to a directive in the wuident.cab file.</td>
    </tr>
    <tr>
        <td>-2145071096</td>
        <td>2149896200</td>
        <td>0x8024D008</td>
        <td>An update to the Windows Update Agent was skipped because previous attempts to update have failed.</td>
    </tr>
    <tr>
        <td>-2145071097</td>
        <td>2149896199</td>
        <td>0x8024D007</td>
        <td>Windows Update Agent could not be updated because regsvr32.exe returned an error.</td>
    </tr>
    <tr>
        <td>-2145071098</td>
        <td>2149896198</td>
        <td>0x8024D006</td>
        <td>Windows Update Agent could not be updated because a WUA file on the target system is newer than the corresponding source file.</td>
    </tr>
    <tr>
        <td>-2145071099</td>
        <td>2149896197</td>
        <td>0x8024D005</td>
        <td>Windows Update Agent could not be updated because the versions specified in the INF do not match the actual source file versions.</td>
    </tr>
    <tr>
        <td>-2145071100</td>
        <td>2149896196</td>
        <td>0x8024D004</td>
        <td>Windows Update Agent could not be updated because setup initialization was never completed successfully.</td>
    </tr>
    <tr>
        <td>-2145071101</td>
        <td>2149896195</td>
        <td>0x8024D003</td>
        <td>Windows Update Agent could not be updated because of an internal error that caused set up initialization to be performed twice.</td>
    </tr>
    <tr>
        <td>-2145071102</td>
        <td>2149896194</td>
        <td>0x8024D002</td>
        <td>Windows Update Agent could not be updated because the wuident.cab file contains invalid information.</td>
    </tr>
    <tr>
        <td>-2145071103</td>
        <td>2149896193</td>
        <td>0x8024D001</td>
        <td>Windows Update Agent could not be updated because an INF file contains invalid information.</td>
    </tr>
    <tr>
        <td>-2145071105</td>
        <td>2149896191</td>
        <td>0x8024CFFF</td>
        <td>A driver error not covered by another WU_E_DRV_* code.</td>
    </tr>
    <tr>
        <td>-2145075193</td>
        <td>2149892103</td>
        <td>0x8024C007</td>
        <td>Information required for the synchronization of applicable printers is missing.</td>
    </tr>
    <tr>
        <td>-2145075194</td>
        <td>2149892102</td>
        <td>0x8024C006</td>
        <td>Driver synchronization failed.</td>
    </tr>
    <tr>
        <td>-2145075195</td>
        <td>2149892101</td>
        <td>0x8024C005</td>
        <td>The driver update is missing a required attribute.</td>
    </tr>
    <tr>
        <td>-2145075196</td>
        <td>2149892100</td>
        <td>0x8024C004</td>
        <td>The driver update is missing metadata.</td>
    </tr>
    <tr>
        <td>-2145075197</td>
        <td>2149892099</td>
        <td>0x8024C003</td>
        <td>The registry type read for the driver does not match the expected type.</td>
    </tr>
    <tr>
        <td>-2145075198</td>
        <td>2149892098</td>
        <td>0x8024C002</td>
        <td>A property for the driver could not be found. It may not conform to the required specifications.</td>
    </tr>
    <tr>
        <td>-2145075199</td>
        <td>2149892097</td>
        <td>0x8024C001</td>
        <td>A driver was skipped.</td>
    </tr>
    <tr>
        <td>-2145079291</td>
        <td>2149888005</td>
        <td>0x8024B005</td>
        <td>Cannot cancel a non-scheduled install.</td>
    </tr>
    <tr>
        <td>-2145079292</td>
        <td>2149888004</td>
        <td>0x8024B004</td>
        <td>The task was stopped and needs to be rerun to complete.</td>
    </tr>
    <tr>
        <td>-2145079293</td>
        <td>2149888003</td>
        <td>0x8024B003</td>
        <td>The operation cannot be completed since the task is not yet started.</td>
    </tr>
    <tr>
        <td>-2145079294</td>
        <td>2149888002</td>
        <td>0x8024B002</td>
        <td>The operation cannot be completed since the task status is currently disabled.</td>
    </tr>
    <tr>
        <td>-2145079295</td>
        <td>2149888001</td>
        <td>0x8024B001</td>
        <td>The task is currently in progress.</td>
    </tr>
    <tr>
        <td>-2145079297</td>
        <td>2149887999</td>
        <td>0x8024AFFF</td>
        <td>An Automatic Updates error is not covered by another WU_E_AU * code.</td>
    </tr>
    <tr>
        <td>-2145083386</td>
        <td>2149883910</td>
        <td>0x8024A006</td>
        <td>The default service registered with AU changed during the search.</td>
    </tr>
    <tr>
        <td>-2145083387</td>
        <td>2149883909</td>
        <td>0x8024A005</td>
        <td>No unmanaged service is registered with AU.</td>
    </tr>
    <tr>
        <td>-2145083388</td>
        <td>2149883908</td>
        <td>0x8024A004</td>
        <td>Automatic Updates was unable to process incoming requests because it was paused.</td>
    </tr>
    <tr>
        <td>-2145083389</td>
        <td>2149883907</td>
        <td>0x8024A003</td>
        <td>The old version of the Automatic Updates client was disabled.</td>
    </tr>
    <tr>
        <td>-2145083390</td>
        <td>2149883906</td>
        <td>0x8024A002</td>
        <td>The old version of the Automatic Updates client has stopped because the WSUS server has been upgraded.</td>
    </tr>
    <tr>
        <td>-2145083392</td>
        <td>2149883904</td>
        <td>0x8024A000</td>
        <td>Automatic Updates was unable to service incoming requests.</td>
    </tr>
    <tr>
        <td>-2145087483</td>
        <td>2149879813</td>
        <td>0x80249005</td>
        <td>A WMI error occurred when enumerating the instances for a particular class.</td>
    </tr>
    <tr>
        <td>-2145087484</td>
        <td>2149879812</td>
        <td>0x80249004</td>
        <td>There was an inventory error not covered by another error code.</td>
    </tr>
    <tr>
        <td>-2145087485</td>
        <td>2149879811</td>
        <td>0x80249003</td>
        <td>Failed to upload inventory results to the server.</td>
    </tr>
    <tr>
        <td>-2145087486</td>
        <td>2149879810</td>
        <td>0x80249002</td>
        <td>Failed to get the requested inventory type from the server.</td>
    </tr>
    <tr>
        <td>-2145087487</td>
        <td>2149879809</td>
        <td>0x80249001</td>
        <td>Parsing of the rule file failed.</td>
    </tr>
    <tr>
        <td>-2145087489</td>
        <td>2149879807</td>
        <td>0x80248FFF</td>
        <td>A data store error is not covered by another WU_E_DS_* code.</td>
    </tr>
    <tr>
        <td>-2145091555</td>
        <td>2149875741</td>
        <td>0x8024801D</td>
        <td>A data store operation did not complete because it was requested with an impersonated identity.</td>
    </tr>
    <tr>
        <td>-2145091556</td>
        <td>2149875740</td>
        <td>0x8024801C</td>
        <td>The data store requires a session reset; release the session and retry with a new session.</td>
    </tr>
    <tr>
        <td>-2145091557</td>
        <td>2149875739</td>
        <td>0x8024801B</td>
        <td>The schema of the current data store and the schema of a table in a backup XML document do not match.</td>
    </tr>
    <tr>
        <td>-2145091558</td>
        <td>2149875738</td>
        <td>0x8024801A</td>
        <td>A request was declined because the operation is not allowed.</td>
    </tr>
    <tr>
        <td>-2145091559</td>
        <td>2149875737</td>
        <td>0x80248019</td>
        <td>A request to remove the Windows Update service or to unregister it with Automatic Updates was declined because it is a built-in service, and/or Automatic Updates cannot fall back to another service.</td>
    </tr>
    <tr>
        <td>-2145091560</td>
        <td>2149875736</td>
        <td>0x80248018</td>
        <td>A table was not closed because it is not associated with the session.</td>
    </tr>
    <tr>
        <td>-2145091561</td>
        <td>2149875735</td>
        <td>0x80248017</td>
        <td>A table was not closed because it is not associated with the session.</td>
    </tr>
    <tr>
        <td>-2145091562</td>
        <td>2149875734</td>
        <td>0x80248016</td>
        <td>A request to hide an update was declined because it is a mandatory update or because it was deployed with a deadline.</td>
    </tr>
    <tr>
        <td>-2145091563</td>
        <td>2149875733</td>
        <td>0x80248015</td>
        <td>An operation did not complete because the registration of the service has expired.</td>
    </tr>
    <tr>
        <td>-2145091564</td>
        <td>2149875732</td>
        <td>0x80248014</td>
        <td>An operation did not complete because the service is not in the data store.</td>
    </tr>
    <tr>
        <td>-2145091565</td>
        <td>2149875731</td>
        <td>0x80248013</td>
        <td>The server sent the same update to the client with two different revision IDs.</td>
    </tr>
    <tr>
        <td>-2145091567</td>
        <td>2149875729</td>
        <td>0x80248011</td>
        <td>I could not create a datastore object in another process.</td>
    </tr>
    <tr>
        <td>-2145091568</td>
        <td>2149875728</td>
        <td>0x80248010</td>
        <td>The datastore is not allowed to be registered with COM in the current process.</td>
    </tr>
    <tr>
        <td>-2145091569</td>
        <td>2149875727</td>
        <td>0x8024800F</td>
        <td>The data store could not be initialized because it was locked by another process.</td>
    </tr>
    <tr>
        <td>-2145091570</td>
        <td>2149875726</td>
        <td>0x8024800E</td>
        <td>The row was not added because an existing row has the same primary key.</td>
    </tr>
    <tr>
        <td>-2145091571</td>
        <td>2149875725</td>
        <td>0x8024800D</td>
        <td>The category was not added because it contains no parent categories and is not a top-level category itself.</td>
    </tr>
    <tr>
        <td>-2145091572</td>
        <td>2149875724</td>
        <td>0x8024800C</td>
        <td>The data store section could not be locked within the allotted time.</td>
    </tr>
    <tr>
        <td>-2145091573</td>
        <td>2149875723</td>
        <td>0x8024800B</td>
        <td>The update was not deleted because it is still referenced by one or more services.</td>
    </tr>
    <tr>
        <td>-2145091574</td>
        <td>2149875722</td>
        <td>0x8024800A</td>
        <td>The update was not processed because its update handler could not be recognized.</td>
    </tr>
    <tr>
        <td>-2145091575</td>
        <td>2149875721</td>
        <td>0x80248009</td>
        <td>The datastore is missing required information or references missing license terms file localized property or linked row.</td>
    </tr>
    <tr>
        <td>-2145091576</td>
        <td>2149875720</td>
        <td>0x80248008</td>
        <td>The datastore is missing required information or has a NULL in a table column that requires a non-null value.</td>
    </tr>
    <tr>
        <td>-2145091577</td>
        <td>2149875719</td>
        <td>0x80248007</td>
        <td>The information requested is not in the data store.</td>
    </tr>
    <tr>
        <td>-2145091578</td>
        <td>2149875718</td>
        <td>0x80248006</td>
        <td>The current and expected versions of the datastore do not match.</td>
    </tr>
    <tr>
        <td>-2145091579</td>
        <td>2149875717</td>
        <td>0x80248005</td>
        <td>A table could not be opened because the table is not in the data store.</td>
    </tr>
    <tr>
        <td>-2145091580</td>
        <td>2149875716</td>
        <td>0x80248004</td>
        <td>The data store contains a table with unexpected columns.</td>
    </tr>
    <tr>
        <td>-2145091581</td>
        <td>2149875715</td>
        <td>0x80248003</td>
        <td>The datastore is missing a table.</td>
    </tr>
    <tr>
        <td>-2145091582</td>
        <td>2149875714</td>
        <td>0x80248002</td>
        <td>The current and expected states of the datastore do not match.</td>
    </tr>
    <tr>
        <td>-2145091583</td>
        <td>2149875713</td>
        <td>0x80248001</td>
        <td>An operation failed because the datastore was in use.</td>
    </tr>
    <tr>
        <td>-2145091584</td>
        <td>2149875712</td>
        <td>0x80248000</td>
        <td>An operation failed because Windows Update Agent is shutting down.</td>
    </tr>
    <tr>
        <td>-2145091585</td>
        <td>2149875711</td>
        <td>0x80247FFF</td>
        <td>Search using the scan package failed.</td>
    </tr>
    <tr>
        <td>-2145095675</td>
        <td>2149871621</td>
        <td>0x80247005</td>
        <td>The service is not registered.</td>
    </tr>
    <tr>
        <td>-2145095676</td>
        <td>2149871620</td>
        <td>0x80247004</td>
        <td>The size of the event payload submitted is invalid.</td>
    </tr>
    <tr>
        <td>-2145095677</td>
        <td>2149871619</td>
        <td>0x80247003</td>
        <td>An invalid event payload was specified.</td>
    </tr>
    <tr>
        <td>-2145095678</td>
        <td>2149871618</td>
        <td>0x80247002</td>
        <td>An operation could not be completed because the scan package requires a greater version of the Windows Update Agent.</td>
    </tr>
    <tr>
        <td>-2145095679</td>
        <td>2149871617</td>
        <td>0x80247001</td>
        <td>An operation could not be completed because the scan package was invalid.</td>
    </tr>
    <tr>
        <td>-2145095681</td>
        <td>2149871615</td>
        <td>0x80246FFF</td>
        <td>There was a download manager error not covered by another WU_E_DM_* error code.</td>
    </tr>
    <tr>
        <td>-2145099764</td>
        <td>2149867532</td>
        <td>0x8024600C</td>
        <td>A download failed because the current network limits downloads by update size for the update service.</td>
    </tr>
    <tr>
        <td>-2145099765</td>
        <td>2149867531</td>
        <td>0x8024600B</td>
        <td>A download must be restarted because the updated content changed in a new revision.</td>
    </tr>
    <tr>
        <td>-2145099766</td>
        <td>2149867530</td>
        <td>0x8024600A</td>
        <td>A download must be restarted because the location of the source of the download has changed.</td>
    </tr>
    <tr>
        <td>-2145099767</td>
        <td>2149867529</td>
        <td>0x80246009</td>
        <td>A download manager operation failed because of an unspecified Background Intelligent Transfer Service (BITS) transfer error.</td>
    </tr>
    <tr>
        <td>-2145099768</td>
        <td>2149867528</td>
        <td>0x80246008</td>
        <td>A download manager operation failed because the download manager could not connect the Background Intelligent Transfer Service (BITS).</td>
    </tr>
    <tr>
        <td>-2145099769</td>
        <td>2149867527</td>
        <td>0x80246007</td>
        <td>The update has not been downloaded.</td>
    </tr>
    <tr>
        <td>-2145099770</td>
        <td>2149867526</td>
        <td>0x80246006</td>
        <td>A download manager operation could not be completed because the version of Background Intelligent Transfer Service (BITS) is incompatible.</td>
    </tr>
    <tr>
        <td>-2145099771</td>
        <td>2149867525</td>
        <td>0x80246005</td>
        <td>A download manager operation could not be completed because the network connection was unavailable.</td>
    </tr>
    <tr>
        <td>-2145099772</td>
        <td>2149867524</td>
        <td>0x80246004</td>
        <td>An operation could not be completed because a download request is required from the download handler.</td>
    </tr>
    <tr>
        <td>-2145099773</td>
        <td>2149867523</td>
        <td>0x80246003</td>
        <td>A download manager operation could not be completed because the file metadata requested an unrecognized hash algorithm.</td>
    </tr>
</table>

-----
Credits: [Anoop Nair](https://www.anoopcnair.com/sccm-troubleshooting-intune-error-codes-table/) for the list of error codes

-----

Want to see something else added? <a href="https://github.com/smcallister594/scotscottmca/issues/new">Open an issue.</a>

<#
    .SYNOPSIS
    Searches a Json file containing a list of ConfigMgr and Intune error codes and returns their description

    .PARAMETER UrlToJsonFile
    Specifies the Url of the Json file containing the error codes, defaults to my Github repo

    .PARAMETER SeachParameter
    Determines whether to search for HexCode, SignedIntCode or UnsignedIntCode

    .PARAMETER SearchValue
    The error code you want to search for

    .EXAMPLE
    PS> Search-JsonForErrorCodes -SearchParameter HexCode -SearchValue 0x87D00324

        SignedIntCode UnsignedIntCode HexCode    Description
        ------------- --------------- -------    -----------
        -2016410844      2278556452 0x87D00324 The application was not detected after the installation was completed.

    .EXAMPLE
    PS> Search-JsonForErrorCodes -SearchParameter UnSignedIntCode -SearchValue "2278556235"

        SignedIntCode UnsignedIntCode HexCode    Description
        ------------- --------------- -------    -----------
        -2016411061      2278556235 0x87D0024B Name already exists

    .EXAMPLE
    PS> Search-JsonForErrorCodes -SearchParameter SignedIntCode -SearchValue "-2016344211"

        SignedIntCode UnsignedIntCode HexCode    Description
        ------------- --------------- -------    -----------
        -2016344211      2278623085 0x87D1076D User canceled the operation

#>
function Search-JsonForErrorCodes {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$false, Position=0)]
        [string]$UrlToJsonFile = "https://raw.githubusercontent.com/scotscottmca/scotscottmca/main/assets/ErrorCodes/errorCodes.json",
        
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
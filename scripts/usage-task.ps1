<#
.SYNOPSIS
  Registers the Scheduled Task that publishes Claude + GitHub usage to the gist
  behind scotscottmca.com/usage. The Windows counterpart to
  scripts/com.scotscottmca.usage.plist.

.DESCRIPTION
  Every machine you work on publishes its own usage-<device>.json to the same
  gist and the figures are summed, so run this on the Windows box as well as
  the launchd agent on each Mac. usage-stats.mjs itself is portable — it reads
  %USERPROFILE%\.claude\projects the same way it reads ~/.claude/projects — so
  only the scheduling differs.

  Needs: node on PATH, the GitHub CLI signed in (gh auth login), and this repo
  cloned. Paths are taken from where this script sits and from PATH, so there
  is nothing to edit.

  The default 7-minute offset staggers this machine's publish against the
  Macs' (which run on a plain 15-minute interval from load). Both writing the
  merged usage.json in the same minute is last-writer-wins, and one machine's
  figures would sit out until the next run.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts\usage-task.ps1

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts\usage-task.ps1 -Unregister
#>
[CmdletBinding()]
param(
  [int]$IntervalMinutes = 15,
  # Minutes past the hour the first run of each hour lands on.
  [int]$OffsetMinutes = 7,
  # Day of the month the Claude subscription renews. Must match every other
  # machine, or they will disagree about where the billing cycle starts.
  [int]$CycleDay = 10,
  [string]$GistId = '5321ac84ddec1de6e66f6f49f0f5d57f',
  [string]$TaskName = 'ScotScottMcA Usage',
  [switch]$Unregister
)

$ErrorActionPreference = 'Stop'

if ($Unregister) {
  if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
    Write-Host "Removed scheduled task '$TaskName'."
  } else {
    Write-Host "No scheduled task named '$TaskName'."
  }
  return
}

$stats = Join-Path $PSScriptRoot 'usage-stats.mjs'
if (-not (Test-Path -LiteralPath $stats)) {
  throw "Cannot find $stats — run this from the repo's scripts folder."
}

$node = Get-Command node -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $node) { throw 'node is not on PATH. Install Node 20+ and reopen the shell.' }

# Node refuses to spawn .cmd/.bat without a shell, and usage-stats.mjs calls
# `gh` through execFileSync. A real gh.exe (winget, choco, scoop) is fine.
$gh = Get-Command gh -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $gh) {
  throw 'The GitHub CLI is not on PATH. Install it (winget install GitHub.cli) and run: gh auth login'
}
if ([IO.Path]::GetExtension($gh.Source) -in '.cmd', '.bat') {
  Write-Warning "gh resolves to $($gh.Source). Node cannot spawn a batch shim; put the real gh.exe ahead of it on PATH or the publish will fail."
}
& $gh.Source auth status *> $null
if ($LASTEXITCODE -ne 0) { Write-Warning 'gh is not signed in on this machine. Run: gh auth login' }

# The task inherits the user environment, and setting it here also means a
# manual `node scripts\usage-stats.mjs --publish` works in a new shell.
foreach ($pair in @{ USAGE_GIST_ID = $GistId; USAGE_CYCLE_DAY = "$CycleDay" }.GetEnumerator()) {
  [Environment]::SetEnvironmentVariable($pair.Key, $pair.Value, 'User')
  Set-Item -Path "env:$($pair.Key)" -Value $pair.Value
}

# Task Scheduler cannot redirect output, so the action goes through cmd.
$log = Join-Path $env:LOCALAPPDATA 'scotscottmca-usage.log'
$arguments = '/c "{0}"' -f ('"{0}" "{1}" --publish >> "{2}" 2>&1' -f $node.Source, $stats, $log)
$action = New-ScheduledTaskAction -Execute "$env:SystemRoot\System32\cmd.exe" -Argument $arguments

# No repetition duration means it repeats indefinitely. Starting from today's
# midnight plus the offset pins the runs to fixed minutes past the hour.
$triggers = @(
  New-ScheduledTaskTrigger -Once -At (Get-Date).Date.AddMinutes($OffsetMinutes) -RepetitionInterval (New-TimeSpan -Minutes $IntervalMinutes)
  New-ScheduledTaskTrigger -AtLogOn -User "$env:USERDOMAIN\$env:USERNAME"
)

$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
  -StartWhenAvailable -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 10)

# S4U keeps the console window from flashing every quarter of an hour, but
# registering it needs rights a plain user may not have — fall back rather
# than leave the machine unscheduled.
$register = {
  param($LogonType)
  $principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType $LogonType -RunLevel Limited
  Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $triggers -Settings $settings `
    -Principal $principal -Description 'Publishes Claude + GitHub usage to the gist behind scotscottmca.com/usage.' -Force
}
try {
  & $register 'S4U' | Out-Null
} catch {
  Write-Warning "Could not register the task to run without a visible window ($($_.Exception.Message)). Falling back; expect a brief console window every $IntervalMinutes minutes."
  & $register 'Interactive' | Out-Null
}

Write-Host "Registered '$TaskName': every $IntervalMinutes minutes from :$('{0:00}' -f $OffsetMinutes) past, and at logon."
Write-Host "  node    $($node.Source)"
Write-Host "  script  $stats"
Write-Host "  log     $log"
Write-Host "  cycle   day $CycleDay of the month"
Write-Host ''
Write-Host "Run it once now with:  Start-ScheduledTask -TaskName '$TaskName'"
Write-Host "Remove it with:        .\scripts\usage-task.ps1 -Unregister"

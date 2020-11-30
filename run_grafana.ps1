#! /c/WINDOWS/System32/WindowsPowerShell/v1.0/powershell
# This makes it possible to run this script in eg. Git Bash

$EXE_NAME = "grafana-server.exe"
$SEARCH_PATH = ".."

# Optional path to EXE_NAME. The script also tries to search for it.
# eg. ../grafana-7.1.5/bin/grafana-server.exe
$EXE_PATH = "../grafana-7.1.5/bin/grafana-server.exe"

function SearchForFile() {
    param (
        [String[]] $filename,
        [String[]] $searchPath = $SEARCH_PATH
    )
    $file_path = Get-ChildItem -Path $searchPath -Recurse -Filter $EXE_NAME

    if (! $file_path) {
        Write-Output "[ERROR] $EXE_NAME was not found in the parent tree.
Please set EXE_PATH in this script."
        exit 1
    }

    return $file_path
}

function RunProcessInOwnPath {
    param (
        [System.IO.FileInfo] $process_exe_path
    )
    Start-Process -FilePath $process_exe_path.FullName `
       -WorkingDirectory $process_exe_path.Directory
}

# Starts a process in its parent directory, if it is not already running.
function RunProcessIfNotRunning {
    param (
        [System.IO.FileInfo] $process_exe_path, 
        [String[]] $process_name
    )
    $process = Get-Process -Name $process_name `
        -ErrorAction SilentlyContinue

    if (! $process) {
        RunProcessInOwnPath $process_exe_path
        return $true
    }
    return $false
}

function Main() {
    $exe_path = Resolve-Path -Relative $EXE_PATH
    if (!$EXE_PATH) {
        # Optional path was not set, search for the .exe
        Write-Output `
            "[INFO] Searching for $EXE_NAME. Set EXE_PATH for faster execution."
        $exe_path = SearchForFile $EXE_NAME
    }
    # Check that the path refers to $EXE_NAME and that the path exists.
    elseif (! (Test-Path -Path $exe_path -Filter $EXE_NAME -PathType leaf)) {
        Write-Output "[ERROR] $EXE_PATH is not a valid path for $EXE_NAME."
        exit 1
    }
    
    if (! (RunProcessIfNotRunning $exe_path "grafana-server")) {
        Write-Output "[ERROR] Grafana is already running"
        exit 1
    }
    else {
        Write-Output "[INFO] Started Grafana server."
    }
}

Main
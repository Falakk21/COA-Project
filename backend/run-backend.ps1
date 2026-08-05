param(
    [Parameter(Position=0, ValueFromRemainingArguments=$true)]
    [string[]]$Expression
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

$msys2Path = 'C:\msys64\ucrt64\bin'
$env:PATH = "$msys2Path;$env:PATH"

if (-not $Expression) {
    Write-Host 'Running backend in MSYS2 environment...'
    & 'C:\msys64\usr\bin\bash.exe' -lc 'export PATH=/ucrt64/bin:$PATH; cd /c/Users/bahar/Instruction-Set-Simulator/backend; ./iss.exe'
} else {
    $expr = $Expression -join ' '
    Write-Host "Running backend with input: $expr"
    & 'C:\msys64\usr\bin\bash.exe' -lc "export PATH=/ucrt64/bin:$PATH; cd /c/Users/bahar/Instruction-Set-Simulator/backend; printf '%s\n' '$expr' | ./iss.exe"
}

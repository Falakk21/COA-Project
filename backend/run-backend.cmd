@echo off
setlocal

rem Resolve script directory
set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

rem Ensure MSYS2 ucrt64 path is available for g++ and runtime
set "MSYS2_PATH=C:\msys64\ucrt64\bin"
set "PATH=%MSYS2_PATH%;%PATH%"

if "%~1"=="" (
  echo Running backend in MSYS2 environment...
  "C:\msys64\usr\bin\bash.exe" -lc "export PATH=/ucrt64/bin:$PATH; cd /c/%CD:~0,1%/Users/bahar/Instruction-Set-Simulator/backend; ./iss.exe"
) else (
  set "EXPR=%~1"
  echo Running backend with input: %EXPR%
  "C:\msys64\usr\bin\bash.exe" -lc "export PATH=/ucrt64/bin:$PATH; cd /c/%CD:~0,1%/Users/bahar/Instruction-Set-Simulator/backend; printf '%s\n' \"%EXPR%\" | ./iss.exe"
)
endlocal

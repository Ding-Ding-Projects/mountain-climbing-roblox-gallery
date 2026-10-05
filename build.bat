@echo off
setlocal
set "GALLERY_POWERSHELL=%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe"
set "PSModulePath=%SystemRoot%\System32\WindowsPowerShell\v1.0\Modules;%PSModulePath%"
if not exist "%GALLERY_POWERSHELL%" (
  echo ERROR: Built-in Windows PowerShell 5.1 is unavailable. This Windows static-export route cannot run on this host.
  exit /b 3
)
"%GALLERY_POWERSHELL%" -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\build-gallery.ps1" %*
set "GALLERY_EXIT=%ERRORLEVEL%"
exit /b %GALLERY_EXIT%

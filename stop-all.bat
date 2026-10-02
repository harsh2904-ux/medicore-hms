@echo off
title MediCore HMS - Shutdown
color 0C

echo ======================================================================
echo                 STOPPING MEDICORE HMS SERVICES
echo ======================================================================

echo [*] Stopping Frontend (Port 3000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

echo [*] Stopping Spring Boot Backend (Port 8080)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080" ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

echo [*] Stopping PostgreSQL Database...
where pg_ctl >nul 2>&1
if %errorlevel% equ 0 (
    pg_ctl stop >nul 2>&1
) else if exist "%USERPROFILE%\.tools\pgsql\pgsql\bin\pg_ctl.exe" (
    "%USERPROFILE%\.tools\pgsql\pgsql\bin\pg_ctl.exe" stop -D "%USERPROFILE%\.tools\pgsql\pgsql\data" >nul 2>&1
)

echo.
echo ======================================================================
echo   All MediCore services have been cleanly stopped.
echo ======================================================================
pause

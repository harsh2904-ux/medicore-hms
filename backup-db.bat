@echo off
title MediCore HMS - Database Backup
color 0A

echo ======================================================================
echo             BACKING UP MEDICORE POSTGRESQL DATABASE
echo ======================================================================

set PG_DUMP=
where pg_dump >nul 2>&1
if %errorlevel% equ 0 (
    set PG_DUMP=pg_dump
) else if exist "%USERPROFILE%\.tools\pgsql\pgsql\bin\pg_dump.exe" (
    set PG_DUMP="%USERPROFILE%\.tools\pgsql\pgsql\bin\pg_dump.exe"
) else if exist "C:\Program Files\PostgreSQL\16\bin\pg_dump.exe" (
    set PG_DUMP="C:\Program Files\PostgreSQL\16\bin\pg_dump.exe"
)

if not defined PG_DUMP (
    echo [ERROR] pg_dump executable not found in system PATH or standard directories.
    echo         Please ensure PostgreSQL is installed and added to PATH.
    pause
    exit /b 1
)

set PGPASSWORD=postgres
set BACKUP_FILE=medicore_hms_backup.sql

echo [*] Exporting database 'medicore_hms' to %BACKUP_FILE%...
%PG_DUMP% -U postgres -d medicore_hms -f "%~dp0%BACKUP_FILE%"

if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] Database successfully backed up to:
    echo           %~dp0%BACKUP_FILE%
) else (
    echo.
    echo [ERROR] Backup failed. Make sure PostgreSQL is running on port 5432.
)

echo ======================================================================
pause

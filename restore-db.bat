@echo off
title MediCore HMS - Database Restore
color 0E

echo ======================================================================
echo             RESTORING MEDICORE POSTGRESQL DATABASE
echo ======================================================================

set PSQL_EXE=
where psql >nul 2>&1
if %errorlevel% equ 0 (
    set PSQL_EXE=psql
) else if exist "%USERPROFILE%\.tools\pgsql\pgsql\bin\psql.exe" (
    set PSQL_EXE="%USERPROFILE%\.tools\pgsql\pgsql\bin\psql.exe"
) else if exist "C:\Program Files\PostgreSQL\16\bin\psql.exe" (
    set PSQL_EXE="C:\Program Files\PostgreSQL\16\bin\psql.exe"
)

if not defined PSQL_EXE (
    echo [ERROR] psql executable not found in system PATH or standard directories.
    echo         Please ensure PostgreSQL is installed and added to PATH.
    pause
    exit /b 1
)

set PGPASSWORD=postgres
set BACKUP_FILE=medicore_hms_backup.sql

if not exist "%~dp0%BACKUP_FILE%" (
    echo [ERROR] Backup file %BACKUP_FILE% not found at %~dp0%BACKUP_FILE%!
    pause
    exit /b 1
)

echo [*] Restoring database 'medicore_hms' from %BACKUP_FILE%...
%PSQL_EXE% -U postgres -d medicore_hms -f "%~dp0%BACKUP_FILE%"

if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] Database successfully restored!
) else (
    echo.
    echo [ERROR] Restore failed. Make sure PostgreSQL is running on port 5432.
)

echo ======================================================================
pause

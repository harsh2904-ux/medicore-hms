@echo off
title MediCore HMS - Production Starter
color 0B

echo ======================================================================
echo                 MEDICORE HOSPITAL MANAGEMENT SYSTEM
echo ======================================================================

:: ----------------------------------------------------------------------
:: Resolve Portable Paths (System PATH -> USERPROFILE -> Standard Paths)
:: ----------------------------------------------------------------------
set PG_CTL=
set PG_DATA=
set JAVA_EXE=

:: Detect PostgreSQL
where pg_ctl >nul 2>&1
if %errorlevel% equ 0 (
    set PG_CTL=pg_ctl
) else if exist "%USERPROFILE%\.tools\pgsql\pgsql\bin\pg_ctl.exe" (
    set PG_CTL="%USERPROFILE%\.tools\pgsql\pgsql\bin\pg_ctl.exe"
    set PG_DATA=%USERPROFILE%\.tools\pgsql\pgsql\data
) else if exist "C:\Program Files\PostgreSQL\16\bin\pg_ctl.exe" (
    set PG_CTL="C:\Program Files\PostgreSQL\16\bin\pg_ctl.exe"
    set PG_DATA=C:\Program Files\PostgreSQL\16\data
)

:: Detect Java 21
where java >nul 2>&1
if %errorlevel% equ 0 (
    set JAVA_EXE=java
) else if defined JAVA_HOME if exist "%JAVA_HOME%\bin\java.exe" (
    set JAVA_EXE="%JAVA_HOME%\bin\java.exe"
) else if exist "%USERPROFILE%\.tools\jdk21\jdk-21.0.12.1+1\bin\java.exe" (
    set JAVA_EXE="%USERPROFILE%\.tools\jdk21\jdk-21.0.12.1+1\bin\java.exe"
    set JAVA_HOME=%USERPROFILE%\.tools\jdk21\jdk-21.0.12.1+1
) else if exist "C:\Program Files\Java\jdk-21\bin\java.exe" (
    set JAVA_EXE="C:\Program Files\Java\jdk-21\bin\java.exe"
    set JAVA_HOME=C:\Program Files\Java\jdk-21
)

:: ----------------------------------------------------------------------
:: [1/3] Start PostgreSQL Database
:: ----------------------------------------------------------------------
echo [1/3] Checking PostgreSQL Database...
netstat -ano | findstr /R /C:":5432 .*LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] PostgreSQL is already active on port 5432.
) else (
    if defined PG_CTL (
        echo [*] Starting PostgreSQL on port 5432...
        if defined PG_DATA (
            start /b "" %PG_CTL% start -D "%PG_DATA%" >nul 2>&1
        ) else (
            start /b "" %PG_CTL% start >nul 2>&1
        )
        timeout /t 3 /nobreak >nul
    ) else (
        echo [WARNING] PostgreSQL binary not found automatically.
        echo           Please ensure PostgreSQL service is running on port 5432.
    )
)

:: ----------------------------------------------------------------------
:: [2/3] Start Spring Boot Backend
:: ----------------------------------------------------------------------
echo [2/3] Checking Spring Boot Backend...
netstat -ano | findstr /R /C:":8080 .*LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Spring Boot is already running on port 8080.
) else (
    if not exist "%~dp0backend\target\medicore-hms-1.0.0-SNAPSHOT.jar" (
        echo [*] Backend JAR not found. Building Spring Boot project with Maven...
        pushd "%~dp0backend"
        call mvn clean package -DskipTests
        popd
    )

    if exist "%~dp0backend\target\medicore-hms-1.0.0-SNAPSHOT.jar" (
        echo [*] Starting Spring Boot REST API on port 8080...
        start "MediCore Backend (Port 8080)" cmd /c "cd /d %~dp0 && %JAVA_EXE% -jar backend\target\medicore-hms-1.0.0-SNAPSHOT.jar"
        timeout /t 6 /nobreak >nul
    ) else (
        echo [ERROR] Could not build or locate backend\target\medicore-hms-1.0.0-SNAPSHOT.jar
        echo         Please run 'mvn clean package -DskipTests' inside the backend directory.
    )
)

:: ----------------------------------------------------------------------
:: [3/3] Start React + Vite Frontend
:: ----------------------------------------------------------------------
echo [3/3] Checking React + Vite Frontend...
netstat -ano | findstr /R /C:":3000 .*LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Frontend is already running on port 3000.
) else (
    if not exist "%~dp0node_modules" (
        echo [*] node_modules not found. Installing frontend dependencies...
        pushd "%~dp0"
        call npm install
        popd
    )
    echo [*] Starting Frontend UI on port 3000...
    start "MediCore Frontend (Port 3000)" cmd /c "cd /d %~dp0 && npm run dev"
    timeout /t 3 /nobreak >nul
)

echo.
echo ======================================================================
echo   ALL MEDICORE SERVICES ARE ACTIVE AND RUNNING!
echo   Frontend:       http://localhost:3000
echo   Patient Portal: http://localhost:3000/portal/dashboard
echo   Backend API:    http://localhost:8080
echo   Swagger UI:     http://localhost:8080/swagger-ui/index.html
echo   PostgreSQL DB:  localhost:5432 (database: medicore_hms)
echo ======================================================================
echo.
echo Launching http://localhost:3000 in your browser...
start http://localhost:3000
pause

@echo off
echo Building Social Media Backend...

REM Check if Java is available
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Java is not installed or not in PATH
    echo Please install Java 17 or higher
    pause
    exit /b 1
)

REM Check if Maven is available
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo Warning: Maven is not installed globally
    echo Please install Maven or use an IDE like IntelliJ IDEA or VSCode with Java extensions
    pause
    exit /b 1
)

echo Starting Maven build...
mvn clean compile
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo Build successful!
echo To run the application: mvn spring-boot:run
pause 
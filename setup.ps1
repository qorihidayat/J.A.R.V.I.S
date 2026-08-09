[CmdletBinding()]
param(
    [switch]$SkipNode,
    [switch]$SkipPython,
    [switch]$GenerateGraph
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSCommandPath
Set-Location $ProjectRoot

function Require-Command([string]$Name, [string]$Message) {
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "$Message"
    }
}

Write-Host "Setting up Jarvis in $ProjectRoot" -ForegroundColor Cyan

if (-not $SkipNode) {
    Require-Command "node" "Node.js 20+ is required. Install it from https://nodejs.org/."
    Require-Command "npm" "npm was not found. Reinstall Node.js 20+ with npm."
    Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) { throw "npm install failed." }
}

if (-not $SkipPython) {
    Require-Command "py" "Python 3.10+ with the Python Launcher is required. Install it from https://www.python.org/downloads/."
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    if (-not (Test-Path ".venv\\Scripts\\python.exe")) {
        py -3 -m venv .venv
    }

    & .\.venv\Scripts\python.exe -m pip install --upgrade pip
    & .\.venv\Scripts\python.exe -m pip install -r requirements.txt
}

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env from .env.example. Add API keys only if you need @search or @image." -ForegroundColor Yellow
}

if ($GenerateGraph) {
    Write-Host "Generating Graphify index..." -ForegroundColor Yellow
    py -3 -m pip install uv
    py -3 -m uv tool run --from graphifyy graphify . --code-only
}

Write-Host "`nChecking prerequisites..." -ForegroundColor Yellow
node scripts/doctor.js

Write-Host "`nModel files are not downloaded automatically." -ForegroundColor Yellow
Write-Host "Place Whisper runtime/model and Kokoro model/voice pack at the paths shown by: npm run doctor"
Write-Host "Then run: npm start" -ForegroundColor Green

# CertifyChain Startup Script
# This script starts all three components

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Starting CertifyChain System" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# Check if processes are already running
$hardhatRunning = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*hardhat*"}
$backendRunning = netstat -ano | Select-String ":8000" | Select-String "LISTENING"
$frontendRunning = netstat -ano | Select-String ":5174" | Select-String "LISTENING"

Write-Host "[1/3] Starting Blockchain (Hardhat Node)..." -ForegroundColor Yellow

if ($null -ne $hardhatRunning) {
    Write-Host "  Already running!" -ForegroundColor Green
} else {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\blockchain'; cmd /c 'npx hardhat node'" -WindowStyle Normal
    Write-Host "  Started in new window" -ForegroundColor Green
    Write-Host "  Waiting for blockchain to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 8
    
    # Deploy contract
    Write-Host "  Deploying smart contract..." -ForegroundColor Yellow
    Set-Location "$PSScriptRoot\blockchain"
    $deployOutput = cmd /c "npx hardhat run scripts/deploy.js --network localhost" 2>&1
    Write-Host "  Contract deployed" -ForegroundColor Green
    
    # Copy ABI
    Set-Location "$PSScriptRoot"
    python backend/copy_abi.py 2>&1 | Out-Null
    Write-Host "  ABI copied to backend" -ForegroundColor Green
    
    # Wait a bit more to ensure everything is ready
    Start-Sleep -Seconds 2
}

Write-Host "`n[2/3] Starting Backend (FastAPI)..." -ForegroundColor Yellow

if ($null -ne $backendRunning) {
    Write-Host "  Already running!" -ForegroundColor Green
} else {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; uvicorn app.main:app --reload" -WindowStyle Normal
    Write-Host "  Started in new window" -ForegroundColor Green
    Start-Sleep -Seconds 3
}

Write-Host "`n[3/3] Starting Frontend (Vite + React)..." -ForegroundColor Yellow

if ($null -ne $frontendRunning) {
    Write-Host "  Already running!" -ForegroundColor Green
} else {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; cmd /c 'npm run dev'" -WindowStyle Normal
    Write-Host "  Started in new window" -ForegroundColor Green
    Start-Sleep -Seconds 3
}

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "  CertifyChain System Started!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan

Write-Host "`nAccess the application at:" -ForegroundColor White
Write-Host "  Frontend:   http://localhost:5174" -ForegroundColor Cyan
Write-Host "  Backend:    http://localhost:8000/api/v1/docs" -ForegroundColor Cyan
Write-Host "  Blockchain: http://localhost:8545" -ForegroundColor Cyan

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "  System Ready! Open the frontend to start using the app." -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan

Write-Host "`nPress any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

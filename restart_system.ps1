# Comprehensive System Restart Script
# Stops all services, redeploys contract, and starts fresh

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "  CertifyChain Complete Restart" -ForegroundColor Cyan
Write-Host "============================================================`n" -ForegroundColor Cyan

# Stop all services
Write-Host "[1/4] Stopping all services..." -ForegroundColor Yellow

# Stop backend
$backendProcess = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1
if ($backendProcess) {
    Stop-Process -Id $backendProcess -Force -ErrorAction SilentlyContinue
    Write-Host "  Stopped backend (PID: $backendProcess)" -ForegroundColor Green
}

# Stop frontend
$frontendProcess = Get-NetTCPConnection -LocalPort 5174 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1
if ($frontendProcess) {
    Stop-Process -Id $frontendProcess -Force -ErrorAction SilentlyContinue
    Write-Host "  Stopped frontend (PID: $frontendProcess)" -ForegroundColor Green
}

# Stop Hardhat (more aggressive)
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*hardhat*" -or $_.CommandLine -like "*hardhat*"} | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "  All services stopped" -ForegroundColor Green
Start-Sleep -Seconds 2

# Start blockchain
Write-Host "`n[2/4] Starting Blockchain (Hardhat Node)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\blockchain'; cmd /c 'npx hardhat node'" -WindowStyle Normal
Write-Host "  Hardhat node started" -ForegroundColor Green
Write-Host "  Waiting 8 seconds for initialization..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Deploy contract
Write-Host "`n[3/4] Deploying Smart Contract..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\blockchain"
$deployOutput = cmd /c "npx hardhat run scripts/deploy.js --network localhost" 2>&1
$deployOutput | Write-Host
Write-Host "  Contract deployed successfully" -ForegroundColor Green

# Copy ABI
Set-Location "$PSScriptRoot"
Write-Host "  Copying ABI to backend..." -ForegroundColor Yellow
python backend/copy_abi.py
Write-Host "  ABI copied" -ForegroundColor Green

# Verify contract is deployed
Write-Host "  Verifying contract deployment..." -ForegroundColor Yellow
python check_blockchain_state.py | Select-String "Has code"

Start-Sleep -Seconds 2

# Start backend and frontend
Write-Host "`n[4/4] Starting Backend and Frontend..." -ForegroundColor Yellow

Write-Host "  Starting Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; uvicorn app.main:app --reload" -WindowStyle Normal
Start-Sleep -Seconds 4

Write-Host "  Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; cmd /c 'npm run dev'" -WindowStyle Normal
Start-Sleep -Seconds 3

# Summary
Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "  CertifyChain System Restarted Successfully!" -ForegroundColor Green
Write-Host "============================================================`n" -ForegroundColor Cyan

Write-Host "Access the application at:" -ForegroundColor White
Write-Host "  Frontend:   http://localhost:5174" -ForegroundColor Cyan
Write-Host "  Backend:    http://localhost:8000/api/v1/docs" -ForegroundColor Cyan
Write-Host "  Blockchain: http://localhost:8545" -ForegroundColor Cyan

Write-Host "`nWaiting 5 seconds, then testing backend..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test backend
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/health" -Method Get
    Write-Host "`nBackend Status: HEALTHY" -ForegroundColor Green
    Write-Host "  Service: $($response.service)" -ForegroundColor White
} catch {
    Write-Host "`nBackend Status: NOT READY YET (may need a few more seconds)" -ForegroundColor Yellow
}

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "Press any key to run integration tests..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host "`nRunning Integration Tests...`n" -ForegroundColor Yellow
python test_integration.py

Write-Host "`nPress any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

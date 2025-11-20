# Quick Backend Restart Script
# Use this when the contract address in .env doesn't match the deployed contract

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "  Backend Quick Restart with Contract Address Fix" -ForegroundColor Cyan
Write-Host "============================================================`n" -ForegroundColor Cyan

# Check if Hardhat is running
Write-Host "[1/3] Checking Hardhat node..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8545" -Method Post -Body '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' -ContentType "application/json" -ErrorAction Stop
    $blockNum = [Convert]::ToInt32($response.result, 16)
    Write-Host "  Hardhat is running (Block: $blockNum)" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: Hardhat node is not running!" -ForegroundColor Red
    Write-Host "  Please start Hardhat first: cd blockchain; npx hardhat node" -ForegroundColor Yellow
    exit 1
}

# Check contract deployment
Write-Host "`n[2/3] Checking contract deployment..." -ForegroundColor Yellow
$deploymentFile = "$PSScriptRoot\blockchain\deployment-info.json"

if (Test-Path $deploymentFile) {
    $deployment = Get-Content $deploymentFile | ConvertFrom-Json
    $contractAddress = $deployment.address
    Write-Host "  Contract deployed at: $contractAddress" -ForegroundColor Green
    
    # Update backend .env
    $backendEnv = "$PSScriptRoot\backend\.env"
    if (Test-Path $backendEnv) {
        $envContent = Get-Content $backendEnv -Raw
        $envContent = $envContent -replace 'CONTRACT_ADDRESS=0x[a-fA-F0-9]{40}', "CONTRACT_ADDRESS=$contractAddress"
        Set-Content -Path $backendEnv -Value $envContent -NoNewline
        Write-Host "  Updated backend/.env" -ForegroundColor Green
    }
    
    # Update frontend .env
    $frontendEnv = "$PSScriptRoot\frontend\.env"
    if (Test-Path $frontendEnv) {
        $envContent = Get-Content $frontendEnv -Raw
        $envContent = $envContent -replace 'VITE_CONTRACT_ADDRESS=0x[a-fA-F0-9]{40}', "VITE_CONTRACT_ADDRESS=$contractAddress"
        Set-Content -Path $frontendEnv -Value $envContent -NoNewline
        Write-Host "  Updated frontend/.env" -ForegroundColor Green
    }
} else {
    Write-Host "  ERROR: deployment-info.json not found!" -ForegroundColor Red
    Write-Host "  Deploy the contract first: cd blockchain; npx hardhat run scripts/deploy.js --network localhost" -ForegroundColor Yellow
    exit 1
}

# Copy ABI
Write-Host "  Copying contract ABI..." -ForegroundColor Yellow
python backend/copy_abi.py | Out-Null
Write-Host "  ABI copied" -ForegroundColor Green

# Restart backend
Write-Host "`n[3/3] Restarting backend..." -ForegroundColor Yellow

# Stop existing backend
$backendProcess = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1
if ($backendProcess) {
    Stop-Process -Id $backendProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "  Stopped old backend process" -ForegroundColor Green
}

# Start new backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; uvicorn app.main:app --reload" -WindowStyle Normal
Write-Host "  Backend starting..." -ForegroundColor Green

# Wait and test
Write-Host "`nWaiting 5 seconds for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

try {
    $health = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/health" -Method Get -ErrorAction Stop
    Write-Host "`nBackend Status: HEALTHY" -ForegroundColor Green
    Write-Host "  Service: $($health.service)" -ForegroundColor White
} catch {
    Write-Host "`nBackend Status: STARTING (may need a few more seconds)" -ForegroundColor Yellow
}

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "  Backend Restarted with Correct Contract Address!" -ForegroundColor Green
Write-Host "============================================================`n" -ForegroundColor Cyan

Write-Host "Contract: $contractAddress" -ForegroundColor White
Write-Host "Backend:  http://localhost:8000/api/v1/docs" -ForegroundColor Cyan
Write-Host "`nYou can now run: python test_integration.py" -ForegroundColor Yellow
Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

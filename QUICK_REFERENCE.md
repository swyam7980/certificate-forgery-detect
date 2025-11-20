# 🚀 CertifyChain - Quick Reference

## Start System
```powershell
# Automated
.\start_all.ps1

# Manual
# Terminal 1: cd blockchain; npx hardhat node
# Terminal 2: cd backend; uvicorn app.main:app --reload  
# Terminal 3: cd frontend; npm run dev
```

## URLs
- Frontend: http://localhost:5174
- Backend API: http://localhost:8000/api/v1/docs
- Blockchain: http://localhost:8545

## Test
```bash
python test_blockchain_service.py  # Test blockchain
python test_integration.py         # Test full system
```

## Key Files
- **Smart Contract**: `blockchain/contracts/CertificateRegistry.sol`
- **Contract Address**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **Backend API**: `backend/app/api/v1/endpoints/`
- **Frontend Pages**: `frontend/src/pages/`
- **Blockchain Service**: `backend/app/services/blockchain_service.py`

## Common Commands
```bash
# Deploy contract
cd blockchain; npx hardhat run scripts/deploy.js --network localhost

# Copy ABI
cd backend; python copy_abi.py

# Install dependencies
cd frontend; npm install
cd backend; pip install -r requirements.txt
cd blockchain; npm install

# Run tests
cd blockchain; npx hardhat test
cd backend; pytest
cd frontend; npm test
```

## Configuration
**backend/.env**: CONTRACT_ADDRESS, ETHEREUM_RPC_URL, DATABASE_URL
**frontend/.env**: VITE_CONTRACT_ADDRESS, VITE_API_URL

## Troubleshooting
- **Contract not loaded**: Run `python backend/copy_abi.py`
- **Backend can't connect**: Check Hardhat node is running
- **Port in use**: Kill process on 5174/8000/8545
- **Database error**: Delete `backend/test.db` and restart

## Package Versions
- React: 18.2.0
- FastAPI: 0.104.1  
- Hardhat: 2.19.4
- Solidity: 0.8.20
- Python: 3.9+
- Node: 18+

## Status
✅ All systems integrated and working
✅ Blockchain service tested and verified
✅ End-to-end flow functional

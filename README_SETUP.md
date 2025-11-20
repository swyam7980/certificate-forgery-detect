# 🎓 CertifyChain - Blockchain Certificate Verification System

A comprehensive solution for issuing, storing, and verifying educational certificates using blockchain technology, AI/ML verification, and IPFS storage.

## 📋 System Overview

CertifyChain consists of three main components:

1. **Frontend** (React + TypeScript + Tailwind CSS)
   - Institution Portal - Upload and manage certificates
   - Student Portal - View and download certificates
   - Verifier Portal - Verify certificate authenticity
   
2. **Backend** (Python FastAPI)
   - RESTful API for all operations
   - Database management (SQLAlchemy + SQLite/PostgreSQL)
   - Blockchain integration (web3.py)
   - AI/ML verification system
   - IPFS integration for document storage

3. **Blockchain** (Solidity + Hardhat)
   - Smart contract for immutable certificate records
   - Local Ethereum node for development
   - Production-ready contract deployment

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.9+
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/swyam7980/certificate-forgery-detect.git
   cd certificate-forgery-detect
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

4. **Install Blockchain Dependencies**
   ```bash
   cd blockchain
   npm install
   cd ..
   ```

### Running the System

#### Option 1: Automated Startup (Windows)
```powershell
.\start_all.ps1
```

#### Option 2: Manual Startup

**Terminal 1 - Blockchain:**
```bash
cd blockchain
npx hardhat node
```

**Terminal 2 - Deploy Contract:**
```bash
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```

**Terminal 3 - Backend:**
```bash
cd backend
python copy_abi.py  # Copy contract ABI
uvicorn app.main:app --reload
```

**Terminal 4 - Frontend:**
```bash
cd frontend
npm run dev
```

## 📍 Access Points

- **Frontend**: http://localhost:5174
- **Backend API Docs**: http://localhost:8000/api/v1/docs
- **Blockchain RPC**: http://localhost:8545

## 🧪 Testing

### Integration Tests
```bash
python test_integration.py
```

### Blockchain Service Test
```bash
python test_blockchain_service.py
```

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Dependencies

### Frontend
- React 18.2.0
- TypeScript 5.2.2
- Vite 5.0.8
- TailwindCSS 3.4.0
- React Router DOM 6.20.1
- React Query (TanStack Query) 5.13.4
- Axios 1.6.2
- ethers.js 6.9.0

### Backend
- FastAPI 0.104.1
- SQLAlchemy 2.0.23
- Pydantic 2.5.0
- web3.py 6.11.3
- python-dotenv 1.0.0
- uvicorn 0.24.0
- OpenCV 4.8.1
- Pillow 10.1.0
- EasyOCR 1.7.0
- scikit-learn 1.3.2
- ipfshttpclient 0.8.0a2

### Blockchain
- Hardhat 2.19.4
- Solidity 0.8.20
- ethers.js 6.9.0
- @nomicfoundation/hardhat-toolbox 4.0.0

## 🏗️ Project Structure

```
certificate-forgery-detect/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components (portals)
│   │   ├── services/        # API & blockchain services
│   │   └── types/           # TypeScript type definitions
│   └── package.json
│
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Core functionality (DB, security)
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic services
│   │   └── contracts/      # Smart contract ABI
│   ├── requirements.txt
│   └── .env
│
├── blockchain/              # Ethereum smart contracts
│   ├── contracts/          # Solidity contracts
│   ├── scripts/            # Deployment scripts
│   ├── test/               # Contract tests
│   └── hardhat.config.js
│
├── test_integration.py      # End-to-end tests
├── test_blockchain_service.py  # Blockchain service tests
├── start_all.ps1           # Automated startup script
└── README_SETUP.md         # This file
```

## 🔧 Configuration

### Backend (.env)
```env
DATABASE_URL=sqlite:///./test.db
ETHEREUM_RPC_URL=http://localhost:8545
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
PRIVATE_KEY=
IPFS_URL=http://localhost:5001
JWT_SECRET=dev-secret-key-for-testing-only
ENVIRONMENT=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_ETHEREUM_RPC_URL=http://localhost:8545
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

## 🎯 Features

### Certificate Issuance
- Upload PDF certificates
- Automatic hash generation
- Blockchain storage with transaction proof
- IPFS integration for document storage
- Metadata support

### Certificate Verification
- **Blockchain Verification**: Verify certificate exists on blockchain
- **AI Verification**: Detect tampering using ML models
- **Complete Verification**: Combined blockchain + AI verification
- Anomaly detection and reporting

### Student Portal
- View all earned certificates
- Download certificates
- Portfolio generation
- Certificate statistics

### Institution Portal
- Upload new certificates
- View issued certificates
- Certificate management dashboard

## 🔐 Security Features

- Immutable blockchain storage
- SHA-256 certificate hashing
- JWT authentication (ready for implementation)
- CORS protection
- Input validation with Pydantic

## 🤖 AI/ML Features

- Document tampering detection
- Anomaly scoring
- Pattern recognition
- Multiple verification algorithms:
  - Texture analysis
  - Edge detection
  - Format consistency checking
  - Metadata verification

## 📊 Database Schema

### Tables
- **institutions**: Certificate issuers
- **students**: Certificate recipients
- **certificates**: Certificate records with blockchain references
- **verifications**: Verification history and results

## 🌐 API Endpoints

### Institution Endpoints
- `POST /api/v1/institution/certificates` - Upload certificate
- `GET /api/v1/institution/certificates` - Get all certificates

### Student Endpoints
- `GET /api/v1/student/{student_id}/certificates` - Get student certificates
- `GET /api/v1/student/{student_id}/portfolio` - Get student portfolio
- `GET /api/v1/student/certificate/{cert_id}/download` - Download certificate

### Verifier Endpoints
- `POST /api/v1/verifier/blockchain` - Verify on blockchain
- `POST /api/v1/verifier/ai` - Verify using AI
- `POST /api/v1/verifier/complete` - Complete verification

## 🔗 Smart Contract Functions

- `issueCertificate(bytes32 hash, string studentId, string ipfsHash)` - Issue new certificate
- `verifyCertificate(bytes32 hash)` - Verify certificate exists
- `revokeCertificate(bytes32 hash)` - Revoke certificate
- `isCertificateValid(bytes32 hash)` - Check if certificate is valid

## 📝 Development Workflow

1. **Start blockchain node** - Provides local Ethereum network
2. **Deploy smart contract** - Deploy CertificateRegistry contract
3. **Copy ABI** - Run `copy_abi.py` to sync contract ABI
4. **Start backend** - API server with database
5. **Start frontend** - User interface
6. **Run tests** - Verify integration

## 🐛 Troubleshooting

### Backend not connecting to blockchain
- Ensure Hardhat node is running
- Check CONTRACT_ADDRESS in backend/.env
- Verify ABI is copied to backend/app/contracts/

### Frontend cannot connect to MetaMask
- Install MetaMask browser extension
- Connect to localhost:8545 network
- Import Hardhat test account

### Database errors
- Delete test.db and restart backend to recreate tables
- Check SQLAlchemy version compatibility

### Port already in use
- Frontend (5174): Kill process or change in vite.config.ts
- Backend (8000): Change in uvicorn command
- Blockchain (8545): Kill other Hardhat instances

## 🚢 Production Deployment

### Backend
1. Use PostgreSQL instead of SQLite
2. Set production JWT_SECRET
3. Configure CORS for production domains
4. Deploy to cloud platform (AWS, Azure, GCP)
5. Use production Ethereum network (Polygon, Ethereum mainnet)

### Frontend
1. Build production bundle: `npm run build`
2. Deploy to Vercel/Netlify/AWS S3
3. Update API URLs in .env.production

### Blockchain
1. Deploy contract to production network
2. Update CONTRACT_ADDRESS in all components
3. Fund deployer account with ETH
4. Verify contract on Etherscan

## 📚 Additional Resources

- **Hardhat Documentation**: https://hardhat.org/docs
- **FastAPI Documentation**: https://fastapi.tiangolo.com
- **React Documentation**: https://react.dev
- **web3.py Documentation**: https://web3py.readthedocs.io
- **Solidity Documentation**: https://docs.soliditylang.org

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Developer**: swyam7980
- **Repository**: https://github.com/swyam7980/certificate-forgery-detect

## 🎉 Acknowledgments

- Built with modern web3 technologies
- Inspired by the need for verifiable educational credentials
- Community-driven development

---

**Status**: ✅ All systems integrated and tested
**Last Updated**: November 21, 2025

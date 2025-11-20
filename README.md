# 🎓 Certify - Blockchain Certificate Verification Platform

A full-stack decentralized application for issuing, managing, and verifying educational certificates using Ethereum blockchain, IPFS storage, and AI-powered forgery detection.

## 🌟 Features

### 🏛️ Institution Portal
- Upload PDF certificates
- Store certificate hashes on Ethereum blockchain
- Automatic IPFS storage for decentralized file hosting
- Dashboard to manage all issued certificates
- Certificate revocation support

### 👨‍🎓 Student Portal
- View all certificates issued to you
- Download certificates as PDF
- Generate shareable portfolio page
- Public portfolio URLs for resume/LinkedIn

### ✅ Verifier Portal
- **Blockchain Verification**: Check if certificate hash exists on-chain
- **AI-Powered Forgery Detection**:
  - OCR text extraction
  - Layout similarity analysis
  - Logo/seal detection and matching
  - Signature authenticity analysis
  - Image tamper detection (ELA, clone detection)
  - NLP content validation
- Combined trust score (0-100%)
- Detailed anomaly reporting

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│         (Institution/Student/Verifier Portals)           │
└────────────────────┬─────────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────────┐
│                 FastAPI Backend (Python)                 │
│  ┌──────────────┬───────────────┬────────────────────┐  │
│  │ Blockchain   │     IPFS      │   AI Verification  │  │
│  │   Service    │   Service     │     Pipeline       │  │
│  └──────────────┴───────────────┴────────────────────┘  │
└─────────┬────────────────┬────────────────┬─────────────┘
          │                │                │
┌─────────▼──────┐  ┌──────▼──────┐  ┌─────▼──────────┐
│   Ethereum     │  │    IPFS     │  │   PostgreSQL   │
│ Smart Contract │  │   Storage   │  │    Database    │
└────────────────┘  └─────────────┘  └────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** (fast dev server)
- **TailwindCSS** (styling)
- **React Router** (navigation)
- **ethers.js** (blockchain interaction)
- **Axios** + React Query (API/state)

### Backend
- **FastAPI** (Python web framework)
- **SQLAlchemy** + PostgreSQL (database)
- **web3.py** (Ethereum interaction)
- **ipfshttpclient** (IPFS storage)
- **PyTorch** + OpenCV (AI models)
- **Tesseract OCR** (text extraction)

### Blockchain
- **Solidity** smart contracts
- **Hardhat** (development framework)
- **Ethereum** (Sepolia testnet)
- **OpenZeppelin** (security standards)

### Infrastructure
- **Docker** + Docker Compose
- **Nginx** (reverse proxy)
- **Alembic** (database migrations)

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```powershell
# Clone the repository
cd Devfolio

# Start all services
docker-compose up -d

# Deploy smart contract
cd blockchain
npm install
npm run deploy:local

# Update CONTRACT_ADDRESS in docker-compose.yml
# Then restart backend
docker-compose restart backend

# Run database migrations
docker-compose exec backend alembic upgrade head

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/docs
```

### Option 2: Local Development

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed local setup instructions.

## 📁 Project Structure

```
Devfolio/
├── frontend/          # React TypeScript app
├── backend/           # FastAPI Python backend
│   ├── app/
│   │   ├── api/       # API endpoints
│   │   ├── models/    # Database models
│   │   ├── services/  # Business logic
│   │   └── ai/        # AI verification modules
│   └── alembic/       # Database migrations
├── blockchain/        # Solidity smart contracts
│   ├── contracts/     # CertificateRegistry.sol
│   ├── scripts/       # Deployment scripts
│   └── test/          # Contract tests
├── docker/            # Docker configurations
└── ml-models/         # Pre-trained AI models
```

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed breakdown.

## 🔑 Key Components

### Smart Contract (`CertificateRegistry.sol`)
- Stores certificate hashes immutably on Ethereum
- Tracks issuer, student, and certificate metadata
- Supports certificate revocation
- Event emission for tracking

### Backend Services
- **`blockchain_service.py`**: Web3 integration
- **`ipfs_service.py`**: Decentralized storage
- **`certificate_service.py`**: Certificate issuance orchestration
- **`ai/aggregator.py`**: AI verification pipeline

### AI Verification Pipeline
1. **OCR Extraction**: Extract text from PDF
2. **Name Verification**: Match student name with blockchain record
3. **Layout Analysis**: Compare with template certificates
4. **Logo Detection**: Verify institution logos
5. **Signature Analysis**: Classify signature authenticity
6. **Tamper Detection**: Detect image manipulation
7. **Trust Score**: Aggregate weighted score (0-100%)

## 📚 API Documentation

Once backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

**Institution:**
- `POST /api/v1/institution/certificates` - Issue certificate
- `GET /api/v1/institution/certificates` - List certificates
- `DELETE /api/v1/institution/certificates/{hash}` - Revoke

**Student:**
- `GET /api/v1/student/certificates/{student_id}` - Get certificates
- `GET /api/v1/student/certificate/{ipfs_hash}/download` - Download PDF
- `GET /api/v1/student/portfolio/{student_id}` - Public portfolio

**Verifier:**
- `POST /api/v1/verify/blockchain` - Blockchain verification
- `POST /api/v1/verify/ai` - AI forgery detection
- `POST /api/v1/verify/complete` - Complete verification

## 🔐 Security Features

- ✅ Immutable blockchain storage
- ✅ Decentralized IPFS file hosting
- ✅ Cryptographic hash verification
- ✅ Multi-layer AI fraud detection
- ✅ JWT authentication (TODO)
- ✅ Rate limiting (TODO)
- ✅ HTTPS/SSL (production)

## 🧪 Testing

```powershell
# Backend tests
cd backend
pytest

# Smart contract tests
cd blockchain
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Production deployment guide
- Environment configuration
- Security checklist
- Scaling considerations
- Troubleshooting

## 🛣️ Roadmap

- [x] Core certificate issuance
- [x] Blockchain integration
- [x] IPFS storage
- [x] Basic AI verification
- [ ] Advanced AI models (signature, tamper detection)
- [ ] JWT authentication
- [ ] Institution registration/approval
- [ ] Email notifications
- [ ] Mobile app
- [ ] Batch certificate upload
- [ ] Analytics dashboard

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please read CONTRIBUTING.md first.

## 📞 Support

- Documentation: [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
- Deployment: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Issues: GitHub Issues
- Email: support@certify.dev

---

**Built with ❤️ using Blockchain, AI, and Web3 technologies**

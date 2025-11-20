# Certificate Verification System - Project Structure

## Tech Stack

### Frontend
- **Framework**: React.js with TypeScript
- **Styling**: TailwindCSS
- **Blockchain**: ethers.js
- **State Management**: React Query
- **Routing**: React Router

### Backend
- **Framework**: Python FastAPI
- **Blockchain**: web3.py
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Storage**: IPFS (via ipfshttpclient)
- **AI/ML**: PyTorch, OpenCV, Tesseract
- **Authentication**: JWT tokens

### Blockchain
- **Smart Contract**: Solidity
- **Development**: Hardhat
- **Network**: Ethereum (Sepolia testnet for development)

---

## Project Directory Structure

```
Devfolio/
├── README.md
├── PROJECT_STRUCTURE.md
│
├── frontend/                          # React frontend application
│   ├── public/
│   │   ├── index.html
│   │   └── assets/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/               # Reusable components
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Card.tsx
│   │   │   ├── institution/
│   │   │   │   ├── UploadCertificate.tsx
│   │   │   │   ├── CertificateDashboard.tsx
│   │   │   │   └── CertificateCard.tsx
│   │   │   ├── student/
│   │   │   │   ├── CertificateList.tsx
│   │   │   │   ├── CertificateViewer.tsx
│   │   │   │   └── SharePortfolio.tsx
│   │   │   └── verifier/
│   │   │       ├── VerificationForm.tsx
│   │   │       ├── BlockchainVerify.tsx
│   │   │       └── AIVerifyResults.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Institution.tsx
│   │   │   ├── Student.tsx
│   │   │   ├── Verifier.tsx
│   │   │   └── Portfolio.tsx
│   │   ├── services/
│   │   │   ├── api.ts                # Axios/Fetch API client
│   │   │   ├── blockchain.ts         # Web3 interactions
│   │   │   └── ipfs.ts
│   │   ├── hooks/
│   │   │   ├── useWeb3.ts
│   │   │   ├── useCertificates.ts
│   │   │   └── useVerification.ts
│   │   ├── utils/
│   │   │   ├── constants.ts
│   │   │   ├── helpers.ts
│   │   │   └── validators.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.js
│
├── backend/                           # Python FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                   # FastAPI application entry
│   │   ├── config.py                 # Configuration (env variables)
│   │   │
│   │   ├── api/                      # API routes
│   │   │   ├── __init__.py
│   │   │   ├── v1/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── endpoints/
│   │   │   │   │   ├── __init__.py
│   │   │   │   │   ├── institution.py    # Institution endpoints
│   │   │   │   │   ├── student.py        # Student endpoints
│   │   │   │   │   └── verifier.py       # Verifier endpoints
│   │   │   │   └── router.py
│   │   │
│   │   ├── models/                   # Database models (SQLAlchemy)
│   │   │   ├── __init__.py
│   │   │   ├── certificate.py
│   │   │   ├── institution.py
│   │   │   ├── student.py
│   │   │   └── verification.py
│   │   │
│   │   ├── schemas/                  # Pydantic schemas (request/response)
│   │   │   ├── __init__.py
│   │   │   ├── certificate.py
│   │   │   ├── institution.py
│   │   │   ├── student.py
│   │   │   └── verification.py
│   │   │
│   │   ├── services/                 # Business logic
│   │   │   ├── __init__.py
│   │   │   ├── blockchain_service.py    # Ethereum/Web3 interactions
│   │   │   ├── ipfs_service.py          # IPFS upload/retrieval
│   │   │   ├── certificate_service.py   # Certificate CRUD
│   │   │   └── ai_service.py            # AI model orchestration
│   │   │
│   │   ├── ai/                       # AI/ML modules
│   │   │   ├── __init__.py
│   │   │   ├── ocr/
│   │   │   │   ├── __init__.py
│   │   │   │   └── text_extractor.py    # Tesseract/EasyOCR
│   │   │   ├── layout/
│   │   │   │   ├── __init__.py
│   │   │   │   └── layout_analyzer.py   # Layout similarity
│   │   │   ├── logo/
│   │   │   │   ├── __init__.py
│   │   │   │   └── logo_matcher.py      # Logo detection/matching
│   │   │   ├── signature/
│   │   │   │   ├── __init__.py
│   │   │   │   └── signature_verifier.py
│   │   │   ├── tamper/
│   │   │   │   ├── __init__.py
│   │   │   │   └── tamper_detector.py   # Forgery detection
│   │   │   ├── nlp/
│   │   │   │   ├── __init__.py
│   │   │   │   └── content_checker.py   # NLP checks
│   │   │   └── aggregator.py            # Combine all scores
│   │   │
│   │   ├── core/                     # Core utilities
│   │   │   ├── __init__.py
│   │   │   ├── security.py           # JWT, password hashing
│   │   │   ├── database.py           # DB connection
│   │   │   └── dependencies.py       # FastAPI dependencies
│   │   │
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── pdf_utils.py          # PDF processing
│   │       ├── hash_utils.py         # Hashing functions
│   │       └── validators.py
│   │
│   ├── tests/                        # Unit tests
│   │   ├── __init__.py
│   │   ├── test_api/
│   │   ├── test_services/
│   │   └── test_ai/
│   │
│   ├── alembic/                      # Database migrations
│   │   ├── versions/
│   │   └── env.py
│   │
│   ├── requirements.txt              # Python dependencies
│   ├── requirements-dev.txt          # Development dependencies
│   ├── Dockerfile
│   └── .env.example
│
├── blockchain/                        # Smart contracts
│   ├── contracts/
│   │   ├── CertificateRegistry.sol   # Main contract
│   │   └── Ownable.sol               # Access control
│   ├── scripts/
│   │   ├── deploy.js                 # Deployment script
│   │   └── verify.js
│   ├── test/
│   │   └── CertificateRegistry.test.js
│   ├── hardhat.config.js
│   ├── package.json
│   └── .env.example
│
├── ml-models/                         # Pre-trained models & data
│   ├── layout_templates/             # Institution certificate templates
│   ├── logo_embeddings/              # Canonical logos
│   ├── signature_model/              # Trained signature model
│   ├── tamper_detection/             # Forgery detection model
│   └── README.md
│
├── docker/                            # Docker configuration
│   ├── docker-compose.yml
│   ├── frontend.Dockerfile
│   ├── backend.Dockerfile
│   └── nginx.conf
│
└── docs/                              # Documentation
    ├── API.md                         # API documentation
    ├── BLOCKCHAIN.md                  # Smart contract docs
    ├── AI_MODELS.md                   # AI model details
    └── DEPLOYMENT.md                  # Deployment guide
```

---

## Backend API Endpoints (Python FastAPI)

### Institution Endpoints
```
POST   /api/v1/institution/register          # Register institution
POST   /api/v1/institution/login             # Login
POST   /api/v1/institution/certificates      # Upload & issue certificate
GET    /api/v1/institution/certificates      # Get all issued certificates
GET    /api/v1/institution/certificates/:id  # Get specific certificate
DELETE /api/v1/institution/certificates/:id  # Revoke certificate
```

### Student Endpoints
```
GET    /api/v1/student/certificates/:studentId     # Get student's certificates
GET    /api/v1/student/portfolio/:studentId        # Get shareable portfolio
GET    /api/v1/student/certificate/:id/download    # Download certificate PDF
```

### Verifier Endpoints
```
POST   /api/v1/verify/blockchain                   # Verify via blockchain
POST   /api/v1/verify/ai                           # AI forgery detection
GET    /api/v1/verify/certificate/:hash            # Get certificate by hash
POST   /api/v1/verify/complete                     # Both blockchain + AI
```

### Health & Utility
```
GET    /api/health                                 # Health check
GET    /api/docs                                   # Swagger documentation
```

---

## Key Python Dependencies

### Core Backend
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
pydantic==2.5.0
pydantic-settings==2.1.0
```

### Database
```
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
alembic==1.12.1
```

### Blockchain
```
web3==6.11.3
eth-account==0.10.0
```

### IPFS
```
ipfshttpclient==0.8.0a2
```

### AI/ML
```
torch==2.1.0
torchvision==0.16.0
opencv-python==4.8.1.78
pytesseract==0.3.10
easyocr==1.7.0
pillow==10.1.0
pdf2image==1.16.3
numpy==1.24.3
scikit-learn==1.3.2
transformers==4.35.2
```

### Utilities
```
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.0
httpx==0.25.1
aiofiles==23.2.1
```

---

## Database Schema (PostgreSQL)

### Tables

**institutions**
- id (UUID, PK)
- name (VARCHAR)
- email (VARCHAR, UNIQUE)
- wallet_address (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- logo_url (VARCHAR)
- created_at (TIMESTAMP)

**students**
- id (UUID, PK)
- name (VARCHAR)
- email (VARCHAR)
- student_id (VARCHAR, UNIQUE)
- created_at (TIMESTAMP)

**certificates**
- id (UUID, PK)
- institution_id (UUID, FK)
- student_id (UUID, FK)
- certificate_hash (VARCHAR, UNIQUE)
- ipfs_hash (VARCHAR)
- blockchain_tx_hash (VARCHAR)
- pdf_url (VARCHAR)
- course_name (VARCHAR)
- issue_date (DATE)
- metadata (JSONB)
- created_at (TIMESTAMP)

**verifications**
- id (UUID, PK)
- certificate_id (UUID, FK)
- verification_type (ENUM: 'blockchain', 'ai', 'complete')
- trust_score (FLOAT)
- anomalies (JSONB)
- verified_at (TIMESTAMP)

---

## Smart Contract Structure (Solidity)

```solidity
contract CertificateRegistry {
    struct Certificate {
        bytes32 certificateHash;
        address issuer;
        string studentId;
        uint256 issueDate;
        string ipfsHash;
        bool isRevoked;
    }
    
    mapping(bytes32 => Certificate) public certificates;
    mapping(address => bool) public authorizedIssuers;
    
    event CertificateIssued(bytes32 indexed hash, address issuer);
    event CertificateRevoked(bytes32 indexed hash);
    
    function issueCertificate(...) external;
    function verifyCertificate(bytes32 hash) external view returns (bool);
    function revokeCertificate(bytes32 hash) external;
}
```

---

## AI Model Pipeline

1. **PDF → Image Conversion** → Extract pages as images
2. **OCR Text Extraction** → Extract all text using Tesseract
3. **Layout Analysis** → Compare with template using CNN embeddings
4. **Logo Detection** → YOLO/Faster-RCNN → Similarity check
5. **Signature Analysis** → CNN classification
6. **Tamper Detection** → ELA + Clone detection
7. **NLP Content Check** → Text validation
8. **Score Aggregation** → Weighted average → Final trust score

---

## Development Workflow

1. **Setup local environment**
   - Install Python 3.11+, Node.js, PostgreSQL
   - Run local Ethereum node (Hardhat)
   - Setup IPFS node

2. **Deploy smart contract**
   - Compile and deploy to local/testnet
   - Save contract address and ABI

3. **Start backend**
   - Configure `.env` with contract address
   - Run database migrations
   - Start FastAPI server

4. **Start frontend**
   - Configure environment variables
   - Connect to backend API
   - Run development server

5. **Test workflow**
   - Upload test certificate
   - Verify blockchain storage
   - Test AI verification

---

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:pass@localhost/certify_db
ETHEREUM_RPC_URL=http://localhost:8545
CONTRACT_ADDRESS=0x...
PRIVATE_KEY=0x...
IPFS_URL=http://localhost:5001
JWT_SECRET=your-secret-key
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_ETHEREUM_RPC_URL=http://localhost:8545
REACT_APP_CONTRACT_ADDRESS=0x...
```

---

## Deployment Architecture

```
┌─────────────┐
│   Nginx     │ ← Reverse Proxy
└──────┬──────┘
       │
   ┌───┴────┬─────────┬──────────┐
   │        │         │          │
┌──▼───┐ ┌─▼────┐ ┌──▼─────┐ ┌──▼────┐
│React │ │FastAPI│ │Ethereum│ │ IPFS  │
│ UI   │ │Backend│ │ Node   │ │ Node  │
└──────┘ └───┬───┘ └────────┘ └───────┘
             │
        ┌────▼─────┐
        │PostgreSQL│
        └──────────┘
```

---

This structure provides a scalable, maintainable architecture with clear separation of concerns. The Python backend unifies all AI/ML and blockchain logic in one language, making development and deployment more efficient.

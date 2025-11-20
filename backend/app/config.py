from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./test.db"
    
    # Blockchain
    ETHEREUM_RPC_URL: str = "http://localhost:8545"
    CONTRACT_ADDRESS: Optional[str] = None
    PRIVATE_KEY: Optional[str] = None
    
    # IPFS
    IPFS_URL: str = "http://localhost:5001"
    
    # Security
    JWT_SECRET: str = "dev-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Environment
    ENVIRONMENT: str = "development"
    
    # API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "CertifyChain"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

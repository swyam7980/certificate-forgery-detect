from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any, List
from datetime import datetime, date


# Institution Schemas
class InstitutionBase(BaseModel):
    name: str
    email: EmailStr
    wallet_address: str


class InstitutionCreate(InstitutionBase):
    password: str


class InstitutionResponse(InstitutionBase):
    id: str
    logo_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Student Schemas
class StudentBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    student_id: str


class StudentCreate(StudentBase):
    pass


class StudentResponse(StudentBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


# Certificate Schemas
class CertificateBase(BaseModel):
    student_name: str
    student_id: str
    course_name: str
    issue_date: date
    metadata: Optional[Dict[str, Any]] = None


class CertificateCreate(CertificateBase):
    pass


class CertificateResponse(CertificateBase):
    id: str
    certificate_hash: str
    ipfs_hash: str
    blockchain_tx_hash: str
    pdf_url: str
    institution_name: str
    institution_id: str
    created_at: datetime

    class Config:
        from_attributes = True


class CertificateUploadResponse(BaseModel):
    success: bool
    certificate_id: str
    certificate_hash: str
    ipfs_hash: str
    blockchain_tx_hash: str
    pdf_url: str
    message: str


# Verification Schemas
class VerificationRequest(BaseModel):
    hash: Optional[str] = None


class VerificationDetails(BaseModel):
    ocr_score: Optional[float] = None
    layout_score: Optional[float] = None
    logo_score: Optional[float] = None
    signature_score: Optional[float] = None
    tamper_score: Optional[float] = None
    content_score: Optional[float] = None


class VerificationResult(BaseModel):
    is_valid: bool
    certificate_hash: str
    blockchain_verified: bool
    ai_verified: Optional[bool] = None
    trust_score: Optional[float] = None
    anomalies: Optional[List[str]] = None
    details: Optional[VerificationDetails] = None
    certificate: Optional[CertificateResponse] = None


# Portfolio Schema
class PortfolioResponse(BaseModel):
    student: StudentResponse
    certificates: List[CertificateResponse]

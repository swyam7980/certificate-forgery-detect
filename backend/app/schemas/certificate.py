from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, Dict, Any, List
from datetime import datetime, date


def to_camel(string: str) -> str:
    """Convert snake_case to camelCase"""
    components = string.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])


# Institution Schemas
class InstitutionBase(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
    
    name: str
    email: EmailStr
    wallet_address: str


class InstitutionCreate(InstitutionBase):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
    
    password: str


class InstitutionResponse(InstitutionBase):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    
    id: str
    logo_url: Optional[str] = None
    created_at: datetime


# Student Schemas
class StudentBase(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
    
    name: str
    email: Optional[EmailStr] = None
    student_id: str


class StudentCreate(StudentBase):
    pass


class StudentResponse(StudentBase):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    
    id: str
    created_at: datetime


# Certificate Schemas
class CertificateBase(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
    
    student_name: str
    student_id: str
    course_name: str
    issue_date: date
    metadata: Optional[Dict[str, Any]] = None


class CertificateCreate(CertificateBase):
    pass


class CertificateResponse(CertificateBase):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    
    id: str
    certificate_hash: str
    ipfs_hash: str
    blockchain_tx_hash: str
    pdf_url: str
    institution_name: str
    institution_id: str
    created_at: datetime


class CertificateUploadResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
    
    success: bool
    certificate_id: str
    certificate_hash: str
    ipfs_hash: str
    blockchain_tx_hash: str
    pdf_url: str
    message: str


# Verification Schemas
class VerificationRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
    
    hash: Optional[str] = None


class VerificationDetails(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
    
    ocr_score: Optional[float] = None
    layout_score: Optional[float] = None
    logo_score: Optional[float] = None
    signature_score: Optional[float] = None
    tamper_score: Optional[float] = None
    content_score: Optional[float] = None


class VerificationResult(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
    
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
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
    
    student: StudentResponse
    certificates: List[CertificateResponse]

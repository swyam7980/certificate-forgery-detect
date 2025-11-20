from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, Date, Boolean, Float
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class Institution(Base):
    __tablename__ = "institutions"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    wallet_address = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    logo_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    certificates = relationship("Certificate", back_populates="institution")


class Student(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    student_id = Column(String, unique=True, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    certificates = relationship("Certificate", back_populates="student")


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(String, primary_key=True, default=generate_uuid)
    institution_id = Column(String, ForeignKey("institutions.id"), nullable=False)
    student_id_fk = Column(String, ForeignKey("students.id"), nullable=False)
    
    certificate_hash = Column(String, unique=True, nullable=False, index=True)
    ipfs_hash = Column(String, nullable=False)
    blockchain_tx_hash = Column(String, nullable=False)
    pdf_url = Column(String, nullable=False)
    
    student_name = Column(String, nullable=False)
    student_id = Column(String, nullable=False, index=True)
    course_name = Column(String, nullable=False)
    issue_date = Column(Date, nullable=False)
    
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    institution = relationship("Institution", back_populates="certificates")
    student = relationship("Student", back_populates="certificates")
    verifications = relationship("Verification", back_populates="certificate")


class Verification(Base):
    __tablename__ = "verifications"

    id = Column(String, primary_key=True, default=generate_uuid)
    certificate_id = Column(String, ForeignKey("certificates.id"), nullable=False)
    
    verification_type = Column(String, nullable=False)  # 'blockchain', 'ai', 'complete'
    trust_score = Column(Float, nullable=True)
    anomalies = Column(JSON, nullable=True)
    details = Column(JSON, nullable=True)
    
    is_valid = Column(Boolean, default=False)
    blockchain_verified = Column(Boolean, nullable=True)
    ai_verified = Column(Boolean, nullable=True)
    
    verified_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    certificate = relationship("Certificate", back_populates="verifications")

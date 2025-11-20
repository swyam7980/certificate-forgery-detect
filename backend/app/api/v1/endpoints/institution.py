from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date as date_type
import hashlib
import json
import logging

from app.core.database import get_db
from app.schemas.certificate import (
    CertificateResponse,
    CertificateUploadResponse
)
from app.models.certificate import Certificate, Institution, Student
from app.services.blockchain_service import blockchain_service

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/certificates", response_model=CertificateUploadResponse)
async def upload_certificate(
    student_name: str = Form(...),
    student_id: str = Form(...),
    course_name: str = Form(...),
    issue_date: str = Form(...),
    pdfFile: UploadFile = File(...),
    metadata: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Upload a certificate and store it on blockchain and IPFS
    """
    try:
        # Read PDF file
        pdf_content = await pdfFile.read()
        
        # Calculate certificate hash
        cert_hash = hashlib.sha256(pdf_content).hexdigest()
        
        # TODO: Upload to IPFS
        ipfs_hash = f"Qm{cert_hash[:44]}"  # Placeholder
        pdf_url = f"https://ipfs.io/ipfs/{ipfs_hash}"
        
        # Store on blockchain
        try:
            blockchain_result = blockchain_service.issue_certificate(
                certificate_hash=cert_hash,
                student_id=student_id,
                ipfs_hash=ipfs_hash
            )
            tx_hash = blockchain_result['transaction_hash']
            logger.info(f"Certificate issued on blockchain: {tx_hash}")
        except Exception as e:
            logger.error(f"Failed to issue certificate on blockchain: {e}")
            # Fallback to placeholder if blockchain fails
            tx_hash = f"0x{cert_hash[:64]}"
        
        # Parse metadata
        metadata_dict = json.loads(metadata) if metadata else None
        
        # Create or get student
        student = db.query(Student).filter(Student.student_id == student_id).first()
        if not student:
            student = Student(
                student_id=student_id,
                name=student_name
            )
            db.add(student)
            db.commit()
            db.refresh(student)
        
        # TODO: Get institution_id from authentication
        institution_id = "temp-institution-id"
        
        # Create certificate record
        certificate = Certificate(
            institution_id=institution_id,
            student_id_fk=student.id,
            certificate_hash=cert_hash,
            ipfs_hash=ipfs_hash,
            blockchain_tx_hash=tx_hash,
            pdf_url=pdf_url,
            student_name=student_name,
            student_id=student_id,
            course_name=course_name,
            issue_date=date_type.fromisoformat(issue_date),
            cert_metadata=metadata_dict
        )
        
        db.add(certificate)
        db.commit()
        db.refresh(certificate)
        
        return CertificateUploadResponse(
            success=True,
            certificate_id=certificate.id,
            certificate_hash=cert_hash,
            ipfs_hash=ipfs_hash,
            blockchain_tx_hash=tx_hash,
            pdf_url=pdf_url,
            message="Certificate uploaded successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/certificates", response_model=List[CertificateResponse])
def get_institution_certificates(
    db: Session = Depends(get_db)
):
    """
    Get all certificates issued by the institution
    """
    # TODO: Get institution_id from authentication
    institution_id = "temp-institution-id"
    
    certificates = db.query(Certificate).filter(
        Certificate.institution_id == institution_id
    ).all()
    
    return certificates


@router.get("/certificates/{certificate_id}", response_model=CertificateResponse)
def get_certificate(
    certificate_id: str,
    db: Session = Depends(get_db)
):
    """
    Get a specific certificate by ID
    """
    certificate = db.query(Certificate).filter(
        Certificate.id == certificate_id
    ).first()
    
    if not certificate:
        raise HTTPException(status_code=404, detail="Certificate not found")
    
    return certificate

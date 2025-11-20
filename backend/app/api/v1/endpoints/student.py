from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.certificate import CertificateResponse, PortfolioResponse, StudentResponse
from app.models.certificate import Certificate, Student

router = APIRouter()


@router.get("/{student_id}/certificates", response_model=List[CertificateResponse])
def get_student_certificates(
    student_id: str,
    db: Session = Depends(get_db)
):
    """
    Get all certificates for a specific student
    """
    certificates = db.query(Certificate).filter(
        Certificate.student_id == student_id
    ).all()
    
    if not certificates:
        raise HTTPException(status_code=404, detail="No certificates found for this student")
    
    # Enrich with institution names
    result = []
    for cert in certificates:
        cert_dict = {
            "id": cert.id,
            "certificate_hash": cert.certificate_hash,
            "ipfs_hash": cert.ipfs_hash,
            "blockchain_tx_hash": cert.blockchain_tx_hash,
            "pdf_url": cert.pdf_url,
            "student_name": cert.student_name,
            "student_id": cert.student_id,
            "course_name": cert.course_name,
            "issue_date": cert.issue_date,
            "institution_name": cert.institution.name if cert.institution else "Unknown",
            "institution_id": cert.institution_id,
            "created_at": cert.created_at,
            "metadata": cert.cert_metadata
        }
        result.append(cert_dict)
    
    return result


@router.get("/{student_id}/portfolio")
def get_student_portfolio(
    student_id: str,
    db: Session = Depends(get_db)
):
    """
    Get student portfolio with all certificates
    """
    student = db.query(Student).filter(Student.student_id == student_id).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    certificates = db.query(Certificate).filter(
        Certificate.student_id == student_id
    ).all()
    
    # Enrich certificates with institution names
    result_certs = []
    for cert in certificates:
        cert_dict = {
            "id": cert.id,
            "certificate_hash": cert.certificate_hash,
            "ipfs_hash": cert.ipfs_hash,
            "blockchain_tx_hash": cert.blockchain_tx_hash,
            "pdf_url": cert.pdf_url,
            "student_name": cert.student_name,
            "student_id": cert.student_id,
            "course_name": cert.course_name,
            "issue_date": cert.issue_date,
            "institution_name": cert.institution.name if cert.institution else "Unknown",
            "institution_id": cert.institution_id,
            "created_at": cert.created_at,
            "metadata": cert.cert_metadata
        }
        result_certs.append(cert_dict)
    
    return {
        "student": {
            "id": student.id,
            "name": student.name,
            "email": student.email,
            "student_id": student.student_id,
            "created_at": student.created_at
        },
        "certificates": result_certs
    }


@router.get("/certificate/{certificate_id}/download")
async def download_certificate(
    certificate_id: str,
    db: Session = Depends(get_db)
):
    """
    Download certificate PDF
    """
    certificate = db.query(Certificate).filter(
        Certificate.id == certificate_id
    ).first()
    
    if not certificate:
        raise HTTPException(status_code=404, detail="Certificate not found")
    
    # TODO: Download from IPFS and return
    raise HTTPException(status_code=501, detail="Download feature not implemented yet")

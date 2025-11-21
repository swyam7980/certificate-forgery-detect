from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
import logging

from app.core.database import get_db
from app.schemas.certificate import VerificationResult, VerificationRequest, VerificationDetails
from app.models.certificate import Certificate, Verification
from app.services.blockchain_service import blockchain_service
from app.services.ai_verification_service import ai_verification_service

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/blockchain", response_model=VerificationResult)
async def verify_blockchain(
    request: VerificationRequest,
    db: Session = Depends(get_db)
):
    """
    Verify certificate using blockchain hash
    """
    if not request.hash:
        raise HTTPException(status_code=400, detail="Hash is required")
    
    logger.info(f"🔍 Verifying certificate hash: {request.hash}")
    
    # Find certificate by hash
    certificate = db.query(Certificate).filter(
        Certificate.certificate_hash == request.hash
    ).first()
    
    if not certificate:
        logger.warning(f"❌ Certificate not found in database: {request.hash}")
        return VerificationResult(
            is_valid=False,
            certificate_hash=request.hash,
            blockchain_verified=False,
            ai_verified=None,
            trust_score=None,
            anomalies=["Certificate not found in database"],
            details=None,
            certificate=None
        )
    
    logger.info(f"✅ Certificate found in database: {certificate.id}")
    
    # Verify on blockchain
    try:
        logger.info(f"🔗 Calling blockchain verification for hash: {certificate.certificate_hash}")
        blockchain_result = blockchain_service.verify_certificate(certificate.certificate_hash)
        logger.info(f"📊 Blockchain result: {blockchain_result}")
        
        blockchain_verified = blockchain_result['is_valid']
        
        if not blockchain_result['exists']:
            blockchain_verified = False
            anomalies = ["Certificate not found on blockchain"]
            logger.warning(f"❌ Certificate does not exist on blockchain")
        elif blockchain_result['is_revoked']:
            blockchain_verified = False
            anomalies = ["Certificate has been revoked"]
            logger.warning(f"⚠️ Certificate has been revoked")
        else:
            anomalies = []
            logger.info(f"✅ Certificate verified on blockchain")
            
        logger.info(f"Final blockchain_verified status: {blockchain_verified}")
    except Exception as e:
        logger.error(f"❌ Blockchain verification failed: {e}")
        logger.exception("Full traceback:")  # Log full traceback
        blockchain_verified = False
        anomalies = [f"Blockchain verification error: {str(e)}"]
    
    # Create verification record
    verification = Verification(
        certificate_id=certificate.id,
        verification_type="blockchain",
        is_valid=blockchain_verified,
        blockchain_verified=blockchain_verified
    )
    db.add(verification)
    db.commit()
    
    # Prepare certificate response
    cert_response = {
        "id": certificate.id,
        "certificate_hash": certificate.certificate_hash,
        "ipfs_hash": certificate.ipfs_hash,
        "blockchain_tx_hash": certificate.blockchain_tx_hash,
        "pdf_url": certificate.pdf_url,
        "student_name": certificate.student_name,
        "student_id": certificate.student_id,
        "course_name": certificate.course_name,
        "issue_date": certificate.issue_date,
        "institution_name": certificate.institution.name if certificate.institution else "Unknown",
        "institution_id": certificate.institution_id,
        "created_at": certificate.created_at,
        "metadata": certificate.cert_metadata
    }
    
    logger.info(f"📤 Returning verification result: is_valid={blockchain_verified}")
    
    return VerificationResult(
        is_valid=blockchain_verified,
        certificate_hash=request.hash,
        blockchain_verified=blockchain_verified,
        ai_verified=None,
        trust_score=None,
        anomalies=anomalies if anomalies else None,
        details=None,
        certificate=cert_response  # type: ignore
    )


@router.post("/ai", response_model=VerificationResult)
async def verify_ai(
    pdfFile: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Verify certificate using AI forgery detection
    """
    try:
        logger.info("🤖 Starting AI-only verification...")
        
        # Read PDF file
        pdf_content = await pdfFile.read()
        logger.info(f"📄 PDF file received: {pdfFile.filename}, size: {len(pdf_content)} bytes")
        
        # Run AI verification
        ai_results = ai_verification_service.verify_certificate_ai(pdf_content)
        
        # Create verification details
        details = VerificationDetails(
            ocr_score=ai_results["ocr_score"],
            layout_score=ai_results["layout_score"],
            logo_score=ai_results["logo_score"],
            signature_score=ai_results["signature_score"],
            tamper_score=ai_results["tamper_score"],
            content_score=ai_results.get("name_confidence", 0.0)
        )
        
        trust_score = ai_results["trust_score"]
        is_valid = trust_score >= 70.0
        anomalies = ai_results["anomalies"] if ai_results["anomalies"] else None
        
        logger.info(f"✅ AI verification complete - Trust Score: {trust_score:.2f}%")
        
        return VerificationResult(
            is_valid=is_valid,
            certificate_hash="",
            blockchain_verified=False,
            ai_verified=is_valid,
            trust_score=trust_score,
            details=details,
            anomalies=anomalies,
            certificate=None
        )
        
    except Exception as e:
        logger.error(f"❌ AI verification failed: {e}")
        logger.exception("Full traceback:")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/complete", response_model=VerificationResult)
async def verify_complete(
    hash: str = Form(...),
    pdfFile: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Complete verification: blockchain + AI
    """
    try:
        logger.info(f"🔍 Complete verification for hash: {hash}")
        
        # Blockchain verification
        certificate = db.query(Certificate).filter(
            Certificate.certificate_hash == hash
        ).first()
        
        logger.info(f"Certificate found: {certificate is not None}")
        
        blockchain_verified = certificate is not None
        
        # Read PDF for AI verification
        pdf_content = await pdfFile.read()
        logger.info(f"📄 PDF file received: {pdfFile.filename}, size: {len(pdf_content)} bytes")
        
        # Run AI verification with student name if certificate found
        expected_name = certificate.student_name if certificate else None
        ai_results = ai_verification_service.verify_certificate_ai(pdf_content, expected_name)
        
        # Create verification details
        details = VerificationDetails(
            ocr_score=ai_results["ocr_score"],
            layout_score=ai_results["layout_score"],
            logo_score=ai_results["logo_score"],
            signature_score=ai_results["signature_score"],
            tamper_score=ai_results["tamper_score"],
            content_score=ai_results.get("name_confidence", 0.0)
        )
        
        trust_score = ai_results["trust_score"]
        ai_verified = trust_score >= 70.0
        is_valid = blockchain_verified and ai_verified
        
        anomalies = ai_results["anomalies"].copy() if ai_results["anomalies"] else []
        if not blockchain_verified:
            anomalies.insert(0, "Certificate not found in blockchain")
        if not ai_verified:
            anomalies.insert(0, f"AI detected potential forgery (trust score: {trust_score:.1f}%)")
        
        logger.info(f"✅ Verification complete: valid={is_valid}, blockchain={blockchain_verified}, ai={ai_verified}")
        
        # Create verification record
        if certificate:
            verification = Verification(
                certificate_id=certificate.id,
                verification_type="complete",
                is_valid=is_valid,
                blockchain_verified=blockchain_verified,
                ai_verified=ai_verified,
                trust_score=trust_score,
                verification_details=details.model_dump(),  # Convert Pydantic model to dict
                anomalies=anomalies if anomalies else None
            )
            db.add(verification)
            db.commit()
        
        # Prepare certificate response
        cert_response = None
        if certificate:
            cert_response = {
                "id": certificate.id,
                "certificate_hash": certificate.certificate_hash,
                "ipfs_hash": certificate.ipfs_hash,
                "blockchain_tx_hash": certificate.blockchain_tx_hash,
                "pdf_url": certificate.pdf_url,
                "student_name": certificate.student_name,
                "student_id": certificate.student_id,
                "course_name": certificate.course_name,
                "issue_date": certificate.issue_date,
                "institution_name": certificate.institution.name if certificate.institution else "Unknown",
                "institution_id": certificate.institution_id,
                "created_at": certificate.created_at,
                "metadata": certificate.cert_metadata
            }
        
        return VerificationResult(
            is_valid=is_valid,
            certificate_hash=hash,
            blockchain_verified=blockchain_verified,
            ai_verified=ai_verified,
            trust_score=trust_score,
            details=details,
            anomalies=anomalies if anomalies else None,
            certificate=cert_response
        )
        
    except Exception as e:
        logger.error(f"❌ Complete verification failed: {e}")
        logger.exception("Full traceback:")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/certificate/{hash}")
def get_certificate_by_hash(
    hash: str,
    db: Session = Depends(get_db)
):
    """
    Get certificate by hash
    """
    certificate = db.query(Certificate).filter(
        Certificate.certificate_hash == hash
    ).first()
    
    if not certificate:
        raise HTTPException(status_code=404, detail="Certificate not found")
    
    return {
        "id": certificate.id,
        "certificate_hash": certificate.certificate_hash,
        "ipfs_hash": certificate.ipfs_hash,
        "blockchain_tx_hash": certificate.blockchain_tx_hash,
        "pdf_url": certificate.pdf_url,
        "student_name": certificate.student_name,
        "student_id": certificate.student_id,
        "course_name": certificate.course_name,
        "issue_date": certificate.issue_date,
        "institution_name": certificate.institution.name if certificate.institution else "Unknown",
        "institution_id": certificate.institution_id,
        "created_at": certificate.created_at,
        "metadata": certificate.cert_metadata
    }

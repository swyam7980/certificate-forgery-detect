from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from app.core.database import get_db
from app.core.auth import (
    authenticate_institution,
    create_access_token,
    get_password_hash,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from app.models.certificate import Institution
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    SignupRequest,
    SignupResponse,
    InstitutionProfile
)

router = APIRouter()


@router.post("/signup", response_model=SignupResponse)
def signup(
    request: SignupRequest,
    db: Session = Depends(get_db)
):
    """
    Register a new institution
    """
    # Check if email already exists
    existing = db.query(Institution).filter(Institution.email == request.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if wallet address already exists
    existing_wallet = db.query(Institution).filter(
        Institution.wallet_address == request.wallet_address
    ).first()
    if existing_wallet:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Wallet address already registered"
        )
    
    # Create new institution
    hashed_password = get_password_hash(request.password)
    institution = Institution(
        name=request.name,
        email=request.email,
        wallet_address=request.wallet_address,
        password_hash=hashed_password,
        logo_url=request.logo_url
    )
    
    db.add(institution)
    db.commit()
    db.refresh(institution)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": institution.id},
        expires_delta=access_token_expires
    )
    
    return SignupResponse(
        access_token=access_token,
        token_type="bearer",
        institution=InstitutionProfile(
            id=institution.id,
            name=institution.name,
            email=institution.email,
            wallet_address=institution.wallet_address,
            logo_url=institution.logo_url,
            created_at=institution.created_at
        )
    )


@router.post("/login", response_model=LoginResponse)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Login an institution
    """
    institution = authenticate_institution(request.email, request.password, db)
    if not institution:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": institution.id},
        expires_delta=access_token_expires
    )
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        institution=InstitutionProfile(
            id=institution.id,
            name=institution.name,
            email=institution.email,
            wallet_address=institution.wallet_address,
            logo_url=institution.logo_url,
            created_at=institution.created_at
        )
    )


@router.get("/me", response_model=InstitutionProfile)
def get_current_user_profile(
    db: Session = Depends(get_db)
):
    """
    Get current authenticated institution profile
    """
    from app.core.auth import get_current_institution
    
    institution = get_current_institution(db=db)
    
    return InstitutionProfile(
        id=institution.id,
        name=institution.name,
        email=institution.email,
        wallet_address=institution.wallet_address,
        logo_url=institution.logo_url,
        created_at=institution.created_at
    )

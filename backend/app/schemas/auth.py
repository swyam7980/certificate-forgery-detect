from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime


def to_camel(string: str) -> str:
    """Convert snake_case to camelCase"""
    components = string.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])


# Auth Schemas
class LoginRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
    
    email: EmailStr
    password: str


class SignupRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
    
    name: str
    email: EmailStr
    password: str
    wallet_address: str
    logo_url: Optional[str] = None


class InstitutionProfile(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    
    id: str
    name: str
    email: str
    wallet_address: str
    logo_url: Optional[str] = None
    created_at: datetime


class LoginResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
    
    access_token: str
    token_type: str
    institution: InstitutionProfile


class SignupResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
    
    access_token: str
    token_type: str
    institution: InstitutionProfile

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field, EmailStr

from .models import RequestStatus, RequestType


class MentorshipRequestCreate(BaseModel):
    mentor_id: int
    request_type: RequestType
    subject: str = Field(..., min_length=1, max_length=255)
    message: str = Field(..., min_length=1)


class MentorshipRequestRead(BaseModel):
    id: str
    mentee_id: int
    mentor_id: int
    request_type: RequestType
    subject: str
    message: str
    status: RequestStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str = "mentee"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
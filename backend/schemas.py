from __future__ import annotations

from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

from .models import RequestStatus, RequestType, VerificationStatus


class MentorProfileCreate(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=255)
    job_title: str = Field(..., min_length=1, max_length=255)
    company: str = Field(..., min_length=1, max_length=255)
    years_of_experience: int = Field(..., ge=0)
    bio: str = Field(..., min_length=1)
    expertise_tags: str = Field(..., min_length=1, max_length=500)
    availability: str = Field(..., min_length=1, max_length=255)
    avatar_url: str | None = None


class MentorProfileRead(BaseModel):
    id: int
    user_id: int
    full_name: str
    job_title: str
    company: str
    years_of_experience: int
    bio: str
    expertise_tags: str
    availability: str
    avatar_url: str | None = None

    class Config:
        orm_mode = True


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = "mentee"


class UserCreateMentor(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=1, max_length=255)
    job_title: str = Field(..., min_length=1, max_length=255)
    company: str = Field(..., min_length=1, max_length=255)
    years_of_experience: int = Field(..., ge=0)
    bio: str = Field(..., min_length=1)
    expertise_tags: str = Field(..., min_length=1, max_length=500)
    availability: str = Field(..., min_length=1, max_length=255)
    avatar_url: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    verification_status: VerificationStatus
    profile: MentorProfileRead | None = None

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class MentorshipRequestCreate(BaseModel):
    mentor_id: int
    request_type: RequestType
    subject: str = Field(..., min_length=1, max_length=255)
    message: str = Field(..., min_length=1)
    resume_url: str | None = None
    portfolio_url: str | None = None
    github_url: str | None = None


class MentorshipRequestStatusUpdate(BaseModel):
    status: RequestStatus
    response_message: str | None = None


class MentorshipRequestRead(BaseModel):
    id: str
    mentee_id: int
    mentor_id: int
    request_type: RequestType
    subject: str
    message: str
    resume_url: str | None = None
    portfolio_url: str | None = None
    github_url: str | None = None
    response_message: str | None = None
    status: RequestStatus
    created_at: datetime
    updated_at: datetime
    mentee_email: str | None = None
    mentor_email: str | None = None
    mentor_profile: MentorProfileRead | None = None

    class Config:
        orm_mode = True


class FileUploadResponse(BaseModel):
    filename: str
    url: str
    content_type: str
    size_bytes: int


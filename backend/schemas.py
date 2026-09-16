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
    location: str | None = None
    linkedin_url: str | None = None


class ProfileUpdate(BaseModel):
    full_name: str | None = None
    job_title: str | None = None
    company: str | None = None
    years_of_experience: int | None = None
    bio: str | None = None
    expertise_tags: str | None = None
    availability: str | None = None
    avatar_url: str | None = None
    location: str | None = None
    linkedin_url: str | None = None


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
    location: str | None = None
    linkedin_url: str | None = None

    class Config:
        orm_mode = True
        from_attributes = True


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
    location: str | None = None
    linkedin_url: str | None = None


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
        from_attributes = True


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
        from_attributes = True


class FileUploadResponse(BaseModel):
    filename: str
    url: str
    content_type: str
    size_bytes: int


class SavedMentorCreate(BaseModel):
    mentor_id: int


class SavedMentorRead(BaseModel):
    id: int
    user_id: int
    mentor_id: int
    created_at: datetime
    mentor_profile: MentorProfileRead | None = None

    class Config:
        orm_mode = True
        from_attributes = True


class MentorReviewCreate(BaseModel):
    mentor_id: int
    rating: int = Field(5, ge=1, le=5)
    session_topic: str = Field(..., min_length=1, max_length=255)
    quote: str = Field(..., min_length=1)


class MentorReviewRead(BaseModel):
    id: int
    mentor_id: int
    mentee_id: int
    rating: int
    reviewer_name: str
    reviewer_role: str
    session_topic: str
    quote: str
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True


class SessionNoteCreate(BaseModel):
    request_id: str | None = None
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)
    resource_url: str | None = None


class SessionNoteRead(BaseModel):
    id: int
    user_id: int
    request_id: str | None = None
    title: str
    content: str
    resource_url: str | None = None
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True

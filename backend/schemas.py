from __future__ import annotations

from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, validator

from .models import RequestStatus, RequestType, VerificationStatus


def _tags_to_list(v) -> list[str]:
    """Convert a comma-separated string OR a list to a clean list of tag strings."""
    if isinstance(v, list):
        return [str(tag).strip() for tag in v if str(tag).strip()]
    return [tag.strip() for tag in str(v).split(",") if tag.strip()]


def _list_to_str(tags: list[str]) -> str:
    """Serialize a list of tags back to the CSV string stored in the DB column."""
    return ", ".join(tags)


class MentorProfileCreate(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=255)
    job_title: str = Field(..., min_length=1, max_length=255)
    company: str = Field(..., min_length=1, max_length=255)
    years_of_experience: int = Field(..., ge=0)
    bio: str = Field(..., min_length=1)
    # Accepts either a list of strings or a legacy CSV string
    expertise_tags: list[str] = Field(..., min_length=1)
    availability: str = Field(..., min_length=1, max_length=255)
    avatar_url: str | None = None
    location: str | None = None
    linkedin_url: str | None = None

    @validator("expertise_tags", pre=True, always=True)
    @classmethod
    def parse_expertise_tags(cls, v):
        return _tags_to_list(v)

    @property
    def expertise_tags_str(self) -> str:
        """CSV string for writing to the ORM model's expertise_tags column."""
        return _list_to_str(self.expertise_tags)


class ProfileUpdate(BaseModel):
    full_name: str | None = None
    job_title: str | None = None
    company: str | None = None
    years_of_experience: int | None = None
    bio: str | None = None
    # Accepts list or legacy CSV string; None means "don't update"
    expertise_tags: list[str] | None = None
    availability: str | None = None
    avatar_url: str | None = None
    location: str | None = None
    linkedin_url: str | None = None

    @validator("expertise_tags", pre=True, always=True)
    @classmethod
    def parse_expertise_tags(cls, v):
        if v is None:
            return None
        return _tags_to_list(v)

    def dict_for_orm(self) -> dict:
        """
        Return a dict suitable for writing to the ORM, converting
        expertise_tags list → CSV string so it matches the DB column type.
        """
        data = self.dict(exclude_unset=True)
        if "expertise_tags" in data and data["expertise_tags"] is not None:
            data["expertise_tags"] = _list_to_str(data["expertise_tags"])
        return data


class MentorProfileRead(BaseModel):
    id: int
    user_id: int
    full_name: str
    job_title: str
    company: str
    years_of_experience: int
    bio: str
    # Always returned as a list regardless of how it was stored
    expertise_tags: list[str]
    availability: str
    avatar_url: str | None = None
    location: str | None = None
    linkedin_url: str | None = None

    @validator("expertise_tags", pre=True, always=True)
    @classmethod
    def parse_expertise_tags(cls, v):
        return _tags_to_list(v)

    class Config:
        orm_mode = True
        from_attributes = True


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = "mentee"
    full_name: str | None = None


class UserCreateMentor(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=1, max_length=255)
    job_title: str = Field(..., min_length=1, max_length=255)
    company: str = Field(..., min_length=1, max_length=255)
    years_of_experience: int = Field(..., ge=0)
    bio: str = Field(..., min_length=1)
    expertise_tags: list[str] = Field(..., min_length=1)
    availability: str = Field(..., min_length=1, max_length=255)
    avatar_url: str | None = None
    location: str | None = None
    linkedin_url: str | None = None

    @validator("expertise_tags", pre=True, always=True)
    @classmethod
    def parse_expertise_tags(cls, v):
        return _tags_to_list(v)

    @property
    def expertise_tags_str(self) -> str:
        return _list_to_str(self.expertise_tags)


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
    meeting_link: str | None = None


class MentorshipRequestStatusUpdate(BaseModel):
    status: RequestStatus
    response_message: str | None = None
    meeting_link: str | None = None


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
    meeting_link: str | None = None
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


class SessionNoteUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=255)
    content: str | None = Field(None, min_length=1)
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


class GoalCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    category: str = Field("General", max_length=100)
    target_date: str = Field("TBD", max_length=100)
    completed: bool = False


class GoalUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=255)
    category: str | None = Field(None, max_length=100)
    target_date: str | None = Field(None, max_length=100)
    completed: bool | None = None


class GoalRead(BaseModel):
    id: int
    user_id: int
    title: str
    category: str
    target_date: str
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True


class UserSettingsRead(BaseModel):
    user_id: int
    email_notifications: bool
    session_reminders: bool
    weekly_digest: bool

    class Config:
        orm_mode = True
        from_attributes = True


class UserSettingsUpdate(BaseModel):
    email_notifications: bool | None = None
    session_reminders: bool | None = None
    weekly_digest: bool | None = None


class AdminStatsOut(BaseModel):
    total_users: int
    total_mentors: int
    verified_mentors: int
    pending_mentors: int
    total_mentees: int
    total_requests: int
    pending_requests: int
    accepted_requests: int
    completed_requests: int
    total_session_notes: int
    total_saved_mentors: int

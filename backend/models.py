from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum as PyEnum
from uuid import uuid4

from sqlalchemy import Enum, ForeignKey, Integer, String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base


class RequestType(str, PyEnum):
    CV_REVIEW = "cv_review"
    PORTFOLIO_FEEDBACK = "portfolio_feedback"
    CAREER_PATH_CONVERSATION = "career_path_conversation"
    INTERVIEW_PREPARATION = "interview_preparation"
    ROLE_INDUSTRY_INSIGHT = "role_industry_insight"


class RequestStatus(str, PyEnum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    DECLINED = "declined"
    COMPLETED = "completed"


class VerificationStatus(str, PyEnum):
    PENDING_VERIFICATION = "pending_verification"
    VERIFIED = "verified"
    REJECTED = "rejected"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="mentee", nullable=False)
    verification_status: Mapped[VerificationStatus] = mapped_column(
        Enum(VerificationStatus), default=VerificationStatus.PENDING_VERIFICATION, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

    profile: Mapped[MentorProfile | None] = relationship(
        "MentorProfile", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )


class MentorProfile(Base):
    __tablename__ = "mentor_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    job_title: Mapped[str] = mapped_column(String(255), nullable=False)
    company: Mapped[str] = mapped_column(String(255), nullable=False)
    years_of_experience: Mapped[int] = mapped_column(Integer, nullable=False)
    bio: Mapped[str] = mapped_column(Text, nullable=False)
    expertise_tags: Mapped[str] = mapped_column(String(500), nullable=False)
    availability: Mapped[str] = mapped_column(String(255), nullable=False)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    linkedin_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    user: Mapped[User] = relationship("User", back_populates="profile")


class MentorshipRequest(Base):
    __tablename__ = "mentorship_requests"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    mentee_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    mentor_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    request_type: Mapped[RequestType] = mapped_column(Enum(RequestType), nullable=False, index=True)
    subject: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    resume_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    portfolio_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    github_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    response_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[RequestStatus] = mapped_column(
        Enum(RequestStatus), default=RequestStatus.PENDING, nullable=False, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    mentee: Mapped[User] = relationship("User", foreign_keys=[mentee_id])
    mentor: Mapped[User] = relationship("User", foreign_keys=[mentor_id])


class SavedMentor(Base):
    __tablename__ = "saved_mentors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    mentor_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )


class MentorReview(Base):
    __tablename__ = "mentor_reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    mentor_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    mentee_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    rating: Mapped[int] = mapped_column(Integer, nullable=False, default=5)
    reviewer_name: Mapped[str] = mapped_column(String(255), nullable=False)
    reviewer_role: Mapped[str] = mapped_column(String(255), nullable=False)
    session_topic: Mapped[str] = mapped_column(String(255), nullable=False)
    quote: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )


class SessionNote(Base):
    __tablename__ = "session_notes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    request_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    resource_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )


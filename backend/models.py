from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum as PyEnum
from uuid import uuid4

from sqlalchemy import DateTime, Enum, String, Text, Column, Integer, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
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


class MentorshipRequest(Base):
    __tablename__ = "mentorship_requests"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    mentee_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    mentor_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    request_type: Mapped[RequestType] = mapped_column(Enum(RequestType), nullable=False, index=True)
    subject: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
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

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    role: Mapped[str] = mapped_column(String, default="mentee")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
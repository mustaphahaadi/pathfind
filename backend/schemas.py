from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field

from .models import RequestStatus, RequestType


class MentorshipRequestCreate(BaseModel):
    mentee_id: str = Field(..., min_length=1, max_length=255)
    mentor_id: str = Field(..., min_length=1, max_length=255)
    request_type: RequestType
    subject: str = Field(..., min_length=1, max_length=255)
    message: str = Field(..., min_length=1)


class MentorshipRequestRead(BaseModel):
    id: str
    mentee_id: str
    mentor_id: str
    request_type: RequestType
    subject: str
    message: str
    status: RequestStatus
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True,
    }

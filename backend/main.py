import os
from datetime import datetime, timezone

from fastapi import BackgroundTasks, Depends, FastAPI, File, HTTPException, Request, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.staticfiles import StaticFiles
from jose import JWTError, jwt
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from sqlalchemy import or_
from sqlalchemy.orm import Session

from .auth import ALGORITHM, SECRET_KEY, create_access_token, hash_password, verify_password
from .database import SessionLocal, init_db
from .email_service import notify_mentee_status_update, notify_mentor_new_request, notify_mentor_verification_status
from .s3_service import upload_file as upload_to_storage
from .models import (
    Goal,
    MentorshipRequest,
    MentorProfile,
    MentorReview,
    RequestStatus,
    RequestType,
    SavedMentor,
    SessionNote,
    User,
    UserSettings,
    VerificationStatus,
)
from .schemas import (
    AdminStatsOut,
    FileUploadResponse,
    GoalCreate,
    GoalRead,
    GoalUpdate,
    MentorshipRequestCreate,
    MentorshipRequestRead,
    MentorshipRequestStatusUpdate,
    MentorProfileRead,
    MentorReviewCreate,
    MentorReviewRead,
    ProfileUpdate,
    SavedMentorCreate,
    SavedMentorRead,
    SessionNoteCreate,
    SessionNoteRead,
    SessionNoteUpdate,
    Token,
    UserCreate,
    UserCreateMentor,
    UserLogin,
    UserOut,
    UserSettingsRead,
    UserSettingsUpdate,
    _list_to_str,
)

init_db()

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Pathfind API", version="0.2.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
UPLOAD_DIR = os.path.join(STATIC_DIR, "uploads")
try:
    os.makedirs(UPLOAD_DIR, exist_ok=True)
except (PermissionError, OSError):
    pass

if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# CORS — origins are configured via the ALLOWED_ORIGINS environment variable.
# In development: defaults to localhost Vite dev server.
# In production: set ALLOWED_ORIGINS to your frontend domain(s), comma-separated.
#   e.g. ALLOWED_ORIGINS=https://pathfind.amalitech.org,https://www.pathfind.amalitech.org
_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
ALLOWED_ORIGINS = [origin.strip() for origin in _raw_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/signin")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        ) from exc

    user_id_str = payload.get("sub")
    if user_id_str is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")

    try:
        user_id = int(user_id_str)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")

    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def get_current_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user


@app.get("/")
def read_root():
    return {"status": "ok", "message": "Pathfind API is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


# ── Auth Endpoints ─────────────────────────────────────────────────────────────

@app.get("/auth/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@app.patch("/profiles/me", response_model=UserOut)
def update_profile(
    payload: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = current_user.profile
    if profile is None:
        profile = MentorProfile(
            user_id=current_user.id,
            full_name=payload.full_name or current_user.email.split("@")[0],
            job_title=payload.job_title or "Mentee",
            company=payload.company or "Pathfind Network",
            years_of_experience=payload.years_of_experience or 1,
            bio=payload.bio or "",
            expertise_tags=_list_to_str(payload.expertise_tags) if payload.expertise_tags else "Software Engineering",
            availability=payload.availability or "Available",
            avatar_url=payload.avatar_url,
            location=payload.location,
            linkedin_url=payload.linkedin_url,
        )
        db.add(profile)
    else:
        for field, value in payload.dict_for_orm().items():
            if value is not None:
                setattr(profile, field, value)

    db.commit()
    db.refresh(current_user)
    return current_user


@app.get("/settings/me", response_model=UserSettingsRead)
def get_user_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get current user's settings."""
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        # Create default settings if none exist
        settings = UserSettings(
            user_id=current_user.id,
            email_notifications=True,
            session_reminders=True,
            weekly_digest=False,
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


@app.patch("/settings/me", response_model=UserSettingsRead)
def update_user_settings(
    payload: UserSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update current user's settings."""
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        # Create settings if none exist
        settings = UserSettings(
            user_id=current_user.id,
            email_notifications=payload.email_notifications if payload.email_notifications is not None else True,
            session_reminders=payload.session_reminders if payload.session_reminders is not None else True,
            weekly_digest=payload.weekly_digest if payload.weekly_digest is not None else False,
        )
        db.add(settings)
    else:
        # Update only provided fields
        if payload.email_notifications is not None:
            settings.email_notifications = payload.email_notifications
        if payload.session_reminders is not None:
            settings.session_reminders = payload.session_reminders
        if payload.weekly_digest is not None:
            settings.weekly_digest = payload.weekly_digest

    db.commit()
    db.refresh(settings)
    return settings


@app.post("/auth/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
@limiter.limit("3/minute")
def signup(
    user: UserCreate,
    db: Session = Depends(get_db),
    request: Request = None,
):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user_role = user.role if user.role in ("mentee", "mentor", "admin") else "mentee"
    v_status = (
        VerificationStatus.PENDING_VERIFICATION if user_role == "mentor" else VerificationStatus.VERIFIED
    )

    new_user = User(
        email=user.email,
        hashed_password=hash_password(user.password),
        role=user_role,
        verification_status=v_status,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create profile if full_name is provided
    if user.full_name:
        profile = MentorProfile(
            user_id=new_user.id,
            full_name=user.full_name,
            job_title="Mentee" if user_role == "mentee" else "Mentor",
            company="Pathfind Network",
            years_of_experience=1,
            bio="",
            expertise_tags="General",
            availability="Available",
        )
        db.add(profile)
        db.commit()
        db.refresh(new_user)

    return new_user


@app.post("/auth/signup/mentor", response_model=UserOut, status_code=status.HTTP_201_CREATED)
@limiter.limit("3/minute")
def signup_mentor(
    payload: UserCreateMentor,
    db: Session = Depends(get_db),
    request: Request = None,
):
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    new_user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role="mentor",
        verification_status=VerificationStatus.PENDING_VERIFICATION,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    profile = MentorProfile(
        user_id=new_user.id,
        full_name=payload.full_name,
        job_title=payload.job_title,
        company=payload.company,
        years_of_experience=payload.years_of_experience,
        bio=payload.bio,
        expertise_tags=payload.expertise_tags_str,
        availability=payload.availability,
        avatar_url=payload.avatar_url,
        location=payload.location,
        linkedin_url=payload.linkedin_url,
    )
    db.add(profile)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/auth/signin", response_model=Token)
@limiter.limit("5/minute")
def signin(
    credentials: UserLogin,
    db: Session = Depends(get_db),
    request: Request = None,
):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}


# ── Mentor Discovery Endpoints ──────────────────────────────────────────────────

@app.get("/mentors", response_model=list[MentorProfileRead])
def list_mentors(
    query: str | None = None,
    expertise: str | None = None,
    request_type: RequestType | None = None,
    verified_only: bool = True,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    q = (
        db.query(MentorProfile)
        .join(User, MentorProfile.user_id == User.id)
        .filter(User.role == "mentor")
    )

    if verified_only:
        q = q.filter(User.verification_status == VerificationStatus.VERIFIED)

    if query:
        search_pattern = f"%{query}%"
        q = q.filter(
            or_(
                MentorProfile.full_name.ilike(search_pattern),
                MentorProfile.job_title.ilike(search_pattern),
                MentorProfile.company.ilike(search_pattern),
                MentorProfile.bio.ilike(search_pattern),
            )
        )

    if expertise:
        q = q.filter(MentorProfile.expertise_tags.ilike(f"%{expertise}%"))

    return q.offset(offset).limit(limit).all()


@app.get("/mentors/{mentor_id}", response_model=MentorProfileRead)
def get_mentor(mentor_id: int, db: Session = Depends(get_db)):
    profile = (
        db.query(MentorProfile)
        .join(User, MentorProfile.user_id == User.id)
        .filter(
            or_(MentorProfile.user_id == mentor_id, MentorProfile.id == mentor_id),
            User.role == "mentor",
        )
        .first()
    )
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mentor profile not found")
    return profile


def _get_user_display_name(user: User) -> str:
    if user and user.profile and user.profile.full_name:
        return user.profile.full_name
    return user.email if user else "User"


# ── Mentorship Requests Endpoints ──────────────────────────────────────────────

@app.post("/mentorship-requests", response_model=MentorshipRequestRead, status_code=status.HTTP_201_CREATED)
def create_mentorship_request(
    payload: MentorshipRequestCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # verify mentor exists and is a mentor
    # pyrefly: ignore [unnecessary-type-conversion]
    mentor = db.get(User, int(payload.mentor_id))
    if mentor is None or mentor.role != "mentor":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mentor not found")

    request_record = MentorshipRequest(
        mentee_id=current_user.id,
        mentor_id=payload.mentor_id,
        request_type=payload.request_type,
        subject=payload.subject,
        message=payload.message,
        resume_url=payload.resume_url,
        portfolio_url=payload.portfolio_url,
        github_url=payload.github_url,
        meeting_link=payload.meeting_link,
        status=RequestStatus.PENDING,
    )
    db.add(request_record)
    db.commit()
    db.refresh(request_record)

    background_tasks.add_task(
        notify_mentor_new_request,
        mentor_email=mentor.email,
        mentee_name=_get_user_display_name(current_user),
        mentee_email=current_user.email,
        subject_title=payload.subject,
        request_type=payload.request_type.value,
    )

    return request_record


@app.get("/mentorship-requests", response_model=list[MentorshipRequestRead])
def list_mentorship_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    request_type: RequestType | None = None,
    status_filter: RequestStatus | None = None,
):
    query = db.query(MentorshipRequest)

    # Show requests where current_user is either mentee OR mentor
    query = query.filter(
        or_(
            MentorshipRequest.mentee_id == current_user.id,
            MentorshipRequest.mentor_id == current_user.id,
        )
    )

    if request_type:
        query = query.filter(MentorshipRequest.request_type == request_type)
    if status_filter:
        query = query.filter(MentorshipRequest.status == status_filter)

    results = query.order_by(MentorshipRequest.created_at.desc()).all()

    # Populate email details and profile info for response
    output = []
    for r in results:
        read_obj = MentorshipRequestRead.model_validate(r)
        if current_user.id in (r.mentee_id, r.mentor_id):
            read_obj.mentee_email = r.mentee.email
            read_obj.mentor_email = r.mentor.email
        if r.mentor and r.mentor.profile:
            read_obj.mentor_profile = MentorProfileRead.model_validate(r.mentor.profile)
        output.append(read_obj)

    return output


@app.get("/mentorship-requests/{request_id}", response_model=MentorshipRequestRead)
def get_mentorship_request(
    request_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    mentorship_request = db.get(MentorshipRequest, request_id)
    if mentorship_request is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mentorship request not found")

    if current_user.id not in (mentorship_request.mentee_id, mentorship_request.mentor_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    read_obj = MentorshipRequestRead.model_validate(mentorship_request)
    read_obj.mentee_email = mentorship_request.mentee.email
    read_obj.mentor_email = mentorship_request.mentor.email
    if mentorship_request.mentor and mentorship_request.mentor.profile:
        read_obj.mentor_profile = MentorProfileRead.model_validate(mentorship_request.mentor.profile)
    return read_obj


@app.patch("/mentorship-requests/{request_id}/status", response_model=MentorshipRequestRead)
def update_mentorship_request_status(
    request_id: str,
    payload: MentorshipRequestStatusUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    mentorship_request = db.get(MentorshipRequest, request_id)
    if mentorship_request is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mentorship request not found")

    if mentorship_request.mentor_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the designated mentor can update request status",
        )

    mentorship_request.status = payload.status
    if payload.response_message:
        mentorship_request.response_message = payload.response_message
    if payload.meeting_link:
        mentorship_request.meeting_link = payload.meeting_link

    db.commit()
    db.refresh(mentorship_request)

    background_tasks.add_task(
        notify_mentee_status_update,
        mentee_email=mentorship_request.mentee.email,
        mentor_name=_get_user_display_name(current_user),
        new_status=payload.status.value,
        response_message=payload.response_message,
    )

    read_obj = MentorshipRequestRead.model_validate(mentorship_request)
    read_obj.mentee_email = mentorship_request.mentee.email
    read_obj.mentor_email = mentorship_request.mentor.email
    if mentorship_request.mentor and mentorship_request.mentor.profile:
        read_obj.mentor_profile = MentorProfileRead.model_validate(mentorship_request.mentor.profile)
    return read_obj


@app.delete("/mentorship-requests/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_mentorship_request(
    request_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    mentorship_request = db.get(MentorshipRequest, request_id)
    if mentorship_request is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mentorship request not found")

    if mentorship_request.mentee_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the mentee who created the request can cancel it",
        )

    if mentorship_request.status != RequestStatus.PENDING:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only pending requests can be cancelled")

    db.delete(mentorship_request)
    db.commit()
    return None


@app.get("/mentorship-request-types")
def list_mentorship_request_types():
    return [request_type.value for request_type in RequestType]


# ── Admin Verification Queue Endpoints ──────────────────────────────────────────

@app.get("/admin/mentors/pending", response_model=list[UserOut])
def list_pending_mentors(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    return (
        db.query(User)
        .filter(User.role == "mentor", User.verification_status == VerificationStatus.PENDING_VERIFICATION)
        .all()
    )


@app.post("/admin/mentors/{mentor_id}/approve", response_model=UserOut)
def approve_mentor(
    mentor_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    user = db.get(User, mentor_id)
    if not user or user.role != "mentor":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mentor not found")

    user.verification_status = VerificationStatus.VERIFIED
    db.commit()
    db.refresh(user)

    background_tasks.add_task(
        notify_mentor_verification_status,
        mentor_email=user.email,
        mentor_name=_get_user_display_name(user),
        status="VERIFIED",
    )
    return user


@app.post("/admin/mentors/{mentor_id}/reject", response_model=UserOut)
def reject_mentor(
    mentor_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    user = db.get(User, mentor_id)
    if not user or user.role != "mentor":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mentor not found")

    user.verification_status = VerificationStatus.REJECTED
    db.commit()
    db.refresh(user)

    background_tasks.add_task(
        notify_mentor_verification_status,
        mentor_email=user.email,
        mentor_name=_get_user_display_name(user),
        status="REJECTED",
    )
    return user


@app.get("/admin/stats", response_model=AdminStatsOut)
def get_admin_stats(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """Retrieve comprehensive real-time statistics for the Admin Portal."""
    total_users = db.query(User).count()
    total_mentors = db.query(User).filter(User.role == "mentor").count()
    verified_mentors = (
        db.query(User)
        .filter(User.role == "mentor", User.verification_status == VerificationStatus.VERIFIED)
        .count()
    )
    pending_mentors = (
        db.query(User)
        .filter(User.role == "mentor", User.verification_status == VerificationStatus.PENDING_VERIFICATION)
        .count()
    )
    total_mentees = db.query(User).filter(User.role == "mentee").count()
    total_requests = db.query(MentorshipRequest).count()
    pending_requests = db.query(MentorshipRequest).filter(MentorshipRequest.status == RequestStatus.PENDING).count()
    accepted_requests = db.query(MentorshipRequest).filter(MentorshipRequest.status == RequestStatus.ACCEPTED).count()
    completed_requests = db.query(MentorshipRequest).filter(MentorshipRequest.status == RequestStatus.COMPLETED).count()
    total_session_notes = db.query(SessionNote).count()
    total_saved_mentors = db.query(SavedMentor).count()

    return AdminStatsOut(
        total_users=total_users,
        total_mentors=total_mentors,
        verified_mentors=verified_mentors,
        pending_mentors=pending_mentors,
        total_mentees=total_mentees,
        total_requests=total_requests,
        pending_requests=pending_requests,
        accepted_requests=accepted_requests,
        completed_requests=completed_requests,
        total_session_notes=total_session_notes,
        total_saved_mentors=total_saved_mentors,
    )


@app.get("/admin/mentors", response_model=list[UserOut])
def list_all_admin_mentors(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """List all mentors regardless of verification status."""
    return db.query(User).filter(User.role == "mentor").order_by(User.created_at.desc()).all()


@app.get("/admin/mentees", response_model=list[UserOut])
def list_all_admin_mentees(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """List all registered mentees on the platform."""
    return db.query(User).filter(User.role == "mentee").order_by(User.created_at.desc()).all()


@app.delete("/admin/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """Delete a user account and associated profile."""
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user.id == admin_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Admin cannot delete own account")

    if user.profile:
        db.delete(user.profile)
    db.delete(user)
    db.commit()
    return None


# ── File Upload Endpoint ───────────────────────────────────────────────────────

ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg", ".webp", ".svg"}
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB limit


@app.post("/upload", response_model=FileUploadResponse, status_code=status.HTTP_201_CREATED)
def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """Upload resume, portfolio, or avatar attachments to S3 or local storage."""
    ext = os.path.splitext(file.filename)[1].lower() if file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File extension '{ext}' is not supported. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
        )

    file.file.seek(0, os.SEEK_END)
    size_bytes = file.file.tell()
    file.file.seek(0)

    if size_bytes > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds maximum limit of {MAX_FILE_SIZE_BYTES // (1024 * 1024)} MB",
        )

    # Read file content
    file_content = file.file.read()
    original_filename = os.path.basename(file.filename)

    # Upload to S3 or local storage via s3_service
    url, safe_filename = upload_to_storage(
        file_content=file_content,
        filename=original_filename,
        content_type=file.content_type or "application/octet-stream",
    )

    return FileUploadResponse(
        filename=original_filename,
        url=url,
        content_type=file.content_type or "application/octet-stream",
        size_bytes=size_bytes,
    )


# ── Saved Mentors ─────────────────────────────────────────────────────────────

@app.post("/saved-mentors", response_model=SavedMentorRead, status_code=status.HTTP_201_CREATED)
def save_mentor(
    payload: SavedMentorCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = (
        db.query(SavedMentor)
        .filter(SavedMentor.user_id == current_user.id, SavedMentor.mentor_id == payload.mentor_id)
        .first()
    )
    if existing:
        return existing

    record = SavedMentor(user_id=current_user.id, mentor_id=payload.mentor_id)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@app.get("/saved-mentors", response_model=list[SavedMentorRead])
def list_saved_mentors(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    items = db.query(SavedMentor).filter(SavedMentor.user_id == current_user.id).all()
    output = []
    for item in items:
        read_obj = SavedMentorRead.model_validate(item)
        mentor_user = db.get(User, item.mentor_id)
        if mentor_user and mentor_user.profile:
            read_obj.mentor_profile = MentorProfileRead.model_validate(mentor_user.profile)
        output.append(read_obj)
    return output


@app.delete("/saved-mentors/{mentor_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_saved_mentor(
    mentor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = (
        db.query(SavedMentor)
        .filter(SavedMentor.user_id == current_user.id, SavedMentor.mentor_id == mentor_id)
        .first()
    )
    if record:
        db.delete(record)
        db.commit()
    return None


# ── Mentor Reviews ─────────────────────────────────────────────────────────────

@app.post("/mentors/{mentor_id}/reviews", response_model=MentorReviewRead, status_code=status.HTTP_201_CREATED)
def create_mentor_review(
    mentor_id: int,
    payload: MentorReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reviewer_name = _get_user_display_name(current_user)
    reviewer_role = "Verified Mentee"

    review = MentorReview(
        mentor_id=mentor_id,
        mentee_id=current_user.id,
        rating=payload.rating,
        reviewer_name=reviewer_name,
        reviewer_role=reviewer_role,
        session_topic=payload.session_topic,
        quote=payload.quote,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


@app.get("/mentors/{mentor_id}/reviews", response_model=list[MentorReviewRead])
def list_mentor_reviews(mentor_id: int, db: Session = Depends(get_db)):
    return (
        db.query(MentorReview)
        .filter(MentorReview.mentor_id == mentor_id)
        .order_by(MentorReview.created_at.desc())
        .all()
    )


# ── Session Notes ─────────────────────────────────────────────────────────────

@app.post("/session-notes", response_model=SessionNoteRead, status_code=status.HTTP_201_CREATED)
def create_session_note(
    payload: SessionNoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = SessionNote(
        user_id=current_user.id,
        request_id=payload.request_id,
        title=payload.title,
        content=payload.content,
        resource_url=payload.resource_url,
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@app.get("/session-notes", response_model=list[SessionNoteRead])
def list_session_notes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(SessionNote)
        .filter(SessionNote.user_id == current_user.id)
        .order_by(SessionNote.created_at.desc())
        .all()
    )


@app.delete("/session-notes/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_session_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = db.get(SessionNote, note_id)
    if note and note.user_id == current_user.id:
        db.delete(note)
        db.commit()
    return None


@app.patch("/session-notes/{note_id}", response_model=SessionNoteRead)
def update_session_note(
    note_id: int,
    payload: SessionNoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update title, content or resource_url of an existing session note."""
    note = db.get(SessionNote, note_id)
    if note is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    if note.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(note, field, value)

    db.commit()
    db.refresh(note)
    return note


# ── Goals Routes ────────────────────────────────────────────────────────────

@app.get("/goals", response_model=list[GoalRead])
def list_goals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve goals for current user. Seeds three generic starter goals for new users."""
    user_goals = (
        db.query(Goal)
        .filter(Goal.user_id == current_user.id)
        .order_by(Goal.created_at.desc())
        .all()
    )
    if not user_goals:
        # Calculate a generic "6 months out" target date so it stays relevant
        now = datetime.now(timezone.utc)
        target_month = now.month + 6
        target_year = now.year + (target_month - 1) // 12
        target_month = ((target_month - 1) % 12) + 1
        quarter = (target_month - 1) // 3 + 1
        default_target = f"Q{quarter} {target_year}"

        defaults = [
            Goal(
                user_id=current_user.id,
                title="Connect with a mentor and complete a first session",
                category="Networking",
                target_date=default_target,
                completed=False,
            ),
            Goal(
                user_id=current_user.id,
                title="Define your 6-month career or learning goal",
                category="Career Growth",
                target_date=default_target,
                completed=False,
            ),
            Goal(
                user_id=current_user.id,
                title="Update your portfolio or CV with recent work",
                category="Personal Branding",
                target_date=default_target,
                completed=False,
            ),
        ]
        db.add_all(defaults)
        db.commit()
        for g in defaults:
            db.refresh(g)
        return defaults
    return user_goals


@app.post("/goals", response_model=GoalRead, status_code=status.HTTP_201_CREATED)
def create_goal(
    payload: GoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goal = Goal(
        user_id=current_user.id,
        title=payload.title,
        category=payload.category,
        target_date=payload.target_date,
        completed=payload.completed,
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


@app.patch("/goals/{goal_id}", response_model=GoalRead)
def update_goal(
    goal_id: int,
    payload: GoalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goal = db.get(Goal, goal_id)
    if goal is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")
    if goal.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(goal, field, value)

    db.commit()
    db.refresh(goal)
    return goal


@app.delete("/goals/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goal = db.get(Goal, goal_id)
    if goal and goal.user_id == current_user.id:
        db.delete(goal)
        db.commit()
    return None

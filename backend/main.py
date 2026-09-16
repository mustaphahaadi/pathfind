import os
import shutil
from uuid import uuid4

from fastapi import BackgroundTasks, Depends, FastAPI, File, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.staticfiles import StaticFiles
from jose import JWTError, jwt
from sqlalchemy import or_
from sqlalchemy.orm import Session

from .auth import ALGORITHM, SECRET_KEY, create_access_token, hash_password, verify_password
from .database import Base, SessionLocal, engine
from .email_service import notify_mentee_status_update, notify_mentor_new_request, notify_mentor_verification_status
from .models import (
    MentorshipRequest,
    MentorProfile,
    MentorReview,
    RequestStatus,
    RequestType,
    SavedMentor,
    SessionNote,
    User,
    VerificationStatus,
)
from .schemas import (
    AdminStatsOut,
    FileUploadResponse,
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
    Token,
    UserCreate,
    UserCreateMentor,
    UserLogin,
    UserOut,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pathfind API", version="0.2.0")

STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
UPLOAD_DIR = os.path.join(STATIC_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Allow local frontend during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
            expertise_tags=payload.expertise_tags or "Software Engineering",
            availability=payload.availability or "Available",
            avatar_url=payload.avatar_url,
            location=payload.location,
            linkedin_url=payload.linkedin_url,
        )
        db.add(profile)
    else:
        for field, value in payload.dict(exclude_unset=True).items():
            if value is not None:
                setattr(profile, field, value)

    db.commit()
    db.refresh(current_user)
    return current_user


@app.post("/auth/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
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
    return new_user


@app.post("/auth/signup/mentor", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def signup_mentor(payload: UserCreateMentor, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        existing_user.role = "mentor"
        if existing_user.verification_status != VerificationStatus.VERIFIED:
            existing_user.verification_status = VerificationStatus.PENDING_VERIFICATION
        if existing_user.profile:
            existing_user.profile.full_name = payload.full_name
            existing_user.profile.job_title = payload.job_title
            existing_user.profile.company = payload.company
            existing_user.profile.years_of_experience = payload.years_of_experience
            existing_user.profile.bio = payload.bio
            existing_user.profile.expertise_tags = payload.expertise_tags
            existing_user.profile.availability = payload.availability
            existing_user.profile.avatar_url = payload.avatar_url
            existing_user.profile.location = payload.location
            existing_user.profile.linkedin_url = payload.linkedin_url
        else:
            profile = MentorProfile(
                user_id=existing_user.id,
                full_name=payload.full_name,
                job_title=payload.job_title,
                company=payload.company,
                years_of_experience=payload.years_of_experience,
                bio=payload.bio,
                expertise_tags=payload.expertise_tags,
                availability=payload.availability,
                avatar_url=payload.avatar_url,
                location=payload.location,
                linkedin_url=payload.linkedin_url,
            )
            db.add(profile)
        db.commit()
        db.refresh(existing_user)
        return existing_user

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
        expertise_tags=payload.expertise_tags,
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
def signin(credentials: UserLogin, db: Session = Depends(get_db)):
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
    q = db.query(MentorProfile).join(User, MentorProfile.user_id == User.id)

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
    profile = db.query(MentorProfile).filter(MentorProfile.user_id == mentor_id).first()
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
    mentor_user = db.get(User, payload.mentor_id)
    if mentor_user is None or mentor_user.role != "mentor":
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
        status=RequestStatus.PENDING,
    )
    db.add(request_record)
    db.commit()
    db.refresh(request_record)

    background_tasks.add_task(
        notify_mentor_new_request,
        mentor_email=mentor_user.email,
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
        read_obj = MentorshipRequestRead.from_orm(r)
        if current_user.id in (r.mentee_id, r.mentor_id):
            read_obj.mentee_email = r.mentee.email
            read_obj.mentor_email = r.mentor.email
        if r.mentor and r.mentor.profile:
            read_obj.mentor_profile = MentorProfileRead.from_orm(r.mentor.profile)
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

    read_obj = MentorshipRequestRead.from_orm(mentorship_request)
    read_obj.mentee_email = mentorship_request.mentee.email
    read_obj.mentor_email = mentorship_request.mentor.email
    if mentorship_request.mentor and mentorship_request.mentor.profile:
        read_obj.mentor_profile = MentorProfileRead.from_orm(mentorship_request.mentor.profile)
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

    db.commit()
    db.refresh(mentorship_request)

    background_tasks.add_task(
        notify_mentee_status_update,
        mentee_email=mentorship_request.mentee.email,
        mentor_name=_get_user_display_name(current_user),
        new_status=payload.status.value,
        response_message=payload.response_message,
    )

    read_obj = MentorshipRequestRead.from_orm(mentorship_request)
    read_obj.mentee_email = mentorship_request.mentee.email
    read_obj.mentor_email = mentorship_request.mentor.email
    if mentorship_request.mentor and mentorship_request.mentor.profile:
        read_obj.mentor_profile = MentorProfileRead.from_orm(mentorship_request.mentor.profile)
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
    """Upload resume, portfolio, or avatar attachments."""
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

    safe_filename = f"{uuid4().hex}_{os.path.basename(file.filename)}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return FileUploadResponse(
        filename=os.path.basename(file.filename),
        url=f"/static/uploads/{safe_filename}",
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
        read_obj = SavedMentorRead.from_orm(item)
        mentor_user = db.get(User, item.mentor_id)
        if mentor_user and mentor_user.profile:
            read_obj.mentor_profile = MentorProfileRead.from_orm(mentor_user.profile)
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

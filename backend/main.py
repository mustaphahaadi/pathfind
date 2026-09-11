from __future__ import annotations

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy import or_
from sqlalchemy.orm import Session

from .auth import ALGORITHM, SECRET_KEY, create_access_token, hash_password, verify_password
from .database import Base, SessionLocal, engine
from .models import MentorshipRequest, MentorProfile, RequestStatus, RequestType, User, VerificationStatus
from .schemas import (
    MentorshipRequestCreate,
    MentorshipRequestRead,
    MentorshipRequestStatusUpdate,
    MentorProfileRead,
    Token,
    UserCreate,
    UserCreateMentor,
    UserLogin,
    UserOut,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pathfind API", version="0.2.0")

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


@app.post("/auth/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    new_user = User(
        email=user.email,
        hashed_password=hash_password(user.password),
        role=user.role if user.role in ("mentee", "mentor", "admin") else "mentee",
        verification_status=VerificationStatus.VERIFIED,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/auth/signup/mentor", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def signup_mentor(payload: UserCreateMentor, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    # Determine verification status (pending by default for mentors)
    verification = VerificationStatus.PENDING_VERIFICATION

    new_user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role="mentor",
        verification_status=verification,
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


# ── Mentorship Requests Endpoints ──────────────────────────────────────────────

@app.post("/mentorship-requests", response_model=MentorshipRequestRead, status_code=status.HTTP_201_CREATED)
def create_mentorship_request(
    payload: MentorshipRequestCreate,
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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    mentorship_request = db.get(MentorshipRequest, request_id)
    if mentorship_request is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mentorship request not found")

    # Only the mentor on the request may accept/decline/complete
    if mentorship_request.mentor_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the designated mentor can update request status")

    mentorship_request.status = payload.status
    if payload.response_message:
        mentorship_request.response_message = payload.response_message

    db.commit()
    db.refresh(mentorship_request)

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
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the mentee who created the request can cancel it")

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
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    user = db.get(User, mentor_id)
    if not user or user.role != "mentor":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mentor not found")

    user.verification_status = VerificationStatus.VERIFIED
    db.commit()
    db.refresh(user)
    return user


@app.post("/admin/mentors/{mentor_id}/reject", response_model=UserOut)
def reject_mentor(
    mentor_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    user = db.get(User, mentor_id)
    if not user or user.role != "mentor":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mentor not found")

    user.verification_status = VerificationStatus.REJECTED
    db.commit()
    db.refresh(user)
    return user


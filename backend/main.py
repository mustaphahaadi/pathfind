from __future__ import annotations

from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy.orm import Session
from auth import hash_password, verify_password, create_access_token

from .database import Base, SessionLocal, engine
from .models import MentorshipRequest, RequestStatus, RequestType, User
from .schemas import MentorshipRequestCreate, MentorshipRequestRead, UserCreate, UserLogin, UserOut, Token

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pathfind API", version="0.1.0")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# this is just a placeholder. I will update it when major work happens
@app.get("/")
def read_root():
    return {"status": "ok", "message": "Pathfind API is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/mentorship-requests", response_model=MentorshipRequestRead, status_code=status.HTTP_201_CREATED)
def create_mentorship_request(payload: MentorshipRequestCreate, db: Session = Depends(get_db)):
    request_record = MentorshipRequest(
        mentee_id=payload.mentee_id,
        mentor_id=payload.mentor_id,
        request_type=payload.request_type,
        subject=payload.subject,
        message=payload.message,
        status=RequestStatus.PENDING,
    )
    db.add(request_record)
    db.commit()
    db.refresh(request_record)
    return request_record


@app.get("/mentorship-requests", response_model=list[MentorshipRequestRead])
def list_mentorship_requests(
    db: Session = Depends(get_db),
    mentor_id: str | None = None,
    mentee_id: str | None = None,
    status: RequestStatus | None = None,
    request_type: RequestType | None = None,
):
    query = db.query(MentorshipRequest)

    if mentor_id:
        query = query.filter(MentorshipRequest.mentor_id == mentor_id)
    if mentee_id:
        query = query.filter(MentorshipRequest.mentee_id == mentee_id)
    if status:
        query = query.filter(MentorshipRequest.status == status)
    if request_type:
        query = query.filter(MentorshipRequest.request_type == request_type)

    return query.order_by(MentorshipRequest.created_at.desc()).all()

@app.get("/mentorship-requests/{request_id}", response_model=MentorshipRequestRead)
def get_mentorship_request(request_id: str, db: Session = Depends(get_db)):
    mentorship_request = db.get(MentorshipRequest, request_id)
    if mentorship_request is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mentorship request not found")
    return mentorship_request

@app.get("/mentorship-request-types")
def list_mentorship_request_types():
    return [request_type.value for request_type in RequestType]
@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/auth/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=user.email,
        hashed_password=hash_password(user.password),
        role=user.role,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/auth/signin", response_model=Token)
def signin(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

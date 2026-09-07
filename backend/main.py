from __future__ import annotations

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from typing import Optional, cast
from .auth import hash_password, verify_password, create_access_token, SECRET_KEY, ALGORITHM

from .database import Base, SessionLocal, engine
from .models import MentorshipRequest, RequestStatus, RequestType, User
from .schemas import MentorshipRequestCreate, MentorshipRequestRead, UserCreate, UserLogin, UserOut, Token

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pathfind API", version="0.1.0")

security = HTTPBearer(auto_error=False)


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


def _get_current_user_from_token(credentials: Optional[HTTPAuthorizationCredentials], db: Session) -> User:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        if sub is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        user = db.get(User, int(sub))
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")


@app.post("/mentorship-requests", response_model=MentorshipRequestRead, status_code=status.HTTP_201_CREATED)
def create_mentorship_request(payload: MentorshipRequestCreate, credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    current_user = _get_current_user_from_token(credentials, db)

    # mentee is the authenticated user
    mentee_id = current_user.id

    # validate mentor exists
    mentor = db.get(User, payload.mentor_id)
    if mentor is None or mentor.role != "mentor":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mentor not found")

    request_record = MentorshipRequest(
        mentee_id=mentee_id,
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
def list_mentorship_requests(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    current_user = _get_current_user_from_token(credentials, db)

    query = db.query(MentorshipRequest)

    if current_user.role == "mentor":
        query = query.filter(MentorshipRequest.mentor_id == current_user.id)
    else:
        query = query.filter(MentorshipRequest.mentee_id == current_user.id)

    return query.order_by(MentorshipRequest.created_at.desc()).all()

@app.get("/mentorship-requests/{request_id}", response_model=MentorshipRequestRead)
def get_mentorship_request(request_id: str, credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    current_user = _get_current_user_from_token(credentials, db)

    mentorship_request = db.get(MentorshipRequest, request_id)
    if mentorship_request is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mentorship request not found")

    if current_user.id not in (mentorship_request.mentee_id, mentorship_request.mentor_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this request")

    return mentorship_request

@app.get("/mentorship-request-types")
def list_mentorship_request_types():
    return [request_type.value for request_type in RequestType]


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
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(credentials.password, cast(str, user.hashed_password)):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

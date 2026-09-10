from __future__ import annotations

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from .auth import ALGORITHM, SECRET_KEY, create_access_token, hash_password, verify_password
from .database import Base, SessionLocal, engine
from .models import MentorshipRequest, RequestStatus, RequestType, User
from .schemas import MentorshipRequestCreate, MentorshipRequestRead, Token, UserCreate, UserLogin, UserOut

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/signin")

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pathfind API", version="0.1.0")

# Allow local frontend during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")

    user = db.get(User, int(user_id))
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


@app.get("/")
def read_root():
    return {"status": "ok", "message": "Pathfind API is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/mentorship-requests", response_model=MentorshipRequestRead, status_code=status.HTTP_201_CREATED)
def create_mentorship_request(
    payload: MentorshipRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # verify mentor exists and is a mentor
    mentor = db.get(User, int(payload.mentor_id))
    if mentor is None or mentor.role != "mentor":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mentor not found")

    request_record = MentorshipRequest(
        mentee_id=current_user.id,
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
    current_user: User = Depends(get_current_user),
    request_type: RequestType | None = None,
    status_filter: RequestStatus | None = None,
):
    query = db.query(MentorshipRequest)

    # Mentees see only their own requests; mentors see requests addressed to them
    if current_user.role == "mentor":
        query = query.filter(MentorshipRequest.mentor_id == current_user.id)
    else:
        query = query.filter(MentorshipRequest.mentee_id == current_user.id)

    if request_type:
        query = query.filter(MentorshipRequest.request_type == request_type)
    if status_filter:
        query = query.filter(MentorshipRequest.status == status_filter)

    return query.order_by(MentorshipRequest.created_at.desc()).all()


@app.get("/mentorship-requests/{request_id}", response_model=MentorshipRequestRead)
def get_mentorship_request(
    request_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    mentorship_request = db.get(MentorshipRequest, request_id)
    if mentorship_request is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mentorship request not found")

    # Only the mentee or the mentor on the request may view it
    if current_user.id not in (mentorship_request.mentee_id, mentorship_request.mentor_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

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
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

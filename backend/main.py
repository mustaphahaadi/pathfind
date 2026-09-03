<<<<<<< HEAD
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import User
from schemas import UserCreate, UserLogin, UserOut, Token
from auth import hash_password, verify_password, create_access_token

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pathfind API")

=======
from fastapi import FastAPI

app = FastAPI(title="Pathfind API")
# this is just a placeholder. I will update it when major work happens
>>>>>>> efa87cbcc38e89271d5c5b3a6ff0865a815a04f5
@app.get("/")
def read_root():
    return {"status": "ok", "message": "Pathfind API is running"}

@app.get("/health")
def health_check():
<<<<<<< HEAD
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
=======
    return {"status": "healthy"}
>>>>>>> efa87cbcc38e89271d5c5b3a6ff0865a815a04f5

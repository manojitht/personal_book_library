from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.user_service import UserService
from app.repositories.user_repository import UserRepository
from app.core.security import verify_password, create_access_token
from app.schemas.users import UserCreate

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    try:
        return UserService.register(db, user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = UserRepository.get_by_username(db, form.username)
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

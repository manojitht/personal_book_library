from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.routers.deps import get_current_user
from app.schemas.users import UserResponse

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
def get_profile(user=Depends(get_current_user)):
    return user

@router.put("/me")
def update_profile(data: dict, db: Session = Depends(get_db), user=Depends(get_current_user)):
    for key, value in data.items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user

from sqlalchemy.orm import Session
from app.models.users import User
from app.schemas.users import UserCreate
from app.core.security import get_password_hash

class UserService:
    @staticmethod
    def create_user(db: Session, user: UserCreate):
        hashed_pw = get_password_hash(user.password)
        db_user = User(
            username=user.username,
            email=user.email,
            hashed_password=hashed_pw
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def get_user_by_username(db: Session, username: str):
        return db.query(User).filter(User.username == username).first()
    
    
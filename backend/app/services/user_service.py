from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.models.users import User
from app.schemas.users import UserCreate
from app.core.security import hash_password

class UserService:
    @staticmethod
    def register(db: Session, user: UserCreate):
        if UserRepository.get_by_username(db, user.username):
            raise ValueError("Username already exists")

        db_user = User(
            username=user.username,
            email=user.email,
            hashed_password=hash_password(user.password)
        )
        return UserRepository.create(db, db_user)

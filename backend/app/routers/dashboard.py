from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.books import Book
from app.routers.deps import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/")
def dashboard(db: Session = Depends(get_db), user=Depends(get_current_user)):
    total = db.query(Book).filter(Book.owner_id == user.id).count()
    recent = db.query(Book).filter(Book.owner_id == user.id).order_by(Book.id.desc()).limit(5).all()
    return {
        "total_books": total,
        "recent_books": recent
    }

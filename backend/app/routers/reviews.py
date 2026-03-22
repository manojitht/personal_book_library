from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.review_service import ReviewService
from app.schemas.reviews import ReviewCreate
from app.routers.deps import get_current_user

router = APIRouter(prefix="/books/{book_id}/reviews", tags=["reviews"])

@router.post("/")
def add_review(book_id: int, data: ReviewCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return ReviewService.add_review(db, data, user.id, book_id)

@router.get("/")
def get_reviews(book_id: int, db: Session = Depends(get_db)):
    reviews = ReviewService.list_reviews(db, book_id)
    avg = ReviewService.avg_rating(db, book_id)
    return {"reviews": reviews, "average_rating": avg}

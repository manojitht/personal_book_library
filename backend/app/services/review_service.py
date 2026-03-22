from sqlalchemy.orm import Session
from app.repositories.review_repository import ReviewRepository
from app.models.reviews import Review
from app.schemas.reviews import ReviewCreate

class ReviewService:
    @staticmethod
    def add_review(db: Session, data: ReviewCreate, user_id: int, book_id: int):
        review = Review(**data.model_dump(), user_id=user_id, book_id=book_id)
        return ReviewRepository.create(db, review)

    @staticmethod
    def list_reviews(db: Session, book_id: int):
        return ReviewRepository.get_by_book(db, book_id)

    @staticmethod
    def avg_rating(db: Session, book_id: int):
        return ReviewRepository.get_avg_rating(db, book_id)

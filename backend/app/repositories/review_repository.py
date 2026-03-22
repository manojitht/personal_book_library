from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.reviews import Review

class ReviewRepository:
    @staticmethod
    def create(db: Session, review: Review):
        db.add(review)
        db.commit()
        db.refresh(review)
        return review

    @staticmethod
    def get_by_book(db: Session, book_id: int):
        return db.query(Review).filter(Review.book_id == book_id).all()

    @staticmethod
    def get_avg_rating(db: Session, book_id: int):
        return db.query(func.avg(Review.rating)).filter(Review.book_id == book_id).scalar()

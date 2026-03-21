from sqlalchemy.orm import Session
from app.repositories.book_repository import BookRepository
from app.schemas.books import BookCreate, BookUpdate
from app.models.books import Book

class BookService:
    @staticmethod
    def create(db: Session, data: BookCreate, user_id: int):
        book = Book(**data.model_dump(), owner_id=user_id)
        return BookRepository.create(db, book)

    @staticmethod
    def list(db: Session, user_id: int, skip: int, limit: int, search: str):
        return BookRepository.get_user_books(db, user_id, skip, limit, search)

    @staticmethod
    def update(db: Session, book_id: int, user_id: int, data: BookUpdate):
        book = BookRepository.get_by_id(db, book_id, user_id)
        if not book:
            return None
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(book, key, value)
        db.commit()
        db.refresh(book)
        return book

    @staticmethod
    def delete(db: Session, book_id: int, user_id: int):
        book = BookRepository.get_by_id(db, book_id, user_id)
        if not book:
            return None
        BookRepository.delete(db, book)
        return True

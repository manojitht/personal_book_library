from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.books import Book
from app.schemas.books import BookCreate

class BookService:
    @staticmethod
    def create_book(db: Session, book: BookCreate, user_id: int):
        db_book = Book(**book.model_dump(), owner_id=user_id)
        db.add(db_book)
        db.commit()
        db.refresh(db_book)
        return db_book

    @staticmethod
    def get_user_books(db: Session, user_id: int, skip: int = 0, limit: int = 10, search: str = None):
        query = db.query(Book).filter(Book.owner_id == user_id)
        
        if search:
            query = query.filter(
                or_(
                    Book.title.icontains(search),
                    Book.author.icontains(search)
                )
            )
        
        return query.offset(skip).limit(limit).all()

    @staticmethod
    def delete_book(db: Session, book_id: int, user_id: int):
        db_book = db.query(Book).filter(Book.id == book_id, Book.owner_id == user_id).first()
        if db_book:
            db.delete(db_book)
            db.commit()
            return True
        return False
    
    
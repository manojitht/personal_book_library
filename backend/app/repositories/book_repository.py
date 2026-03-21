from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.books import Book

class BookRepository:
    @staticmethod
    def create(db: Session, book: Book):
        db.add(book)
        db.commit()
        db.refresh(book)
        return book

    @staticmethod
    def get_user_books(db: Session, user_id: int, skip: int, limit: int, search: str):
        query = db.query(Book).filter(Book.owner_id == user_id)
        if search:
            query = query.filter(or_(Book.title.ilike(f"%{search}%"), Book.author.ilike(f"%{search}%")))
        return query.offset(skip).limit(limit).all()

    @staticmethod
    def get_by_id(db: Session, book_id: int, user_id: int):
        return db.query(Book).filter(Book.id == book_id, Book.owner_id == user_id).first()

    @staticmethod
    def delete(db: Session, book: Book):
        db.delete(book)
        db.commit()

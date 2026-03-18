from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.schemas.books import BookCreate, BookResponse
from app.models.books import Book
# Note: You'll need a dependency helper here to get the 'current_user' via JWT

router = APIRouter(prefix="/books", tags=["books"])

@router.get("/", response_model=List[BookResponse])
def get_books(
    skip: int = 0, 
    limit: int = 10, 
    search: Optional[str] = None, 
    db: Session = Depends(get_db)
):
    query = db.query(Book)
    if search:
        query = query.filter(Book.title.contains(search) | Book.author.contains(search))
    return query.offset(skip).limit(limit).all()

@router.post("/", response_model=BookResponse)
def add_book(book: BookCreate, db: Session = Depends(get_db)):
    db_book = Book(**book.dict()) # In production, assign owner_id here
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


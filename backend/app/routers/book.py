from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.schemas.books import BookCreate, BookResponse
from app.services.book_service import BookService
from app.routers.deps import get_current_user

router = APIRouter(prefix="/books", tags=["books"])

@router.post("/", response_model=BookResponse)
def add_book(book: BookCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return BookService.create_book(db, book, current_user.id)

@router.get("/", response_model=List[BookResponse])
def list_books(
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return BookService.get_user_books(db, current_user.id, skip, limit, search)


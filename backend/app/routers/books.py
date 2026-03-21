from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.book_service import BookService
from app.schemas.books import BookCreate, BookUpdate
from app.routers.deps import get_current_user

router = APIRouter(prefix="/books", tags=["books"])

@router.post("/")
def create(book: BookCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return BookService.create(db, book, user.id)

@router.get("/")
def list_books(search: str = None, skip: int = 0, limit: int = 10, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return BookService.list(db, user.id, skip, limit, search)

@router.put("/{book_id}")
def update(book_id: int, data: BookUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    book = BookService.update(db, book_id, user.id, data)
    if not book:
        raise HTTPException(status_code=404, detail="Not found")
    return book

@router.delete("/{book_id}")
def delete(book_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    result = BookService.delete(db, book_id, user.id)
    if not result:
        raise HTTPException(status_code=404, detail="Not found")
    return {"message": "Deleted"}

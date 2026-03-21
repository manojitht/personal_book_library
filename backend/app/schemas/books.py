from pydantic import BaseModel
from typing import Optional
from datetime import date

class BookCreate(BaseModel):
    title: str
    author: str
    publication_date: Optional[date]
    isbn: Optional[str]
    cover_image_url: Optional[str]

class BookUpdate(BaseModel):
    title: Optional[str]
    author: Optional[str]
    publication_date: Optional[date]
    isbn: Optional[str]
    cover_image_url: Optional[str]

class BookResponse(BookCreate):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

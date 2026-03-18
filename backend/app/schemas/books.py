from pydantic import BaseModel
from datetime import date
from typing import Optional

class BookBase(BaseModel):
    title: str
    author: str
    publication_date: Optional[date] = None
    isbn: Optional[str] = None
    cover_image_url: Optional[str] = None

class BookCreate(BookBase):
    pass

class BookResponse(BookBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True


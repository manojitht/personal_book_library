from pydantic import BaseModel, Field
from typing import Optional

class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

class ReviewResponse(ReviewCreate):
    id: int
    user_id: int
    book_id: int

    class Config:
        from_attributes = True

from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.db.database import Base

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True) # [cite: 12]
    author = Column(String, nullable=False, index=True) # [cite: 13]
    publication_date = Column(Date, nullable=True) # [cite: 14]
    isbn = Column(String, unique=True, index=True, nullable=True) # [cite: 15]
    cover_image_url = Column(String, nullable=True) # [cite: 16]
    
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="books")

# Update app/models/users.py to include the relationship:
# books = relationship("Book", back_populates="owner")

from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.db.database import Base

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    author = Column(String, index=True, nullable=False)
    publication_date = Column(Date)
    isbn = Column(String, unique=True, index=True)
    cover_image_url = Column(String)

    owner_id = Column(Integer, ForeignKey("users.id"), index=True)
    owner = relationship("User", back_populates="books")

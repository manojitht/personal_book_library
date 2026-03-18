from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, Base
from app.routers import user, book

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Personal Book Library API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(user.router)
app.include_router(book.router)

@app.get("/")
def health_check():
    return {"status": "online", "message": "Library API is running"}


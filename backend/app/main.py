from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import Base, engine
from app.routers import auth, books, dashboard, reviews, users
from app.core.logging import setup_logging
from app.core.exceptions import global_exception_handler
from app.core.rate_limiter import rate_limiter

setup_logging()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Book Library API")

app.add_exception_handler(Exception, global_exception_handler)

# app.middleware("http")(rate_limiter) # Apply rate limiting to all routes

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(books.router)
app.include_router(dashboard.router)
app.include_router(reviews.router)
app.include_router(users.router)

@app.get("/")
def root():
    return {"status": "running"}

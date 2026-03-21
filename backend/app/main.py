from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import Base, engine
from app.routers import auth, books, dashboard

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Book Library API")

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

@app.get("/")
def root():
    return {"status": "running"}
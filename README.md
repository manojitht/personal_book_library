# Biblios — Personal Book Library

> A full-stack personal book library application built with **FastAPI** + **React TypeScript + Tailwind CSS**.  
> Track every book you've read, write reviews, search your collection, and manage your reading life in one place.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Full Project](#running-the-full-project)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

Biblios is a personal book library web application that allows users to:

- Register and log in securely
- Add, edit, delete, and search books in their personal library
- View a dashboard summarising their collection
- Write star-rated reviews for books
- Update their profile information

The project is split into two parts:

| Part | Technology | Default Port |
|------|-----------|-------------|
| Backend API | Python · FastAPI · SQLite | `8000` |
| Frontend UI | React · TypeScript · Vite · Tailwind CSS | `5173` |

---

## Project Structure

```
personal_book_library/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py          # Settings & env vars
│   │   │   ├── exceptions.py      # Global exception handler
│   │   │   ├── logging.py         # Logging setup
│   │   │   ├── rate_limiter.py    # slowapi rate limiter
│   │   │   └── security.py        # Password hashing & JWT
│   │   ├── db/
│   │   │   └── database.py        # SQLAlchemy engine & session
│   │   ├── models/
│   │   │   ├── books.py           # Book model
│   │   │   ├── reviews.py         # Review model
│   │   │   └── users.py           # User model
│   │   ├── repositories/
│   │   │   ├── book_repository.py
│   │   │   ├── review_repository.py
│   │   │   └── user_repository.py
│   │   ├── routers/
│   │   │   ├── auth.py            # /auth/signup, /auth/login
│   │   │   ├── books.py           # /books CRUD
│   │   │   ├── dashboard.py       # /dashboard
│   │   │   ├── deps.py            # Auth dependency (get_current_user)
│   │   │   ├── reviews.py         # /books/{id}/reviews
│   │   │   └── users.py           # /users/me
│   │   ├── schemas/
│   │   │   ├── books.py           # BookCreate, BookUpdate, BookResponse
│   │   │   ├── reviews.py         # ReviewCreate, ReviewResponse
│   │   │   └── users.py           # UserCreate, UserUpdate, UserResponse
│   │   ├── services/
│   │   │   ├── book_service.py
│   │   │   ├── dashboard_service.py
│   │   │   ├── review_service.py
│   │   │   └── user_service.py
│   │   └── main.py                # App entry point
│   ├── .env.example
│   ├── .gitignore
│   ├── pyproject.toml
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── auth.ts            # signup, login, getMe, updateMe
    │   │   ├── books.ts           # list, create, update, delete, dashboard
    │   │   ├── client.ts          # Axios instance with JWT interceptor
    │   │   └── reviews.ts         # list, create
    │   ├── components/
    │   │   ├── BookCard.tsx       # Book grid card with cover & actions
    │   │   ├── BookForm.tsx       # Create / edit form
    │   │   ├── Layout.tsx         # Navbar + page outlet
    │   │   ├── Navbar.tsx         # Top navigation bar
    │   │   ├── ProtectedRoute.tsx # Auth guard wrapper
    │   │   ├── ReviewsPanel.tsx   # Star ratings + review list
    │   │   └── ui.tsx             # Button, Input, Card, Modal, Skeleton…
    │   ├── context/
    │   │   └── AuthContext.tsx    # Global auth state
    │   ├── pages/
    │   │   ├── BooksPage.tsx      # Library grid, search, pagination
    │   │   ├── DashboardPage.tsx  # Stats + recent books
    │   │   ├── LoginPage.tsx
    │   │   ├── ProfilePage.tsx    # View & edit profile
    │   │   └── SignupPage.tsx
    │   ├── types/
    │   │   └── index.ts           # TypeScript interfaces
    │   ├── App.tsx                # Router setup
    │   ├── index.css              # Global styles + Tailwind
    │   └── main.tsx               # React entry point
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

---

## Prerequisites

Make sure the following are installed before you begin:

| Tool | Minimum Version | Check |
|------|----------------|-------|
| Python | 3.11+ | `python --version` |
| pip | latest | `pip --version` |
| Node.js | 24+ | `node --version` |
| npm | 11+ | `npm --version` |

---

## Backend Setup

### Step 1 — Navigate to the backend folder

```bash
cd backend
```

### Step 2 — Create and activate a virtual environment

**macOS / Linux:**
```bash
python -m venv .venv
source .venv/bin/activate
```

**Windows (Command Prompt):**
```bash
python -m venv .venv
.venv\Scripts\activate
```

**Windows (PowerShell):**
```bash
python -m venv .venv
.venv\Scripts\Activate.ps1
```

You should see `(.venv)` at the start of your terminal prompt when the environment is active.

### Step 3 — Install dependencies

```bash
pip install fastapi "uvicorn[standard]" sqlalchemy "pydantic[email]" \
  pydantic-settings "python-jose[cryptography]" "passlib[bcrypt]" \
  python-multipart slowapi python-dotenv
```

Or if a `pyproject.toml` / `requirements.txt` is present:

```bash
pip install -e .
# or
pip install -r requirements.txt
```

### Step 4 — Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the values:

```env
SECRET_KEY=your-super-secret-key-minimum-16-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
DATABASE_URL=sqlite:///./test.db
ALLOWED_ORIGINS=http://localhost:5173
```

> **Generate a secure SECRET_KEY:**
> ```bash
> python -c "import secrets; print(secrets.token_hex(32))"
> ```
> Copy the output into your `.env` file.

### Step 5 — Run the backend server

```bash
uvicorn app.main:app --reload --port 8000
```

| URL | Purpose |
|-----|---------|
| `http://localhost:8000` | API root |
| `http://localhost:8000/docs` | Swagger UI (interactive docs) |
| `http://localhost:8000/redoc` | ReDoc documentation |

The SQLite database file `test.db` will be created automatically in the `backend/` folder on first run.

---

## Frontend Setup

### Step 1 — Navigate to the frontend folder

```bash
cd frontend
```

### Step 2 — Install dependencies

```bash
npm install
```

This installs all packages defined in `package.json`, including:

- `react` + `react-dom` — UI framework
- `react-router-dom` — client-side routing
- `axios` — HTTP client
- `tailwindcss` + `@tailwindcss/vite` — styling
- `lucide-react` — icons
- `react-hot-toast` — toast notifications

### Step 3 — Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and set:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Step 4 — Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Other useful commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npx tsc --noEmit` | Run TypeScript type check without building |

---

## Running the Full Project

Open **two separate terminal windows** and run both servers simultaneously:

**Terminal 1 — Backend:**
```bash
cd backend
source .venv/bin/activate       # or .venv\Scripts\activate on Windows
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Then open your browser at **http://localhost:5173**.

1. Click **Create one** to register a new account
2. Log in with your credentials
3. Start adding books to your library

---

## Environment Variables

### Backend — `backend/.env`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SECRET_KEY` | ✅ Yes | — | JWT signing key (min 16 chars) |
| `ALGORITHM` | ✅ Yes | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | ✅ Yes | `60` | Token expiry in minutes |
| `DATABASE_URL` | No | `sqlite:///./test.db` | SQLAlchemy database URL |
| `ALLOWED_ORIGINS` | No | `http://localhost:5173` | Comma-separated CORS origins |

### Frontend — `frontend/.env`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | No | `http://localhost:8000` | Backend API base URL |

---

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/signup` | — | Register a new user |
| `POST` | `/auth/login` | — | Login and receive a JWT token |

### User Profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/users/me` | ✅ | Get current user profile |
| `PUT` | `/users/me` | ✅ | Update username and/or email |

### Dashboard

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/dashboard/` | ✅ | Total book count + 5 recent books |

### Books

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/books/` | ✅ | List books (supports `search`, `skip`, `limit`) |
| `POST` | `/books/` | ✅ | Add a new book |
| `GET` | `/books/{id}` | ✅ | Get a single book by ID |
| `PUT` | `/books/{id}` | ✅ | Update a book |
| `DELETE` | `/books/{id}` | ✅ | Delete a book |

**Query parameters for `GET /books/`:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Filter by title or author (case-insensitive) |
| `skip` | int | Number of records to skip (default: `0`) |
| `limit` | int | Max records to return (default: `10`) |

### Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/books/{id}/reviews/` | ✅ | Get all reviews + average rating for a book |
| `POST` | `/books/{id}/reviews/` | ✅ | Add a review (one per user per book) |

---

## Features

### Authentication & Security
- User registration with username, email, and password (min 8 characters)
- Secure login returning a JWT bearer token
- Passwords hashed with bcrypt — never stored in plain text
- Protected API routes — all book/review/dashboard endpoints require a valid JWT
- Brute-force protection on the login endpoint (10 requests per minute per IP)
- Frontend auto-redirects to `/login` on token expiry (HTTP 401)

### Book Library
- Add books with title, author, publication date, ISBN, and cover image URL
- View your entire collection in a responsive grid layout
- Edit any book's details via an inline modal
- Delete books with a confirmation dialog
- Search books by title or author with a debounced real-time search bar
- Pagination — 12 books per page with previous/next controls

### Reviews
- Rate any book from 1 to 5 stars
- Add an optional written comment alongside the rating
- View all reviews for a book plus the calculated average rating
- One review per user per book — enforced at the database level

### Dashboard
- At-a-glance summary of your total book count
- The 5 most recently added books
- Quick shortcut to add a new book

### User Profile
- View your account information (ID, username, email, account status)
- Update your username and/or email with live uniqueness validation

---

## Tech Stack

### Backend

| Package | Version | Purpose |
|---------|---------|---------|
| FastAPI | latest | Web framework |
| Uvicorn | latest | ASGI server |
| SQLAlchemy | latest | ORM & database abstraction |
| Pydantic v2 | latest | Data validation & serialisation |
| pydantic-settings | latest | Environment variable management |
| python-jose | latest | JWT encoding/decoding |
| passlib + bcrypt | latest | Password hashing |
| python-multipart | latest | Form data parsing (OAuth2 login) |
| slowapi | latest | Rate limiting |
| python-dotenv | latest | `.env` file loading |
| SQLite | built-in | Development database |

### Frontend

| Package | Version | Purpose |
|---------|---------|---------|
| React | 19 | UI framework |
| TypeScript | 5 | Static typing |
| Vite | 6 | Build tool & dev server |
| Tailwind CSS | v4 | Utility-first styling |
| React Router | v6 | Client-side routing |
| Axios | latest | HTTP client with interceptors |
| react-hot-toast | latest | Toast notifications |
| lucide-react | latest | SVG icon library |

---

## Deployment

### Backend

1. Switch from SQLite to PostgreSQL by updating `DATABASE_URL`:
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   ```
   Install the driver: `pip install psycopg2-binary`

2. Set a strong `SECRET_KEY` and all other variables via your host's environment variable settings — never commit `.env` to version control.

3. Update `ALLOWED_ORIGINS` to your production frontend domain:
   ```env
   ALLOWED_ORIGINS=https://your-app.com
   ```

4. Run with Gunicorn + Uvicorn workers:
   ```bash
   pip install gunicorn
   gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   ```

### Frontend

1. Set `VITE_API_BASE_URL` to your production backend URL:
   ```env
   VITE_API_BASE_URL=https://api.your-app.com
   ```

2. Build the production bundle:
   ```bash
   npm run build
   ```
   The output is in the `dist/` folder.

3. Deploy `dist/` to any static host:
   - **Vercel** — connect your repo, set env var, deploy
   - **Netlify** — drag and drop `dist/` or connect repo
   - **nginx** — serve `dist/` as a static directory; add a rewrite rule for SPA routing:
     ```nginx
     location / {
       try_files $uri $uri/ /index.html;
     }
     ```

---

## Troubleshooting

### Backend

**`ValueError: SECRET_KEY must be set`**  
→ Your `.env` file is missing or `SECRET_KEY` is empty. Generate one and add it.

**`ModuleNotFoundError: No module named 'app'`**  
→ Run `uvicorn` from the `backend/` directory, not from inside `app/`.

**`sqlite3.OperationalError: no such table`**  
→ The database hasn't been created yet. Make sure `Base.metadata.create_all(bind=engine)` runs on startup (it's already in `main.py`).

**`422 Unprocessable Entity` on login**  
→ The login endpoint uses OAuth2 form data, not JSON. Make sure the request sends `Content-Type: application/x-www-form-urlencoded` (the frontend handles this automatically).

**`409 Conflict` when adding a review**  
→ You've already reviewed this book. Each user can only submit one review per book.

### Frontend

**`Network Error` / API calls failing**  
→ Make sure the backend is running on port `8000` and `VITE_API_BASE_URL` in `.env` matches.

**Blank page after `npm run build`**  
→ Check that `VITE_API_BASE_URL` is set before building. Vite bakes env vars in at build time.

**Redirected to `/login` immediately after logging in**  
→ The JWT token may be malformed or `SECRET_KEY` changed between sessions. Clear `localStorage` in your browser dev tools and log in again.

**`npm install` fails**  
→ Ensure you're using Node.js 24+ and npm 11+. Run `node --version` and `npm --version` to verify.
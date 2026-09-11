# Pathfind

A web platform connecting people transitioning into tech careers in Ghana (students, recent graduates, bootcamp alumni, and career switchers) with experienced tech professionals who can offer structured mentorship.

**AmaliTech Capstone Internship — Product Family 2**

---

## 💡 The Idea

Mentees search a directory of verified tech mentors and send a structured mentorship request (resume review, portfolio feedback, career conversation, interview prep). Mentors review and respond to requests that fit their expertise and availability.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + TypeScript, built with Vite & Tailwind CSS v4 |
| **Backend** | Python 3.11/3.14 (FastAPI), SQLAlchemy 2.0 |
| **Database** | PostgreSQL (Docker container locally / AWS RDS in prod), SQLite for testing |
| **Containerization** | Docker, Docker Compose |
| **Authentication** | JWT Auth with OAuth2 password bearer |
| **CI/CD** | GitHub Actions |

---

## 📁 Project Structure

```text
pathfind/
├── .github/
│   └── workflows/          # GitHub Actions CI pipelines (frontend & backend)
├── backend/
│   ├── tests/              # Pytest test suite (auth & mentorship requests)
│   ├── auth.py             # Password hashing & JWT generation
│   ├── database.py         # SQLAlchemy engine & session setup
│   ├── main.py             # FastAPI app routes & middleware
│   ├── models.py           # Database models (User, MentorshipRequest)
│   ├── schemas.py          # Pydantic schemas for request/response validation
│   ├── Dockerfile          # Multi-stage Docker build for backend API
│   └── requirements.txt    # Python dependencies
├── doc/                    # Project scope, task briefs, and mock mentor seed data
│   ├── mentor_profiles_seed.md
│   └── Project_family_2_Scope_document(pathfind).pdf
├── frontend/               # React + TypeScript + Vite app
│   ├── src/                # React UI components & styles
│   ├── index.html
│   └── package.json
├── docker-compose.yml      # Local dev stack (Postgres 15 + FastAPI with auto-reload)
├── .dockerignore           # Build exclusions for Docker context
├── CONTRIBUTING.md         # Contribution guidelines and Git workflow
└── README.md
```

---

## 🚀 Getting Started

### Method 1: Docker Compose (Recommended for Full Stack)

Run the backend API and PostgreSQL database simultaneously using Docker Compose:

```bash
# Build and start services in containerized environment
docker compose up --build
```

The API will be available at `http://localhost:8000` (interactive API docs at `http://localhost:8000/docs`).

---

### Method 2: Local Development Setup

#### Backend Setup

1. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv backend/.venv
   source backend/.venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. Run the development server:
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```

4. Run backend tests:
   ```bash
   pytest backend/tests
   ```

5. Run linting checks:
   ```bash
   flake8 backend --exclude=.venv
   ```

#### Frontend Setup

1. Navigate to frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

The frontend will run at `http://localhost:5173`.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/` | No | API status message |
| `GET` | `/health` | No | Health check endpoint |
| `POST` | `/auth/signup` | No | Register a new user (mentee or mentor) |
| `POST` | `/auth/signin` | No | Authenticate user & return JWT token |
| `POST` | `/mentorship-requests` | 🔒 Yes | Create a new mentorship request |
| `GET` | `/mentorship-requests` | 🔒 Yes | List user's mentorship requests |
| `GET` | `/mentorship-requests/{id}` | 🔒 Yes | Retrieve details of a specific request |
| `GET` | `/mentorship-request-types` | No | List supported mentorship request categories |

---

## 👥 Team — Product Family 2

| Name | Role |
|---|---|
| **Mustapha Haadi** | DevOps/Cloud, Team Lead |
| **Edward Kamasah** | Frontend |
| **Faith Ugwo Oghenetega** | Fullstack |
| **Margaret Amanfu** | DevOps |
| **Stephen Nyarko Mensah** | Backend |

---

## 📄 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for our branching strategy and pull request guidelines.

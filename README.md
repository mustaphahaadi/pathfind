# Pathfind

A web platform connecting people transitioning into tech careers in Ghana (students, recent graduates, bootcamp alumni, and career switchers) with experienced tech professionals who can offer structured mentorship.

**AmaliTech Capstone Internship — Product Family 2**

---

## 💡 The Idea

Mentees search a directory of verified tech mentors and send a structured mentorship request (resume review, portfolio feedback, career conversation, interview prep). Mentors review and respond to requests that fit their expertise and availability, while administrators review and verify incoming mentor profile applications.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + TypeScript, built with Vite & Vanilla CSS |
| **Backend** | Python 3.11/3.14 (FastAPI), SQLAlchemy 2.0 |
| **Database** | PostgreSQL (Docker container locally / AWS RDS in prod), SQLite for testing |
| **Email Service** | AWS SES / SMTP / Console Mock via FastAPI BackgroundTasks |
| **Storage & Uploads** | Multipart local storage (`/static/uploads/`) with size & format validation |
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
│   ├── tests/              # Pytest test suite (21 unit tests covering Auth, Requests, Email, Uploads)
│   │   ├── test_auth.py
│   │   ├── test_mentorship_requests.py
│   │   ├── test_email.py
│   │   └── test_upload.py
│   ├── static/uploads/     # Local storage directory for uploaded avatars, resumes & portfolios
│   ├── auth.py             # Password hashing & JWT token generation
│   ├── database.py         # SQLAlchemy engine & session setup
│   ├── email.py            # AWS SES / SMTP / Console background email notification service
│   ├── main.py             # FastAPI app routes, static file server & middleware
│   ├── models.py           # Database models (User, MentorProfile, MentorshipRequest)
│   ├── schemas.py          # Pydantic validation schemas
│   ├── seed.py             # Database seed script (populates mock mentors & admin)
│   ├── Dockerfile          # Multi-stage Docker build for backend API
│   └── requirements.txt    # Python dependencies
├── doc/                    # Developer implementation specifications & deliverables
│   ├── Pathfind_Backend_Developer_Implementation_Report.pdf (.docx)
│   ├── Pathfind_Frontend_Developer_Implementation_Report.pdf (.docx)
│   ├── Pathfind_Full_Developer_Implementation_Report.pdf (.docx)
│   └── mentor_profiles_seed.md
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

1. **Create and activate a Python virtual environment**:
   ```bash
   python3 -m venv backend/.venv
   source backend/.venv/bin/activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Seed mock data** (Populates 8 verified mentor profiles & 1 admin account):
   ```bash
   python -m backend.seed
   ```

4. **Run the development server**:
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```

5. **Run backend tests** (21 unit tests, 100% pass rate):
   ```bash
   pytest backend/tests
   ```

6. **Run linting checks**:
   ```bash
   flake8 backend --exclude=.venv,venv,tests --max-line-length=120
   ```

#### Frontend Setup

1. **Navigate to frontend directory and install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start the Vite development server**:
   ```bash
   npm run dev
   ```

The frontend will run at `http://localhost:5173`.

---

## ⚙️ Environment Variables

Configure environment variables in a `.env` file in the root or `backend/` directory:

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `sqlite:///./pathfind.db` | Database connection string (PostgreSQL in production) |
| `SECRET_KEY` | `pathfind_super_secret_jwt_key_2026` | JWT signature secret key |
| `EMAIL_SERVICE` | `console` | Email provider: `console` (mock), `smtp`, or `ses` |
| `SENDER_EMAIL` | `noreply@pathfind.org` | From email address for notifications |
| `AWS_REGION` | `us-east-1` | AWS region for SES email delivery |
| `SMTP_SERVER` | `localhost` | SMTP host server (when `EMAIL_SERVICE=smtp`) |
| `SMTP_PORT` | `587` | SMTP port (TLS) |

---

## 📡 API Endpoints Matrix

| Category | Method | Endpoint | Auth Required | Description |
|---|---|---|---|---|
| **System** | `GET` | `/` | No | API root welcome message |
| **System** | `GET` | `/health` | No | Health check status |
| **Auth** | `POST` | `/auth/signup` | No | Register a new mentee user |
| **Auth** | `POST` | `/auth/signup/mentor` | No | Register a mentor profile (sets `pending_verification`) |
| **Auth** | `POST` | `/auth/signin` | No | Authenticate user & return OAuth2 JWT token |
| **Auth** | `GET` | `/auth/me` | 🔒 Yes | Restore current user session & profile details |
| **Mentors** | `GET` | `/mentors` | No | Discover mentors (search text, expertise, request type, verified filters) |
| **Mentors** | `GET` | `/mentors/{id}` | No | Retrieve detailed profile of a specific mentor |
| **Requests** | `POST` | `/mentorship-requests` | 🔒 Mentee | Create a new mentorship request with optional attachments |
| **Requests** | `GET` | `/mentorship-requests` | 🔒 Yes | List user's mentorship requests (as mentee or mentor) |
| **Requests** | `GET` | `/mentorship-requests/{id}` | 🔒 Yes | Retrieve detailed view of a specific request |
| **Requests** | `PATCH` | `/mentorship-requests/{id}/status` | 🔒 Mentor | Accept or decline request with an optional response message |
| **Requests** | `DELETE` | `/mentorship-requests/{id}` | 🔒 Mentee | Cancel a pending request |
| **Requests** | `GET` | `/mentorship-request-types` | No | List supported mentorship categories |
| **Admin** | `GET` | `/admin/mentors/pending` | 🔒 Admin | List unverified mentor applications |
| **Admin** | `POST` | `/admin/mentors/{id}/approve` | 🔒 Admin | Verify and approve a mentor profile |
| **Admin** | `POST` | `/admin/mentors/{id}/reject` | 🔒 Admin | Reject a mentor profile application |
| **Uploads** | `POST` | `/upload` | 🔒 Yes | Upload avatar/resume/portfolio files (Max 5 MB) |

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

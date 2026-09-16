# Pathfind

A web platform connecting people transitioning into tech careers in Ghana (students, recent graduates, bootcamp alumni, and career switchers) with experienced tech professionals who can offer structured mentorship.

**AmaliTech Capstone Internship — Product Family 2**

---

## 💡 The Idea

Mentees search a directory of verified tech mentors and send structured mentorship requests (resume review, portfolio feedback, career path conversation, interview preparation, role/industry insights). Mentors review and respond to requests that fit their expertise and availability, participants can take private session notes and save favorite mentors, while administrators have full platform control with real-time analytics, user directories, and mentor application verification queues.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + TypeScript, built with Vite & Vanilla CSS |
| **State & Router** | React Router v7, Zustand for global auth state |
| **Backend** | Python 3.11 / 3.14 (FastAPI), SQLAlchemy 2.0 ORM |
| **Database** | PostgreSQL (Docker container locally / AWS RDS in prod), SQLite for dev & testing |
| **Email Service** | AWS SES / SMTP / Console Mock via FastAPI BackgroundTasks |
| **Storage & Uploads** | Multipart local storage (`/static/uploads/`) with size & format validation |
| **Containerization** | Docker, Docker Compose |
| **Authentication** | JWT Auth with OAuth2 password bearer flow |
| **CI/CD & Quality** | GitHub Actions (automated flake8 linting & npm build/eslint checks) |

---

## 📁 Project Structure

```text
pathfind/
├── .github/
│   └── workflows/          # GitHub Actions CI pipelines (frontend build/lint & backend flake8/tests)
├── backend/
│   ├── tests/              # Pytest test suite covering Auth, Requests, Email, Uploads
│   │   ├── test_auth.py
│   │   ├── test_mentorship_requests.py
│   │   ├── test_email.py
│   │   └── test_upload.py
│   ├── static/uploads/     # Storage directory for uploaded avatars, resumes & portfolios
│   ├── auth.py             # Password hashing & JWT token generation
│   ├── database.py         # SQLAlchemy engine & session setup
│   ├── email_service.py    # AWS SES / SMTP / Console background email notification service
│   ├── main.py             # FastAPI app routes, admin endpoints, static file server & middleware
│   ├── models.py           # Database models (User, MentorProfile, MentorshipRequest, SavedMentor, SessionNote, MentorReview)
│   ├── schemas.py          # Pydantic validation schemas & response models
│   ├── seed.py             # Database seed script (populates mock mentors & admin)
│   ├── Dockerfile          # Multi-stage Docker build for backend API
│   └── requirements.txt    # Python dependencies
├── doc/                    # Developer implementation specifications & deliverables
│   ├── Pathfind_Backend_Developer_Implementation_Report.pdf (.docx)
│   ├── Pathfind_Frontend_Developer_Implementation_Report.pdf (.docx)
│   ├── Pathfind_Full_Developer_Implementation_Report.pdf (.docx)
│   ├── Pathfind_Project_Review.md
│   └── mentor_profiles_seed.md
├── frontend/               # React + TypeScript + Vite app
│   ├── src/                # React UI components, layouts, pages, store & API client
│   │   ├── components/     # UI components (Navbar, Footer, Admin, Cards, Modals)
│   │   ├── pages/          # Page components (Landing, Mentors, AdminDashboard, SessionDetails, etc.)
│   │   ├── lib/api.ts      # Axios API client connecting to FastAPI backend
│   │   └── types/api.ts    # TypeScript interface contracts matching FastAPI backend schemas
│   ├── index.html
│   └── package.json
├── docker-compose.yml      # Local dev stack (Postgres 15 + FastAPI with auto-reload)
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

3. **Seed mock data** (Populates 8 verified mentor profiles & 1 admin account `admin@pathfind.org` / `admin123`):
   ```bash
   python3 backend/seed.py
   ```

4. **Run the development server**:
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```

5. **Run linting checks**:
   ```bash
   python3 -m flake8 backend --exclude=.venv,venv,tests --max-line-length=120
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

3. **Build and lint frontend**:
   ```bash
   npm run build
   npx eslint .
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
| **Auth** | `POST` | `/auth/signup` | No | Register a new mentee account |
| **Auth** | `POST` | `/auth/signup/mentor` | No | Register a mentor profile (sets status to `pending_verification`) |
| **Auth** | `POST` | `/auth/signin` | No | Authenticate user & return OAuth2 JWT access token |
| **Auth & Profile** | `GET` | `/auth/me` | 🔒 Yes | Restore current user session & profile details |
| **Auth & Profile** | `PATCH` | `/profiles/me` | 🔒 Yes | Update current user profile details |
| **Mentors** | `GET` | `/mentors` | No | Discover mentors (supports query, expertise, request type, & status filters) |
| **Mentors** | `GET` | `/mentors/{mentor_id}` | No | Retrieve detailed profile of a specific mentor |
| **Mentors** | `POST` | `/mentors/{mentor_id}/reviews` | 🔒 Mentee | Submit a rating review for a mentor |
| **Mentors** | `GET` | `/mentors/{mentor_id}/reviews` | No | List reviews submitted for a mentor |
| **Requests** | `POST` | `/mentorship-requests` | 🔒 Mentee | Create a new mentorship request with optional attachments |
| **Requests** | `GET` | `/mentorship-requests` | 🔒 Yes | List mentorship requests (role-filtered for mentee or mentor) |
| **Requests** | `GET` | `/mentorship-requests/{request_id}` | 🔒 Yes | Retrieve detailed view of a specific request |
| **Requests** | `PATCH` | `/mentorship-requests/{request_id}/status` | 🔒 Mentor | Accept or decline request with an optional response message |
| **Requests** | `DELETE` | `/mentorship-requests/{request_id}` | 🔒 Mentee | Cancel a pending mentorship request |
| **Requests** | `GET` | `/mentorship-request-types` | No | List supported mentorship categories |
| **Bookmarks** | `POST` | `/saved-mentors` | 🔒 Mentee | Bookmark a mentor profile |
| **Bookmarks** | `GET` | `/saved-mentors` | 🔒 Mentee | List bookmarked mentors for logged-in user |
| **Bookmarks** | `DELETE` | `/saved-mentors/{mentor_id}` | 🔒 Mentee | Remove a saved mentor bookmark |
| **Session Notes** | `POST` | `/session-notes` | 🔒 Yes | Add a private note for a mentorship session |
| **Session Notes** | `GET` | `/session-notes` | 🔒 Yes | List session notes for logged-in user |
| **Session Notes** | `DELETE` | `/session-notes/{note_id}` | 🔒 Yes | Delete a session note |
| **Admin Control** | `GET` | `/admin/stats` | 🔒 Admin | Real-time platform analytics & count metrics |
| **Admin Control** | `GET` | `/admin/mentors/pending` | 🔒 Admin | List unverified mentor applications queue |
| **Admin Control** | `GET` | `/admin/mentors` | 🔒 Admin | Directory of all mentors (verified, pending, rejected) |
| **Admin Control** | `GET` | `/admin/mentees` | 🔒 Admin | Directory of all registered mentees |
| **Admin Control** | `POST` | `/admin/mentors/{mentor_id}/approve` | 🔒 Admin | Approve a pending mentor application |
| **Admin Control** | `POST` | `/admin/mentors/{mentor_id}/reject` | 🔒 Admin | Reject a mentor application |
| **Admin Control** | `DELETE` | `/admin/users/{user_id}` | 🔒 Admin | Remove a user account from the platform |
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

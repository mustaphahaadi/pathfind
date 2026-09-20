# Pathfind

A web platform connecting people transitioning into tech careers in Ghana (students, recent graduates, bootcamp alumni, and career switchers) with experienced tech professionals who can offer structured mentorship.

**AmaliTech Capstone Internship — Product Family 2**

---

## The Idea

Mentees search a directory of verified tech mentors and send structured mentorship requests (resume review, portfolio feedback, career path conversation, interview preparation, role/industry insights). Mentors review and respond to requests that fit their expertise and availability, participants can take private session notes and save favorite mentors, while administrators have full platform control with real-time analytics, user directories, and mentor application verification queues.

---

## Tech Stack

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

## Project Structure

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

## Getting Started & Local Setup Guide

Follow one of the two methods below to set up and run the application locally.

---

### Method 1: Docker Compose Setup (Recommended)

Docker Compose provisions a local PostgreSQL 15 database container alongside the FastAPI backend with live code hot-reloading.

#### 1. Start Docker Containers
```bash
# Build images and start Postgres DB & FastAPI API in foreground
docker compose up --build
```
> *Tip: Add `-d` flag to run in detached background mode (`docker compose up --build -d`).*

#### 2. Seed Mock Database Data
In a new terminal window, populate the database with 8 verified mentor profiles and the admin account:
```bash
docker compose exec api python3 backend/seed.py
```

#### 3. Start Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```

#### 4. Access Local Services
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:8000`
- **Interactive Swagger API Docs**: `http://localhost:8000/docs`
- **PostgreSQL Database**: `localhost:5432` (`user: pathfind`, `password: pathfind`, `db: pathfind`)

#### Useful Docker Commands
```bash
# View backend logs in real time
docker compose logs -f api

# Stop all container services
docker compose down

# Stop and wipe database volume data
docker compose down -v
```

---

### Method 2: Normal Local Setup (Manual Environment)

#### Prerequisites
Ensure you have the following installed on your system:
- **Python**: 3.11 or higher (`python3 --version`)
- **Node.js**: 18.0 or higher (`node -v`)
- **npm**: 9.0 or higher (`npm -v`)

---

#### Step-by-Step Backend Setup

1. **Navigate to project root and create virtual environment**:
   ```bash
   python3 -m venv backend/.venv
   ```

2. **Activate the virtual environment**:
   - **Linux / macOS**:
     ```bash
     source backend/.venv/bin/activate
     ```
   - **Windows (PowerShell)**:
     ```powershell
     .\backend\.venv\Scripts\Activate.ps1
     ```

3. **Install Python dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

4. **Seed mock data into SQLite database** (Populates mock Ghanaian mentors & admin `admin@pathfind.org` / `admin123`):
   ```bash
   python3 backend/seed.py
   ```

5. **Start the Uvicorn development server**:
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```
   The backend API will start at `http://localhost:8000`.

6. **(Optional) Run tests and linting**:
   ```bash
   # Run Pytest unit test suite
   pytest backend/tests

   # Run Flake8 code style linter
   python3 -m flake8 backend --exclude=.venv,venv,tests --max-line-length=120
   ```

---

#### Step-by-Step Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node modules**:
   ```bash
   npm install
   ```

3. **Configure environment variable** (Optional):
   Create a `.env` file in `frontend/` (defaults to `http://localhost:8000`):
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Start the Vite development server**:
   ```bash
   npm run dev
   ```
   The application will open at `http://localhost:5173`.

5. **(Optional) Verify production build and linting**:
   ```bash
   # Build production bundle
   npm run build

   # Run ESLint static check
   npx eslint .
   ```

---

## Environment Variables

Configure environment variables in a `.env` file in the root, `backend/`, or `frontend/` directory:

| Variable | Default | Scope | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Frontend | Backend API base URL for client HTTP requests |
| `DATABASE_URL` | `sqlite:///./pathfind.db` | Backend | Database connection string (PostgreSQL in production) |
| `SECRET_KEY` | `pathfind_super_secret_jwt_key_2026` | Backend | JWT signature secret key |
| `EMAIL_SERVICE` | `smtp` | Backend | Email provider: `smtp` (production), `console` (mock), or `ses` |
| `SENDER_EMAIL` | `noreply@pathfind.org` | Backend | From email address for notifications |
| `SMTP_SERVER` | `smtp.sendgrid.net` | Backend | SMTP host server (when `EMAIL_SERVICE=smtp`) |
| `SMTP_PORT` | `587` | Backend | SMTP port (TLS) |
| `SMTP_USERNAME` | `apikey` | Backend | SMTP authentication username |
| `SMTP_PASSWORD` | `your-smtp-api-key` | Backend | SMTP authentication password / API key |
| `AWS_REGION` | `us-east-1` | Backend | AWS region for S3 file storage |

---

## API Endpoints Matrix

| Category | Method | Endpoint | Auth Required | Description |
|---|---|---|---|---|
| **System** | `GET` | `/` | No | API root welcome message |
| **System** | `GET` | `/health` | No | Health check status |
| **Auth** | `POST` | `/auth/signup` | No | Register a new mentee account |
| **Auth** | `POST` | `/auth/signup/mentor` | No | Register a mentor profile (rejects existing email to prevent profile tampering) |
| **Auth** | `POST` | `/auth/signin` | No | Authenticate user & return OAuth2 JWT access token |
| **Auth & Profile** | `GET` | `/auth/me` | Yes | Restore current user session & profile details |
| **Auth & Profile** | `PATCH` | `/profiles/me` | Yes | Update current user profile details |
| **User Settings** | `GET` | `/settings/me` | Yes | Get current user's email notification and reminder settings |
| **User Settings** | `PATCH` | `/settings/me` | Yes | Update user's notification and reminder preferences |
| **Mentors** | `GET` | `/mentors` | No | Discover mentors (supports query, expertise, request type, & status filters) |
| **Mentors** | `GET` | `/mentors/{mentor_id}` | No | Retrieve detailed profile of a specific mentor |
| **Mentors** | `POST` | `/mentors/{mentor_id}/reviews` | Mentee | Submit a rating review for a mentor |
| **Mentors** | `GET` | `/mentors/{mentor_id}/reviews` | No | List reviews submitted for a mentor |
| **Requests** | `POST` | `/mentorship-requests` | Mentee | Create a new mentorship request with optional attachments |
| **Requests** | `GET` | `/mentorship-requests` | Yes | List mentorship requests (role-filtered for mentee or mentor) |
| **Requests** | `GET` | `/mentorship-requests/{request_id}` | Yes | Retrieve detailed view of a specific request |
| **Requests** | `PATCH` | `/mentorship-requests/{request_id}/status` | Mentor | Accept or decline request with an optional response message |
| **Requests** | `DELETE` | `/mentorship-requests/{request_id}` | Mentee | Cancel a pending mentorship request |
| **Requests** | `GET` | `/mentorship-request-types` | No | List supported mentorship categories |
| **Bookmarks** | `POST` | `/saved-mentors` | Mentee | Bookmark a mentor profile |
| **Bookmarks** | `GET` | `/saved-mentors` | Mentee | List bookmarked mentors for logged-in user |
| **Bookmarks** | `DELETE` | `/saved-mentors/{mentor_id}` | Mentee | Remove a saved mentor bookmark |
| **Session Notes** | `POST` | `/session-notes` | Yes | Add a private note for a mentorship session |
| **Session Notes** | `GET` | `/session-notes` | Yes | List session notes for logged-in user |
| **Session Notes** | `PATCH` | `/session-notes/{note_id}` | Yes | Update title, content, or resource URL of an existing note |
| **Session Notes** | `DELETE` | `/session-notes/{note_id}` | Yes | Delete a session note |
| **Goals** | `GET` | `/goals` | Yes | List personal mentorship goals & target milestones |
| **Goals** | `POST` | `/goals` | Yes | Create a new personal goal |
| **Goals** | `PATCH` | `/goals/{goal_id}` | Yes | Update goal completion status or target date |
| **Goals** | `DELETE` | `/goals/{goal_id}` | Yes | Delete a goal |
| **Admin Control** | `GET` | `/admin/stats` | Admin | Real-time platform analytics & count metrics |
| **Admin Control** | `GET` | `/admin/mentors/pending` | Admin | List unverified mentor applications queue |
| **Admin Control** | `GET` | `/admin/mentors` | Admin | Directory of all mentors (verified, pending, rejected) |
| **Admin Control** | `GET` | `/admin/mentees` | Admin | Directory of all registered mentees |
| **Admin Control** | `POST` | `/admin/mentors/{mentor_id}/approve` | Admin | Approve a pending mentor application |
| **Admin Control** | `POST` | `/admin/mentors/{mentor_id}/reject` | Admin | Reject a mentor application |
| **Admin Control** | `DELETE` | `/admin/users/{user_id}` | Admin | Remove a user account from the platform |
| **Uploads** | `POST` | `/upload` | Yes | Upload avatar/resume/portfolio files (Max 5 MB) |

---

## Team — Product Family 2

| Name | Role |
|---|---|
| **Mustapha Haadi** | DevOps/Cloud, Team Lead |
| **Edward Kamasah** | Frontend |
| **Faith Ugwo Oghenetega** | Fullstack |
| **Margaret Amanfu** | DevOps |
| **Stephen Nyarko Mensah** | Backend |

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for our branching strategy and pull request guidelines.

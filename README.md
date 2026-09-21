# Pathfind

A web platform connecting people transitioning into tech careers in Ghana — students, recent graduates, bootcamp alumni, and career switchers — with experienced tech professionals who offer structured mentorship.

**AmaliTech Capstone Internship — Product Family 2**

---

## The Idea

Mentees search a directory of verified tech mentors and send structured mentorship requests (resume review, portfolio feedback, career path conversation, interview preparation, role/industry insights). Mentors review and respond to requests that fit their expertise and availability. Participants can take private session notes, track personal goals, and save favourite mentors. Administrators have full platform control with real-time analytics, user directories, and a mentor application verification queue.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + TypeScript, Vite, Tailwind CSS v4 |
| **State & Router** | React Router v7, Zustand (persisted auth store) |
| **Backend** | Python 3.11, FastAPI 0.95, SQLAlchemy 2.0 ORM |
| **Database** | PostgreSQL 15 (Docker / AWS RDS in prod), SQLite for dev & testing |
| **Migrations** | Alembic — versioned schema migrations |
| **Email Service** | AWS SES / SMTP / Console mock via FastAPI `BackgroundTasks` |
| **File Storage** | AWS S3 (production) with local disk fallback (dev) |
| **Containerisation** | Docker, Docker Compose |
| **Authentication** | JWT (python-jose), bcrypt password hashing, OAuth2 bearer flow |
| **Rate Limiting** | slowapi (3/min signup, 5/min signin) |
| **CI/CD** | GitHub Actions — lint + test on PR, auto-deploy to AWS ECS on merge to `main` |

---

## Project Structure

```text
pathfind/
├── .github/
│   └── workflows/
│       ├── ci.yml              # PR gate: frontend lint/build + backend flake8/pytest
│       └── deploy.yml          # Push to main: test → build Docker image → push ECR → deploy ECS
├── backend/
│   ├── migrations/             # Alembic migration scripts
│   │   ├── versions/           # One file per schema change
│   │   ├── env.py              # Alembic runtime config (reads DATABASE_URL from env)
│   │   └── script.py.mako      # Template for new migration files
│   ├── tests/
│   │   ├── conftest.py         # In-memory SQLite fixture, rate-limiter disabled
│   │   ├── test_auth.py        # Signup, signin, duplicate email, wrong password
│   │   ├── test_mentorship_requests.py  # Full request lifecycle + admin approval
│   │   ├── test_email.py       # Email notification mocking
│   │   └── test_upload.py      # File upload validation
│   ├── static/uploads/         # Local file storage (dev fallback when S3 not configured)
│   ├── alembic.ini             # Alembic configuration (reads DATABASE_URL from env)
│   ├── auth.py                 # bcrypt hashing + JWT token creation/verification
│   ├── database.py             # SQLAlchemy engine & session factory
│   ├── email_service.py        # SES / SMTP / console email backend
│   ├── main.py                 # FastAPI app: all routes, middleware, CORS, rate limiting
│   ├── models.py               # ORM models: User, MentorProfile, MentorshipRequest, etc.
│   ├── s3_service.py           # S3 upload with local disk fallback
│   ├── schemas.py              # Pydantic schemas — expertise_tags serialised as list[str]
│   ├── seed.py                 # Populates mock mentor profiles and admin account
│   ├── Dockerfile              # Multi-stage build; runs `alembic upgrade head` on start
│   ├── requirements.txt        # Fully pinned Python dependencies
│   ├── .env.example            # Template for backend environment variables
│   └── .gitignore
├── doc/                        # Implementation reports and scope documents
├── frontend/
│   ├── src/
│   │   ├── components/         # Shared UI components (cards, modals, header, footer)
│   │   ├── layouts/            # Page layouts (Auth, Onboarding, MentorOnboarding)
│   │   ├── pages/              # Route-level page components
│   │   ├── routes/
│   │   │   ├── router.tsx      # Full routing tree
│   │   │   └── guards/
│   │   │       └── AuthGuards.tsx  # ProtectedRoute, GuestOnlyRoute, AdminRoute, MentorRoute
│   │   ├── store/              # Zustand stores (auth, mentee onboarding, mentor onboarding)
│   │   ├── lib/api.ts          # Typed API client — auto-clears session on 401
│   │   └── types/api.ts        # TypeScript interfaces matching backend Pydantic schemas
│   ├── package.json
│   └── .gitignore
├── .env.example                # Root env template (Docker Compose + all services)
├── docker-compose.yml          # Local dev: PostgreSQL 15 + FastAPI with hot-reload
├── CONTRIBUTING.md
└── README.md
```

---

## Local Setup

Choose **Method 1 (Docker Compose)** for the fastest start — it provisions the database automatically. Use **Method 2 (Manual)** if you prefer to run services directly.

---

### Method 1 — Docker Compose (Recommended)

#### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Compose plugin)

#### 1. Copy the environment file

```bash
cp .env.example .env
```

Open `.env` and set the two required values:

```env
# Generate with: openssl rand -hex 32
POSTGRES_PASSWORD=choose_a_strong_password
SECRET_KEY=generate_a_32_byte_hex_secret
```

All other values have sensible defaults for local development.

#### 2. Start the stack

```bash
docker compose up --build
```

> Add `-d` to run in the background: `docker compose up --build -d`

On first start the container automatically runs `alembic upgrade head` to create the database schema before Uvicorn starts.

#### 3. Seed mock data

In a second terminal:

```bash
docker compose exec api python3 backend/seed.py
```

This creates 8 verified mentor profiles and the admin account (`admin@pathfind.org` / `admin123`).

#### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

#### 5. Access the services

| Service | URL |
|---|---|
| Frontend app | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Swagger / API docs | http://localhost:8000/docs |
| PostgreSQL | `localhost:5432` — see `.env` for credentials |

#### Useful Docker commands

```bash
# Tail backend logs
docker compose logs -f api

# Stop containers (keeps database volume)
docker compose down

# Stop and wipe all data
docker compose down -v

# Re-run migrations after a schema change
docker compose exec api alembic -c backend/alembic.ini upgrade head
```

---

### Method 2 — Manual Setup

#### Prerequisites

- Python 3.11+
- Node.js 18+ and npm 9+
- (Optional) PostgreSQL 15 — SQLite is used by default

---

#### Backend

1. **Create and activate a virtual environment**

   ```bash
   python3 -m venv backend/.venv
   source backend/.venv/bin/activate        # Linux / macOS
   .\backend\.venv\Scripts\Activate.ps1     # Windows PowerShell
   ```

2. **Install dependencies**

   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Configure environment variables**

   ```bash
   cp backend/.env.example backend/.env
   ```

   The defaults use SQLite — no database server needed. To use PostgreSQL instead, set:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/pathfind
   SECRET_KEY=generate_a_32_byte_hex_secret
   ```

4. **Run database migrations**

   ```bash
   alembic -c backend/alembic.ini upgrade head
   ```

   This creates all tables. Run this command every time you pull changes that include new migration files.

5. **Seed mock data**

   ```bash
   python3 backend/seed.py
   ```

6. **Start the API server**

   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```

   API available at `http://localhost:8000`.

7. **Run tests and linting** (optional)

   ```bash
   pytest backend/tests -v
   python3 -m flake8 backend --exclude=.venv,venv,tests --max-line-length=120
   ```

---

#### Frontend

1. **Install dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Configure the API URL** (optional — defaults to `http://localhost:8000`)

   ```bash
   # frontend/.env
   VITE_API_BASE_URL=http://localhost:8000
   ```

3. **Start the dev server**

   ```bash
   npm run dev
   ```

   App available at `http://localhost:5173`.

4. **Build and lint** (optional)

   ```bash
   npm run build
   npm run lint
   ```

---

## Database Migrations (Alembic)

The project uses Alembic to manage schema changes. The initial migration (`0001`) creates all tables on a fresh database. After any change to `backend/models.py`, generate and apply a new migration:

```bash
# Auto-generate a migration from model changes
alembic -c backend/alembic.ini revision --autogenerate -m "describe your change"

# Apply pending migrations
alembic -c backend/alembic.ini upgrade head

# Roll back the latest migration
alembic -c backend/alembic.ini downgrade -1

# Show current migration state
alembic -c backend/alembic.ini current
```

> In Docker: prefix each command with `docker compose exec api`.

---

## Environment Variables

Copy `.env.example` to `.env` at the project root (for Docker) or `backend/.env.example` to `backend/.env` (for manual setup).

| Variable | Default | Where | Description |
|---|---|---|---|
| `POSTGRES_PASSWORD` | — | Docker | **Required.** PostgreSQL password |
| `POSTGRES_USER` | `pathfind` | Docker | PostgreSQL username |
| `POSTGRES_DB` | `pathfind` | Docker | PostgreSQL database name |
| `DATABASE_URL` | `sqlite:///./pathfind.db` | Backend | Full DB connection string |
| `SECRET_KEY` | — | Backend | **Required in production.** JWT signing secret (`openssl rand -hex 32`) |
| `ENVIRONMENT` | `development` | Backend | Environment label |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | Backend | Comma-separated list of allowed frontend origins for CORS |
| `EMAIL_SERVICE` | `console` | Backend | `console` (mock) \| `smtp` \| `ses` |
| `SENDER_EMAIL` | `noreply@pathfind.org` | Backend | From address for notification emails |
| `SMTP_SERVER` | — | Backend | SMTP host (when `EMAIL_SERVICE=smtp`) |
| `SMTP_PORT` | `587` | Backend | SMTP port |
| `SMTP_USERNAME` | — | Backend | SMTP authentication username |
| `SMTP_PASSWORD` | — | Backend | SMTP password / API key |
| `USE_S3` | `false` | Backend | Set `true` to upload files to S3 instead of local disk |
| `S3_BUCKET_NAME` | — | Backend | S3 bucket name (required when `USE_S3=true`) |
| `AWS_REGION` | `us-east-1` | Backend | AWS region |
| `AWS_ACCESS_KEY_ID` | — | Backend | AWS access key (leave blank to use IAM role) |
| `AWS_SECRET_ACCESS_KEY` | — | Backend | AWS secret key |
| `VITE_API_BASE_URL` | `http://localhost:8000` | Frontend | Backend API base URL |

---

## API Endpoints

| Category | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| **System** | `GET` | `/` | — | API root status |
| **System** | `GET` | `/health` | — | Health check |
| **Auth** | `POST` | `/auth/signup` | — | Register mentee account |
| **Auth** | `POST` | `/auth/signup/mentor` | — | Register mentor profile |
| **Auth** | `POST` | `/auth/signin` | — | Sign in, returns JWT |
| **Auth** | `GET` | `/auth/me` | ✓ | Current user + profile |
| **Profile** | `PATCH` | `/profiles/me` | ✓ | Update profile |
| **Settings** | `GET` | `/settings/me` | ✓ | Get notification settings |
| **Settings** | `PATCH` | `/settings/me` | ✓ | Update notification settings |
| **Mentors** | `GET` | `/mentors` | — | Browse mentors (filterable) |
| **Mentors** | `GET` | `/mentors/{id}` | — | Single mentor profile |
| **Mentors** | `POST` | `/mentors/{id}/reviews` | ✓ | Submit review |
| **Mentors** | `GET` | `/mentors/{id}/reviews` | — | List mentor reviews |
| **Requests** | `POST` | `/mentorship-requests` | ✓ | Create request |
| **Requests** | `GET` | `/mentorship-requests` | ✓ | List requests (role-filtered) |
| **Requests** | `GET` | `/mentorship-requests/{id}` | ✓ | Single request |
| **Requests** | `PATCH` | `/mentorship-requests/{id}/status` | Mentor | Accept / decline |
| **Requests** | `DELETE` | `/mentorship-requests/{id}` | Mentee | Cancel pending request |
| **Requests** | `GET` | `/mentorship-request-types` | — | List request categories |
| **Saved** | `POST` | `/saved-mentors` | ✓ | Bookmark mentor |
| **Saved** | `GET` | `/saved-mentors` | ✓ | List bookmarks |
| **Saved** | `DELETE` | `/saved-mentors/{id}` | ✓ | Remove bookmark |
| **Notes** | `POST` | `/session-notes` | ✓ | Create session note |
| **Notes** | `GET` | `/session-notes` | ✓ | List session notes |
| **Notes** | `PATCH` | `/session-notes/{id}` | ✓ | Update note |
| **Notes** | `DELETE` | `/session-notes/{id}` | ✓ | Delete note |
| **Goals** | `GET` | `/goals` | ✓ | List goals (seeds 3 starter goals for new users) |
| **Goals** | `POST` | `/goals` | ✓ | Create goal |
| **Goals** | `PATCH` | `/goals/{id}` | ✓ | Update goal |
| **Goals** | `DELETE` | `/goals/{id}` | ✓ | Delete goal |
| **Admin** | `GET` | `/admin/stats` | Admin | Platform analytics |
| **Admin** | `GET` | `/admin/mentors/pending` | Admin | Pending verification queue |
| **Admin** | `GET` | `/admin/mentors` | Admin | All mentors |
| **Admin** | `GET` | `/admin/mentees` | Admin | All mentees |
| **Admin** | `POST` | `/admin/mentors/{id}/approve` | Admin | Approve mentor |
| **Admin** | `POST` | `/admin/mentors/{id}/reject` | Admin | Reject mentor |
| **Admin** | `DELETE` | `/admin/users/{id}` | Admin | Delete user |
| **Upload** | `POST` | `/upload` | ✓ | Upload file (max 5 MB, S3 or local) |

Full interactive documentation: `http://localhost:8000/docs`

---

## CI/CD Pipeline

Every pull request into `main` runs:
1. **Frontend** — `npm ci`, ESLint, `npm run build`
2. **Backend** — `pip install`, flake8 lint, `pytest tests/ -v`

Every push to `main` that touches `backend/**` additionally:
1. Runs the same test + lint gate
2. Builds a Docker image and pushes it to Amazon ECR (tagged with the commit SHA)
3. Registers a new ECS task definition and forces a new deployment

The container runs `alembic upgrade head` before starting Uvicorn, so schema migrations are applied automatically on each deploy.

---

## Team — Product Family 2

| Name | Role |
|---|---|
| **Mustapha Haadi** | DevOps / Cloud, Team Lead |
| **Edward Kamasah** | Frontend |
| **Faith Ugwo Oghenetega** | Fullstack |
| **Margaret Amanfu** | DevOps |
| **Stephen Nyarko Mensah** | Backend |

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the branching strategy, PR workflow, and deployment guidelines.

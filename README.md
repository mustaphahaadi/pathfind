# Pathfind

A web platform connecting people transitioning into tech careers in Ghana — students, recent graduates, bootcamp alumni, and career switchers — with experienced tech professionals who offer structured mentorship.

**AmaliTech Capstone Internship — Product Family 2**

---

## System Architecture Diagram

![Pathfind System Architecture Diagram](./doc/pathfind-diagram.drawio.png)

*The raw editable architecture file is available at [doc/pathfind_aws_architecture.drawio](./doc/pathfind_aws_architecture.drawio).*

---

## Project Overview

Mentees search a directory of verified tech mentors and send structured mentorship requests (resume review, portfolio feedback, career path conversation, interview preparation, role/industry insights). Mentors review and respond to requests that fit their expertise and availability, attaching direct video meeting links upon acceptance. Participants can take private session notes, track personal starter goals, and save favourite mentors. Administrators maintain platform governance with real-time telemetry analytics, user management directories, and a mentor verification queue.

---

## Tech Stack

| Component | Technology | Description |
|---|---|---|
| **DNS & Ingress** | Cloudflare DNS | DNS routing, proxying, and WAF security |
| **Frontend** | React 19 + TypeScript, Vite, Tailwind CSS v4 | Responsive single-page application |
| **State & Navigation** | React Router v7, Zustand | Client-side routing with persisted state stores |
| **Backend API** | Python 3.11, FastAPI 0.95, SQLAlchemy 2.0 ORM | Asynchronous REST API with Pydantic schemas |
| **Compute / Hosting** | AWS ECS (EC2 Launch Type) | Single EC2 container host instance running Docker tasks |
| **Database** | Amazon RDS PostgreSQL 15 | Single relational database instance (SQLite for dev) |
| **Database Migrations** | Alembic | Version-controlled schema migration pipeline |
| **Email Service** | Gmail SMTP Server (`smtp.gmail.com`) | Transactional email notifications via FastAPI BackgroundTasks |
| **File Storage** | AWS S3 (`pathfind-uploads`) | S3 presigned URLs with local disk fallback in development |
| **Authentication** | JWT (python-jose), bcrypt | OAuth2 bearer token flow with secure password hashing |
| **Rate Limiting** | slowapi | Endpoint protection (3 requests/min signup, 5 requests/min signin) |
| **Containerization** | Docker, Docker Compose | Multi-stage Docker build for local dev & production |
| **CI/CD Pipeline** | GitHub Actions | Automated lint, pytest gate, ECR build, and ECS deploy |

---

## Project Structure

```text
pathfind/
├── .github/
│   └── workflows/
│       ├── ci.yml              # PR gate: frontend lint/build + backend flake8/pytest
│       └── deploy.yml          # Push to main: test -> build Docker image -> push ECR -> deploy ECS
├── backend/
│   ├── migrations/             # Alembic migration scripts
│   │   ├── versions/           # Versioned database migration files
│   │   ├── env.py              # Alembic runtime configuration
│   │   └── script.py.mako      # Migration file template
│   ├── tests/
│   │   ├── conftest.py         # SQLite test fixtures & rate-limiter overrides
│   │   ├── test_auth.py        # Authentication & user registration tests
│   │   ├── test_mentorship_requests.py  # Mentorship lifecycle & admin flow tests
│   │   ├── test_email.py       # Email notification test suite
│   │   └── test_upload.py      # File upload validation tests
│   ├── static/uploads/         # Local file storage (dev fallback when S3 is disabled)
│   ├── alembic.ini             # Alembic configuration
│   ├── auth.py                 # Password hashing & JWT token creation/verification
│   ├── database.py             # SQLAlchemy database engine & session factory
│   ├── email_service.py        # Gmail SMTP / Console email notification dispatch
│   ├── main.py                 # FastAPI application routes, CORS, rate limiting
│   ├── models.py               # ORM database models
│   ├── s3_service.py           # AWS S3 file upload handler & local disk fallback
│   ├── schemas.py              # Pydantic data validation schemas
│   ├── seed.py                 # Seeds initial mentor profiles & admin account
│   ├── Dockerfile              # Production multi-stage Docker build
│   ├── requirements.txt        # Backend Python dependencies
│   └── .env.example
├── doc/                        # Architecture diagrams and implementation reports
│   ├── pathfind-diagram.drawio.png       # Production architecture diagram image
│   ├── pathfind_aws_architecture.drawio # Editable draw.io diagram file
│   ├── pathfind_aws_architecture.xml    # Raw XML diagram file
│   └── pathfind_comprehensive_project_report.md  # Comprehensive project report
├── frontend/
│   ├── src/
│   │   ├── components/         # Shared UI components (cards, modals, header, footer)
│   │   ├── layouts/            # Layout wrappers (Auth, Onboarding, MentorOnboarding)
│   │   ├── pages/              # Page views (Dashboard, Mentors, Admin, Settings)
│   │   ├── routes/             # Router setup & protection guards (AuthGuards.tsx)
│   │   ├── store/              # Zustand state stores (auth, onboarding)
│   │   ├── lib/api.ts          # API client with auto 401 session handling
│   │   └── types/api.ts        # TypeScript definitions
│   ├── package.json
│   └── .gitignore
├── .env.example                # Root environment template
├── docker-compose.yml          # Local development stack (PostgreSQL + FastAPI)
├── CONTRIBUTING.md
└── README.md
```

---

## Local Setup

### Method 1 — Docker Compose (Recommended)

#### 1. Copy the environment file

```bash
cp .env.example .env
```

Open `.env` and set the required secrets:

```env
POSTGRES_PASSWORD=choose_a_strong_password
SECRET_KEY=generate_a_32_byte_hex_secret
```

#### 2. Start the stack

```bash
docker compose up --build
```

On first run, the API container automatically executes `alembic upgrade head` before Uvicorn starts.

#### 3. Seed initial data

In a separate terminal:

```bash
docker compose exec api python3 backend/seed.py
```

This populates verified mentor profiles and the default admin account (`admin@pathfind.org` / `admin123`).

#### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

#### 5. Local Service Endpoints

| Service | Local URL |
|---|---|
| Frontend Web Application | http://localhost:5173 |
| Backend API Service | http://localhost:8000 |
| Interactive API Documentation | http://localhost:8000/docs |
| PostgreSQL Database | localhost:5432 |

---

### Method 2 — Manual Setup

#### Backend Setup

1. **Create and activate Python virtual environment**

   ```bash
   python3 -m venv backend/.venv
   source backend/.venv/bin/activate
   ```

2. **Install backend dependencies**

   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Configure environment variables**

   ```bash
   cp backend/.env.example backend/.env
   ```

4. **Run schema migrations**

   ```bash
   alembic -c backend/alembic.ini upgrade head
   ```

5. **Seed database**

   ```bash
   python3 backend/seed.py
   ```

6. **Start FastAPI application**

   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```

7. **Execute test suite**

   ```bash
   pytest backend/tests -v
   ```

#### Frontend Setup

1. **Install Node modules**

   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**

   ```bash
   npm run dev
   ```

3. **Run TypeScript check & linter**

   ```bash
   npm run build
   npm run lint
   ```

---

## Database Migrations (Alembic)

The project manages database schema changes through Alembic.

```bash
# Generate a new migration after modifying backend/models.py
alembic -c backend/alembic.ini revision --autogenerate -m "description_of_change"

# Apply pending migrations
alembic -c backend/alembic.ini upgrade head

# Roll back latest migration
alembic -c backend/alembic.ini downgrade -1
```

---

## Environment Variables Configuration

| Variable | Default Value | Target | Description |
|---|---|---|---|
| `POSTGRES_PASSWORD` | — | Docker | PostgreSQL superuser password |
| `POSTGRES_USER` | `pathfind` | Docker | PostgreSQL database user |
| `POSTGRES_DB` | `pathfind` | Docker | PostgreSQL database name |
| `DATABASE_URL` | `sqlite:///./pathfind.db` | Backend | Relational database connection string |
| `SECRET_KEY` | — | Backend | Required JWT signing secret (`openssl rand -hex 32`) |
| `ENVIRONMENT` | `development` | Backend | Deployment environment label |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | Backend | Comma-separated list of allowed CORS origins |
| `EMAIL_SERVICE` | `console` | Backend | Email driver: `console` (dev mock) \| `smtp` (Gmail) |
| `SENDER_EMAIL` | `noreply@pathfind.org` | Backend | Sender email address for notifications |
| `SMTP_SERVER` | `smtp.gmail.com` | Backend | SMTP host server |
| `SMTP_PORT` | `587` | Backend | SMTP port |
| `SMTP_USERNAME` | — | Backend | Gmail SMTP username |
| `SMTP_PASSWORD` | — | Backend | Gmail App Password |
| `USE_S3` | `false` | Backend | Set `true` to enable AWS S3 uploads |
| `S3_BUCKET_NAME` | `pathfind-uploads` | Backend | AWS S3 bucket name |
| `AWS_REGION` | `us-east-1` | Backend | AWS region |
| `AWS_ACCESS_KEY_ID` | — | Backend | AWS IAM access key ID |
| `AWS_SECRET_ACCESS_KEY` | — | Backend | AWS IAM secret access key |
| `VITE_API_BASE_URL` | `http://localhost:8000` | Frontend | Backend API base URL |

---

## API Endpoints Reference

| Category | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| **System** | `GET` | `/` | Open | Root API status endpoint |
| **System** | `GET` | `/health` | Open | Health check endpoint |
| **Auth** | `POST` | `/auth/signup` | Open | Register mentee account |
| **Auth** | `POST` | `/auth/signup/mentor` | Open | Register mentor application profile |
| **Auth** | `POST` | `/auth/signin` | Open | Authenticate credentials & return JWT |
| **Auth** | `GET` | `/auth/me` | User | Get current user identity & profile |
| **Profile** | `PATCH` | `/profiles/me` | User | Update personal user profile |
| **Settings** | `GET` | `/settings/me` | User | Fetch notification preferences |
| **Settings** | `PATCH` | `/settings/me` | User | Update notification preferences |
| **Mentors** | `GET` | `/mentors` | Open | Search & filter verified mentors |
| **Mentors** | `GET` | `/mentors/{id}` | Open | Fetch single mentor details |
| **Mentors** | `POST` | `/mentors/{id}/reviews` | User | Submit mentor rating & review |
| **Mentors** | `GET` | `/mentors/{id}/reviews` | Open | List mentor reviews |
| **Requests** | `POST` | `/mentorship-requests` | Mentee | Submit structured booking request |
| **Requests** | `GET` | `/mentorship-requests` | User | List mentorship requests |
| **Requests** | `GET` | `/mentorship-requests/{id}` | User | Fetch request details |
| **Requests** | `PATCH` | `/mentorship-requests/{id}/status` | Mentor | Accept/decline request & assign meeting link |
| **Requests** | `DELETE` | `/mentorship-requests/{id}` | Mentee | Cancel pending request |
| **Requests** | `GET` | `/mentorship-request-types` | Open | List mentorship request categories |
| **Saved** | `POST` | `/saved-mentors` | User | Bookmark mentor |
| **Saved** | `GET` | `/saved-mentors` | User | List bookmarked mentors |
| **Saved** | `DELETE` | `/saved-mentors/{id}` | User | Remove bookmark |
| **Notes** | `POST` | `/session-notes` | User | Create private session note |
| **Notes** | `GET` | `/session-notes` | User | List private session notes |
| **Notes** | `PATCH` | `/session-notes/{id}` | User | Update session note |
| **Notes** | `DELETE` | `/session-notes/{id}` | User | Delete session note |
| **Goals** | `GET` | `/goals` | User | List goals (auto-seeds 3 starter goals) |
| **Goals** | `POST` | `/goals` | User | Create personal goal |
| **Goals** | `PATCH` | `/goals/{id}` | User | Update goal progress/status |
| **Goals** | `DELETE` | `/goals/{id}` | User | Delete goal |
| **Admin** | `GET` | `/admin/stats` | Admin | System telemetry analytics |
| **Admin** | `GET` | `/admin/mentors/pending` | Admin | Mentor verification queue |
| **Admin** | `GET` | `/admin/mentors` | Admin | Directory of all mentors |
| **Admin** | `GET` | `/admin/mentees` | Admin | Directory of all mentees |
| **Admin** | `POST` | `/admin/mentors/{id}/approve` | Admin | Approve pending mentor profile |
| **Admin** | `POST` | `/admin/mentors/{id}/reject` | Admin | Reject pending mentor profile |
| **Admin** | `DELETE` | `/admin/users/{id}` | Admin | Remove user account |
| **Upload** | `POST` | `/upload` | User | Upload resume/avatar (max 5 MB) |

---

## CI/CD Deployment Pipeline

On every Pull Request into `main`:
1. **Frontend**: Runs `npm ci`, ESLint, and `npm run build`.
2. **Backend**: Runs `pip install`, flake8 linting, and `pytest backend/tests -v`.

On Merge to `main`:
1. Executes test and lint validation gates.
2. Builds the multi-stage FastAPI Docker image.
3. Pushes the Docker image to Amazon ECR tagged with the commit SHA.
4. Registers an updated ECS task definition targeting the single EC2 host instance.
5. Executes `alembic upgrade head` auto-migrations during task initialization.

---

## Documentation Links

- [Comprehensive Project Report](./doc/pathfind_comprehensive_project_report.md)
- [Architecture Diagram Source (draw.io)](./doc/pathfind_aws_architecture.drawio)
- [Architecture XML Source](./doc/pathfind_aws_architecture.xml)

---

## Team — Product Family 2

| Name | Role |
|---|---|
| **Mustapha Haadi** | DevOps / Cloud, Team Lead |
| **Edward Kamasah** | Frontend Engineer |
| **Faith Ugwo Oghenetega** | Fullstack Engineer |
| **Margaret Amanfu** | DevOps Engineer |
| **Stephen Nyarko Mensah** | Backend Engineer |

---

## Contributing

Refer to [CONTRIBUTING.md](./CONTRIBUTING.md) for developer guidelines, branch management conventions, and pull request rules.

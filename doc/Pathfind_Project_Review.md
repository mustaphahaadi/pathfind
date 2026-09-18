# 📚 Pathfind Developer & Platform Documentation

**Platform Name**: Pathfind  
**Sub-project**: AmaliTech Capstone Internship — Product Family 2  
**Last Updated**: September 18, 2026  

---

## 🚀 Overview

Pathfind is a full-stack mentorship connection platform designed for career transitioners, bootcamp graduates, and tech students in Ghana. The application enables mentees to explore a directory of verified tech professionals, submit structured 1:1 mentorship requests (CV review, portfolio feedback, interview prep, career path guidance), track personal learning goals, take private session notes, and receive automated email notifications.

---

## 🛠️ System Architecture & Tech Stack

```text
               +-------------------------------------------------+
               |              React 19 + TypeScript              |
               |       React Router v7 + Zustand State Store     |
               |      Vite 8 Build & Rolldown Code-Splitting     |
               +-----------------------+-------------------------+
                                       |
                                       | REST API (JSON / Bearer JWT)
                                       v
               +-------------------------------------------------+
               |            Python 3.11/3.14 + FastAPI           |
               |        Slowapi Rate Limiter & PyJWT Auth        |
               +-----------------------+-------------------------+
                                       |
                   +-------------------+-------------------+
                   |                                       |
                   v                                       v
    +------------------------------+       +------------------------------+
    | SQLAlchemy 2.0 ORM Engine    |       | AWS SES / SMTP / Console     |
    | (PostgreSQL / SQLite)        |       | Background Tasks Email       |
    +------------------------------+       +------------------------------+
```

### Stack Components

- **Frontend**: React 19, TypeScript, Vite 8, React Router v7, Zustand (for persistent auth and onboarding state), Vanilla Tailwind CSS.
- **Backend**: FastAPI (Python 3.11 / 3.14), SQLAlchemy 2.0 ORM, Pydantic v2 validation models, PyJWT, Passlib (Bcrypt hashing), Slowapi rate limiter.
- **Database**: PostgreSQL (Docker container / AWS RDS in production), SQLite (`pathfind.db`) for local testing.
- **File Uploads**: Local storage (`/static/uploads/`) with fallback S3 bucket integration (`boto3`).
- **Testing & Quality**: Pytest test suite (21 test cases), Flake8 PEP-8 code style linter.

---

## 🔒 Security Architecture & Rules

1. **Authentication**: JWT token bearer flow (`/auth/signin`). Tokens are signed using `HS256` algorithm with `SECRET_KEY`.
2. **Mentor Registration Security**: `/auth/signup/mentor` validates email uniqueness and rejects already registered emails (`HTTP 400 Bad Request`) to prevent unauthenticated profile modifications or account hijacking.
3. **Role-Based Access Control**:
   - `mentee`: Can browse mentors, request sessions, bookmark mentors, manage notes & goals.
   - `mentor`: Can accept/decline incoming requests, post meeting links, edit profile availability.
   - `admin`: Full administrative access to pending mentor verification queues (`/admin/mentors/pending`), user deletion, and platform analytics (`/admin/stats`).
4. **Rate Limiting**:
   - Sign up (`/auth/signup`): 3 requests per minute.
   - Sign in (`/auth/signin`): 5 requests per minute.

---

## 🗄️ Database Models

### `User`
- `id` (Integer, Primary Key)
- `email` (String, Unique, Indexed)
- `hashed_password` (String)
- `role` (String: `"mentee"`, `"mentor"`, `"admin"`)
- `verification_status` (Enum: `"pending_verification"`, `"verified"`, `"rejected"`)
- `created_at` (DateTime UTC)

### `MentorProfile`
- `id` (Integer, Primary Key)
- `user_id` (Integer, Foreign Key `users.id`, Unique)
- `full_name`, `job_title`, `company`, `years_of_experience`, `bio`, `expertise_tags`, `availability`
- `avatar_url`, `location`, `linkedin_url` (Optional)

### `MentorshipRequest`
- `id` (UUID String, Primary Key)
- `mentee_id` (Integer, Foreign Key `users.id`)
- `mentor_id` (Integer, Foreign Key `users.id`)
- `request_type` (Enum: `cv_review`, `portfolio_feedback`, `career_path_conversation`, `interview_preparation`, `role_industry_insight`)
- `subject`, `message`
- `resume_url`, `portfolio_url`, `github_url`, `meeting_link`, `response_message` (Optional)
- `status` (Enum: `pending`, `accepted`, `declined`, `completed`)

### `Goal`
- `id` (Integer, Primary Key)
- `user_id` (Integer, Foreign Key `users.id`)
- `title`, `category`, `target_date`, `completed` (Boolean)

### `SessionNote`
- `id` (Integer, Primary Key)
- `user_id` (Integer, Foreign Key `users.id`)
- `request_id`, `title`, `content`, `resource_url`

---

## ⚙️ Environment Variable Reference

| Variable | Scope | Default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | Frontend | `http://localhost:8000` | FastAPI server URL |
| `DATABASE_URL` | Backend | `sqlite:///./pathfind.db` | Connection string |
| `SECRET_KEY` | Backend | `dev-only-secret-key` | JWT signing key |
| `EMAIL_SERVICE` | Backend | `console` | `console`, `smtp`, or `ses` |
| `SENDER_EMAIL` | Backend | `noreply@pathfind.org` | Notification sender email |
| `AWS_REGION` | Backend | `us-east-1` | AWS Region for SES / S3 |

---

## 🧪 Verification & Testing Commands

```bash
# 1. Run Backend Pytest Suite
cd backend
.venv/bin/pytest

# 2. Run Flake8 Code Quality Check
.venv/bin/python -m flake8 . --max-line-length=120 --exclude=.venv,venv,tests

# 3. Verify Frontend Production Build & Code Splitting
cd ../frontend
npm run build
```

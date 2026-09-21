# Contributing to Pathfind

This document covers everything you need to collaborate on this repo: local environment setup, branching, code standards, the pull request process, and how deployments work.

---

## Table of Contents

1. [First-time Setup](#first-time-setup)
2. [Branching Strategy](#branching-strategy)
3. [Making Changes](#making-changes)
4. [Pull Requests](#pull-requests)
5. [Code Standards](#code-standards)
6. [Database Migrations](#database-migrations)
7. [Running Tests](#running-tests)
8. [CI/CD and Deployment](#cicd-and-deployment)
9. [Commit Message Guidelines](#commit-message-guidelines)
10. [Questions and Blockers](#questions-and-blockers)

---

## First-time Setup

Before making any change, get the project running locally. Follow the full setup in [README.md](./README.md). The short version:

```bash
# 1. Clone the repo
git clone https://github.com/your-org/pathfind.git
cd pathfind

# 2. Copy and fill in the environment file
cp .env.example .env
# Edit .env — set POSTGRES_PASSWORD and SECRET_KEY at minimum

# 3. Start the stack
docker compose up --build -d

# 4. Apply database migrations (runs automatically on container start,
#    but also run manually if you skip Docker)
docker compose exec api alembic -c backend/alembic.ini upgrade head

# 5. Seed mock data
docker compose exec api python3 backend/seed.py

# 6. Start the frontend
cd frontend && npm install && npm run dev
```

> **Never commit a `.env` file.** It is gitignored. `.env.example` is the committed template — update it when you add a new environment variable.

---

## Branching Strategy

- **`main`** is protected. It reflects production. Every push to `main` triggers an automated deployment to AWS ECS. Never push directly.
- All work happens on feature branches named `feat/yourname` or, for focused changes, `feat/yourname-short-description`.

```bash
# Always start from an up-to-date main
git checkout main
git pull origin main

# Create your branch
git checkout -b feat/yourname
```

---

## Making Changes

1. Pull the latest `main` before starting any work (see above).
2. Make your changes on your branch.
3. If you changed `backend/models.py`, generate a migration (see [Database Migrations](#database-migrations)).
4. Run the tests before pushing (see [Running Tests](#running-tests)).
5. Stage and commit:

```bash
git add path/to/changed/file.py    # prefer specific files over git add .
git commit -m "Add mentor search filter by expertise tag"
```

6. Push your branch:

```bash
git push origin feat/yourname
```

---

## Pull Requests

1. Open a PR from your branch into `main` on GitHub.
2. Fill in the PR description:
   - **What changed** — a short summary of the change and why.
   - **How to test** — steps to verify the change works locally.
   - **Screenshots** — for any UI changes.
3. Assign **2–3 teammates** as reviewers. Do not merge your own PR.
4. Address all review feedback before merging.
5. Once approved, merge using **Squash and Merge** to keep history clean.
6. Delete your branch after it is merged.

### PR checklist

- [ ] Tests pass locally (`pytest backend/tests -v`)
- [ ] Frontend builds cleanly (`npm run build` in `frontend/`)
- [ ] No `.env` files committed
- [ ] New environment variables added to `.env.example`
- [ ] New Alembic migration generated if models changed
- [ ] `ALLOWED_ORIGINS` updated in ECS task definition if a new frontend domain was added

---

## Code Standards

### Backend (Python)

- Formatter: none enforced, but keep lines under 120 characters.
- Linter: **flake8** — run before pushing:
  ```bash
  python3 -m flake8 backend --exclude=.venv,venv,tests --max-line-length=120
  ```
- All new routes must use `Depends(get_current_user)` for auth. Never trust user-supplied IDs without verifying ownership.
- Pydantic schemas live in `schemas.py`. Keep them in sync with `types/api.ts` on the frontend.
- `expertise_tags` is a `list[str]` in all schemas. The DB column stores a comma-separated string — the conversion is handled automatically by the `_tags_to_list` / `_list_to_str` helpers in `schemas.py`. Do not pass a raw string to `expertise_tags` in new code.

### Frontend (TypeScript / React)

- Linter: **ESLint** — run before pushing:
  ```bash
  npm run lint
  ```
- All API calls go through `src/lib/api.ts`. Do not use `fetch` directly in components.
- Authentication state lives exclusively in `useAuthStore` (token + user). Do not use onboarding store state as a proxy for "is logged in".
- Route guards are in `src/routes/guards/AuthGuards.tsx`. If you add a new role or route type, add a guard there — do not inline redirect logic in pages.

---

## Database Migrations

The project uses **Alembic** for schema versioning. Every change to `backend/models.py` must be accompanied by a migration.

### Workflow

```bash
# 1. Make your model change in backend/models.py

# 2. Auto-generate a migration
alembic -c backend/alembic.ini revision --autogenerate -m "add linkedin_url to mentor_profiles"

# 3. Review the generated file in backend/migrations/versions/
#    Check that upgrade() and downgrade() look correct before committing.

# 4. Apply the migration locally to verify it works
alembic -c backend/alembic.ini upgrade head

# 5. Commit the migration file alongside your model change
git add backend/migrations/versions/<new_file>.py backend/models.py
git commit -m "Add linkedin_url to mentor_profiles"
```

> In Docker: prefix alembic commands with `docker compose exec api`.

### Other useful commands

```bash
# Show current migration version
alembic -c backend/alembic.ini current

# Show full history
alembic -c backend/alembic.ini history

# Roll back the latest migration
alembic -c backend/alembic.ini downgrade -1
```

> **Never** edit an already-merged migration file. Create a new one instead.

---

## Running Tests

### Backend

```bash
# Activate virtual environment first
source backend/.venv/bin/activate

# Run full test suite
pytest backend/tests -v

# Run a single test file
pytest backend/tests/test_auth.py -v
```

Tests use an in-memory SQLite database via the `client` fixture in `conftest.py` — no running database needed.

### Frontend

There is currently no frontend unit test suite. Verify changes manually and ensure `npm run build` succeeds cleanly.

---

## CI/CD and Deployment

### What runs automatically

| Event | Pipeline | Steps |
|---|---|---|
| Pull request → `main` | `ci.yml` | Frontend lint + build, backend flake8 + pytest |
| Push to `main` (backend files changed) | `deploy.yml` | Backend test + lint → build Docker image → push to Amazon ECR → deploy to Amazon ECS |

### How the ECS deployment works

1. GitHub Actions builds the Docker image from `backend/Dockerfile` and tags it with the commit SHA.
2. The image is pushed to Amazon ECR (the registry URL and repository name are stored as GitHub secrets).
3. The workflow fetches the active ECS task definition, swaps the image tag, registers a new revision, and calls `aws ecs update-service --force-new-deployment`.
4. ECS starts the new container. The Dockerfile `CMD` runs `alembic upgrade head` before Uvicorn starts, so migrations are applied automatically.

### Environment variables in production (ECS)

Sensitive values are configured as **environment variables on the ECS task definition**, not in the image. After any change that adds a new environment variable:

1. Go to **ECS → Task Definitions → your task def → Create new revision**.
2. Under the container definition, add the new variable.
3. Update the service to use the new task definition revision.

Key production variables to keep up to date:

| Variable | Notes |
|---|---|
| `SECRET_KEY` | Generate with `openssl rand -hex 32` |
| `DATABASE_URL` | Points to RDS PostgreSQL instance |
| `ALLOWED_ORIGINS` | Comma-separated list of your frontend domain(s) |
| `EMAIL_SERVICE` | Set to `ses` or `smtp` in production |
| `USE_S3` | Set to `true` in production |
| `S3_BUCKET_NAME` | Your S3 bucket for file uploads |

### Accessing ECS task logs

Logs are available in **CloudWatch** under the log group for your ECS service. You can also view the last 4 log entries directly in the ECS console under the task → Logs tab.

### Triggering a manual redeploy

If you need to redeploy without a code change (e.g. to pick up a config update):

```bash
aws ecs update-service \
  --cluster <your-cluster> \
  --service <your-service> \
  --force-new-deployment
```

---

## Commit Message Guidelines

Short, present-tense, descriptive:

```
Add expertise tag filter to mentor search
Fix 401 redirect loop on token expiry
Add Alembic initial migration for all tables
Update CORS to read ALLOWED_ORIGINS from env
```

Avoid: `fixed stuff`, `updates`, `wip`, `misc changes`.

---

## Questions and Blockers

Post in the team channel as soon as something blocks you. A problem raised early gets solved fast; a hidden one costs the team time.

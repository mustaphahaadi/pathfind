
# Pathfind

A web platform connecting people transitioning into tech careers in Ghana (students, recent graduates, bootcamp alumni, and career switchers) with experienced tech professionals who can offer structured mentorship.

**AmaliTech Capstone Internship — Product Family 2**

## The Idea

Mentees search a directory of verified tech mentors and send a structured mentorship request (resume review, portfolio feedback, career conversation, interview prep). Mentors review and respond to requests that fit their expertise and availability.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript, built with Vite |
| Backend | Python (FastAPI), containerized with Docker |
| Database | PostgreSQL (AWS RDS) |
| Hosting | Frontend: S3 + CloudFront. Backend: ECR + ECS |
| Auth | Custom FastAPI authentication endpoints |
| Email | AWS SES |
| CI/CD | GitHub Actions |

## Project Structure

pathfind/
├── frontend/ # React + TypeScript + Vite app
├── backend/ # FastAPI application
├── .github/
│ └── workflows/ # CI/CD pipelines
├── README.md
└── CONTRIBUTING.md


## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
python -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

Set `SECRET_KEY` before deploying. The API refuses to start with no secret when
`ENVIRONMENT=production`; a development-only key is used locally for convenience.

## Team — Product Family 2

| Name | Role |
|---|---|
| Mustapha Haadi | DevOps/Cloud, Team Lead |
| Edward Kamasah | Frontend |
| Faith Ugwo Oghenetega | Fullstack |
| Margaret Amanfu | DevOps |
| Stephen Nyarko Mensah | Backend |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for our branching and pull request workflow.

# ── Stage 1: build dependencies ────────────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /app

# Install build tools needed by some packages (e.g. pycryptodome)
RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir --prefix=/install -r backend/requirements.txt

# ── Stage 2: runtime image ─────────────────────────────────────────────────
FROM python:3.11-slim

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Copy application source (project root so `backend` package resolves correctly)
COPY backend/ ./backend/

# Non-root user for security
RUN useradd --create-home appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

# Production: no --reload. Override CMD in docker-compose for dev.
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]

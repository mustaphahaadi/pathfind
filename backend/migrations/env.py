"""Alembic environment configuration.

This file is executed by Alembic on every migration command.
It connects to the database and imports the project's metadata so
Alembic can auto-generate and apply schema migrations.
"""
import os
import sys
from logging.config import fileConfig

# Ensure project root is on sys.path so `backend` package can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from sqlalchemy import engine_from_config, pool
from alembic import context

# ── Load application models so their metadata is available ────────────────────
# This import must come before target_metadata is set.
from backend.database import Base, sanitize_db_url  # noqa: F401 — registers all models
import backend.models  # noqa: F401 — ensures all ORM classes are loaded

# ── Alembic Config object (gives access to values in alembic.ini) ─────────────
config = context.config

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# The metadata object that autogenerate will compare against the live DB
target_metadata = Base.metadata

# ── Override sqlalchemy.url from the environment variable if set ──────────────
# This lets the same alembic.ini work for SQLite (local) and PostgreSQL (prod).
database_url = os.getenv("DATABASE_URL")
if database_url:
    config.set_main_option("sqlalchemy.url", sanitize_db_url(database_url).replace("%", "%%"))


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode (emit SQL without a live connection)."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        # Detect column type changes in addition to additions/removals
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode (against a live database connection)."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

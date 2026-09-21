"""Initial schema — creates all tables from the current models.

Revision ID: 0001
Revises:
Create Date: 2026-09-21 00:00:00.000000 UTC

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── Safely create PostgreSQL Enum types if they do not already exist ─────────
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        bind.execute(
            sa.text("""
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verificationstatus') THEN
                    CREATE TYPE verificationstatus AS ENUM ('pending_verification', 'verified', 'rejected');
                END IF;
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'requesttype') THEN
                    CREATE TYPE requesttype AS ENUM ('cv_review', 'portfolio_feedback', 'career_path_conversation', 'interview_preparation', 'role_industry_insight');
                END IF;
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'requeststatus') THEN
                    CREATE TYPE requeststatus AS ENUM ('pending', 'accepted', 'declined', 'completed');
                END IF;
            END $$;
            """)
        )

    # ── users ──────────────────────────────────────────────────────────────────
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=50), nullable=False),
        sa.Column(
            "verification_status",
            sa.Enum(
                "pending_verification",
                "verified",
                "rejected",
                name="verificationstatus",
                create_type=False,
            ),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)

    # ── mentor_profiles ────────────────────────────────────────────────────────
    op.create_table(
        "mentor_profiles",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("job_title", sa.String(length=255), nullable=False),
        sa.Column("company", sa.String(length=255), nullable=False),
        sa.Column("years_of_experience", sa.Integer(), nullable=False),
        sa.Column("bio", sa.Text(), nullable=False),
        sa.Column("expertise_tags", sa.String(length=500), nullable=False),
        sa.Column("availability", sa.String(length=255), nullable=False),
        sa.Column("avatar_url", sa.String(length=500), nullable=True),
        sa.Column("location", sa.String(length=255), nullable=True),
        sa.Column("linkedin_url", sa.String(length=500), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id"),
    )
    op.create_index(op.f("ix_mentor_profiles_id"), "mentor_profiles", ["id"], unique=False)

    # ── mentorship_requests ────────────────────────────────────────────────────
    op.create_table(
        "mentorship_requests",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("mentee_id", sa.Integer(), nullable=False),
        sa.Column("mentor_id", sa.Integer(), nullable=False),
        sa.Column(
            "request_type",
            sa.Enum(
                "cv_review",
                "portfolio_feedback",
                "career_path_conversation",
                "interview_preparation",
                "role_industry_insight",
                name="requesttype",
                create_type=False,
            ),
            nullable=False,
        ),
        sa.Column("subject", sa.String(length=255), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("resume_url", sa.String(length=500), nullable=True),
        sa.Column("portfolio_url", sa.String(length=500), nullable=True),
        sa.Column("github_url", sa.String(length=500), nullable=True),
        sa.Column("meeting_link", sa.String(length=500), nullable=True),
        sa.Column("response_message", sa.Text(), nullable=True),
        sa.Column(
            "status",
            sa.Enum("pending", "accepted", "declined", "completed", name="requeststatus", create_type=False),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["mentee_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["mentor_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_mentorship_requests_mentee_id"), "mentorship_requests", ["mentee_id"], unique=False)
    op.create_index(op.f("ix_mentorship_requests_mentor_id"), "mentorship_requests", ["mentor_id"], unique=False)
    op.create_index(op.f("ix_mentorship_requests_request_type"), "mentorship_requests", ["request_type"], unique=False)
    op.create_index(op.f("ix_mentorship_requests_status"), "mentorship_requests", ["status"], unique=False)

    # ── saved_mentors ──────────────────────────────────────────────────────────
    op.create_table(
        "saved_mentors",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("mentor_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["mentor_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_saved_mentors_id"), "saved_mentors", ["id"], unique=False)
    op.create_index(op.f("ix_saved_mentors_mentor_id"), "saved_mentors", ["mentor_id"], unique=False)
    op.create_index(op.f("ix_saved_mentors_user_id"), "saved_mentors", ["user_id"], unique=False)

    # ── mentor_reviews ─────────────────────────────────────────────────────────
    op.create_table(
        "mentor_reviews",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("mentor_id", sa.Integer(), nullable=False),
        sa.Column("mentee_id", sa.Integer(), nullable=False),
        sa.Column("rating", sa.Integer(), nullable=False),
        sa.Column("reviewer_name", sa.String(length=255), nullable=False),
        sa.Column("reviewer_role", sa.String(length=255), nullable=False),
        sa.Column("session_topic", sa.String(length=255), nullable=False),
        sa.Column("quote", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["mentee_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["mentor_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_mentor_reviews_id"), "mentor_reviews", ["id"], unique=False)
    op.create_index(op.f("ix_mentor_reviews_mentee_id"), "mentor_reviews", ["mentee_id"], unique=False)
    op.create_index(op.f("ix_mentor_reviews_mentor_id"), "mentor_reviews", ["mentor_id"], unique=False)

    # ── session_notes ──────────────────────────────────────────────────────────
    op.create_table(
        "session_notes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("request_id", sa.String(length=36), nullable=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("resource_url", sa.String(length=500), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_session_notes_id"), "session_notes", ["id"], unique=False)
    op.create_index(op.f("ix_session_notes_user_id"), "session_notes", ["user_id"], unique=False)

    # ── goals ──────────────────────────────────────────────────────────────────
    op.create_table(
        "goals",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("category", sa.String(length=100), nullable=False),
        sa.Column("target_date", sa.String(length=100), nullable=False),
        sa.Column("completed", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_goals_id"), "goals", ["id"], unique=False)
    op.create_index(op.f("ix_goals_user_id"), "goals", ["user_id"], unique=False)

    # ── user_settings ──────────────────────────────────────────────────────────
    op.create_table(
        "user_settings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("email_notifications", sa.Boolean(), nullable=False),
        sa.Column("session_reminders", sa.Boolean(), nullable=False),
        sa.Column("weekly_digest", sa.Boolean(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id"),
    )
    op.create_index(op.f("ix_user_settings_id"), "user_settings", ["id"], unique=False)
    op.create_index(op.f("ix_user_settings_user_id"), "user_settings", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_table("user_settings")
    op.drop_table("goals")
    op.drop_table("session_notes")
    op.drop_table("mentor_reviews")
    op.drop_table("saved_mentors")
    op.drop_table("mentorship_requests")
    op.drop_table("mentor_profiles")
    op.drop_table("users")

    # Drop enum types (PostgreSQL only — SQLite ignores these)
    op.execute("DROP TYPE IF EXISTS verificationstatus")
    op.execute("DROP TYPE IF EXISTS requeststatus")
    op.execute("DROP TYPE IF EXISTS requesttype")

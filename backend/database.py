import os
import re
from typing import Any
from urllib.parse import quote_plus

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.pool import StaticPool


def sanitize_db_url(url: str) -> str:
    m = re.match(r"^(postgresql(?:\+[a-z0-9]+)?://)([^:]+):(.*)@([^@/:]+(?::\d+)?(?:/.*)?)$", url)
    if m:
        scheme, user, password, rest = m.groups()
        return f"{scheme}{user}:{quote_plus(password)}@{rest}"
    return url


DATABASE_URL = sanitize_db_url(os.getenv("DATABASE_URL", "sqlite:///./pathfind.db"))
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine_kwargs: dict[str, Any] = {"connect_args": connect_args}

if DATABASE_URL.startswith("sqlite:///:memory:"):
    engine_kwargs["poolclass"] = StaticPool

engine = create_engine(DATABASE_URL, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def init_db():
    Base.metadata.create_all(bind=engine)
    if DATABASE_URL.startswith("sqlite"):
        with engine.connect() as conn:
            for table_name, table in Base.metadata.tables.items():
                try:
                    res = conn.exec_driver_sql(f"PRAGMA table_info({table_name})").fetchall()
                    existing_cols = {row[1] for row in res}
                    if not existing_cols:
                        continue
                    for col in table.columns:
                        if col.name not in existing_cols:
                            col_type = col.type.compile(engine.dialect)
                            conn.exec_driver_sql(f"ALTER TABLE {table_name} ADD COLUMN {col.name} {col_type}")
                    conn.commit()
                except Exception:
                    pass

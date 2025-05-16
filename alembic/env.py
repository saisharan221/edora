import os
from logging.config import fileConfig

from sqlalchemy import create_engine, pool
from alembic import context
from sqlmodel import SQLModel

# this grabs your .env if you’ve loaded it already, or falls back to the default
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./data/app.db")

# but for migrations we use the sync SQLite driver
SYNC_URL = DATABASE_URL.replace("sqlite+aiosqlite", "sqlite")

# --- Alembic Config ---
config = context.config
config.set_main_option("sqlalchemy.url", SYNC_URL)
fileConfig(config.config_file_name)

# import your models so SQLModel.metadata is populated
from app.users.models import User
from app.resources.models import Resource

target_metadata = SQLModel.metadata

def run_migrations_offline():
    context.configure(
        url=SYNC_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = create_engine(SYNC_URL, poolclass=pool.NullPool)
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

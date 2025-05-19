from sqlmodel import SQLModel, Session, select
from app.db import engine, get_session
from app.users.models import User
import app.resources.models


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def create_test_user():
    with get_session() as session:
        statement = select(User).where(User.id == 1)
        existing = session.exec(statement).first()
        if not existing:
            user = User(id=1, email="test@example.com", points=100)
            session.add(user)
            session.commit()
            print(" Test user created")
        else:
            print(" Test user already exists")


if __name__ == "__main__":
    create_db_and_tables()
    create_test_user()

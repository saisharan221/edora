from sqlmodel import Session, create_engine

DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL, echo=True)


def get_session() -> Session:
    return Session(engine)

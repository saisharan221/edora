from fastapi import APIRouter
from sqlmodel import select
from app.db import get_session
from app.users.models import User

router = APIRouter()


@router.post("/upload")
def upload_resource(user_id: int):
    with get_session() as session:
        user = session.exec(select(User).where(User.id == user_id)).first()
        if user:
            user.points += 10  # Add 10 points per upload
            session.add(user)
            session.commit()
            return {"message": "Upload simulated, points updated"}
    return {"message": "User not found"}

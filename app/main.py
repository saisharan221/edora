from fastapi import FastAPI
from sqlmodel import select
from app.api.router import api_router
from app.db import get_session
from app.users import models as _user_models
from app.resources import models as _resource_models
from app.users.models import User

app = FastAPI()
app.include_router(api_router)


@app.get("/me/points")
def get_points(user_id: int):
    session = get_session()
    user = session.exec(select(User).where(User.id == user_id)).first()
    return {"points": user.points if user else 0}

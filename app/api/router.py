from fastapi import APIRouter
from app.api.resources import router as resources_router
from app.gamification.tasks import queue


api_router = APIRouter()
api_router.include_router(resources_router, prefix="/resources", tags=["resources"])

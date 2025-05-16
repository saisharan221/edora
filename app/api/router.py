from fastapi import APIRouter
from app.api.router import router as resources_router
# import any other routers…

api_router = APIRouter()
api_router.include_router(resources_router, prefix="/resources", tags=["resources"])
# e.g. api_router.include_router(users_router, prefix="/users", tags=["users"])



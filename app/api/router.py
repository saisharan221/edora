from fastapi import APIRouter
# import any other routers…
from . import upload

api_router = APIRouter()
# api_router.include_router(resources_router, prefix="/resources", tags=["resources"])
# e.g. api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(upload.router, tags=["upload"])

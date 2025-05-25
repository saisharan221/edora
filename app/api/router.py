from fastapi import APIRouter

# ─── Import your sub-routers here ─────────────────────────────────────────────
from app.api.auth import router as auth_router
from app.api.files import router as files_router
from app.api.channels import router as channels_router
from app.api.posts    import router as posts_router
from app.api.leaderboard import router as leaderboard_router
from app.api.comments import router as comments_router
# from app.api.resources import router as resources_router  # add when ready

# ─── Collect them into one router ─────────────────────────────────────────────
api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(files_router, prefix="/files")
api_router.include_router(channels_router)
api_router.include_router(posts_router)
api_router.include_router(leaderboard_router)
api_router.include_router(comments_router)
# api_router.include_router(resources_router, prefix="/resources")

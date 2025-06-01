from fastapi import APIRouter

# ─── Import your sub-routers here ──────────────────────────────────────────
from app.api.auth import router as auth_router
from app.api.files import router as files_router
from app.api.channels import router as channels_router
from app.api.posts import router as posts_router
from app.api.comments import router as comments_router
from app.api.reactions import router as reactions_router
from app.api.saved_posts import router as saved_posts_router
from app.api.flagged_words import router as flagged_words_router
from app.api.gamification import router as gamification_router
# from app.api.resources import router as resources_router  # add when ready

# ─── Collect them into one router ──────────────────────────────────────────
api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(files_router, prefix="/api/files")
api_router.include_router(channels_router)
api_router.include_router(posts_router)
api_router.include_router(comments_router)
api_router.include_router(reactions_router)
api_router.include_router(saved_posts_router)
api_router.include_router(flagged_words_router)
api_router.include_router(gamification_router)
# api_router.include_router(resources_router, prefix="/resources")

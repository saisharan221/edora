from fastapi import FastAPI
from app.api.router import api_router

app = FastAPI(title="Edora API")

# Mount your API under /api
app.include_router(api_router, prefix="/api")

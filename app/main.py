from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.db import init_db
from fastapi.staticfiles import StaticFiles



app = FastAPI(title="Edora API")

app.mount(
    "/files",
    StaticFiles(directory="uploads"),   # ← make sure this matches your UPLOAD_DIR
    name="files",
)

init_db()

# Allow all origins for development
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # allow all origins
    allow_credentials=True,
    allow_methods=["*"],          # GET, POST, OPTIONS, etc.
    allow_headers=["*"],
)

app.include_router(api_router)
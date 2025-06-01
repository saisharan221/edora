from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.db import init_db
from fastapi.staticfiles import StaticFiles


app = FastAPI(title="Edora API")

app.mount(
    "/files",
    StaticFiles(directory="uploads"),
    name="files",
)

init_db()

# Allow all origins for development (Docker and local)
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],          # GET, POST, OPTIONS, etc.
    allow_headers=["*"],
)

app.include_router(api_router)
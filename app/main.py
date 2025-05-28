from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.db import init_db
from fastapi.staticfiles import StaticFiles


app = FastAPI(title="Edora API")

app.mount(
    "/files",
    StaticFiles(directory="app/uploads"),   # Updated to match UPLOAD_DIR
    name="files",
)

init_db()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # you can use ["*"] during dev if easier
    allow_credentials=True,
    allow_methods=["*"],          # GET, POST, OPTIONS, etc.
    allow_headers=["*"],
)

app.include_router(api_router)
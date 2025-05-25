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

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
    "http://localhost:5176",
    "http://127.0.0.1:5176",
    "http://localhost:5177",
    "http://127.0.0.1:5177",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # you can use ["*"] during dev if easier
    allow_credentials=True,
    allow_methods=["*"],          # GET, POST, OPTIONS, etc.
    allow_headers=["*"],
)

app.include_router(api_router)
import os
from pathlib import Path
from uuid import uuid4
from typing import List
from fastapi.responses import FileResponse

from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, Form
from sqlmodel import Session

from app.database import engine
from app.models import MediaFile
from app.db import get_session
from app.models.media_file import MediaFile  
from app.api.auth import current_user, User  # reuse auth dependency

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

router = APIRouter()


def db() -> Session:
    with Session(engine) as session:
        yield session


@router.post("/upload", response_model=List[MediaFile])
async def upload_files(
    files: List[UploadFile] = File(...),
    post_id: int = Form(None),
    user: User = Depends(current_user),
    session: Session = Depends(db),
):
    saved: list[MediaFile] = []

    for up in files:
        ext = os.path.splitext(up.filename)[1] or ""
        folder = UPLOAD_DIR / str(uuid4())
        folder.mkdir(parents=True, exist_ok=True)

        dest = folder / (up.filename or "file" + ext)
        contents = await up.read()

        if len(contents) > 10 * 1024 * 1024:  # 10 MB
            raise HTTPException(400, "file too large (max 10 MB)")

        dest.write_bytes(contents)

        mf = MediaFile(
            filename=str(dest.relative_to(UPLOAD_DIR)),
            mime_type=up.content_type or "",
            size=len(contents),
            post_id=post_id,
        )
        session.add(mf)
        saved.append(mf)

    session.commit()
    for mf in saved:
        session.refresh(mf)  # get the DB id

    return saved

@router.get("/{file_id}")
def serve_file(file_id: int, session: Session = Depends(get_session)):
    mf = session.get(MediaFile, file_id)
    if not mf:
        raise HTTPException(404, "Not found")
    path = os.path.join(UPLOAD_DIR, mf.filename)
    return FileResponse(path, media_type=mf.mime_type)
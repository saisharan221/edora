# Import required classes and functions from FastAPI.
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
# Import Path from pathlib — used for working with file paths.
from pathlib import Path

router = APIRouter()

# This should match the same upload directory used in upload.py
UPLOAD_DIR = Path("data/uploads")


@router.get("/download/{filename}")
async def download_file(filename: str):
    """
    Serve a file for download from the uploads directory.
    """
    file_path = UPLOAD_DIR / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type='application/octet-stream'
    )

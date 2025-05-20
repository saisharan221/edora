# Import required classes and functions from FastAPI.
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
# Import Path from pathlib — used for working with file paths.
from pathlib import Path

# Create a router instance for grouping related routes.
router = APIRouter()

# Define the directory where uploaded files will be saved (relative path).
UPLOAD_DIR = Path("data/uploads")
# Create the uploads directory if it doesn't exist.
# parents=True allows creating parent folders (e.g. "data/").
# exist_ok=True prevents error if folder already exists.
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


# Define a POST endpoint at the path /upload
@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    title: str = Form(...),
    url: str = Form(...),
    desc: str = Form(...)
):
    """
    Upload a file and save it to the uploads folder.
    """
    try:
        # Construct the full file path to save the uploaded file
        file_path = UPLOAD_DIR / file.filename  # same as: Path("app/uploads/filename")

        # Open the file in write-binary mode ("wb") and save the content
        # Use "with" to automatically close the file after writing
        with open(file_path, "wb") as buffer:
            # Read the contents of the uploaded file (asynchronously)
            content = await file.read()

            # Write the contents to the new file on disk
            buffer.write(content)

        # Return a success response
        return {"filename": file.filename, "message": "File uploaded successfully!"}

    # If any error occurs (e.g. read/write failure), raise an HTTP 500 error
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import os
import shutil
from uuid import uuid4

from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

from app.deps import get_db
from app.db.models.file import File as FileModel
from app.routers.auth import get_current_user
from app.utils.logger import logger
from app.errors.app_errors import BadRequestError

router = APIRouter()

UPLOAD_DIR = "storage/uploads"
ALLOWED_EXTENSIONS = {"pdf", "mp3", "wav", "mp4"}

# Get file extension
def get_extension(filename: str) -> str:
    return filename.rsplit(".", 1)[-1].lower()

# Upload File
@router.post("/")
def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    ext = get_extension(file.filename)

    if ext not in ALLOWED_EXTENSIONS:
        raise BadRequestError("Unsupported file type")

    file_id = uuid4()
    stored_filename = f"{file_id}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, stored_filename)

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    logger.info(
        f"Uploading file {file.filename} for user {current_user.id}"
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    db_file = FileModel(
        id=file_id,
        user_id=current_user.id,
        filename=file.filename,
        file_type=ext,
    )

    db.add(db_file)
    db.commit()
    db.refresh(db_file)

    logger.info(f"File uploaded successfully: {db_file.id}")

    return {
        "file_id": str(db_file.id),
        "filename": db_file.filename,
        "file_type": db_file.file_type,
    }

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db import get_session
from app.models.flagged_word import FlaggedWord
from app.api.auth import current_user
from app.models.user import User
from pydantic import BaseModel

router = APIRouter(prefix="/flagged-words", tags=["flagged-words"])

# Dependency to check moderator/admin

def require_moderator(user: User = Depends(current_user)):
    if user.role not in ("moderator", "admin"):
        raise HTTPException(403, "Not authorized")
    return user

class FlaggedWordCreate(BaseModel):
    word: str

@router.get("/", response_model=list[FlaggedWord])
def list_flagged_words(session: Session = Depends(get_session), user: User = Depends(require_moderator)):
    return session.exec(select(FlaggedWord)).all()

@router.post("/", response_model=FlaggedWord)
def add_flagged_word(data: FlaggedWordCreate, session: Session = Depends(get_session), user: User = Depends(require_moderator)):
    word = data.word.strip().lower()
    if session.exec(select(FlaggedWord).where(FlaggedWord.word == word)).first():
        raise HTTPException(400, "Word already flagged")
    fw = FlaggedWord(word=word)
    session.add(fw)
    session.commit()
    session.refresh(fw)
    return fw

@router.delete("/{word}")
def delete_flagged_word(word: str, session: Session = Depends(get_session), user: User = Depends(require_moderator)):
    word = word.strip().lower()
    fw = session.exec(select(FlaggedWord).where(FlaggedWord.word == word)).first()
    if not fw:
        raise HTTPException(404, "Word not found")
    session.delete(fw)
    session.commit()
    return {"ok": True} 
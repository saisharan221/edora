from datetime import datetime, timedelta
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, select
from pydantic import BaseModel

from app.database import engine
from app.models import User, RefreshToken
from app.core.security import (
    verify_password,
    hash_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# ──────────────────────────────────── request models
class RegisterRequest(BaseModel):
    email: str
    password: str
    role: str = "user"  # allow role to be set for dev/admin


class RefreshRequest(BaseModel):
    refresh_token: str


class UpdateUsernameRequest(BaseModel):
    username: str


# ──────────────────────────────────── helpers
def db() -> Session:
    with Session(engine) as session:
        yield session


def get_user(user_id: int, session: Session) -> User:
    user = session.get(User, user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="inactive / unknown user")
    return user


async def current_user(token: str = Depends(oauth2_scheme),
                       session: Session = Depends(db)) -> User:
    try:
        payload = decode_token(token)
        uid = int(payload["sub"])
    except Exception:
        raise HTTPException(status_code=401, detail="invalid token")
    return get_user(uid, session)


# ──────────────────────────────────── routes
@router.post("/register")
def register(request: RegisterRequest, session: Session = Depends(db)):
    if session.exec(select(User).where(User.email == request.email)).first():
        raise HTTPException(400, "email already registered")
    user = User(
        email=request.email, 
        hashed_password=hash_password(request.password), 
        role=request.role
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return {"id": user.id, "email": user.email, "role": user.role}


@router.post("/login")
def login(
    form: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(db),
):
    user = session.exec(
        select(User).where(User.email == form.username)
    ).first()

    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="invalid credentials")

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    session.add(
        RefreshToken(
            id=str(uuid4()),
            user_id=user.id,
            expires_at=datetime.utcnow() + timedelta(days=7),
        )
    )
    session.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user_id": user.id,
    }


@router.post("/refresh")
def refresh(request: RefreshRequest, session: Session = Depends(db)):
    try:
        payload = decode_token(request.refresh_token)
        uid = int(payload["sub"])
    except Exception:
        raise HTTPException(401, "invalid refresh token")

    db_token = session.exec(
        select(RefreshToken).where(RefreshToken.user_id == uid,
                                   RefreshToken.revoked == False)  # noqa: E712
    ).first()
    if not db_token or db_token.expires_at < datetime.utcnow():
        raise HTTPException(401, "refresh token expired / revoked")

    return {"access_token": create_access_token(uid), "token_type": "bearer"}


@router.get("/me")
def me(user: User = Depends(current_user)):
    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "is_superuser": user.is_superuser,
        "role": user.role
    }


@router.put("/username")
def update_username(
    request: UpdateUsernameRequest,
    user: User = Depends(current_user),
    session: Session = Depends(db)
):
    """Update the current user's username."""
    if not request.username or len(request.username.strip()) == 0:
        raise HTTPException(400, "Username cannot be empty")
    
    if len(request.username.strip()) > 50:
        raise HTTPException(400, "Username too long (max 50 characters)")
    
    # Check if username is already taken by another user
    existing_user = session.exec(
        select(User).where(
            User.username == request.username.strip(),
            User.id != user.id
        )
    ).first()
    
    if existing_user:
        raise HTTPException(400, "Username already taken")
    
    user.username = request.username.strip()
    session.add(user)
    session.commit()
    session.refresh(user)
    
    return {
        "username": user.username, 
        "message": "Username updated successfully"
    }

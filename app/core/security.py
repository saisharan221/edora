import os
import datetime as dt
from jose import jwt, JWTError
from passlib.context import CryptContext

ALGORITHM      = "HS256"
ACCESS_TTL_MIN = 30
REFRESH_TTL_D  = 7
JWT_SECRET     = os.getenv("JWT_SECRET", "dev-secret-change-me")

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ──────────────────────────────────── password
def hash_password(plain: str) -> str:
    return pwd_ctx.hash(plain)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_ctx.verify(plain, hashed)


# ──────────────────────────────────── tokens
def _token(exp_delta: dt.timedelta, sub: str) -> str:
    now = dt.datetime.utcnow()
    payload = {"sub": sub, "iat": now, "exp": now + exp_delta}
    return jwt.encode(payload, JWT_SECRET, algorithm=ALGORITHM)

def create_access_token(user_id: int) -> str:
    return _token(dt.timedelta(minutes=ACCESS_TTL_MIN), str(user_id))

def create_refresh_token(user_id: int) -> str:
    return _token(dt.timedelta(days=REFRESH_TTL_D),  str(user_id))

def decode_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])

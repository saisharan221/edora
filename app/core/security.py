import os
import datetime as dt
import bcrypt
from jose import jwt, JWTError

ALGORITHM      = "HS256"
ACCESS_TTL_MIN = 30
REFRESH_TTL_D  = 7
JWT_SECRET     = os.getenv("JWT_SECRET", "dev-secret-change-me")

# ──────────────────────────────────── password
def hash_password(plain: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(plain.encode(), salt).decode()

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())

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

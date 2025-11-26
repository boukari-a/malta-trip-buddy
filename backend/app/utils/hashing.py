# app/utils/hashing.py
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

MAX_BCRYPT_BYTES = 72  # bcrypt only uses the first 72 bytes

def hash_password(password: str) -> str:
    # Truncate password to 72 bytes for safety
    safe_password = password[:MAX_BCRYPT_BYTES]
    return pwd_context.hash(safe_password)

def verify_password(password: str, hashed_password: str) -> bool:
    # Truncate password to 72 bytes for consistency
    safe_password = password[:MAX_BCRYPT_BYTES]
    return pwd_context.verify(safe_password, hashed_password)

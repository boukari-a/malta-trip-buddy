# app/utils/hashing.py
import bcrypt

MAX_BCRYPT_BYTES = 72  # bcrypt only uses the first 72 bytes

def hash_password(password: str) -> str:
    # Truncate password to 72 bytes for safety
    safe_password = password[:MAX_BCRYPT_BYTES]
    # Convert to bytes and hash
    password_bytes = safe_password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    # Truncate password to 72 bytes for consistency
    safe_password = password[:MAX_BCRYPT_BYTES]
    # Convert to bytes
    password_bytes = safe_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)

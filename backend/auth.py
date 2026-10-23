from passlib.context import CryptContext # type: ignore
from dotenv import load_dotenv
from datetime import datetime, timedelta
from jose import JWTError, jwt # type: ignore
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")  # why? because of the warning about bcrypt being deprecated, but it is not, so we use bycrypt instead

def hash_password(password: str):
    if len(password.encode("utf-8")) > 72:
        password = password[:72]
    return pwd_context.hash(password)
# this function takes a plain password as input and returns the hashed version of the password using the

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)
# this function takes a plain password and a hashed password as input and returns True if the plain password matches the hashed password, otherwise it returns False. The verify method is used to verify the password.

def create_access_token(data: dict, expires_delta: int = ACCESS_TOKEN_EXPIRE_MINUTES):
    to_endcode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_delta)
    to_endcode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_endcode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
# this function takes a dictionary of data and an optional expires_delta parameter which is the number of minutes until the token expires. It creates a copy of the data dictionary, adds an expiration time to it, and then encodes it using the jwt.encode method from the jose library. The encoded JWT is returned as a string.
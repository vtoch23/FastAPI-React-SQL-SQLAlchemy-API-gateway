from fastapi import Header, HTTPException, status, Depends
import os
from dotenv import load_dotenv


load_dotenv()


SECRET_KEY = os.getenv('API_KEY')

def verify_api_key(api_key: str = Header(..., alias="api-key")):
    if api_key != SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key"
        )

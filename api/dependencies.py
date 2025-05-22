from fastapi import Header, HTTPException, status, Depends

SECRET_KEY = "c8617422-ac1a-4b2c-b42d-5418553e20b7"

def verify_api_key(api_key: str = Header(..., alias="api-key")):
    if api_key != SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key"
        )

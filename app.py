from fastapi import FastAPI, HTTPException, Depends, Request, status, Form
from fastapi.responses import RedirectResponse
from typing import List, Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import insert
from schemas import NameData, NameOut
from database import get_db
from dotenv import load_dotenv
import os
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import logging
import uvicorn
import time
import models

load_dotenv()

app = FastAPI()
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
logger = logging.getLogger("uvicorn.error")

SECRET_KEY = os.getenv("API_KEY")

@app.get('/', response_model=List[NameOut], status_code=200)
@limiter.limit("5/minute")
async def get_names(request: Request, db: AsyncSession = Depends(get_db)):
    api_key = request.headers.get("api_key")
    if not api_key or api_key != SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key"
        )
    start = time.perf_counter()
    names = (
        select(
            models.Person.fid, 
            models.Person.first_name, 
            models.Person.last_name, 
            models.Person.age, 
            models.Person.address,
        )
        .offset(0)
        .limit(50)
    )
    result = await db.execute(names)
    return result.mappings().all()


@app.get('/get-name', response_model=List[NameOut], status_code=200)
@limiter.limit("5/minute")
async def get_name(request: Request, first_name: str, db: AsyncSession = Depends(get_db)):
    api_key = request.headers.get("api_key")
    if not api_key or api_key != SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key"
        )
    if first_name:
        start = time.perf_counter()
        names = (
            select(
                models.Person.fid, 
                models.Person.first_name, 
                models.Person.last_name, 
                models.Person.age, 
                models.Person.address,
            )
            .where((models.Person.first_name).like(first_name))
            .offset(0)
            .limit(10)
        )
        result = await db.execute(names)
        return result.mappings().all()


@app.post('/add-name', response_model=List[NameOut], status_code=200)
@limiter.limit("5/minute")
async def get_names(request: Request, person: Annotated[NameOut, Form()], db: AsyncSession = Depends(get_db)):
    api_key = request.headers.get("api_key")

    if not api_key or api_key != SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key"
        )
    if person:
        start = time.perf_counter()
        new_person = models.Person(first_name=person.first_name, last_name=person.last_name, age=person.age, address=person.address)
        logger.info(new_person)
        db.add(new_person)
        await db.commit()
        await db.refresh(new_person)
        # stmt = insert(models.Person).values(first_name=person.first_name, last_name=person.last_name, age=person.age, address=person.address)
        # await db.execute(stmt)
        duration = time.perf_counter() - start
        logger.info(f"DB Query TimeL {duration:.2f} seconds")
        return RedirectResponse(url=f"/", status_code=status.HTTP_303_SEE_OTHER)
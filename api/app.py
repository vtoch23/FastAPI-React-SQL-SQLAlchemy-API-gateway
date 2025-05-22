from fastapi import FastAPI, HTTPException, Depends, Request, status, Form, Header, Path
from fastapi.responses import RedirectResponse
from typing import List, Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import insert
from schemas import NameData, NameOut, MessageOut
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
from fastapi.middleware.cors import CORSMiddleware

origins = ["http://localhost:5173"]  # Vite default port



load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
logger = logging.getLogger("uvicorn.error")

SECRET_KEY = os.getenv("API_KEY")

def verify_api_key(api_key: str = Header(...)):
    if api_key != SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key"
        )


@app.get('/', response_model=List[NameOut], status_code=200)
@limiter.limit("5/minute")
async def get_names(request: Request,  db: AsyncSession = Depends(get_db), _ = Depends(verify_api_key)):
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
async def get_name(request: Request, first_name: str, _ = Depends(verify_api_key), db: AsyncSession = Depends(get_db)):
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


from schemas import NameData  # This is the input schema (not NameOut)

@app.post('/add-name',  status_code=200)
@limiter.limit("5/minute")
async def add_name(request: Request, person: NameData, _ = Depends(verify_api_key), db: AsyncSession = Depends(get_db)):
    new_person = models.Person(
        first_name=person.first_name,
        last_name=person.last_name,
        age=person.age,
        address=person.address
    )
    
    db.add(new_person)
    await db.commit()
    await db.refresh(new_person)
    
    return {"message": "Person added successfully"}


@app.delete("/delete-name/{fid}", response_model=MessageOut)
@limiter.limit("5/minute")
async def delete_name(
    request: Request,
    fid: int = Path(..., gt=0), 
    _ = Depends(verify_api_key),
    db: AsyncSession = Depends(get_db)
):
    person = await db.get(models.Person, fid)
    if not person:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Person not found"
        )

    await db.delete(person)
    await db.commit()

    return {"message": f"Person with id {fid} deleted successfully"}
import os
import asyncio
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

DATABASE_URL = (
    f"postgresql+asyncpg://{os.getenv("DB_USER")}:{os.getenv("DB_PASSWORD")}@"f"{os.getenv("DB_URL")}:5432/{os.getenv("DB_NAME")}"
)
engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True,
    pool_size=10,
    max_overflow=20
)
AsyncSession = sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)
async def get_db():
    async with AsyncSession() as session:
        yield session
        
Base = declarative_base()
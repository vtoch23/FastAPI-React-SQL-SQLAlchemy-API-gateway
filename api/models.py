from sqlalchemy import Column, String, BigInteger, Text, Integer
from database import Base
from dotenv import load_dotenv
import os

load_dotenv()

class Person(Base):
    __tablename__=os.getenv("TABLE_NAME")
    fid = Column(BigInteger, primary_key=True, index=True)
    first_name: str = Column(String)
    last_name: str = Column(String)
    age: int = Column(Integer)
    address: str = Column(String)

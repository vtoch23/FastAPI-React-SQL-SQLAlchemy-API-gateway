from pydantic import BaseModel, Field, ConfigDict

class NameDataBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    
    first_name: str = Field()
    last_name: str = Field()
    age: int = Field()
    address: str = Field()

class NameData(NameDataBase):
    class Config:
        orm_mode = True

class NameOut(NameDataBase):
    fid: int = Field()

class MessageOut(BaseModel):
    message: str
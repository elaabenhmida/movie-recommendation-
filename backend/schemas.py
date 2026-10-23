from pydantic import BaseModel, EmailStr
from datetime import date
from typing import List, Optional

class UserCreate(BaseModel): # this class is used to create a new user in the database and it inherits from BaseModel which is a class from the pydantic library that provides data validation and parsing.
    email: EmailStr
    password: str

class UserLogin(BaseModel): # this class is used to login a user and it also inherits from BaseModel.
    email: EmailStr
    password: str

class UserResponse(BaseModel): # this class is used to return a user response and it also inherits from BaseModel.
    id: int
    email: EmailStr
    quiz_completed: bool

    model_config = {
        "from_attributes": True
    }

class GenreSchema(BaseModel):
    name: str

    model_config = {
        "from_attributes": True
    }

class MovieSchema(BaseModel):
    id: int
    title: Optional[str]
    tagline: Optional[str]
    overview: Optional[str]
    poster_path: Optional[str]
    backdrop_path: Optional[str]
    release_date: Optional[date]
    runtime: Optional[int]
    vote_average: Optional[float]
    genres: List[GenreSchema] = []

    model_config = {
        "from_attributes": True
    }

class QuizSubmit(BaseModel):
    genres: List[str]
    movie_ids: List[int]

class MovieAction(BaseModel):
    movie_id: int
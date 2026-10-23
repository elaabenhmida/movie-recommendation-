from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from database import get_db
from typing import List
from schemas import MovieSchema
from models import Movie, Genre
from datetime import date, timedelta
from sqlalchemy import func, cast, Date
from recommender import get_recommendation
from routers.users import get_current_user
from models import User

router = APIRouter()


@router.get("/movies/new-releases", response_model=List[MovieSchema]) # why? To define a route for getting a list of new releases movies. The route is defined using the GET method and the response_model parameter is set to List[MovieSchema].
def get_new_releases(db:Session = Depends(get_db)): # why? To retrieve the new releases movies from the database.
    cutoff = date.today() - timedelta(days=90) # why? To calculate the date 90 days ago from today.
    return (
        db.query(Movie)
        .options(joinedload(Movie.genres))
        .filter(cast(Movie.release_date, Date) >= cutoff)
        .order_by(Movie.release_date.desc())
        .limit(2)
        .all()
    ) # why? To retrieve the new releases movies from the database and order them by release date in descending order.

@router.get("/movies", response_model=List[MovieSchema])
def get_movies(db: Session = Depends(get_db), genre: str = None, search: str = None):
    query = db.query(Movie).options(joinedload(Movie.genres))  # why? To eager load the genres associated with each movie.

    if genre and genre.lower() != "all": # why? To check if the genre parameter is provided and not "all".
        query = query.join(Genre).filter(Genre.name.ilike(genre)) # why? To join the Genre table and filter the movies by genre.

    if search: # why? To check if the search parameter is provided.
        query = query.filter(Movie.title.ilike(f"%{search}%")) # why? To filter the movies by search term in the title.

    return query.all()

@router.get("/movies/{movie_id}") # why? To define a route for getting a specific movie by its ID. The route is defined using the GET method and the movie_id parameter is included in the route path.
def get_movie(movie_id: int, db: Session = Depends(get_db)):
    return (
        db.query(Movie)
        .options(
            joinedload(Movie.genres),
            joinedload(Movie.cast_members),
            joinedload(Movie.crew_members),
        ) # why? To eager load the genres, cast members, and crew members associated with the movie.
        .filter(Movie.id == movie_id) # why? To filter the movie by its ID.
        .first() # why? To retrieve the first result from the query.
    )

@router.get("/recommendation", response_model=List[MovieSchema])
def recommendation(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_recommendation(user_id=current_user.id, db=db)
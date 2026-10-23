from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, Date, Boolean
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users" # why? To specify the name of the database table that this model will represent. In this case, the User model will correspond to a table named "users" in the database.

    id = Column(Integer, primary_key=True, index=True) # why? To define a column named "id" in the "users" table that will store integer values. This column is set as the primary key, which means it will uniquely identify each record in the table. The index=True parameter creates an index on this column, which can improve query performance when filtering or sorting by the "id" field.
    email = Column(String, unique=True, index=True, nullable=False) # why? To define a column named "email" in the "users" table that will store string values. The unique=True parameter ensures that each email must be unique across all records in the table, preventing duplicate entries. The index=True parameter creates an index on this column, which can improve query performance when filtering or sorting by the "email" field. The nullable=False parameter indicates that this column cannot be left empty, ensuring that every user must have an email address.
    quiz_completed = Column(Boolean, default=False)
    hashed_password = Column(String, nullable=False) # why? To define a column named "hashed_password" in the "users" table that will store string values. The nullable=False parameter indicates that this column cannot be left empty, ensuring that every user must have a hashed password stored in the database for authentication purposes.

class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    tagline = Column(Text)
    overview = Column(Text)
    poster_path = Column(String)
    backdrop_path = Column(String)
    release_date = Column(Date)
    runtime = Column(Integer)
    vote_average = Column(Float)

    genres = relationship("Genre", back_populates="movie") # why? To establish a relationship between the Movie model and the Genre model, allowing us to retrieve genres associated with each movie from the database.
    cast_members = relationship("CastMember", back_populates="movie") # why? To establish a relationship between the Movie model and the CastMember model, allowing us to retrieve cast members associated with each movie from the database.
    crew_members = relationship("CrewMember", back_populates="movie")

class Genre(Base):
    __tablename__ = "genres"

    id = Column(Integer, primary_key=True)
    movie_id = Column(Integer, ForeignKey("movies.id"))
    name = Column(String)

    movie = relationship("Movie", back_populates="genres")

class CastMember(Base):
    __tablename__ = "cast_members"

    id = Column(Integer, primary_key=True)
    movie_id = Column(Integer, ForeignKey("movies.id"))
    actor_name = Column(String)
    character_name = Column(String)

    movie = relationship("Movie", back_populates="cast_members")

class CrewMember(Base):
    __tablename__ = "crew_members"

    id = Column(Integer, primary_key=True)
    movie_id = Column(Integer, ForeignKey("movies.id"))
    job = Column(String)
    name = Column(String)

    movie = relationship("Movie", back_populates="crew_members")

class UserGenre(Base):
    __tablename__ = "user_genres"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    genre_id = Column(String)

class UserFavouriteMovie(Base):
    __tablename__ = "user_favourite_movies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    movie_id = Column(Integer, ForeignKey("movies.id"))


class Watchlist(Base):
    __tablename__ = "watchlist"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    movie_id = Column(Integer, ForeignKey("movies.id"))

class WatchedMovie(Base):
    __tablename__ = "watched_movies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    movie_id = Column(Integer, ForeignKey("movies.id"))
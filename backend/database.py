import os
from sqlalchemy import create_engine # pyright: ignore[reportMissingImports]
from sqlalchemy.orm import sessionmaker, declarative_base # pyright: ignore[reportMissingImports]
from dotenv import load_dotenv

load_dotenv() # why? To load environment variables from the .env file into the system's environment variables, allowing us to access them using os.getenv().

DATABASE_URL = os.getenv("DATABASE_URL") # why? To retrieve the value of the DATABASE_URL environment variable, which contains the connection string for the PostgreSQL database. This allows us to connect to the database using SQLAlchemy without hardcoding sensitive information in the code.

engine = create_engine(DATABASE_URL, client_encoding="utf8") # why? To create a SQLAlchemy engine that will manage the connection to the PostgreSQL database specified by the DATABASE_URL. The engine is responsible for establishing connections, executing SQL statements, and managing transactions.

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
) # why? To create a session factory that will generate new database sessions when called. The parameters autocommit=False and autoflush=False ensure that changes to the database are not automatically committed or flushed, giving us more control over when changes are saved to the database. The bind=engine parameter associates the session with the previously created engine, allowing it to connect to the correct database.

Base = declarative_base() # why? To create a base class for our SQLAlchemy models. This base class will be used to define our database tables and their relationships. By inheriting from this base class, we can easily create new models that represent our database schema and interact with the database using SQLAlchemy's ORM features.

def get_db():
    db = SessionLocal() # why? To create a new database session using the SessionLocal factory. This session will be used to interact with the database, allowing us to execute queries and perform CRUD operations.
    try:
        yield db # why? To provide the database session to the caller of the get_db function. The yield statement allows us to return the session to the caller while keeping the function's state intact, allowing us to perform cleanup actions (like closing the session) after the caller is done using it.
    finally:
        db.close() # why? To ensure that the database session is properly closed after it has been used. This is important to free up resources and prevent potential memory leaks or connection issues in the application. By placing the db.close() call in the finally block, we guarantee that it will be executed regardless of whether an exception occurred during the use of the session.
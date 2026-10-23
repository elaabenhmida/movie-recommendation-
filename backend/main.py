from fastapi import FastAPI
from routers import users
from routers import movies
from database import engine
from fastapi.middleware.cors import CORSMiddleware
import models

app = FastAPI() # why? To create a FastAPI application.

models.Base.metadata.create_all(bind=engine) # why? To create the database tables based on the defined models. The create_all method checks the metadata of the models and creates the corresponding tables in the database if they do not already exist. This ensures that the database schema is set up correctly before any operations are performed on it.

app.include_router(users.router) # why? To include the users router in the main application. This allows the application to handle requests to the routes defined in the users router.
app.include_router(movies.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://192.168.1.120:3000"],  # Adjust this to your frontend's URL
    allow_credentials=True, # why? To allow cookies and authentication headers to be included in cross-origin requests.
    allow_methods=["*"], # why? To allow all HTTP methods (GET, POST, PUT, DELETE, etc.) in cross-origin requests.
    allow_headers=["*"], # why? To allow all headers in cross-origin requests.
)

@app.get("/") # why? To define a route for the root URL ("/") of the application. This decorator indicates that when a GET request is made to the root URL, the following function will be executed.
def root():
    return {"message": "Backend is running"} # why? To return a JSON response with a message when the root URL is accessed. This serves as a simple endpoint to verify that the application is running correctly.

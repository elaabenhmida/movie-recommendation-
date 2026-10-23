from fastapi import APIRouter, Depends, HTTPException 
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from auth import SECRET_KEY, ALGORITHM
from sqlalchemy.orm import Session 
from database import get_db
import models, schemas, auth

router = APIRouter(prefix="/users", tags=["Users"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id") # this line gets the user_id from the payload of the token.
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(models.User).filter(models.User.id == user_id).first() # this line queries the User model to find a user with the provided user_id. It returns the first result or None if no user is found.
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

#Signup route
@router.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first() # this line checks if a user with the same email already exists in the database by querying the User model and filtering by the email field. If a user is found, it returns the first result.
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered") # if a user with the same email is found, it raises an HTTPException with a status code of 400 and a detail message indicating that the email is already registered.
    hashed_password = auth.hash_password(user.password) # this line hashes the user's password using the hash_password function from the auth module.
    new_user = models.User(email=user.email, hashed_password=hashed_password) # this line creates a new User object using the User model and the data from the user parameter, including the hashed password.
    db.add(new_user) # this line adds the new user to the database session.
    db.commit() # this line commits the transaction to save the new user in the database.
    db.refresh(new_user) # this line refreshes the new_user object to get the updated data from the database, including the generated id.

    token = auth.create_access_token({"user_id": new_user.id}) # this line creates an access token using the create_access_token function from the auth module, passing a dictionary with the user_id as the payload.
    return {"access_token": token, "token_type": "bearer"} # this line returns a dictionary containing the access token and the token type, which is set to "bearer".

#Login route
@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first() # this line queries the User model to find a user with the provided email. It returns the first result or None if no user is found.
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password): # this line checks if a user was found and if the provided password matches the hashed password stored in the database using the verify_password function from the auth module.
        raise HTTPException(status_code=401, detail="Invalid email or password") # if the user is not found or the password does not match, it raises an HTTPException with a status code of 401 and a detail message indicating that the email or password is invalid.
    
    token = auth.create_access_token({"user_id": db_user.id}) # this line creates an access token using the create_access_token function from the auth module, passing a dictionary with the user_id as the payload.
    return {"access_token": token, "token_type": "bearer"} # this line returns a dictionary containing the access token and the token type, which is set to "bearer".

@router.get("/me", response_model=schemas.UserResponse) # this line defines a route for getting the current user's information. The route is defined using the GET method and the response_model parameter is set to UserResponse.
def get_me(current_user: models.User = Depends(get_current_user)): # this line defines a function that takes a current_user parameter, which is a User object returned from the get_current_user function using the Depends decorator.
    return current_user # this line returns the current_user object

@router.post("/quiz")
def submit_quiz(quiz: schemas.QuizSubmit, current_user: models.User = Depends(get_current_user), db:Session = Depends(get_db)):
    for genre in quiz.genres:
        db.add(models.UserGenre(user_id=current_user.id, genre_id=genre)) # this line adds the genre to the user's genres in the database using the UserGenre model.
    
    for movie_id in quiz.movie_ids:
        db.add(models.UserFavouriteMovie(user_id=current_user.id, movie_id=movie_id)) # this line adds the movie to the user's favourite movies in the database using the UserFavouriteMovie model.
    
    current_user.quiz_completed = True # this line sets the quiz_completed attribute of the current user to True.
    db.commit() # this line commits the transaction to save the changes to the database.
    return {"message": "Quiz submitted successfully"}

@router.post("/watchlist")
def add_to_watchlist(data: schemas.MovieAction, current_user: models.User = Depends(get_current_user), db:Session = Depends(get_db)):
    existing = db.query(models.Watchlist).filter(
        models.Watchlist.user_id == current_user.id,
        models.Watchlist.movie_id == data.movie_id
    ).first()

    if existing:
        db.delete(existing)
    else:
        db.add(models.Watchlist(user_id=current_user.id, movie_id=data.movie_id))
    
    db.commit()
    return {"message": "Watchlist updated successfully"}

@router.post("/watched")
def mark_as_watched(data: schemas.MovieAction, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(models.WatchedMovie).filter(
        models.WatchedMovie.user_id == current_user.id,
        models.WatchedMovie.movie_id == data.movie_id
    ).first()

    if existing:
        db.delete(existing)
    else:
        db.add(models.WatchedMovie(user_id=current_user.id, movie_id=data.movie_id))
    
    db.commit()
    return {"message": "Watched status updated successfully"}
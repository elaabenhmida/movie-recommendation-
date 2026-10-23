import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy.orm import Session
from models import Movie, Genre, UserGenre, UserFavouriteMovie, Watchlist, WatchedMovie

def build_movie_corpus(db:Session):
    movies = db.query(Movie).all() # why? To retrieve all movies from the database.

    corpus = [] # why? To create an empty list to store the movie corpus.
    movie_ids = [] # why? To create an empty list to store the movie IDs.

    for movie in movies:
        # combine genres + overview into one text string
        genres_text = " ".join([g.name for g in movie.genres]) if movie.genres else "" # why? To get the genres of the movie and join them into a single string. If the movie has no genres, an empty string is used.
        overview_text = movie.overview or "" # why? To get the overview of the movie. If the movie has no overview, an empty string is used.
        combined = f"{genres_text} {genres_text} {overview_text}" # why? To combine the genres and overview into a single string. and genres twice = more weight.
        corpus.append(combined) # why? To append the combined string to the corpus list.
        movie_ids.append(movie.id) # why? To append the movie ID to the movie_ids list.

    return movie_ids, corpus # why? To return the movie_ids and corpus lists.

def get_recommendation(user_id: int, db: Session, top_n: int = 10): # why? To define a function to get recommendations for a user. The function takes the user_id as input and returns a list of recommended movie IDs.
    # step 1 - get all movies user interacted with
    fav_movies = db.query(UserFavouriteMovie).filter(UserFavouriteMovie.user_id == user_id).all() # why? To retrieve all favourite movies for the user from the database.
    wacthlist = db.query(Watchlist).filter(Watchlist.user_id == user_id).all() # why? To retrieve all watchlist movies for the user from the database.
    watched = db.query(WatchedMovie).filter(WatchedMovie.user_id == user_id).all() # why? To retrieve all watched movies for the user from the database.

    # combine all movie ids the user interacted with
    user_movie_ids = set(
        [f.movie_id for f in fav_movies] + 
        [w.movie_id for w in wacthlist] + 
        [w.movie_id for w in watched]
    ) # why? To combine all movie IDs the user has interacted with into a set.

    # get user genres from quiz
    user_genres = db.query(UserGenre).filter(UserGenre.user_id == user_id).all() # why? To retrieve all genres for the user from the database.
    user_genres_text = " ".join([g.genre_id for g in user_genres]) * 3 # why? To get the genres of the user and join them into a single string. The genres are repeated 3 times to give more weight.
    
    if not user_movie_ids and not user_genres_text:
        # new user with no data - return top rated
        return db.query(Movie).order_by(Movie.vote_average.desc()).limit(top_n).all() # why? To retrieve the top-rated movies from the database.
    
    # step 2 - build corpus for all movies
    movie_ids, corpus = build_movie_corpus(db) # why? To build the movie corpus. The movie_ids and corpus lists are returned from the build_movie_corpus function.

    # step 3 - add user profile as a document
    user_profile_movies = db.query(Movie).filter(Movie.id.in_(user_movie_ids)).all() # why? To retrieve all movies the user has interacted with from the database.
    user_text = user_genres_text
    for movie in user_profile_movies:
        genres_text = " ".join([g.name for g in movie.genres]) if movie.genres else "" # why? To get the genres of the movie and join them into a single string. If the movie has no genres, an empty string is used.
        user_text += f"{genres_text} {movie.overview or ''}" # why? To combine the genres and overview of the movie into a single string. If the movie has no overview, an empty string is used.

    # step 4 - vectorize everything
    vectorizer = TfidfVectorizer(stop_words="english") # why? To create a TF-IDF vectorizer. The stop_words parameter is set to "english" to remove common English words from the corpus.
    all_texts = corpus + [user_text] # why? To combine the corpus and user profile into a single list.
    tfidf_matrix = vectorizer.fit_transform(all_texts) # why? To vectorize the corpus and user profile using the TF-IDF vectorizer.

    #step 5 - cosine similarity between user and all movies
    user_vector = tfidf_matrix[-1] # why? To get the vector representation of the user profile. last one is the user profile.
    movie_vectors = tfidf_matrix[:-1] # why? To get the vector representations of all movies. last one is the user profile.
    similarities = cosine_similarity(user_vector, movie_vectors).flatten() # why? To calculate the cosine similarity between the user profile and all movies. flatten() returns a 1D array.

    # step 6 - sort by similarity and filter already seen movies
    scored = sorted(zip(movie_ids, similarities), key=lambda x: x[1], reverse=True) # why? To sort the movies by similarity score in descending order.

    recommended_ids = [
        mid for mid, score in scored
        if mid not in user_movie_ids
        # why? To filter out movies that the user has already interacted with.
    ][:top_n] # why? To limit the number of recommended movies to the top_n.

    # step 7 - fetch and returns the actual movie objects
    movies = db.query(Movie).filter(Movie.id.in_(recommended_ids)).all() # why? To retrieve the recommended movies from the database.

    # sort them in the same order as recommended_ids    
    movies_dict = {m.id: m for m in movies} # why? To create a dictionary mapping movie IDs to movie objects.
    return [movies_dict[mid] for mid in recommended_ids if mid in movies_dict] # why? To return the recommended movies in the same order as recommended_ids.

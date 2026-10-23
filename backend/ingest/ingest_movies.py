import os
import requests
import psycopg2
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("TMDB_API_KEY")
BASE_URL = "https://api.themoviedb.org/3"

conn = psycopg2.connect(
    dbname="movie_ai",
    user="postgres",
    password="180302pascal",
    host="localhost",
    port="5432"
)

cur = conn.cursor()

def fetch_popular(page):
    url = f"{BASE_URL}/movie/popular?api_key={API_KEY}&language=en-US&page={page}"
    return requests.get(url).json()["results"]

def fetch_details(movie_id):
    url = f"{BASE_URL}/movie/{movie_id}?api_key={API_KEY}"
    return requests.get(url).json()

def fetch_credits(movie_id):
    url = f"{BASE_URL}/movie/{movie_id}/credits?api_key={API_KEY}"
    return requests.get(url).json()

for page in range(1, 6):  # ~100 movies
    movies = fetch_popular(page)

    for movie in movies:
        movie_id = movie["id"]

        details = fetch_details(movie_id)
        credits = fetch_credits(movie_id)

        release_date = None
        if details.get("release_date"):
            try:
                release_date = datetime.strptime(details["release_date"], "%Y-%m-%d")
            except:
                release_date = None

        cur.execute("""
            INSERT INTO movies (id, title, tagline, overview, poster_path,
                                backdrop_path, release_date, runtime, vote_average)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO NOTHING
        """, (
            details["id"],
            details.get("title"),
            details.get("tagline"),
            details.get("overview"),
            details.get("poster_path"),
            details.get("backdrop_path"),
            release_date,
            details.get("runtime"),
            details.get("vote_average")
        ))

        for genre in details.get("genres", []):
            cur.execute("""
                INSERT INTO genres (movie_id, name)
                VALUES (%s, %s)
            """, (movie_id, genre["name"]))

        for actor in credits.get("cast", [])[:5]:
            cur.execute("""
                INSERT INTO cast_members (movie_id, actor_name, character_name)
                VALUES (%s, %s, %s)
            """, (movie_id, actor["name"], actor["character"]))

        for member in credits.get("crew", []):
            if member["job"] == "Director":
                cur.execute("""
                    INSERT INTO crew_members (movie_id, job, name)
                    VALUES (%s, %s, %s)
                """, (movie_id, "Director", member["name"]))

conn.commit()

print("Movies inserted successfully.")
cur.close()
conn.close()
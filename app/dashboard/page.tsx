"use client";

import CategoryFilter from "./components/CategoryFilter";
import HeroSection from "./components/HeroSection";
import NavBar from "./components/NavBar";
import MovieSection from "./components/MovieSection";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [movies, setmovies] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("Recommended");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (activeCategory === "Recommended") {
      const token = localStorage.getItem("token");
      fetch("http://localhost:8000/recommendation", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const transformed = data.map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            rating: movie.vote_average,
            releaseYear: movie.release_date
              ? new Date(movie.release_date).getFullYear().toString()
              : "N/A",
            genres: movie.genres?.length ? movie.genres[0].name : "Unknown",
          }));

          setmovies(transformed);
        });
    } else {
      const genreParam =
        activeCategory === "all" ? "" : `?genre=${activeCategory}`;
      fetch(`http://localhost:8000/movies${genreParam}`)
        .then((res) => res.json())
        .then((data) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const transofrmed = data.map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            rating: movie.vote_average,
            releaseYear: movie.release_date
              ? new Date(movie.release_date).getFullYear().toString()
              : "N/A",
            genres: movie.genres?.length ? movie.genres[0].name : "Unknown",
          }));

          setmovies(transofrmed);
        });
    }
  }, [activeCategory]);

  const filteredMovies =
    activeCategory === "all" || activeCategory === "Recommended"
      ? movies
      : movies.filter((movies) => movies.genres === activeCategory);

  return (
    <div className="min-h-screen bg-linear-to-tr from-slate-200 via-blue-50 to-slate-200 relative overflow-x-hidden">
      <div className="fixed -top-20 -left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed top-40 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-400 mx-auto px-4 sm:px-6 md:px-8 py-6">
        <NavBar />
        <HeroSection />
        <CategoryFilter
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        <MovieSection
          title={`The Best of ${activeCategory === "all" ? "All" : activeCategory} Movies`}
          description="Based on your selection"
          movies={filteredMovies}
        />
      </div>
    </div>
  );
};

export default Page;

"use client";

import gsap from "gsap";
import { Play } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Movie {
  id: number;
  title: string;
  tagline: string;
  poster_path: string;
  release_date: string;
}

const HeroSection = () => {
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);

  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/movies/new-releases")
      .then((res) => res.json())
      .then((data) => setMovies(data.slice(0, 2)));
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".hero-card");

      const tl = gsap.timeline({
        delay: 0.6, // after navbar animation
      });

      tl.from(cards, {
        y: 40,
        opacity: 0,
        scale: 0.98,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      }).from(
        ".hero-content > *", // select all direct children of hero-content
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.6",
      );
    }, containerRef);

    return () => ctx.revert();
  }, [movies]);

  const handleClick = (movie: Movie) => {
    router.push(`/dashboard/movie/${movie.id}`);
  };

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 pt-28"
    >
      {movies.slice(0, 2).map((movie) => (
        <div
          key={movie.id}
          className="hero-card relative h-70 sm:h-80 rounded-3xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            fill
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          />

          <div
            className={`absolute inset-0 bg-linear-to-r from-slate-900/80 to-transparent opacity-90`}
          />

          <div className="hero-content absolute inset-0 p-8 flex flex-col justify-center items-start text-white">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-medium mb-3 border border-white/10">
              New Release
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-2 max-w-md">
              {movie.title}
            </h2>
            <p className="text-white/80 text-sm sm:text-base mb-6 font-medium">
              {movie.tagline}
            </p>

            <button
              onClick={() => handleClick(movie)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 rounded-full transition-[padding,background-color] duration-300 group-hover:pl-6"
            >
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-slate-900">
                <Play size={10} fill="currentColor" />
              </div>
              <span className="text-sm font-semibold">Play Movie</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroSection;

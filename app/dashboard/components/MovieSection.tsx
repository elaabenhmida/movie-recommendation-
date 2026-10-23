"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import Image from "next/image";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

type Movie = {
  id: number;
  title: string;
  poster: string;
  rating: number;
  releaseYear: string;
  genres: string;
};

type Props = {
  title: string;
  description: string;
  movies: Movie[];
};

const MovieSection = ({ title, description, movies }: Props) => {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const cards = gsap.utils.toArray(".movie-card");
    const title = sectionRef.current?.querySelector(".movie-title");
    const desc = sectionRef.current?.querySelector(".movie-desc");

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const tl = gsap.timeline({ delay: 1.2 });

      tl.from([title, desc], {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        ease: "power3.out",
        duration: 0.8,
      }).from(
        cards,
        {
          y: 40,
          opacity: 0,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.4",
      );
    });

    mm.add("(max-width: 1023px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });

      tl.from([title, desc], {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
      }).from(
        cards,
        {
          y: 60,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.3",
      );
    });

    return () => {
      mm.revert();
    };
  }, []);

  const handleCardClick = (movie: Movie) => {
    router.push(`/dashboard/movie/${movie.id}`);
  };

  return (
    <section ref={sectionRef} className="overflow-hidden">
      <div className="flex items-center justify-between mb-6 px-1">
        <div>
          <h2 className="movie-title text-2xl font-bold text-slate-800">
            {title}
          </h2>
          <p className="movie-desc text-slate-500 text-sm mt-1">
            {description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-8">
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => handleCardClick(movie)}
            className="movie-card group relative shrink-0 w-full cursor-pointer"
          >
            <div className="relative aspect-3/4 rounded-3xl overflow-hidden mb-4 shadow-lg group-hover:shadow-2xl transition-all duration-300">
              <Image
                src={movie.poster}
                alt={movie.title}
                fill
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-white/90 border border-white/10">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold">{movie.rating}</span>
              </div>
            </div>

            <div className="px-1">
              <h3 className="text-slate-800 font-bold text-lg leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                {movie.title}
              </h3>
              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                <span>{movie.releaseYear}</span>
                <span className="w-4 h-1 bg-slate-400 rounded-full" />
                <span>{movie.genres}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MovieSection;

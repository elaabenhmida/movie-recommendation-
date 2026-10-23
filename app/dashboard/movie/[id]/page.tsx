"use client";

import {
  ArrowLeft,
  BookmarkMinus,
  BookmarkPlus,
  Eye,
  EyeOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { notFound, useParams, useRouter } from "next/navigation";

import gsap from "gsap";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

interface Movie {
  id: number;
  title: string;
  tagline: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  genres: { name: string }[];
  cast_members: { actor_name: string; character_name: string }[];
  crew_members: { job: string; name: string }[];
}

const Page = () => {
  const router = useRouter();
  const { id } = useParams();

  const heroRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [watchList, setWatchList] = useState(false);
  const [watched, setWatched] = useState(false);

  const handleWatchList = async () => {
    if (!movie) return;

    const token = localStorage.getItem("token");
    await fetch("http://localhost:8000/users/watchlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ movie_id: movie.id }),
    });

    setWatchList((prev) => !prev);
  };

  const handleWatched = async () => {
    if (!movie) return;

    const token = localStorage.getItem("token");
    await fetch("http://localhost:8000/users/watched", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ movie_id: movie.id }),
    });

    setWatched((prev) => !prev);
  };

  useEffect(() => {
    fetch(`http://localhost:8000/movies/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMovie(data);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!movie) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(backRef.current, {
        y: -40,
        opacity: 0,
        duration: 0.8,
        ease: "power4.out",
        delay: 0.5,
      })
        .from(
          ".hero-image",
          {
            scale: 1.2,
            duration: 1.6,
            ease: "power4.out",
          },
          "-=1.2",
        )
        .from(
          ".hero-overlay",
          {
            opacity: 0,
            duration: 1,
          },
          "-=1.2",
        )
        .from(
          ".hero-content > *",
          {
            y: 60,
            opacity: 0,
            stagger: 0.2,
            duration: 1,
            ease: "power4.out",
          },
          "-=0.8",
        );

      gsap.to(".hero-image", {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          scrub: true,
        },
        y: 100,
      });

      gsap.from(metaRef.current, {
        scrollTrigger: {
          trigger: metaRef.current,
          start: "top 85%",
        },
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      });

      gsap.from(".content-card", {
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 85%",
        },
        y: 80,
        opacity: 0,
        stagger: 0.25,
        duration: 1,
        ease: "power4.out",
      });
    });

    return () => ctx.revert();
  }, [movie]);

  const handleClick = () => {
    router.back();
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-400">
        Loading...
      </div>
    );
  if (!movie) return notFound();

  const director =
    movie.crew_members.find((c) => c.job === "Director")?.name ?? "N/A";

  return (
    <div className="min-h-screen bg-slate-100">
      <section
        ref={heroRef}
        className="relative h-[85vh] w-full overflow-hidden"
      >
        <button
          ref={backRef}
          onClick={handleClick}
          onMouseEnter={() => {
            gsap.to(backRef.current, {
              scale: 1.05,
              duration: 0.2,
            });
          }}
          onMouseLeave={() => {
            gsap.to(backRef.current, {
              scale: 1,
              duration: 0.2,
            });
          }}
          className="fixed top-8 left-8 z-20 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full shadow-xl hover:bg-white/20 transition-colors duration-300 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden md:block text-sm font-medium">Back</span>
        </button>

        <div className="hero-image absolute inset-0">
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="hero-overlay absolute inset-0 bg-black/50" />

        <div className="absolute bottom-0 left-0 w-full h-full bg-linear-to-b from-transparent via-transparent to-slate-100" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col justify-center text-white">
          <div className="hero-content bg-white/10 backdrop-blur-sm p-8 rounded-2xl max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              {movie.title}
            </h1>

            <p className="max-w-xl text-white/80 mb-8 leading-relaxed">
              {movie.tagline}
            </p>

            <div className="flex items-center gap-4 mt-10">
              <button
                onClick={handleWatchList}
                className={`gap-2 transition-all duration-300 px-6 py-3 rounded-full font-medium text-sm md:text-base ${
                  watchList
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-white text-black hover:bg-white/90"
                }`}
              >
                {!watchList ? (
                  <span className="flex items-center gap-2">
                    <BookmarkPlus className="w-4 h-4" />
                    Add to Watchlist
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <BookmarkMinus className="w-4 h-4" />
                    Remove from Watchlist
                  </span>
                )}
              </button>

              <button
                onClick={handleWatched}
                className={`flex items-center gap-2 border border-white/50 px-6 py-3 rounded-full font-medium transition-all duration-300 text-sm md:text-base ${
                  watched
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {!watched ? (
                  <span className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Mark as Watched
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <EyeOff className="w-4 h-4" />
                    Mark as Unwatched
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto -mt-10 px-6">
        <div
          ref={metaRef}
          className="bg-white/70 border border-white/40 backdrop-blur-xl rounded-3xl shadow-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs md:text-sm text-slate-700"
        >
          <div>
            <p className="text-slate-400">Release Date</p>
            <p className="font-semibold">{movie.release_date}</p>
          </div>

          <div>
            <p className="text-slate-400">Duration</p>
            <p className="font-semibold">{movie.runtime} minutes</p>
          </div>

          <div>
            <p className="text-slate-400">Genre</p>
            <p className="font-semibold">
              {movie.genres.map((g) => g.name).join(", ")}
            </p>
          </div>

          <div>
            <p className="text-slate-400">IMDB Rating</p>
            <p className="font-semibold">{movie.vote_average}/10</p>
          </div>
        </div>
      </div>

      <div
        ref={contentRef}
        className="max-w-6xl mx-auto px-6 mt-14 grid md:grid-cols-[1fr_1.3fr] gap-10 text-sm md:text-base"
      >
        <div className="content-card bg-white h-fit rounded-3xl shadow-xl p-6">
          <h2 className="text-xl mb-6 text-slate-400">Cast & Crew</h2>

          <div className="space-y-4">
            {movie.cast_members.map((actor, index) => (
              <div
                key={index}
                className="flex justify-between border-b border-slate-200 pb-3"
              >
                <span className="font-semibold">{actor.actor_name}</span>
                <span className="text-slate-500 text-sm">
                  {actor.character_name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="content-card bg-white rounded-3xl h-fit shadow-xl p-6">
          <h2 className="text-xl mb-6 text-slate-400">Synopsis</h2>

          <p className="text-xs md:text-sm leading-relaxed">{movie.overview}</p>

          <p className="text-slate-700 mt-4">Directed by: {director}</p>
        </div>
      </div>

      <div className="h-12" />
    </div>
  );
};

export default Page;

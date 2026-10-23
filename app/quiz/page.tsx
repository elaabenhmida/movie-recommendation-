"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Drama,
  Film,
  Flame,
  Ghost,
  Heart,
  Laugh,
  Rocket,
  Search,
  Star,
  Swords,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import gsap from "gsap";
import { useRouter } from "next/navigation";

const GERNRES = [
  { name: "Action", icon: Swords },
  { name: "Romance", icon: Heart },
  { name: "Animation", icon: Film },
  { name: "Horror", icon: Ghost },
  { name: "Drama", icon: Drama },
  { name: "Comedy", icon: Laugh },
  { name: "Science Fiction", icon: Rocket },
  { name: "Thriller", icon: Flame },
  { name: "Special", icon: Star },
];

const STEPS = ["genres", "movies"] as const; // why? because we want to know which step we are on so we can render the correct component
type Step = (typeof STEPS)[number]; // this line is a type guard that checks if the step is in the STEPS array

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  genres: { name: string }[];
}

const Page = () => {
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<Step>("genres");
  const [loading, setLoading] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<number[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");

  const toggleGenre = (name: string) => {
    setSelectedGenres((prev) =>
      prev.includes(name) ? prev.filter((g) => g !== name) : [...prev, name],
    );
  };

  const toggleMovie = (id: number) => {
    setSelectedMovies((prev) =>
      prev.includes(id)
        ? prev.filter((m) => m !== id)
        : prev.length < 5
          ? [...prev, id]
          : prev,
    );
  };

  const goToMovie = () => {
    if (selectedGenres.length === 0) return;

    setLoading(true);

    const genre = selectedGenres[0];
    fetch(`http://localhost:8000/movies?genre=${genre}`)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
        setLoading(false);
        animateStepChange(() => setStep("movies"));
      });
  };

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(search),
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: "power4.out",
      });

      gsap.from(".quiz-title", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
      });

      gsap.from(".genre-card", {
        y: 20,
        opacity: 0,
        stagger: 0.06,
        duration: 0.5,
        delay: 0.4,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const animateStepChange = (cb: () => void) => {
    gsap.to(cardRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => {
        cb();
        gsap.fromTo(
          cardRef.current,
          {
            y: 40,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
          },
        );

        gsap.from(".movie-card", {
          y: 20,
          opacity: 0,
          stagger: 0.05,
          duration: 0.4,
          delay: 0.1,
          ease: "power2.out",
        });
      },
    });
  };

  const handleFinish = async () => {
    if (selectedMovies.length < 3) return;
    const token = localStorage.getItem("token");

    await fetch("http://localhost:8000/users/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        genres: selectedGenres,
        movie_ids: selectedMovies,
      }),
    });

    router.push("/dashboard");
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-linear-to-tr from-slate-200 via-blue-50 to slate-200 flex items-center justify-center px-4 py-12 relative overflow-hidden"
    >
      <div className="fixed -top-20 -left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="fixed top-6 left-8 z-50">
        <span className="text-2xl font-bold bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">
          Flix.
        </span>
      </div>

      <div
        ref={cardRef}
        className="w-full max-w-3xl bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl shadow-slate-200/60 p-8 md:p-12"
      >
        <div className="flex items-center gap-3 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step === s
                    ? "bg-slate-900 text-white scale-110"
                    : STEPS.indexOf(step) > i // explain this line : this line is checking if the step is greater than the current index of the step
                      ? "bg-slate-900/20 text-slate-400"
                      : "bg-white/60 text-slate-400 border border-slate-200"
                }`}
              >
                {i + 1}
              </div>

              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-12 rounded-full transition-all duration-500 ${
                    STEPS.indexOf(step) > i ? "bg-slate-900/40" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* STEP 1 : GENRES */}
        {step === "genres" && (
          <>
            <div className="quiz-title mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight mb-2">
                What do you love watching ?
              </h1>
              <p className="text-slate-500 text-sm md:text-base">
                Pick your favourite genres — choose as many as you like.
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 mb-10">
              {GERNRES.map(({ name, icon: Icon }) => {
                const selected = selectedGenres.includes(name);
                return (
                  <button
                    key={name}
                    onClick={() => toggleGenre(name)}
                    className={`genre-card group relative flex flex-col items-center justify-center gap-2 py-5 rounded-2xl border transition-colors duration-300 cursor-pointer ${
                      selected
                        ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20 scale-[1.03]"
                        : "bg-white/60 border-white/60 text-alte-600 hover:bg-white hover:border-slate-200 hover:scale-[1.02]"
                    }`}
                  >
                    <Icon
                      size={22}
                      className={selected ? "text-white" : "text-slate-500"}
                    />
                    <span className="text-xs font-semibold tracking-wide">
                      {name}
                    </span>
                    {selected && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-400" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={goToMovie}
              disabled={selectedGenres.length === 0 || loading}
              className="w-full py-4 rounded-2xl bg-slate-900 text-white font-semibold text-sm tracking-wide hover:bg-slate-800 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-slate-900/20"
            >
              {loading ? (
                "Loading..."
              ) : (
                <>
                  Continue ({selectedGenres.length} selected)
                  <ArrowRight size={16} className="inline-block ml-2" />
                </>
              )}
            </button>
          </>
        )}

        {step === "movies" && (
          <>
            <div className="quiz-title mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight mb-2">
                Pick movies you already watched
              </h1>
              <p className="text-slate-500 text-sm md:text-base">
                Choose at least 3 and up to 5 movies.{" "}
                <span>{selectedMovies.length}/5 selected</span>
              </p>
            </div>

            <div className="relative mb-6">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search movies..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/60 border border-white/60 text-slate-700 text-sm outline-none focus:bg-white focus:border-slate-300"
              />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-8 max-h-72 overflow-y-auto pr-1">
              {filteredMovies.map((movie) => {
                const selected = selectedMovies.includes(movie.id);
                return (
                  <button
                    key={movie.id}
                    onClick={() => toggleMovie(movie.id)}
                    className={`movie-card relative rounded-xl overflow-hidden aspect-2/3 transition-all duration-300 cursor-pointer ${
                      selected
                        ? "ring-3 ring-slate-900 scale-[1.04] shadow-xl"
                        : "hover:scale-[1.03] opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                    {selected && (
                      <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                          <span className="text-slate-900 text-xs font-bold">
                            <Check size={16} />
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-2">
                      <p className="text-white text-[9px] font-medium leading-tight line-clamp-2">
                        {movie.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => animateStepChange(() => setStep("genres"))}
                className="px-6 py-4 flex items-center gap-2 rounded-2xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-white transition-all duration-300"
              >
                <span>
                  <ArrowLeft size={14} />
                </span>{" "}
                Back
              </button>
              <button
                onClick={handleFinish}
                disabled={selectedMovies.length < 3}
                className="flex-1 py-4 rounded-2xl bg-slate-900 text-white font-semibold text-sm tracking-wide hover:bg-slate-800 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
              >
                {selectedMovies.length < 3 ? (
                  `Select ${3 - selectedMovies.length} more to continue`
                ) : (
                  <>
                    Let&apos;s go
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;

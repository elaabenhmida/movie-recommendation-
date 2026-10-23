"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import gsap from "gsap";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
};

const NavBar = () => {
  const router = useRouter();

  const navRef = useRef<HTMLElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [userName, setUserName] = useState("Guest");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8000/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUserName(data.email.split("@")[0]))
      .catch(() => setUserName("Guest"));
  }, []);

  const toggleDesktopSearch = () => {
    if (!desktopSearchRef.current) return;

    if (!desktopOpen) {
      gsap.to(desktopSearchRef.current, {
        width: 220,
        duration: 0.4,
        ease: "power3.out",
        onComplete: () => desktopInputRef.current?.focus(),
      });
    } else {
      gsap.to(desktopSearchRef.current, {
        width: 40,
        duration: 0.3,
        ease: "power3.inOut",
      });
      setSearchQuery("");
      setResults([]);
    }

    setDesktopOpen(!desktopOpen);
  };

  const toggleMobileSearch = () => {
    if (!mobileSearchRef.current) return;

    if (!mobileOpen) {
      gsap.to(mobileSearchRef.current, {
        width: 180,
        duration: 0.4,
        ease: "power3.out",
        onComplete: () => mobileInputRef.current?.focus(),
      });
    } else {
      gsap.to(mobileSearchRef.current, {
        width: 40,
        duration: 0.3,
        ease: "power3.inOut",
      });
      setSearchQuery("");
      setResults([]);
    }

    setMobileOpen(!mobileOpen);
  };

  const handleCardClick = (movie: Movie) => {
    router.push(`/dashboard/movie/${movie.id}`);
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      return;
    }

    const fetchMovies = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/movies?search=${searchQuery}`,
        );

        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error(err);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchMovies();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    if (!navRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(navRef.current, {
        scaleX: 0,
        opacity: 0,
        transformOrigin: "center center",
      });

      const tl = gsap.timeline();

      tl.to(navRef.current, {
        scaleX: 1,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      }).from(
        Array.from(navRef.current?.children || []),
        {
          y: -10,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.4",
      );
    }, navRef);

    return () => ctx.revert();
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-7xl flex items-center justify-between px-6 py-4 mb-8 bg-white/40 backdrop-blur-xl border border-white/30 rounded-full shadow-sm z-50"
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">
          Flix.
        </span>
      </div>

      <div className="hidden md:flex items-center bg-slate-900/80 backdrop-blur-md rounded-full px-3 py-2 gap-1 shadow-inner">
        {["Movies", "Series"].map((item, index) => (
          <button
            key={item}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              index === 0
                ? "bg-white/10 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {item}
          </button>
        ))}

        <div className="relative">
          <div
            ref={desktopSearchRef}
            className="flex items-center bg-white/10 rounded-full overflow-hidden"
            style={{ width: 40 }}
          >
            <button
              onClick={toggleDesktopSearch}
              className="p-2 text-slate-400 hover:text-white"
            >
              <Search size={18} />
            </button>

            <input
              ref={desktopInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search..."
              className={`bg-transparent text-white text-sm outline-none transition-opacity duration-300 ${
                desktopOpen ? "opacity-100 ml-2 w-full pr-3" : "opacity-0 w-0"
              }`}
            />
          </div>

          {results.length > 0 && desktopOpen && (
            <div className="absolute top-14 left-0 w-72 bg-slate-200 border-white/10 rounded-2xl shadow-2xl p-3 space-y-2">
              {results.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleCardClick(movie)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    width={40}
                    height={60}
                    className="rounded-md object-cover"
                  />
                  <span className="text-slate-800 text-sm font-medium">
                    {movie.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="md:hidden items-center bg-slate-900/80 backdrop-blur-md rounded-full px-3 py-2 gap-1 shadow-inner">
        <div className="relative">
          <div
            ref={mobileSearchRef}
            className="flex items-center bg-white/10 rounded-full overflow-hidden"
            style={{ width: 40 }}
          >
            <button
              onClick={toggleMobileSearch}
              className="p-2 text-slate-400 hover:text-white"
            >
              <Search size={18} />
            </button>

            <input
              ref={mobileInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search..."
              className={`bg-transparent text-white text-sm outline-none transition-opacity duration-300 ${
                mobileOpen ? "opacity-100 ml-2 w-full pr-3" : "opacity-0 w-0"
              }`}
            />
          </div>

          {results.length > 0 && mobileOpen && (
            <div className="absolute top-16 -right-7.5 w-72 bg-slate-200 border-white/10 rounded-2xl shadow-2xl p-3 space-y-2">
              {results.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleCardClick(movie)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    width={40}
                    height={60}
                    className="rounded-md object-cover"
                  />
                  <span className="text-slate-800 text-sm font-medium">
                    {movie.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-none">
              {userName}
            </p>
          </div>
          <div className="relative group cursor-pointer">
            <Image
              src="/posters/Spiderman.jpg"
              alt="Profile"
              width={0}
              height={0}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

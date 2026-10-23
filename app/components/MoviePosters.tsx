import { posters } from "@/data/mockData";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const MoviePosters = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const posterRefs = useRef<HTMLDivElement[]>([]);
  const [startPoster, setStartPoster] = useState<string[]>([]);

  // const visiblePosters = [
  //   posters[startIndex % posters.length],
  //   posters[(startIndex + 1) % posters.length],
  //   posters[(startIndex + 2) % posters.length],
  // ];

  useEffect(() => {
    const shuffled = [...posters].sort(() => Math.random() - 0.5).slice(0, 3);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStartPoster(shuffled);
  }, []);

  useEffect(() => {
    if (startPoster.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        posterRefs.current,
        { opacity: 0, scale: 0.8, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        },
      );

      posterRefs.current.forEach((poster, index) => {
        gsap.to(poster, {
          y: -10 - index * 5,
          duration: 3 + index,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [startPoster]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-87.5 md:h-112.5 flex items-center justify-center perspective-1000"
    >
      {startPoster.map((poster, index) => (
        <div
          key={index}
          ref={(el) => {
            if (el) posterRefs.current[index] = el;
          }}
          style={{
            backgroundImage: `url(${poster})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className={`
            absolute rounded-xl shadow-2xl overflow-hidden transform-gpu
            ${
              index === 0
                ? "w-40 h-60 md:w-48 md:h-72 -translate-x-16 translate-y-6 -rotate-12 opacity-80 brightness-75 blur-[1px] z-10"
                : index === 1
                  ? "w-44 h-64 md:w-52 md:h-80 -translate-x-8 translate-y-4 -rotate-6 opacity-90 z-20"
                  : "w-48 h-72 md:w-56 md:h-84 translate-x-0 -translate-y-2 -rotate-3 opacity-100 z-30 border border-white/20"
            }
          `}
        />
      ))}

      <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent pointer-events-none" />
    </div>
  );
};

export default MoviePosters;

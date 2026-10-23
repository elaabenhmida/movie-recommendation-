"use client";

import { categories } from "@/data/mockData";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
};

const CategoryFilter = ({ activeCategory, setActiveCategory }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context((self) => {
      const buttons = self.selector!(".filter-btn"); // Select buttons with a specific class

      const isDesktop = window.innerWidth >= 1024;

      gsap.set(buttons, { y: -10, opacity: 0 });

      if (isDesktop) {
        gsap.to(buttons, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          delay: 1.2,
        });
      } else {
        gsap.to(buttons, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleClick = (el?: HTMLElement) => {
    if (el) {
      gsap.fromTo(
        el,
        { scale: 0.95 },
        { scale: 1, duration: 0.3, ease: "power2.out" },
      );
    }
  };

  return (
    <div
      ref={containerRef}
      className="mb-10 overflow-x-auto pb-4 scrollbar-hide px-2 lg:px-28"
    >
      <div className="flex items-center justify-between gap-4 min-w-max px-1">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = category.label === activeCategory;

          return (
            <button
              key={category.id}
              onClick={(e) => {
                setActiveCategory(category.label);
                handleClick(e.currentTarget);
              }}
              className={`filter-btn cursor-pointer flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-medium transition-colors duration-300 
                ${
                  isActive
                    ? "bg-white/60 backdrop-blur-xl shadow-md text-slate-800 scale-105 ring-1 ring-white/50"
                    : "bg-white/20 backdrop-blur-sm text-slate-600 hover:bg-white/40 hover:text-slate-900"
                }
                `}
            >
              <Icon
                size={16}
                className={isActive ? "text-slate-800" : "text-slate-500"}
              />
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;

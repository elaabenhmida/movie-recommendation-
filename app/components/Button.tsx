"use client";

import { ButtonProps } from "@/data/mockData";
import gsap from "gsap";
import { useEffect, useRef } from "react";

const Button = ({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) => {
  const baseStyle =
    "px-8 py-3 rounded-full font-medium transition-colors duration-300 relative overflow-hidden";
  const variants = {
    primary:
      "bg-[#2e3b55] text-white hover:bg-[#3d4c6b] hover:shadow-lg shadow-md",
    outline:
      "bg-transparent border border-[#2e3b55] text-[#2e3b55] hover:bg-[#2e3b55]/10",
  };

  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const hoverCtx = gsap.context(() => {
      btn.addEventListener("mouseenter", () => {
        gsap.to(btn, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    }, btn);

    return () => hoverCtx.revert();
  }, []);
  return (
    <button
      ref={buttonRef}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

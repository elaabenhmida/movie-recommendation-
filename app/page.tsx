"use client";

import { useEffect, useRef, useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

import Button from "./components/Button";
import MoviePosters from "./components/MoviePosters";
import gsap from "gsap";

const Page = () => {
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email.includes("@") || !email.includes(".")) {
      newErrors.email = "Enter a valid email address";
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (authMode === "signup" && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0 && formRef.current) {
      gsap.fromTo(
        formRef.current,
        { x: -10 },
        { x: 10, duration: 0.1, repeat: 3, yoyo: true },
      );
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:8000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return;

      const data = await res.json();

      localStorage.setItem("token", data.access_token);

      const meRes = await fetch("http://localhost:8000/users/me", {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });

      const me = await meRes.json();

      if (me.quiz_completed) {
        router.push("/dashboard");
      } else {
        router.push("/quiz");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:8000/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.log("Error:", error);
        return;
      }

      const data = await res.json();

      localStorage.setItem("token", data.access_token);

      router.push("/quiz");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!authMode || !modalRef.current) return;

    gsap.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.8, y: 40 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power3.out" },
    );
  }, [authMode]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.from(".hero-title", { y: 80, opacity: 0, duration: 1.2 })
        .from(".hero-text", { y: 40, opacity: 0, duration: 1 }, "-=0.8")
        .from(
          ".hero-btn",
          { y: 30, opacity: 0, duration: 0.8, stagger: 0.15 },
          "-=0.6",
        );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      gsap.utils.toArray(".bg-orb").forEach((orb: any, i) => {
        gsap.to(orb, {
          x: 60 + i * 20,
          y: 40 + i * 15,
          duration: 18 + i * 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="min-h-screen w-full relative flex flex-col md:flex-row overflow-hidden bg-[#eef2f6]"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-br from-[#e0e7ff] via-[#f3e8ff] to-[#eef2f6]" />

          <div className="bg-orb absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[#6366f1] opacity-20 rounded-full blur-[120px]" />
          <div className="bg-orb absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-[#a855f7] opacity-20 rounded-full blur-[120px]" />
          <div className="bg-orb absolute top-[30%] left-[40%] w-[40vw] h-[40vw] bg-[#ec4899] opacity-15 rounded-full blur-[100px]" />

          <div className="absolute inset-0 bg-white/40 backdrop-blur-[60px]" />
        </div>

        <main className="relative z-10 w-full min-h-screen flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-0">
          <div className="flex-1 w-full md:pr-12 flex flex-col justify-center items-start order-2 md:order-1 pt-10 md:pt-0">
            <div className="max-w-2xl">
              <h1 className="hero-title font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#1e293b] leading-[1.05] mb-8">
                Discover Movies Made For You
              </h1>
              <p className="hero-text text-xl md:text-2xl text-[#475569] mb-12 leading-relaxed max-w-lg font-normal tracking-wide">
                Personalized recommendations powered by artificial intelligence.
              </p>
              <div className="flex flex-row gap-6 font-display">
                <Button
                  variant="primary"
                  className="hero-btn text-lg shadow-2xl shadow-indigo-500/20 font-bold tracking-wide cursor-pointer"
                  onClick={() => setAuthMode("login")}
                >
                  Log In
                </Button>
                <Button
                  variant="outline"
                  className="hero-btn text-lg border-2 font-bold tracking-wide cursor-pointer"
                  onClick={() => setAuthMode("signup")}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full h-[40vh] md:h-screen flex items-center justify-center md:justify-end order-1 md:order-2 perspective-1000">
            <div className="scale-125 md:scale-150 transform-gpu md:mr-10">
              <MoviePosters />
            </div>
          </div>
        </main>

        {authMode && (
          <div
            ref={modalRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-md px-4"
          >
            <div className="relative w-[92%] sm:w-[85%] max-w-md rounded-[36px] px-8 py-10 bg-white/20 backdrop-blur-3xl border border-white/40 shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
              <div className="absolute inset-0 rounded-[36px] bg-linear-to-br from-[#ffffff60] via-[#f5f5f520] to-[#00000010] pointer-events-none" />

              <button
                onClick={() => setAuthMode(null)}
                className="absolute top-6 right-6 text-[#2c2c2c]/50 hover:text-[#2c2c2c] transition"
              >
                <X size={20} />
              </button>

              <div className="relative z-10">
                <h2 className="text-3xl font-semibold mb-8 text-[#2c2c2c] tracking-tight">
                  {authMode === "login"
                    ? "Log into your account"
                    : "Create your account"}
                </h2>

                <form
                  ref={formRef}
                  onSubmit={authMode === "login" ? handleLogin : handleSignin}
                  className="flex flex-col gap-7"
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-[#2c2c2c]/60">
                      {authMode === "login" ? "Username / Email" : "Email"}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`bg-transparent border-b py-2 outline-none transition focus:scale-[1.02] ${
                        errors.email
                          ? "border-red-500"
                          : "border-[#2c2c2c]/30 focus:border-[#2c2c2c]"
                      }`}
                    />
                    {errors.email && (
                      <span className="text-xs text-red-500">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-[#2c2c2c]/60">
                      Password
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full bg-transparent border-b py-2 pr-10 outline-none transition focus:scale-[1.02] ${
                          errors.password
                            ? "border-red-500"
                            : "border-[#2c2c2c]/30 focus:border-[#2c2c2c]"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-[#2c2c2c]/60"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    {errors.password && (
                      <span className="text-xs text-red-500">
                        {errors.password}
                      </span>
                    )}
                  </div>

                  {authMode === "signup" && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-[#2c2c2c]/60">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`w-full bg-transparent border-b py-2 pr-10 outline-none transition ${
                            errors.confirmPassword
                              ? "border-red-500"
                              : "border-[#2c2c2c]/30 focus:border-[#2c2c2c]"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((p) => !p)}
                          className="absolute right-0 top-1/2 -translate-y-1/2 text-[#2c2c2c]/60"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <span className="text-xs text-red-500">
                          {errors.confirmPassword}
                        </span>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="mt-6 bg-[#1f2937] text-white py-3 rounded-full font-medium hover:bg-black transition-all duration-300 shadow-md cursor-pointer"
                  >
                    {authMode === "login" ? "Log In" : "Sign Up"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Page;

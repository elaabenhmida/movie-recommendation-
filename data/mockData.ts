import { Film, Ghost, Heart, Laugh, Smile, Sparkles, Zap } from "lucide-react";

export const posters = [
  "/posters/CARS3.jpg",
  "/posters/Oppenheimer.jpg",
  "/posters/Spiderman.jpg",
];

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
  children: React.ReactNode;
}

export const categories = [
  { id: "recommended", label: "Recommended", icon: Sparkles },
  { id: "action", label: "Action", icon: Zap },
  { id: "romance", label: "Romance", icon: Heart },
  { id: "animation", label: "Animation", icon: Film },
  { id: "horror", label: "Horror", icon: Ghost },
  { id: "comedy", label: "Comedy", icon: Laugh },
  { id: "drama", label: "Drama", icon: Smile },
];

import { Link } from "react-router-dom";

interface LogoProps {
  withMark?: boolean;
  light?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ light = false, className = "", size = "md" }: LogoProps) {
  const iconDimensions = size === "sm" ? "h-6 w-6" : size === "lg" ? "h-10 w-10" : "h-8 w-8";
  const textClasses = size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl";

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2.5 font-display font-extrabold tracking-tight ${
        light ? "text-white" : "text-ink"
      } ${className}`}
    >
      <img
        src="/logo.png"
        alt="Pathfind Logo"
        className={`${iconDimensions} rounded-lg object-contain shadow-sm ring-1 ring-black/5`}
      />
      <span className={textClasses}>Pathfind</span>
    </Link>
  );
}

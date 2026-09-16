import { Link } from "react-router-dom";

interface LogoProps {
  withMark?: boolean;
  light?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ light = false, className = "", size = "md" }: LogoProps) {
  const iconDimensions = size === "sm" ? "h-7 w-7" : size === "lg" ? "h-11 w-11" : "h-9 w-9";
  const textClasses = size === "sm" ? "text-xl" : size === "lg" ? "text-3xl" : "text-2xl";

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-3 font-display font-black tracking-tight transition-transform hover:scale-[1.02] ${className}`}
    >
      <div className="relative flex shrink-0 items-center justify-center">
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 opacity-30 blur-sm" />
        <img
          src="/logo.png"
          alt="Pathfind Logo"
          className={`${iconDimensions} relative rounded-xl bg-slate-950 object-contain p-0.5 shadow-md ring-2 ${
            light ? "ring-white/20" : "ring-slate-900/10"
          }`}
        />
      </div>
      <span
        className={`${textClasses} font-black tracking-tight ${
          light
            ? "text-white drop-shadow-sm"
            : "bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 bg-clip-text text-transparent"
        }`}
      >
        Pathfind
      </span>
    </Link>
  );
}

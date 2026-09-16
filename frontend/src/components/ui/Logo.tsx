import { Link } from "react-router-dom";

interface LogoProps {
  withMark?: boolean;
  light?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ light = false, className = "", size = "md" }: LogoProps) {
  const heightClasses =
    size === "sm"
      ? "h-10 sm:h-11"
      : size === "lg"
      ? "h-16 sm:h-20"
      : "h-12 sm:h-14 lg:h-16";

  const logoSrc = light ? "/assets/logo-white.png" : "/assets/logo-black.png";

  return (
    <Link
      to="/"
      className={`inline-flex items-center transition-all hover:opacity-95 ${className}`}
    >
      <img
        src={logoSrc}
        alt="PathFind - Guidance. Mentorship. Success"
        className={`${heightClasses} w-auto object-contain shrink-0`}
      />
    </Link>
  );
}

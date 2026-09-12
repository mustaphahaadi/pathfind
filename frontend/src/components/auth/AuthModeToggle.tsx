import { Link } from "react-router-dom";

interface AuthModeToggleProps {
  active: "sign-in" | "sign-up";
}

const AuthModeToggle = ({ active }: AuthModeToggleProps) => {
  return (
    <div
      className="inline-flex rounded-full bg-surface p-1"
      role="tablist"
      aria-label="Sign in or sign up"
    >
      <Link
        to="/auth"
        role="tab"
        aria-selected={active === "sign-in"}
        className={`rounded-full px-6 py-2 text-sm font-semibold transition-colors ${
          active === "sign-in"
            ? "bg-white text-ink shadow-sm"
            : "text-surface-muted hover:text-ink"
        }`}
      >
        Sign In
      </Link>
      <Link
        to="/join"
        role="tab"
        aria-selected={active === "sign-up"}
        className={`rounded-full px-6 py-2 text-sm font-semibold transition-colors ${
          active === "sign-up"
            ? "bg-white text-ink shadow-sm"
            : "text-surface-muted hover:text-ink"
        }`}
      >
        Sign Up
      </Link>
    </div>
  );
};

export default AuthModeToggle;

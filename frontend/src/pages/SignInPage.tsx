import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { api } from "../lib/api";
import { useAuthStore } from "../store/useAuthStore";

const SignInPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      const token = await api.auth.signIn({ email, password });
      const user = await api.auth.me();
      setAuth(token.access_token, user);

      if (user.role === "mentor") {
        navigate("/mentor-dashboard");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-md text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-green/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-accent-green">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
          JOIN PATHFIND &middot; 100% FREE MENTORSHIP
        </span>

        <h1 className="mt-5 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          Welcome back
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink/60">
          Sign in to manage your sessions, mentors, and mentee progress.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-md rounded-3xl border border-surface-line bg-white p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-ink">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="mt-1.5 w-full rounded-xl border border-surface-line px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Your password"
              className="mt-1.5 w-full rounded-xl border border-surface-line px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Signing in…" : "Sign In"}
            <ArrowRight size={16} />
          </button>

          <p className="text-center text-sm text-surface-muted">
            New to Pathfind?{" "}
            <Link
              to="/join"
              className="font-medium text-ink underline underline-offset-2"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default SignInPage;

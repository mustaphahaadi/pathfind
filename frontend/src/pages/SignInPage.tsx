import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AuthModeToggle from "../components/auth/AuthModeToggle";
import GoogleIcon from "../components/icons/GoogleIcon";
import GitHubIcon from "../components/icons/GitHubIcon";

/** Rendered inside AuthLayout's <Outlet />, which supplies the header/footer shell. */
const SignInPage = () => {
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

        <div className="mt-7 flex justify-center">
          <AuthModeToggle active="sign-in" />
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-md rounded-3xl border border-surface-line bg-white p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-surface-line py-3 text-sm font-medium text-ink transition-colors hover:bg-surface"
          >
            <GoogleIcon size={18} />
            Continue with Google
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-surface-line py-3 text-sm font-medium text-ink transition-colors hover:bg-surface"
          >
            <GitHubIcon size={18} />
            Continue with GitHub
          </button>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-surface-line" />
          <span className="text-xs font-medium tracking-wide text-surface-muted">
            OR WITH EMAIL
          </span>
          <div className="h-px flex-1 bg-surface-line" />
        </div>

        <form className="flex flex-col gap-5">
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

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Sign In
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

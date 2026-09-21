import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { RoleOption } from "../../types/auth";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { useMentorOnboardingStore } from "../../store/useMentorOnboardingStore";
import GoogleIcon from "../icons/GoogleIcon";
import GitHubIcon from "../icons/GitHubIcon";

interface SignUpFormProps {
  role: RoleOption;
}

const roleShortLabel: Record<RoleOption["id"], string> = {
  mentee: "Mentee",
  mentor: "Mentor",
};

const SignUpForm = ({ role }: SignUpFormProps) => {
  const [agreed, setAgreed] = useState(true);
  const navigate = useNavigate();
  const setFullName = useOnboardingStore((state) => state.setFullName);
  const setEmail = useOnboardingStore((state) => state.setEmail);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (role.id === "mentee") {
      if (fullName) setFullName(fullName);
      if (email) setEmail(email);
      navigate("/onboarding/mentee/about-you");
    } else {
      const mentorStore = useMentorOnboardingStore.getState();
      mentorStore.reset();
      if (fullName) mentorStore.setFullName(fullName);
      if (email) mentorStore.setWorkEmail(email);
      if (password) mentorStore.setPassword(password);
      navigate("/onboarding/mentor/identity-verification");
    }
  };

  return (
    <div className="rounded-3xl border border-surface-line bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-3 border-b border-surface-line pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink">
            Get started in under 2 minutes
          </h2>
          <p className="mt-1 text-sm text-ink/60">
            Free account. No credit card, no paywalls ever.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-ink">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-blue" />
          Creating account as: {roleShortLabel[role.id]}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label htmlFor="fullName" className="text-sm font-medium text-ink">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            placeholder="Jane Doe"
            className="mt-1.5 w-full rounded-xl border border-surface-line px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
          />
        </div>

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
          <div className="flex items-baseline justify-between">
            <label htmlFor="password" className="text-sm font-medium text-ink">
              Password
            </label>
            <span className="text-xs text-surface-muted">Min. 8 characters</span>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="Create a strong password"
            className="mt-1.5 w-full rounded-xl border border-surface-line px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
          />
          <p className="mt-1.5 text-xs text-surface-muted">
            Must include at least 1 number and 8 characters.
          </p>
        </div>

        <label className="flex items-start gap-2.5 text-sm text-ink/75">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-surface-line accent-ink"
          />
          <span>
            I agree to Pathfind&apos;s{" "}
            <Link to="/terms" className="underline underline-offset-2 hover:text-ink">
              Terms of Service
            </Link>
            ,{" "}
            <Link to="/honor-code" className="underline underline-offset-2 hover:text-ink">
              Honor Code
            </Link>
            , and{" "}
            <Link
              to="/community-guidelines"
              className="underline underline-offset-2 hover:text-ink"
            >
              Community Guidelines
            </Link>
            .
          </span>
        </label>

        <button
          type="submit"
          disabled={!agreed}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {role.ctaLabel}
          <ArrowRight size={16} />
        </button>

        <p className="text-center text-sm text-surface-muted">
          Already have an account?{" "}
          <Link to="/auth" className="font-medium text-ink underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;

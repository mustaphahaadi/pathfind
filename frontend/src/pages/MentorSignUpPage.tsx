import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import AuthTestimonialPanel from "../components/auth/AuthTestimonialPanel";
import PasswordField from "../components/auth/PasswordField";
import { useMentorOnboardingStore } from "../store/useMentorOnboardingStore";

const MentorSignUpPage = () => {
  const navigate = useNavigate();
  const setFullName = useMentorOnboardingStore((s) => s.setFullName);
  const setWorkEmail = useMentorOnboardingStore((s) => s.setWorkEmail);
  const setPassword = useMentorOnboardingStore((s) => s.setPassword);
  const resetStore = useMentorOnboardingStore((s) => s.reset);

  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!agreed) return;

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    // Reset store then seed with signup-page values
    resetStore();
    if (fullName) setFullName(fullName);
    if (email) setWorkEmail(email);
    if (password) setPassword(password);

    navigate("/onboarding/mentor/identity-verification");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header variant="solid" />

      <main className="flex-1 px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
              Give back. Guide the next generation.
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-ink/60">
              Create your free mentor account and volunteer your experience on
              your own schedule. No fees, no platform cut — just your time and
              expertise.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
              <div>
                <label htmlFor="fullName" className="text-sm font-medium text-ink">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="Alex Rivera"
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
                  placeholder="alex@example.com"
                  className="mt-1.5 w-full rounded-xl border border-surface-line px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
                />
              </div>

              <PasswordField
                id="password"
                name="password"
                helperText="Must be at least 6 characters"
              />

              <label className="flex items-start gap-2.5 text-sm text-ink/75">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-surface-line accent-ink"
                />
                <span>
                  I agree to Pathfind&apos;s{" "}
                  <Link to="/terms" className="underline underline-offset-2 hover:text-ink">
                    Terms of Service
                  </Link>
                  ,{" "}
                  <Link to="/privacy" className="underline underline-offset-2 hover:text-ink">
                    Privacy Policy
                  </Link>
                  , and{" "}
                  <Link to="/honor-code" className="underline underline-offset-2 hover:text-ink">
                    Mentor Honor Code
                  </Link>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={!agreed}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Apply as Volunteer Mentor
                <ArrowRight size={16} />
              </button>

              <p className="text-center text-sm text-surface-muted">
                Already have an account?{" "}
                <Link to="/auth" className="font-medium text-ink underline underline-offset-2">
                  Sign in
                </Link>
                <span className="mx-2">&middot;</span>
                Want to become a mentee instead?{" "}
                <Link to="/join/mentee" className="font-medium text-ink underline underline-offset-2">
                  Sign up here
                </Link>
              </p>
            </form>
          </div>

          <AuthTestimonialPanel
            quote="An hour of my time each month has changed someone's whole career trajectory."
            name="David Park"
            role="Engineering Lead"
            company="Linear"
            avatarUrl="https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200&h=200&fit=crop&crop=faces&q=80"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MentorSignUpPage;

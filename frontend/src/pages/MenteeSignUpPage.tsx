import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import OAuthOptions from "../components/auth/OAuthOptions";
import PasswordField from "../components/auth/PasswordField";
import SimpleRadioTile from "../components/auth/SimpleRadioTile";
import SingleSelectChip from "../components/auth/SingleSelectChip";
import AuthTestimonialPanel from "../components/auth/AuthTestimonialPanel";
import { menteeStageOptions } from "../data/auth/menteeStageOptions";
import { focusAreaOptions } from "../data/auth/focusAreaOptions";
import { useOnboardingStore } from "../store/useOnboardingStore";

const MenteeSignUpPage = () => {
  const navigate = useNavigate();
  const setOnboardingFullName = useOnboardingStore((state) => state.setFullName);
  const setOnboardingEmail = useOnboardingStore((state) => state.setEmail);

  const [stageId, setStageId] = useState<string | null>(null);
  const [focusAreaId, setFocusAreaId] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  const canSubmit = agreed && stageId !== null && focusAreaId !== null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    if (fullName) setOnboardingFullName(fullName);
    if (email) setOnboardingEmail(email);

    navigate("/onboarding/mentee/about-you");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header variant="solid" />

      <main className="flex-1 px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
              Start your journey into tech
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-ink/60">
              Create your free mentee account to book 1:1 sessions with
              verified senior engineers, product managers, and designers.
              Zero fees, ever.
            </p>

            <div className="mt-8">
              <OAuthOptions />

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
                    placeholder="Jordan Chen"
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
                    placeholder="jordan@example.com"
                    className="mt-1.5 w-full rounded-xl border border-surface-line px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
                  />
                </div>

                <PasswordField
                  id="password"
                  name="password"
                  helperText="Must be at least 8 characters"
                />

                <div>
                  <p className="text-sm font-medium text-ink">
                    Current Stage / Primary Goal
                  </p>
                  <div
                    className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2"
                    role="radiogroup"
                    aria-label="Current stage or primary goal"
                  >
                    {menteeStageOptions.map((option) => (
                      <SimpleRadioTile
                        key={option.id}
                        label={option.label}
                        isSelected={stageId === option.id}
                        onSelect={() => setStageId(option.id)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-ink">
                    Primary Discipline of Interest
                  </p>
                  <div
                    className="mt-2 flex flex-wrap gap-2.5"
                    role="radiogroup"
                    aria-label="Primary discipline of interest"
                  >
                    {focusAreaOptions.map((option) => (
                      <SingleSelectChip
                        key={option.id}
                        label={option.label}
                        isSelected={focusAreaId === option.id}
                        onSelect={() => setFocusAreaId(option.id)}
                      />
                    ))}
                  </div>
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
                    <Link to="/privacy" className="underline underline-offset-2 hover:text-ink">
                      Privacy Policy
                    </Link>
                    , and{" "}
                    <Link to="/honor-code" className="underline underline-offset-2 hover:text-ink">
                      Mentee Honor Code
                    </Link>{" "}
                    (commit to bringing a prepared agenda to every session).
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Create Free Mentee Account
                  <ArrowRight size={16} />
                </button>

                <p className="text-center text-sm text-surface-muted">
                  Already have an account?{" "}
                  <Link to="/auth" className="font-medium text-ink underline underline-offset-2">
                    Sign in
                  </Link>
                  <span className="mx-2">&middot;</span>
                  Want to become a mentor instead?{" "}
                  <Link
                    to="/join/mentor"
                    className="font-medium text-ink underline underline-offset-2"
                  >
                    Volunteer here
                  </Link>
                </p>
              </form>
            </div>
          </div>

          <AuthTestimonialPanel
            quote="I spent months making mistakes my mentor helped me avoid in one session."
            name="James Osei"
            role="UX Lead at Figma"
            company="Figma"
            avatarUrl="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=faces&q=80"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MenteeSignUpPage;

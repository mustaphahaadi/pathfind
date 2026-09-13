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
import { mentorExperienceOptions } from "../data/auth/mentorExperienceOptions";
import { focusAreaOptions } from "../data/auth/focusAreaOptions";
import { mentors } from "../data/mentors";

const testimonialMentor = mentors.find((mentor) => mentor.id === "david-park");

const MentorSignUpPage = () => {
  const navigate = useNavigate();

  const [experienceId, setExperienceId] = useState<string | null>(null);
  const [focusAreaId, setFocusAreaId] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  const canSubmit = agreed && experienceId !== null && focusAreaId !== null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    // No mentor onboarding flow yet — land back on the mentors directory for now.
    navigate("/mentors");
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
              Create your free mentor account and volunteer your experience
              on your own schedule. No fees, no platform cut — just your
              time and expertise.
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
                  helperText="Must be at least 8 characters"
                />

                <div>
                  <p className="text-sm font-medium text-ink">Experience Level</p>
                  <div
                    className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2"
                    role="radiogroup"
                    aria-label="Experience level"
                  >
                    {mentorExperienceOptions.map((option) => (
                      <SimpleRadioTile
                        key={option.id}
                        label={option.label}
                        isSelected={experienceId === option.id}
                        onSelect={() => setExperienceId(option.id)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-ink">
                    Primary Area of Expertise
                  </p>
                  <div
                    className="mt-2 flex flex-wrap gap-2.5"
                    role="radiogroup"
                    aria-label="Primary area of expertise"
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
                      Mentor Honor Code
                    </Link>{" "}
                    (commit to a capped, respectful volunteering schedule).
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!canSubmit}
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
                  <Link
                    to="/join/mentee"
                    className="font-medium text-ink underline underline-offset-2"
                  >
                    Sign up here
                  </Link>
                </p>
              </form>
            </div>
          </div>

          <AuthTestimonialPanel
            quote="An hour of my time each month has changed someone's whole career trajectory. It's the highest-leverage volunteering I've ever done."
            name={testimonialMentor?.name ?? "David Park"}
            role={testimonialMentor?.role ?? "Engineering Lead"}
            company={testimonialMentor?.company ?? "Linear"}
            avatarUrl={testimonialMentor?.imageUrl ?? ""}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MentorSignUpPage;

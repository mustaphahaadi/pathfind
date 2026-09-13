import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, HeartHandshake, PartyPopper } from "lucide-react";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { proficiencyOptions } from "../../data/onboarding/proficiencyOptions";
import { meetingPreferences } from "../../data/onboarding/meetingPreferences";
import { mentors } from "../../data/mentors";
import { onboardingStepPath } from "../../data/onboarding/steps";
import RadioOptionCard from "../../components/onboarding/RadioOptionCard";
import ToggleChip from "../../components/onboarding/ToggleChip";
import AvatarStack from "../../components/onboarding/AvatarStack";

const ExperienceReadinessStep = () => {
  const navigate = useNavigate();
  const proficiency = useOnboardingStore((state) => state.proficiency);
  const selectedMeetingPrefs = useOnboardingStore((state) => state.meetingPreferences);
  const pledgeAgreed = useOnboardingStore((state) => state.pledgeAgreed);

  const setProficiency = useOnboardingStore((state) => state.setProficiency);
  const toggleMeetingPreference = useOnboardingStore((state) => state.toggleMeetingPreference);
  const setPledgeAgreed = useOnboardingStore((state) => state.setPledgeAgreed);
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);

  const canComplete = proficiency !== null && pledgeAgreed;

  const handleComplete = () => {
    if (!canComplete) return;
    completeOnboarding();
    navigate("/mentors", { state: { matched: true } });
  };

  return (
    <div>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-blue/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-accent-blue">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-blue" />
        Mentorship Calibration
      </span>

      <h1 className="mt-5 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
        Calibrate your experience &amp; readiness
      </h1>
      <p className="mt-2 max-w-xl text-base leading-relaxed text-ink/60">
        Ensuring high-value sessions tailored to your proficiency and
        commitment to voluntary mentorship.
      </p>

      <div className="mt-8">
        <p className="text-sm font-semibold text-ink">
          Select your current technical proficiency
        </p>
        <p className="mt-0.5 text-sm text-ink/60">
          Mentors leverage this to calibrate the depth of code reviews and
          career strategic talks.
        </p>

        <div
          className="mt-3 flex flex-col gap-3"
          role="radiogroup"
          aria-label="Technical proficiency"
        >
          {proficiencyOptions.map((option) => (
            <RadioOptionCard
              key={option.id}
              title={option.title}
              description={option.description}
              tag={option.tag}
              isSelected={proficiency === option.id}
              onSelect={() => setProficiency(option.id)}
            />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <p className="text-sm font-semibold text-ink">How do you prefer to meet?</p>
        <p className="mt-0.5 text-sm text-ink/60">
          Select all formats that match your schedule and learning
          preferences.
        </p>

        <div className="mt-3 flex flex-wrap gap-2.5">
          {meetingPreferences.map((preference) => (
            <ToggleChip
              key={preference.id}
              label={preference.label}
              icon={preference.icon}
              isSelected={selectedMeetingPrefs.includes(preference.id)}
              onToggle={() => toggleMeetingPreference(preference.id)}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-surface p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-accent-blue">
            <HeartHandshake size={18} strokeWidth={1.75} />
          </span>
          <div>
            <p className="text-sm font-bold text-ink">Voluntary Mentorship Pledge</p>
            <p className="mt-0.5 text-sm text-ink/60">
              Mentors are verified senior industry leaders donating their
              personal time freely. Come with a prepared agenda, test your
              audio/video beforehand, and respect scheduled times.
            </p>
          </div>
        </div>

        <label className="mt-4 flex items-start gap-2.5 rounded-xl border border-surface-line bg-white p-3.5 text-sm text-ink/80">
          <input
            type="checkbox"
            checked={pledgeAgreed}
            onChange={(event) => setPledgeAgreed(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-surface-line accent-ink"
          />
          <span>
            I agree to come to every session with a prepared agenda and
            commit to respecting volunteer time.
          </span>
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-surface-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-green/10 text-accent-green">
            <PartyPopper size={18} strokeWidth={1.75} />
          </span>
          <div>
            <p className="text-sm font-bold text-ink">
              All set! We found 34 matching mentors ready for your background.
            </p>
            <p className="mt-0.5 text-sm text-ink/60">
              Including specialists in React, Systems Design, and Early
              Career Transition.
            </p>
          </div>
        </div>
        <AvatarStack
          avatarUrls={mentors.slice(4, 7).map((mentor) => mentor.imageUrl)}
          overflowCount={31}
        />
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-surface-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to={onboardingStepPath("interests-goals")}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-surface-line px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
        <button
          type="button"
          onClick={handleComplete}
          disabled={!canComplete}
          className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity ${
            canComplete ? "bg-ink hover:opacity-90" : "cursor-not-allowed bg-ink/40"
          }`}
        >
          Complete Setup &amp; Explore Mentors
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ExperienceReadinessStep;

import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { technicalTracks } from "../../data/onboarding/technicalTracks";
import { coreObjectives } from "../../data/onboarding/coreObjectives";
import { mentors } from "../../data/mentors";
import { onboardingStepPath } from "../../data/onboarding/steps";
import ToggleChip from "../../components/onboarding/ToggleChip";
import ObjectiveCard from "../../components/onboarding/ObjectiveCard";
import AvatarStack from "../../components/onboarding/AvatarStack";

const InterestsGoalsStep = () => {
  const selectedTracks = useOnboardingStore((state) => state.technicalTracks);
  const selectedObjectives = useOnboardingStore((state) => state.coreObjectives);
  const toggleTechnicalTrack = useOnboardingStore((state) => state.toggleTechnicalTrack);
  const toggleCoreObjective = useOnboardingStore((state) => state.toggleCoreObjective);

  const canContinue = selectedTracks.length > 0 && selectedObjectives.length > 0;

  const selectedTrackLabels = technicalTracks
    .filter((track) => selectedTracks.includes(track.id))
    .map((track) => track.label);

  const matchingMentorCount = Math.max(
    6,
    40 - selectedTracks.length * 3 - selectedObjectives.length * 2,
  );

  return (
    <div>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-green/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-accent-green">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
        100% Free &amp; Voluntary Community
      </span>

      <h1 className="mt-5 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
        What are your interests and goals?
      </h1>
      <p className="mt-2 max-w-xl text-base leading-relaxed text-ink/60">
        Select your primary technical tracks and what you want to achieve
        with your mentor. We use this to curate volunteer leaders with
        matching practical experience.
      </p>

      <div className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-ink">
              Technical Tracks &amp; Fields
            </p>
            <p className="mt-0.5 text-sm text-ink/60">
              What areas are you interested in? Select all that apply.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink">
            {selectedTracks.length} SELECTED
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2.5">
          {technicalTracks.map((track) => (
            <ToggleChip
              key={track.id}
              label={track.label}
              isSelected={selectedTracks.includes(track.id)}
              onToggle={() => toggleTechnicalTrack(track.id)}
            />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-ink">Core Objectives</p>
            <p className="mt-0.5 text-sm text-ink/60">
              What do you want help with? Select all that apply.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink">
            {selectedObjectives.length} SELECTED
          </span>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {coreObjectives.map((objective) => (
            <ObjectiveCard
              key={objective.id}
              title={objective.title}
              description={objective.description}
              isSelected={selectedObjectives.includes(objective.id)}
              onToggle={() => toggleCoreObjective(objective.id)}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <AvatarStack avatarUrls={mentors.slice(0, 4).map((mentor) => mentor.imageUrl)} />
          <div>
            <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
              {matchingMentorCount} mentors available
            </p>
            <p className="mt-0.5 text-sm text-ink/60">
              {selectedTrackLabels.length > 0
                ? `Matching ${selectedTrackLabels.join(" & ")} with selected goals.`
                : "Select a track above to see matching mentors."}
            </p>
          </div>
        </div>
        <span className="w-fit shrink-0 rounded-full border border-surface-line bg-white px-3 py-1.5 text-xs font-semibold text-accent-blue">
          Zero Platform Fees
        </span>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-surface-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to={onboardingStepPath("about-you")}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-surface-line px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface"
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        <div className="flex flex-col-reverse items-center gap-3 sm:flex-row">
          <Link
            to="/profile"
            className="text-sm font-medium text-ink/60 transition-colors hover:text-ink"
          >
            Save &amp; Exit
          </Link>
          <Link
            to={canContinue ? onboardingStepPath("experience-readiness") : "#"}
            aria-disabled={!canContinue}
            onClick={(event) => {
              if (!canContinue) event.preventDefault();
            }}
            className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity sm:w-auto ${
              canContinue ? "bg-ink hover:opacity-90" : "cursor-not-allowed bg-ink/40"
            }`}
          >
            Continue to Experience &amp; Readiness
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InterestsGoalsStep;

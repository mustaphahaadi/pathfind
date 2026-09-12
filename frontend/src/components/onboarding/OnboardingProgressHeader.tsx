import { Link } from "react-router-dom";
import { onboardingSteps } from "../../data/onboarding/steps";

interface OnboardingProgressHeaderProps {
  currentStepIndex: number;
}

const OnboardingProgressHeader = ({
  currentStepIndex,
}: OnboardingProgressHeaderProps) => {
  const totalSteps = onboardingSteps.length;
  const currentStep = onboardingSteps[currentStepIndex];
  const progressPercent = Math.round(
    ((currentStepIndex + 1) / totalSteps) * 100,
  );

  return (
    <header className="border-b border-surface-line bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-ink"
        >
          Pathfind
          <span className="hidden h-4 w-px bg-surface-line sm:inline-block" />
          <span className="hidden items-center gap-1.5 text-xs font-medium text-ink/60 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
            100% Free Mentorship
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-medium text-ink/50">
              Step {currentStepIndex + 1} of {totalSteps}
            </p>
            <p className="text-sm font-semibold text-ink">
              {currentStep.label}
            </p>
          </div>
          <div
            className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-line sm:w-32"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-ink transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <Link
            to="/profile"
            className="text-sm font-medium text-ink/60 transition-colors hover:text-ink"
          >
            Skip for now
          </Link>
        </div>
      </div>
    </header>
  );
};

export default OnboardingProgressHeader;

import { Check } from "lucide-react";
import { onboardingSteps } from "../../data/onboarding/steps";

interface OnboardingStepperProps {
  currentStepIndex: number;
}

const statusLabel = (stepIndex: number, currentStepIndex: number) => {
  if (stepIndex < currentStepIndex) return "COMPLETED";
  if (stepIndex === currentStepIndex) {
    return stepIndex === onboardingSteps.length - 1 ? "FINAL STEP" : "IN PROGRESS";
  }
  return stepIndex === currentStepIndex + 1 ? "NEXT STEP" : "UPCOMING";
};

const OnboardingStepper = ({ currentStepIndex }: OnboardingStepperProps) => {
  return (
    <ol className="flex flex-col gap-3 rounded-2xl border border-surface-line bg-white p-3 sm:flex-row sm:items-center sm:gap-0 sm:p-4">
      {onboardingSteps.map((step, index) => {
        const isComplete = index < currentStepIndex;
        const isActive = index === currentStepIndex;

        return (
          <li key={step.path} className="flex flex-1 items-center gap-3">
            <div className="flex flex-1 items-center gap-3 rounded-xl px-2 py-1.5 sm:px-3">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isComplete || isActive
                    ? "bg-ink text-white"
                    : "bg-surface text-ink/40"
                }`}
              >
                {isComplete ? <Check size={14} strokeWidth={3} /> : index + 1}
              </span>
              <div>
                <p
                  className={`text-sm font-semibold ${
                    isActive || isComplete ? "text-ink" : "text-ink/50"
                  }`}
                >
                  {step.label}
                </p>
                <p
                  className={`text-[11px] font-medium tracking-wide ${
                    isActive ? "text-accent-blue" : "text-ink/40"
                  }`}
                >
                  {statusLabel(index, currentStepIndex)}
                </p>
              </div>
            </div>

            {index < onboardingSteps.length - 1 && (
              <span
                className="hidden h-px flex-1 bg-surface-line sm:block"
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default OnboardingStepper;

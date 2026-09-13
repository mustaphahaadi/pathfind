import { Link } from "react-router-dom";
import { Check } from "lucide-react";

interface RoadmapStep {
  label: string;
  status: "COMPLETED" | "NEXT STEP" | "PREPARATION";
  title: string;
  description: string;
  linkTo?: string;
}

interface QuickStartRoadmapProps {
  step1Completed: boolean;
  step2Completed: boolean;
}

const QuickStartRoadmap = ({ step1Completed, step2Completed }: QuickStartRoadmapProps) => {
  const steps: RoadmapStep[] = [
    {
      label: "STEP 1",
      status: step1Completed ? "COMPLETED" : "NEXT STEP",
      title: "Set Up Profile & Goals",
      description: step1Completed
        ? "Onboarding answers configured for your career transition."
        : "Finish onboarding to unlock personalized mentor matches.",
      linkTo: step1Completed ? undefined : "/onboarding/mentee/about-you",
    },
    {
      label: "STEP 2",
      status: step2Completed ? "COMPLETED" : "NEXT STEP",
      title: "Book Your First 1:1 Session",
      description: "Choose from weekly slots offered freely by senior tech mentors.",
      linkTo: step2Completed ? undefined : "/mentors",
    },
    {
      label: "STEP 3",
      status: "PREPARATION",
      title: "Prepare 2-3 Target Topics",
      description:
        "Draft questions or link your portfolio case study for direct critique.",
    },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {steps.map((step) => {
        const content = (
          <>
            <div className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  step.status === "COMPLETED"
                    ? "bg-accent-green text-white"
                    : step.status === "NEXT STEP"
                      ? "bg-accent-blue text-white"
                      : "bg-surface text-ink/40"
                }`}
              >
                {step.status === "COMPLETED" ? <Check size={13} strokeWidth={3} /> : step.label.slice(-1)}
              </span>
              <p
                className={`text-[11px] font-semibold tracking-wide ${
                  step.status === "COMPLETED"
                    ? "text-accent-green"
                    : step.status === "NEXT STEP"
                      ? "text-accent-blue"
                      : "text-ink/40"
                }`}
              >
                {step.label} &middot; {step.status}
              </p>
            </div>
            <p className="mt-2 text-sm font-bold text-ink">{step.title}</p>
            <p className="mt-1 text-sm text-ink/60">{step.description}</p>
          </>
        );

        const cardClassName = `rounded-2xl border p-4 ${
          step.status === "NEXT STEP" ? "border-accent-blue" : "border-surface-line"
        }`;

        return step.linkTo ? (
          <Link key={step.label} to={step.linkTo} className={`${cardClassName} block transition-colors hover:bg-surface`}>
            {content}
          </Link>
        ) : (
          <div key={step.label} className={cardClassName}>
            {content}
          </div>
        );
      })}
    </div>
  );
};

export default QuickStartRoadmap;

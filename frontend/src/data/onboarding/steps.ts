export interface OnboardingStep {
  path: string;
  label: string;
}

export const ONBOARDING_BASE_PATH = "/onboarding/mentee";

export const onboardingSteps: OnboardingStep[] = [
  { path: "about-you", label: "About You" },
  { path: "interests-goals", label: "Interests & Goals" },
  { path: "experience-readiness", label: "Experience & Readiness" },
];

export const onboardingStepPath = (path: string) =>
  `${ONBOARDING_BASE_PATH}/${path}`;

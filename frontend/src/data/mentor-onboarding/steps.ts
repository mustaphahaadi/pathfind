export interface MentorOnboardingStep {
  path: string;
  label: string;
  heading: string;
  subtitle: string;
}

export const MENTOR_ONBOARDING_BASE_PATH = "/onboarding/mentor";

export const mentorOnboardingSteps: MentorOnboardingStep[] = [
  {
    path: "identity-verification",
    label: "Identity & Verification",
    heading: "Join Pathfind as a Volunteer Mentor",
    subtitle: "Give back and empower career transitioners into tech. Zero paywalls, 100% voluntary.",
  },
  {
    path: "domain-skills",
    label: "Domain & Skills",
    heading: "Share Your Expertise",
    subtitle: "Define your domain focus, mentoring topics, and coaching philosophy.",
  },
  {
    path: "availability-capacity",
    label: "Availability & Capacity",
    heading: "Set Your Rhythm & Capacity",
    subtitle: "You have 100% control over how much time you offer. No pressure, no mandatory quotas.",
  },
  {
    path: "honor-code-review",
    label: "Honor Code & Review",
    heading: "Review Profile & Volunteer Honor Code",
    subtitle:
      "Confirm your profile details, accept our community honor code pledges, and publish your mentor profile.",
  },
];

export const mentorOnboardingStepPath = (path: string) =>
  `${MENTOR_ONBOARDING_BASE_PATH}/${path}`;

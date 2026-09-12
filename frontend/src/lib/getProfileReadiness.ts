import { useOnboardingStore } from "../store/useOnboardingStore";

type OnboardingSnapshot = ReturnType<typeof useOnboardingStore.getState>;

/** Rough completeness score across every onboarding field, used for the "Profile Readiness" tile. */
export const getProfileReadiness = (state: OnboardingSnapshot): number => {
  const checks = [
    state.fullName.trim().length > 0,
    state.email.trim().length > 0,
    state.location.trim().length > 0,
    state.status !== null,
    state.technicalTracks.length > 0,
    state.coreObjectives.length > 0,
    state.proficiency !== null,
    state.meetingPreferences.length > 0,
    state.pledgeAgreed,
  ];
  const completedCount = checks.filter(Boolean).length;
  return Math.round((completedCount / checks.length) * 100);
};

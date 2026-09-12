import { create } from "zustand";
import type { MenteeStatus, ProficiencyLevel } from "../types/onboarding";

interface OnboardingState {
  avatarUrl: string | null;
  fullName: string;
  email: string;
  location: string;
  status: MenteeStatus | null;
  technicalTracks: string[];
  coreObjectives: string[];
  proficiency: ProficiencyLevel | null;
  meetingPreferences: string[];
  pledgeAgreed: boolean;
  /** True once the person has clicked "Complete Setup" on the final onboarding step. */
  hasCompletedOnboarding: boolean;

  setAvatarUrl: (url: string | null) => void;
  setFullName: (value: string) => void;
  setEmail: (value: string) => void;
  setLocation: (value: string) => void;
  setStatus: (status: MenteeStatus) => void;
  toggleTechnicalTrack: (id: string) => void;
  toggleCoreObjective: (id: string) => void;
  setProficiency: (level: ProficiencyLevel) => void;
  toggleMeetingPreference: (id: string) => void;
  setPledgeAgreed: (agreed: boolean) => void;
  completeOnboarding: () => void;
  reset: () => void;
}

const initialState = {
  avatarUrl: null,
  fullName: "",
  email: "",
  location: "",
  status: null as MenteeStatus | null,
  technicalTracks: [] as string[],
  coreObjectives: [] as string[],
  proficiency: null as ProficiencyLevel | null,
  meetingPreferences: [] as string[],
  pledgeAgreed: false,
  hasCompletedOnboarding: false,
};

const toggleInList = (list: string[], id: string) =>
  list.includes(id) ? list.filter((item) => item !== id) : [...list, id];

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,

  setAvatarUrl: (url) => set({ avatarUrl: url }),
  setFullName: (value) => set({ fullName: value }),
  setEmail: (value) => set({ email: value }),
  setLocation: (value) => set({ location: value }),
  setStatus: (status) => set({ status }),
  toggleTechnicalTrack: (id) =>
    set((state) => ({
      technicalTracks: toggleInList(state.technicalTracks, id),
    })),
  toggleCoreObjective: (id) =>
    set((state) => ({
      coreObjectives: toggleInList(state.coreObjectives, id),
    })),
  setProficiency: (level) => set({ proficiency: level }),
  toggleMeetingPreference: (id) =>
    set((state) => ({
      meetingPreferences: toggleInList(state.meetingPreferences, id),
    })),
  setPledgeAgreed: (agreed) => set({ pledgeAgreed: agreed }),
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
  reset: () => set(initialState),
}));

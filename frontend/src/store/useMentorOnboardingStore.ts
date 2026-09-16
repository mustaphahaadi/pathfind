import { create } from "zustand";
import type { WeeklyAvailabilityWindow } from "../types/mentorOnboarding";

interface MentorOnboardingState {
  // Registration credentials (from MentorSignUpPage)
  password: string;

  // Step 1 — Identity & Verification
  avatarUrl: string | null;
  fullName: string;
  workEmail: string;
  currentTitle: string;
  company: string;
  location: string;
  yearsOfExperience: number;
  linkedinUrl: string;

  // Step 2 — Domain & Skills
  primaryDiscipline: string | null;
  topics: string[];
  motivation: string;
  targetStages: string[];

  // Step 3 — Availability & Capacity
  timezone: string;
  weeklyWindows: WeeklyAvailabilityWindow[];

  // Step 4 — Honor Code & Review
  agreedHonorCodeIds: string[];
  digitalSignature: string;

  hasCompletedOnboarding: boolean;
  acceptingRequests: boolean;

  setPassword: (value: string) => void;
  setAvatarUrl: (url: string | null) => void;
  setFullName: (value: string) => void;
  setWorkEmail: (value: string) => void;
  setCurrentTitle: (value: string) => void;
  setCompany: (value: string) => void;
  setLocation: (value: string) => void;
  setYearsOfExperience: (value: number) => void;
  setLinkedinUrl: (value: string) => void;

  setPrimaryDiscipline: (id: string) => void;
  toggleTopic: (id: string) => void;
  setMotivation: (value: string) => void;
  toggleTargetStage: (id: string) => void;

  setTimezone: (value: string) => void;
  addWeeklyWindow: (window: Omit<WeeklyAvailabilityWindow, "id">) => void;
  removeWeeklyWindow: (id: string) => void;

  toggleHonorCodeItem: (id: string) => void;
  setDigitalSignature: (value: string) => void;

  completeOnboarding: () => void;
  toggleAcceptingRequests: () => void;
  reset: () => void;
}

const initialState = {
  password: "",

  avatarUrl: null,
  fullName: "",
  workEmail: "",
  currentTitle: "",
  company: "",
  location: "",
  yearsOfExperience: 0,
  linkedinUrl: "",

  primaryDiscipline: null as string | null,
  topics: [] as string[],
  motivation: "",
  targetStages: [] as string[],

  timezone: "GMT (UTC+0)",
  weeklyWindows: [] as WeeklyAvailabilityWindow[],

  agreedHonorCodeIds: [] as string[],
  digitalSignature: "",

  hasCompletedOnboarding: false,
  acceptingRequests: true,
};

const toggleInList = (list: string[], id: string) =>
  list.includes(id) ? list.filter((item) => item !== id) : [...list, id];

export const useMentorOnboardingStore = create<MentorOnboardingState>((set) => ({
  ...initialState,

  setPassword: (value) => set({ password: value }),
  setAvatarUrl: (url) => set({ avatarUrl: url }),
  setFullName: (value) => set({ fullName: value }),
  setWorkEmail: (value) => set({ workEmail: value }),
  setCurrentTitle: (value) => set({ currentTitle: value }),
  setCompany: (value) => set({ company: value }),
  setLocation: (value) => set({ location: value }),
  setYearsOfExperience: (value) => set({ yearsOfExperience: value }),
  setLinkedinUrl: (value) => set({ linkedinUrl: value }),

  setPrimaryDiscipline: (id) => set({ primaryDiscipline: id }),
  toggleTopic: (id) => set((state) => ({ topics: toggleInList(state.topics, id) })),
  setMotivation: (value) => set({ motivation: value }),
  toggleTargetStage: (id) =>
    set((state) => ({ targetStages: toggleInList(state.targetStages, id) })),

  setTimezone: (value) => set({ timezone: value }),
  addWeeklyWindow: (window) =>
    set((state) => ({
      weeklyWindows: [
        ...state.weeklyWindows,
        { ...window, id: `window-${Date.now()}` },
      ],
    })),
  removeWeeklyWindow: (id) =>
    set((state) => ({
      weeklyWindows: state.weeklyWindows.filter((window) => window.id !== id),
    })),

  toggleHonorCodeItem: (id) =>
    set((state) => ({
      agreedHonorCodeIds: toggleInList(state.agreedHonorCodeIds, id),
    })),
  setDigitalSignature: (value) => set({ digitalSignature: value }),

  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
  toggleAcceptingRequests: () =>
    set((state) => ({ acceptingRequests: !state.acceptingRequests })),
  reset: () => set(initialState),
}));

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WeeklyAvailabilityWindow } from "../types/mentorOnboarding";
import type { UserOut } from "../types/api";

interface MentorOnboardingState {
  // Registration credentials (from MentorSignUpPage) - NOT persisted for security
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
  hydrateFromUser: (user: UserOut) => void;
  reset: () => void;
}

// Partial state to persist (exclude password for security)
const persistConfig = {
  name: "pathfind-mentor-onboarding",
  partialize: (state: MentorOnboardingState) => ({
    avatarUrl: state.avatarUrl,
    fullName: state.fullName,
    workEmail: state.workEmail,
    currentTitle: state.currentTitle,
    company: state.company,
    location: state.location,
    yearsOfExperience: state.yearsOfExperience,
    linkedinUrl: state.linkedinUrl,
    primaryDiscipline: state.primaryDiscipline,
    topics: state.topics,
    motivation: state.motivation,
    targetStages: state.targetStages,
    timezone: state.timezone,
    weeklyWindows: state.weeklyWindows,
    agreedHonorCodeIds: state.agreedHonorCodeIds,
    digitalSignature: state.digitalSignature,
    hasCompletedOnboarding: state.hasCompletedOnboarding,
    acceptingRequests: state.acceptingRequests,
  }),
};

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

export const useMentorOnboardingStore = create<MentorOnboardingState>()(
  persist(
    (set) => ({
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
      hydrateFromUser: (user) =>
        set((state) => {
          const profile = user.profile;
          if (!profile) return state;

          const tags = profile.expertise_tags
            ? profile.expertise_tags.split(",").map((s) => s.trim()).filter(Boolean)
            : [];
          const hydratedDiscipline = state.primaryDiscipline || (tags.length > 0 ? tags[0] : null);
          const hydratedTopics = state.topics.length > 0 ? state.topics : (tags.length > 1 ? tags.slice(1) : tags);

          return {
            fullName: state.fullName || profile.full_name || "",
            workEmail: state.workEmail || user.email || "",
            currentTitle: state.currentTitle || profile.job_title || "",
            company: state.company || profile.company || "",
            yearsOfExperience: state.yearsOfExperience || profile.years_of_experience || 0,
            location: state.location || profile.location || "",
            linkedinUrl: state.linkedinUrl || profile.linkedin_url || "",
            avatarUrl: state.avatarUrl || profile.avatar_url || null,
            motivation: state.motivation || profile.bio || "",
            primaryDiscipline: hydratedDiscipline,
            topics: hydratedTopics,
            targetStages: state.targetStages.length > 0 ? state.targetStages : ["early_career", "career_switcher"],
          };
        }),
      reset: () => set(initialState),
    }),
    persistConfig
  )
);

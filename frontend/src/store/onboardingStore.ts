import { create } from 'zustand'
import type {
  CoreObjective,
  MeetingFormat,
  MenteeAccount,
  ProficiencyLevel,
  TechnicalTrack,
  UserStage,
} from '@/types'

interface OnboardingState {
  // Step 0 — created at /signup/mentee
  account: MenteeAccount
  setAccount: (account: Partial<MenteeAccount>) => void

  // Step 1 — About You
  avatarUrl: string | null
  location: string
  setAvatarUrl: (url: string | null) => void
  setLocation: (location: string) => void
  setStage: (stage: UserStage) => void

  // Step 2 — Interests & Goals
  tracks: TechnicalTrack[]
  objectives: CoreObjective[]
  toggleTrack: (track: TechnicalTrack) => void
  toggleObjective: (objective: CoreObjective) => void

  // Step 3 — Experience & Readiness
  proficiency: ProficiencyLevel | null
  meetingFormats: MeetingFormat[]
  pledgeAccepted: boolean
  setProficiency: (level: ProficiencyLevel) => void
  toggleMeetingFormat: (format: MeetingFormat) => void
  setPledgeAccepted: (accepted: boolean) => void

  // Progress
  highestStepReached: number
  setHighestStepReached: (step: number) => void

  reset: () => void
}

const initialAccount: MenteeAccount = {
  fullName: '',
  email: '',
  password: '',
  stage: 'career-switcher',
  discipline: null,
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  account: initialAccount,
  setAccount: (account) =>
    set((state) => ({ account: { ...state.account, ...account } })),

  avatarUrl: null,
  location: '',
  setAvatarUrl: (url) => set({ avatarUrl: url }),
  setLocation: (location) => set({ location }),
  setStage: (stage) =>
    set((state) => ({ account: { ...state.account, stage } })),

  tracks: [],
  objectives: [],
  toggleTrack: (track) =>
    set((state) => ({
      tracks: state.tracks.includes(track)
        ? state.tracks.filter((t) => t !== track)
        : [...state.tracks, track],
    })),
  toggleObjective: (objective) =>
    set((state) => ({
      objectives: state.objectives.includes(objective)
        ? state.objectives.filter((o) => o !== objective)
        : [...state.objectives, objective],
    })),

  proficiency: 'beginner',
  meetingFormats: ['video-call', 'async-review'],
  pledgeAccepted: false,
  setProficiency: (level) => set({ proficiency: level }),
  toggleMeetingFormat: (format) =>
    set((state) => ({
      meetingFormats: state.meetingFormats.includes(format)
        ? state.meetingFormats.filter((f) => f !== format)
        : [...state.meetingFormats, format],
    })),
  setPledgeAccepted: (accepted) => set({ pledgeAccepted: accepted }),

  highestStepReached: 1,
  setHighestStepReached: (step) =>
    set((state) => ({
      highestStepReached: Math.max(state.highestStepReached, step),
    })),

  reset: () =>
    set({
      account: initialAccount,
      avatarUrl: null,
      location: '',
      tracks: [],
      objectives: [],
      proficiency: 'beginner',
      meetingFormats: ['video-call', 'async-review'],
      pledgeAccepted: false,
      highestStepReached: 1,
    }),
}))

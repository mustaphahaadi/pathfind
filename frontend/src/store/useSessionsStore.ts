import { create } from "zustand";
import type { BookedSession } from "../types/session";

interface SessionsState {
  sessions: BookedSession[];
  lastBookingId: string | null;
  savedMentorIds: string[];

  addSession: (session: Omit<BookedSession, "id" | "createdAt">) => string;
  toggleSavedMentor: (mentorId: string) => void;
}

export const useSessionsStore = create<SessionsState>((set) => ({
  sessions: [],
  lastBookingId: null,
  savedMentorIds: [],

  addSession: (session) => {
    const id = `session-${Date.now()}`;
    const newSession: BookedSession = {
      ...session,
      id,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      sessions: [...state.sessions, newSession],
      lastBookingId: id,
    }));
    return id;
  },

  toggleSavedMentor: (mentorId) =>
    set((state) => ({
      savedMentorIds: state.savedMentorIds.includes(mentorId)
        ? state.savedMentorIds.filter((id) => id !== mentorId)
        : [...state.savedMentorIds, mentorId],
    })),
}));

export const selectLastBooking = (state: SessionsState): BookedSession | null =>
  state.sessions.find((session) => session.id === state.lastBookingId) ?? null;

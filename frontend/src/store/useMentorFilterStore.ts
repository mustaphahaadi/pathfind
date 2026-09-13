import { create } from "zustand";
import type { MentorCategory } from "../types/mentor";

export type MentorFilter = "All Mentors" | MentorCategory;

interface MentorFilterState {
  activeFilter: MentorFilter;
  setFilter: (filter: MentorFilter) => void;
}

export const mentorFilterOptions: MentorFilter[] = [
  "All Mentors",
  "UX & Product Design",
  "Software Engineering",
  "Product Management",
  "Brand & Design Systems",
  "Technical Writing",
];

export const useMentorFilterStore = create<MentorFilterState>((set) => ({
  activeFilter: "All Mentors",
  setFilter: (filter) => set({ activeFilter: filter }),
}));

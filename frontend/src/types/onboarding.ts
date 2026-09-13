export type MenteeStatus =
  | "university-student"
  | "recent-graduate"
  | "bootcamp-graduate"
  | "career-switcher"
  | "junior-professional";

export type ProficiencyLevel = "beginner" | "intermediate" | "advanced";

export interface StatusOption {
  id: MenteeStatus;
  title: string;
  description: string;
}

export interface TechnicalTrack {
  id: string;
  label: string;
}

export interface CoreObjective {
  id: string;
  title: string;
  description: string;
}

export interface ProficiencyOption {
  id: ProficiencyLevel;
  title: string;
  description: string;
  tag: string;
}

export interface MeetingPreference {
  id: string;
  label: string;
}

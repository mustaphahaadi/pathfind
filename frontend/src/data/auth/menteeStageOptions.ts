export interface SelectOption {
  id: string;
  label: string;
}

export const menteeStageOptions: SelectOption[] = [
  { id: "career-switcher-bootcamp", label: "Career Switcher / Bootcamp" },
  { id: "early-career", label: "Early Career (0-2 yrs)" },
  { id: "student-self-taught", label: "Student / Self-Taught" },
  { id: "mid-level-leveling-up", label: "Mid-level Leveling Up" },
];

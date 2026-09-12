import type { ProficiencyOption } from "../../types/onboarding";

export const proficiencyOptions: ProficiencyOption[] = [
  {
    id: "beginner",
    title: "Beginner",
    description:
      "Just starting or < 1 yr coding/designing. Focusing on foundational basics and syntax.",
    tag: "< 1 Yr",
  },
  {
    id: "intermediate",
    title: "Intermediate",
    description:
      "1-2 yrs building projects or working in early roles. Ready for architecture reviews.",
    tag: "1-2 Yrs",
  },
  {
    id: "advanced",
    title: "Advanced",
    description:
      "3+ yrs experience. Focusing on staff/lead dynamics, advanced system design, and specialized scale.",
    tag: "3+ Yrs",
  },
];

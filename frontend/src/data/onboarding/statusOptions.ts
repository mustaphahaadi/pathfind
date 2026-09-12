import type { StatusOption } from "../../types/onboarding";

export const statusOptions: StatusOption[] = [
  {
    id: "university-student",
    title: "University Student",
    description: "Currently pursuing an undergraduate or graduate degree",
  },
  {
    id: "recent-graduate",
    title: "Recent Graduate",
    description: "Graduated within past 12 months, seeking entry role",
  },
  {
    id: "bootcamp-graduate",
    title: "Bootcamp Graduate",
    description: "Intensive technical certificate or immersive program",
  },
  {
    id: "career-switcher",
    title: "Career Switcher",
    description: "Pivoting from a non-tech background into engineering, product or design",
  },
  {
    id: "junior-professional",
    title: "Junior Professional",
    description: "Working in tech with 0-2 years experience aiming to grow",
  },
];

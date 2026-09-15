import { Code2, ClipboardList, Palette, Database, Users2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface DisciplineOption {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const mentorDisciplines: DisciplineOption[] = [
  { id: "software-engineering", label: "Software Engineering", icon: Code2 },
  { id: "product-management", label: "Product Management", icon: ClipboardList },
  { id: "product-design-ux", label: "Product Design / UX", icon: Palette },
  { id: "data-science-ai", label: "Data Science & AI", icon: Database },
  { id: "engineering-leadership", label: "Engineering Leadership & Management", icon: Users2 },
];

export interface SimpleOption {
  id: string;
  label: string;
}

export const mentorshipTopics: SimpleOption[] = [
  { id: "system-design-architecture", label: "System Design Architecture" },
  { id: "career-transition-switching", label: "Career Transition & Switching" },
  { id: "resume-cv-teardowns", label: "Resume & CV Teardowns" },
  { id: "mock-technical-behavioral", label: "Mock Technical & Behavioral Interviews" },
  { id: "zero-to-one-product-discovery", label: "0-to-1 Product Discovery" },
  { id: "design-systems-ops", label: "Design Systems & Ops" },
  { id: "ic-to-management", label: "IC to Management Navigation" },
  { id: "executive-stakeholder-comms", label: "Executive Stakeholder Communication" },
];

export interface MenteeStagePreference extends SimpleOption {
  description: string;
}

export const menteeStagePreferences: MenteeStagePreference[] = [
  {
    id: "career-changers-bootcamps",
    label: "Career Changers / Bootcamps",
    description:
      "Transitioners seeking their first entry-level role in tech or navigating non-traditional pathways.",
  },
  {
    id: "early-career",
    label: "Early Career (0-2 yrs experience)",
    description: "Junior engineers calibrating code reviews, sprint workflows, and company onboarding.",
  },
  {
    id: "mid-level-to-senior",
    label: "Mid-level looking to level up to Senior",
    description: "Engineers preparing for complex system designs, cross-functional leadership, and promotion packets.",
  },
];

export const weekdayOptions = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const timeOptions = [
  "6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM",
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM",
  "9:00 PM", "9:30 PM", "10:00 PM",
];

export interface HonorCodeItem {
  id: string;
  title: string;
  description: string;
}

export const mentorHonorCodeItems: HonorCodeItem[] = [
  {
    id: "zero-solicitation",
    title: "Zero-Solicitation Policy",
    description:
      "I agree to strictly adhere to the Pathfind Community Guidelines. I will never pitch paid coaching, promote commercial services, or charge mentees.",
  },
  {
    id: "purely-voluntary",
    title: "Purely Voluntary Mentorship",
    description:
      "I understand that mentorship on Pathfind is 100% voluntary, free of charge, and focused on equitable industry access.",
  },
  {
    id: "reliability-respect",
    title: "Reliability & Respect",
    description:
      "I will honor scheduled sessions or give at least 24 hours notice in case of emergency rescheduling, ensuring respect for mentees' preparation time.",
  },
  {
    id: "privacy-safe-space",
    title: "Privacy & Safe Space",
    description: "I will keep discussions confidential and maintain an encouraging, inclusive, and professional environment.",
  },
];

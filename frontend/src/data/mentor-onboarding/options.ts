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

// Specific technical skills matching mock data expertise_tags
export interface SkillOption {
  id: string;
  label: string;
  category: string;
}

export const technicalSkills: SkillOption[] = [
  // Programming Languages
  { id: "python", label: "Python", category: "Languages" },
  { id: "javascript", label: "JavaScript", category: "Languages" },
  { id: "typescript", label: "TypeScript", category: "Languages" },
  { id: "java", label: "Java", category: "Languages" },
  { id: "html-css", label: "HTML/CSS", category: "Languages" },
  { id: "sql", label: "SQL", category: "Languages" },

  // Frameworks & Libraries
  { id: "react", label: "React", category: "Frameworks" },
  { id: "fastapi", label: "FastAPI", category: "Frameworks" },
  { id: "spring-boot", label: "Spring Boot", category: "Frameworks" },

  // Databases
  { id: "postgresql", label: "PostgreSQL", category: "Databases" },
  { id: "mysql", label: "MySQL", category: "Databases" },
  { id: "mongodb", label: "MongoDB", category: "Databases" },

  // Cloud & DevOps
  { id: "aws", label: "AWS", category: "Cloud & DevOps" },
  { id: "docker", label: "Docker", category: "Cloud & DevOps" },
  { id: "ci-cd", label: "CI/CD", category: "Cloud & DevOps" },
  { id: "linux", label: "Linux", category: "Cloud & DevOps" },
  { id: "cloud-infrastructure", label: "Cloud Infrastructure", category: "Cloud & DevOps" },

  // Data & Analytics
  { id: "machine-learning", label: "Machine Learning", category: "Data & Analytics" },
  { id: "data-science", label: "Data Science", category: "Data & Analytics" },
  { id: "statistics", label: "Statistics", category: "Data & Analytics" },
  { id: "power-bi", label: "Power BI", category: "Data & Analytics" },
  { id: "excel", label: "Excel", category: "Data & Analytics" },
  { id: "data-visualization", label: "Data Visualization", category: "Data & Analytics" },

  // Product & Design
  { id: "product-strategy", label: "Product Strategy", category: "Product & Design" },
  { id: "agile", label: "Agile", category: "Product & Design" },
  { id: "user-research", label: "User Research", category: "Product & Design" },
  { id: "product-discovery", label: "Product Discovery", category: "Product & Design" },
  { id: "figma", label: "Figma", category: "Product & Design" },
  { id: "ux-research", label: "UX Research", category: "Product & Design" },
  { id: "wireframing", label: "Wireframing", category: "Product & Design" },
  { id: "design-systems", label: "Design Systems", category: "Product & Design" },

  // APIs & Backend
  { id: "apis", label: "APIs", category: "Backend" },
  { id: "backend-systems", label: "Backend Systems", category: "Backend" },
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

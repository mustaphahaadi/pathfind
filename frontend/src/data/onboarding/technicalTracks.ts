import type { TechnicalTrack } from "../../types/onboarding";

export const technicalTracks: TechnicalTrack[] = [
  { id: "software-engineering", label: "Software Engineering" },
  { id: "ui-ux-design", label: "UI/UX Design" },
  { id: "data-science-analytics", label: "Data Science / Analytics" },
  { id: "product-management", label: "Product Management" },
  { id: "devops-cloud", label: "DevOps / Cloud" },
  { id: "cybersecurity", label: "Cybersecurity" },
  { id: "ai-machine-learning", label: "AI & Machine Learning" },
  { id: "other", label: "Other" },
];

// Specific technical skills for mentees to select (matching mentor expertise)
export interface MenteeSkillOption {
  id: string;
  label: string;
  category: string;
}

export const menteeTechnicalSkills: MenteeSkillOption[] = [
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

  // Data & Analytics
  { id: "machine-learning", label: "Machine Learning", category: "Data & Analytics" },
  { id: "data-science", label: "Data Science", category: "Data & Analytics" },
  { id: "power-bi", label: "Power BI", category: "Data & Analytics" },
  { id: "excel", label: "Excel", category: "Data & Analytics" },

  // Product & Design
  { id: "figma", label: "Figma", category: "Product & Design" },
  { id: "product-strategy", label: "Product Strategy", category: "Product & Design" },
  { id: "agile", label: "Agile", category: "Product & Design" },
  { id: "user-research", label: "User Research", category: "Product & Design" },
];

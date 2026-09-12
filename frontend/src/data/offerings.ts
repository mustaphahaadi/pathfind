import { Target, Award, Code2, Users } from "lucide-react";
import type { Offering } from "../types/offering";

export const offerings: Offering[] = [
  {
    id: "strategic-mentorship",
    title: "1:1 Strategic Mentorship",
    description:
      "Sharpen system design, architecture, and career velocity with senior staff mentors.",
    icon: Target,
  },
  {
    id: "leadership-prep",
    title: "Leadership & Staff+ Prep",
    description:
      "Develop high-performing executive skills, team influence, and technical roadmap strategies.",
    icon: Award,
  },
  {
    id: "portfolio-teardown",
    title: "Portfolio & Code Teardown",
    description:
      "Actionable critiques on GitHub repos, UI portfolios, and architecture documentation.",
    icon: Code2,
  },
  {
    id: "mock-interviews",
    title: "Mock Interviews & Sprints",
    description:
      "Realistic behavioral and technical mock loops that build unshakeable offer confidence.",
    icon: Users,
  },
];

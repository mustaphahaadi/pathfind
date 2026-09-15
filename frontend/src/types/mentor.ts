export type MentorCategory =
  | "UX & Product Design"
  | "Software Engineering"
  | "Product Management"
  | "Brand & Design Systems"
  | "Technical Writing";

export interface MentorReview {
  reviewerName: string;
  reviewerRole: string;
  quote: string;
  sessionTopic: string;
  date: string;
}

export interface MentorExperience {
  title: string;
  org: string;
  location: string;
  period: string;
  description: string;
}

export interface SkillGroup {
  groupLabel: string;
  skills: string[];
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  imageUrl: string;
  category: MentorCategory;
  /** Matches an onboarding technical-track id, used to compute goal-match relevance. */
  trackId: string;
  tags: string[];
  available: boolean;
  verified: boolean;
  rating: number;
  reviewCount: number;
  sessionsGiven: number;
  bio: string;
  nextOpening: string;
  sessionFormat: string;
  durationMinutes: number;
  /** Static sample "goal match" percentage shown on personalized recommendation views. */
  matchScore: number;

  // Public profile page content
  location: string;
  language: string;
  attendanceRate: number;
  responseTime: string;
  philosophy: string;
  aboutParagraphs: string[];
  skillGroups: SkillGroup[];
  experience: MentorExperience[];
  reviews: MentorReview[];
}

// ─── Mirrors of backend Pydantic schemas ──────────────────────────────────────
// Keep in sync with backend/schemas.py

export type VerificationStatus =
  | "pending_verification"
  | "verified"
  | "rejected";

export type RequestType =
  | "cv_review"
  | "portfolio_feedback"
  | "career_path_conversation"
  | "interview_preparation"
  | "role_industry_insight";

export type RequestStatus = "pending" | "accepted" | "declined" | "completed";

// ── Auth ───────────────────────────────────────────────────────────────────────

export interface Token {
  access_token: string;
  token_type: string;
}

export interface UserOut {
  id: number;
  email: string;
  role: "mentee" | "mentor" | "admin";
  verification_status: VerificationStatus;
  profile: MentorProfileRead | null;
}

// ── Mentor profile ─────────────────────────────────────────────────────────────

export interface MentorProfileRead {
  id: number;
  user_id: number;
  full_name: string;
  job_title: string;
  company: string;
  years_of_experience: number;
  bio: string;
  expertise_tags: string; // comma-separated
  availability: string;
  avatar_url: string | null;
  location: string | null;
  linkedin_url: string | null;
}

// ── Mentorship requests ────────────────────────────────────────────────────────

export interface MentorshipRequestRead {
  id: string;
  mentee_id: number;
  mentor_id: number;
  request_type: RequestType;
  subject: string;
  message: string;
  resume_url: string | null;
  portfolio_url: string | null;
  github_url: string | null;
  response_message: string | null;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
  mentee_email: string | null;
  mentor_email: string | null;
  mentor_profile: MentorProfileRead | null;
}

// ── File upload ────────────────────────────────────────────────────────────────

export interface FileUploadResponse {
  filename: string;
  url: string;
  content_type: string;
  size_bytes: number;
}

// ── Request payloads ───────────────────────────────────────────────────────────

export interface UserLoginPayload {
  email: string;
  password: string;
}

export interface UserCreatePayload {
  email: string;
  password: string;
  role?: "mentee";
}

export interface UserCreateMentorPayload {
  email: string;
  password: string;
  full_name: string;
  job_title: string;
  company: string;
  years_of_experience: number;
  bio: string;
  expertise_tags: string; // comma-separated
  availability: string;
  avatar_url?: string | null;
  location?: string | null;
  linkedin_url?: string | null;
}

export interface MentorshipRequestCreatePayload {
  mentor_id: number;
  request_type: RequestType;
  subject: string;
  message: string;
  resume_url?: string | null;
  portfolio_url?: string | null;
  github_url?: string | null;
}

export interface MentorshipStatusUpdatePayload {
  status: RequestStatus;
  response_message?: string | null;
}

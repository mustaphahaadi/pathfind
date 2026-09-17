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
  meeting_link: string | null;
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
  meeting_link?: string | null;
}

export interface MentorshipStatusUpdatePayload {
  status: RequestStatus;
  response_message?: string | null;
  meeting_link?: string | null;
}

export interface SavedMentorRead {
  id: number;
  user_id: number;
  mentor_id: number;
  created_at: string;
  mentor?: MentorProfileRead | null;
  mentor_profile?: MentorProfileRead | null;
}

export interface SessionNoteRead {
  id: number;
  user_id: number;
  request_id?: string | null;
  title: string;
  content: string;
  resource_url?: string | null;
  created_at: string;
}

export interface GoalRead {
  id: number;
  user_id: number;
  title: string;
  category: string;
  target_date: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface GoalCreatePayload {
  title: string;
  category?: string;
  target_date?: string;
  completed?: boolean;
}

export interface GoalUpdatePayload {
  title?: string;
  category?: string;
  target_date?: string;
  completed?: boolean;
}

export interface UserSettingsRead {
  user_id: number;
  email_notifications: boolean;
  session_reminders: boolean;
  weekly_digest: boolean;
}

export interface UserSettingsUpdatePayload {
  email_notifications?: boolean;
  session_reminders?: boolean;
  weekly_digest?: boolean;
}

export interface AdminStatsOut {
  total_users: number;
  total_mentors: number;
  verified_mentors: number;
  pending_mentors: number;
  total_mentees: number;
  total_requests: number;
  pending_requests: number;
  accepted_requests: number;
  completed_requests: number;
  total_session_notes: number;
  total_saved_mentors: number;
}


import { useAuthStore } from "../store/useAuthStore";
import type {
  Token,
  UserOut,
  MentorProfileRead,
  MentorshipRequestRead,
  FileUploadResponse,
  UserLoginPayload,
  UserCreatePayload,
  UserCreateMentorPayload,
  MentorshipRequestCreatePayload,
  MentorshipStatusUpdatePayload,
} from "../types/api";

const BASE_URL = "http://localhost:8000";

// ── Core fetch wrapper ─────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  authToken?: string,
): Promise<T> {
  const token = authToken ?? useAuthStore.getState().token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const body = await res.json();
      if (typeof body?.detail === "string") {
        message = body.detail;
      } else if (Array.isArray(body?.detail)) {
        message = body.detail.map((d: { msg?: string }) => d.msg || JSON.stringify(d)).join(", ");
      } else if (body?.detail) {
        message = JSON.stringify(body.detail);
      }
    } catch {
      // ignore JSON parse error
    }
    throw new Error(message);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

// ── Multipart (file upload) — no Content-Type header so browser sets boundary ──

async function upload(file: File): Promise<FileUploadResponse> {
  const token = useAuthStore.getState().token;
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    headers,
    body: form,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.detail ?? `Upload failed: ${res.status}`);
  }

  return res.json();
}

// ── Auth ───────────────────────────────────────────────────────────────────────

export const api = {
  health: () => request<{ status: string }>("/health"),

  auth: {
    signIn: (payload: UserLoginPayload) =>
      request<Token>("/auth/signin", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    signUp: (payload: UserCreatePayload) =>
      request<UserOut>("/auth/signup", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    signUpMentor: (payload: UserCreateMentorPayload) =>
      request<UserOut>("/auth/signup/mentor", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    me: (token?: string) => request<UserOut>("/auth/me", {}, token),
  },

  // ── Profiles ───────────────────────────────────────────────────────────────

  profiles: {
    update: (payload: Partial<{
      full_name: string;
      job_title: string;
      company: string;
      years_of_experience: number;
      bio: string;
      expertise_tags: string;
      availability: string;
      avatar_url: string | null;
      location: string | null;
      linkedin_url: string | null;
    }>) =>
      request<UserOut>("/profiles/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
  },

  // ── Mentors ────────────────────────────────────────────────────────────────

  mentors: {
    list: (params?: {
      query?: string;
      expertise?: string;
      verified_only?: boolean;
      limit?: number;
      offset?: number;
    }) => {
      const qs = new URLSearchParams();
      if (params?.query) qs.set("query", params.query);
      if (params?.expertise) qs.set("expertise", params.expertise);
      if (params?.verified_only !== undefined)
        qs.set("verified_only", String(params.verified_only));
      if (params?.limit !== undefined) qs.set("limit", String(params.limit));
      if (params?.offset !== undefined) qs.set("offset", String(params.offset));
      const q = qs.toString();
      return request<MentorProfileRead[]>(`/mentors${q ? `?${q}` : ""}`);
    },

    get: (mentorId: number) =>
      request<MentorProfileRead>(`/mentors/${mentorId}`),
  },

  // ── Mentorship requests ────────────────────────────────────────────────────

  requests: {
    create: (payload: MentorshipRequestCreatePayload) =>
      request<MentorshipRequestRead>("/mentorship-requests", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    list: () => request<MentorshipRequestRead[]>("/mentorship-requests"),

    get: (id: string) => request<MentorshipRequestRead>(`/mentorship-requests/${id}`),

    updateStatus: (id: string, payload: MentorshipStatusUpdatePayload) =>
      request<MentorshipRequestRead>(`/mentorship-requests/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),

    cancel: (id: string) =>
      request<void>(`/mentorship-requests/${id}`, { method: "DELETE" }),

    listTypes: () => request<string[]>("/mentorship-request-types"),
  },

  // ── Saved Mentors ──────────────────────────────────────────────────────────

  savedMentors: {
    save: (mentorId: number) =>
      request<{ id: number; user_id: number; mentor_id: number }>("/saved-mentors", {
        method: "POST",
        body: JSON.stringify({ mentor_id: mentorId }),
      }),

    list: () =>
      request<
        Array<{
          id: number;
          user_id: number;
          mentor_id: number;
          created_at: string;
          mentor_profile: MentorProfileRead | null;
        }>
      >("/saved-mentors"),

    remove: (mentorId: number) =>
      request<void>(`/saved-mentors/${mentorId}`, { method: "DELETE" }),
  },

  // ── Mentor Reviews ─────────────────────────────────────────────────────────

  reviews: {
    create: (mentorId: number, payload: { rating: number; session_topic: string; quote: string }) =>
      request<{
        id: number;
        mentor_id: number;
        mentee_id: number;
        rating: number;
        reviewer_name: string;
        reviewer_role: string;
        session_topic: string;
        quote: string;
        created_at: string;
      }>(`/mentors/${mentorId}/reviews`, {
        method: "POST",
        body: JSON.stringify({ mentor_id: mentorId, ...payload }),
      }),

    list: (mentorId: number) =>
      request<
        Array<{
          id: number;
          mentor_id: number;
          mentee_id: number;
          rating: number;
          reviewer_name: string;
          reviewer_role: string;
          session_topic: string;
          quote: string;
          created_at: string;
        }>
      >(`/mentors/${mentorId}/reviews`),
  },

  // ── Session Notes ──────────────────────────────────────────────────────────

  notes: {
    create: (payload: { request_id?: string; title: string; content: string; resource_url?: string }) =>
      request<{
        id: number;
        user_id: number;
        request_id?: string;
        title: string;
        content: string;
        resource_url?: string;
        created_at: string;
      }>("/session-notes", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    list: () =>
      request<
        Array<{
          id: number;
          user_id: number;
          request_id?: string;
          title: string;
          content: string;
          resource_url?: string;
          created_at: string;
        }>
      >("/session-notes"),

    delete: (noteId: number) =>
      request<void>(`/session-notes/${noteId}`, { method: "DELETE" }),
  },

  // ── Admin ──────────────────────────────────────────────────────────────────

  admin: {
    listPendingMentors: () => request<UserOut[]>("/admin/mentors/pending"),

    approveMentor: (mentorId: number) =>
      request<UserOut>(`/admin/mentors/${mentorId}/approve`, { method: "POST" }),

    rejectMentor: (mentorId: number) =>
      request<UserOut>(`/admin/mentors/${mentorId}/reject`, { method: "POST" }),
  },

  // ── File upload ────────────────────────────────────────────────────────────

  upload,
};

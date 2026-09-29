import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Inbox,
  CalendarDays,
  Users,
  Settings,
  Eye,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Circle,
  HandCoins,
  Pencil,
  Video,
  ExternalLink,
  FileText,
  Globe,
  Code,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useMentorOnboardingStore } from "../store/useMentorOnboardingStore";
import { mentorHonorCodeItems } from "../data/mentor-onboarding/options";
import { useAuthStore } from "../store/useAuthStore";
import { api } from "../lib/api";
import type { MentorshipRequestRead } from "../types/api";

type TabId = "overview" | "requests" | "scheduled" | "feedback" | "availability";

const tabs: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "requests", label: "Incoming Requests" },
  { id: "scheduled", label: "Scheduled Sessions" },
  { id: "feedback", label: "Past Mentees & Feedback" },
  { id: "availability", label: "Availability & Settings" },
];

const MentorDashboardPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const user = useAuthStore((s) => s.user);
  const fullName = user?.profile?.full_name ?? useMentorOnboardingStore.getState().fullName;
  const weeklyWindows = useMentorOnboardingStore((state) => state.weeklyWindows);
  const acceptingRequests = useMentorOnboardingStore((state) => state.acceptingRequests);
  const agreedHonorCodeIds = useMentorOnboardingStore((state) => state.agreedHonorCodeIds);
  const hasCompletedOnboarding = useMentorOnboardingStore((state) => state.hasCompletedOnboarding);
  const toggleAcceptingRequests = useMentorOnboardingStore((state) => state.toggleAcceptingRequests);

  const [requests, setRequests] = useState<MentorshipRequestRead[]>([]);

  useEffect(() => {
    api.requests.list()
      .then(setRequests)
      .catch(() => {});
  }, []);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeModalRequest, setActiveModalRequest] = useState<{ id: string; status: "accepted" | "declined" } | null>(null);
  const [responseNote, setResponseNote] = useState("");
  const [meetingLink, setMeetingLink] = useState("");

  const handleStatusChange = async (requestId: string, status: "accepted" | "declined" | "completed", message?: string, link?: string) => {
    setActionLoading(requestId);
    try {
      const updated = await api.requests.updateStatus(requestId, {
        status,
        response_message: message || undefined,
        meeting_link: link || undefined,
      });
      setRequests((prev) => prev.map((r) => (r.id === requestId ? updated : r)));
      setActiveModalRequest(null);
      setResponseNote("");
      setMeetingLink("");
    } catch {
      // keep existing state
    } finally {
      setActionLoading(null);
    }
  };

  const firstName = fullName.split(" ")[0] || "there";
  const monthlyCapacity = weeklyWindows.reduce((sum, window) => sum + window.maxCalls, 0);
  const profileUrl = `https://pathfind.alphateam.live/mentors/${user?.id ?? "me"}`;
  const shareLink = profileUrl;

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const acceptedRequests = requests.filter((r) => r.status === "accepted");
  const completedRequests = requests.filter((r) => r.status === "completed");

  const pendingCount = pendingRequests.length;
  const sessionsBooked = acceptedRequests.length + completedRequests.length;
  const menteesGuided = new Set(completedRequests.map((r) => r.mentee_id)).size;
  const hasRatings = menteesGuided > 0;

  const readinessChecks = [
    { label: "Profile Published", complete: hasCompletedOnboarding || !!user?.profile },
    { label: "Availability Configured", complete: weeklyWindows.length > 0 || !!user?.profile?.availability },
    { label: "Honor Code Signed", complete: agreedHonorCodeIds.length === mentorHonorCodeItems.length },
  ];
  const readinessCompleteCount = readinessChecks.filter((check) => check.complete).length;

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header variant="solid" />

      <main className="flex-1 px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Executive Mentor Header Banner */}
          <div className="rounded-2xl border border-surface-line bg-white p-6 sm:p-8 text-ink shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-line/60 pb-5">
              <div className="flex flex-wrap items-center gap-2.5">
                {user?.verification_status === "verified" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/80">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Verified Mentor Profile
                  </span>
                ) : user?.verification_status === "rejected" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 border border-rose-200/80">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    Verification Rejected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200/80">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Pending Admin Verification
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 border border-neutral-200">
                  Capacity: {monthlyCapacity} Calls / Month
                </span>
              </div>
              <button
                type="button"
                onClick={toggleAcceptingRequests}
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold transition-all border ${
                  acceptingRequests
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${acceptingRequests ? "bg-emerald-500" : "bg-amber-500"}`} />
                {acceptingRequests ? "Accepting Mentees" : "Paused"}
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  Welcome back, {firstName}
                </h1>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink/60 sm:text-base">
                  Your volunteer mentor hub &middot; Review pending booking requests, conduct 1:1 sessions, and guide Ghana&apos;s rising tech talent.
                </p>
              </div>
              <div className="flex shrink-0 gap-2.5">
                <Link
                  to="/onboarding/mentor/identity-verification"
                  id="edit-profile-btn"
                  className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-xs"
                >
                  <Pencil size={15} />
                  Edit Profile
                </Link>
                <Link
                  to={`/mentors/${user?.id ?? "me"}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-surface-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-all hover:bg-surface hover:border-ink/20"
                >
                  <Eye size={15} />
                  View Public Card
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-surface-line bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-amber-500/30">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-ink/40">
                  Pending Requests
                </p>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                  <Inbox size={18} strokeWidth={2} />
                </span>
              </div>
              <p className="mt-3 text-3xl font-black text-ink">{pendingCount}</p>
              <p className="mt-1 text-xs font-medium text-ink/50">Awaiting your response</p>
            </div>

            <div className="rounded-2xl border border-surface-line bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-emerald-500/30">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-ink/40">
                  Sessions Scheduled
                </p>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <CalendarDays size={18} strokeWidth={2} />
                </span>
              </div>
              <p className="mt-3 text-3xl font-black text-ink">{acceptedRequests.length}</p>
              <p className="mt-1 text-xs font-medium text-ink/50">Active mentorship bookings</p>
            </div>

            <div className="rounded-2xl border border-surface-line bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-indigo-500/30">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-ink/40">
                  Mentees Guided
                </p>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                  <Users size={18} strokeWidth={2} />
                </span>
              </div>
              <p className="mt-3 text-3xl font-black text-ink">{menteesGuided}</p>
              <p className="mt-1 text-xs font-medium text-ink/50">Mentees guided so far</p>
            </div>

            <div className="rounded-2xl border border-surface-line bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-amber-500/30">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-ink/40">
                  Community Standing
                </p>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-500">
                  <ShieldCheck size={18} strokeWidth={2} />
                </span>
              </div>
              <p className="mt-3 text-2xl font-black text-ink">
                {hasRatings ? "5.0" : "100% Verified"}
              </p>
              <p className="mt-1 text-xs font-medium text-ink/50">
                {hasRatings
                  ? "Average mentee rating"
                  : "Verified volunteer mentor"}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 flex gap-1.5 overflow-x-auto rounded-2xl border border-surface-line bg-white p-2 shadow-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  tab.id === activeTab
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/15"
                    : "text-ink/70 hover:bg-surface hover:text-ink"
                }`}
              >
                {tab.label}
                {tab.id === "requests" && pendingCount > 0 && (
                  <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-xs font-extrabold text-amber-500">
                    {pendingCount}
                  </span>
                )}
                {tab.id === "scheduled" && acceptedRequests.length > 0 && (
                  <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-xs font-extrabold text-emerald-600">
                    {acceptedRequests.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.8fr_1fr]">
              <div className="flex flex-col gap-6">
                <div className="rounded-3xl border border-surface-line bg-white p-6 sm:p-8">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-accent-green" />
                    <p className="text-xs font-semibold tracking-wide text-accent-green">
                      DIRECT MENTOR PROFILE LINK
                    </p>
                  </div>
                  <h2 className="mt-2 text-2xl font-extrabold text-ink">
                    Share your pathfind directory link
                  </h2>
                  <p className="mt-1 text-sm text-ink/60">
                    Mentees can review your background, focus topics, and request 1:1 sessions.
                  </p>

                  <div className="mt-4 flex items-center gap-2 rounded-2xl bg-surface p-3.5">
                    <span className="flex-1 overflow-hidden">
                      <a
                        href={shareLink}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-xs font-medium text-accent-blue hover:underline break-all"
                      >
                        {shareLink}
                      </a>
                    </span>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(shareLink)}
                      className="shrink-0 rounded-xl border border-surface-line bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>

                {/* Incoming Requests Overview Section */}
                <div className="rounded-3xl border border-surface-line bg-white p-6">
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1.5 text-base font-bold text-ink">
                      <Inbox size={17} />
                      Pending Mentee Requests
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("requests")}
                      className="text-xs font-semibold text-accent-blue hover:underline"
                    >
                      View All ({pendingCount})
                    </button>
                  </div>

                  {pendingRequests.length === 0 ? (
                    <div className="mt-4 flex items-start gap-4 rounded-2xl border border-surface-line bg-surface/40 p-5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-surface-line bg-white text-ink/40">
                        <Mail size={18} />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-ink">No pending requests yet</p>
                        <p className="mt-0.5 text-xs text-ink/60">
                          Make sure your profile is set to <span className="font-semibold text-ink">Accepting Mentees</span> so mentees in your area of expertise can find you.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <ul className="mt-4 space-y-3">
                      {pendingRequests.slice(0, 3).map((req) => (
                        <li
                          key={req.id}
                          className="flex flex-col gap-3 rounded-2xl border border-surface-line bg-surface/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-ink">{req.subject}</p>
                              <span className="rounded-full bg-accent-gold/10 px-2.5 py-0.5 text-xs font-semibold text-accent-gold">
                                PENDING
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-ink/60">
                              Mentee: <span className="font-semibold text-ink">{req.mentee_email}</span> &middot; Type: {req.request_type.replace(/_/g, " ")}
                            </p>
                            <p className="mt-1 text-xs text-ink/70 line-clamp-2">&ldquo;{req.message}&rdquo;</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveModalRequest({ id: req.id, status: "accepted" })}
                              className="rounded-xl bg-accent-green px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveModalRequest({ id: req.id, status: "declined" })}
                              className="rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                            >
                              Decline
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="flex flex-col gap-5">
                <div className="rounded-2xl border border-surface-line bg-white p-5">
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
                      <Settings size={15} />
                      Availability Controls
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between rounded-xl bg-surface p-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">Accepting new requests</p>
                      <p className="text-xs text-ink/50">Visible in public directory</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={acceptingRequests}
                      onClick={toggleAcceptingRequests}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                        acceptingRequests ? "bg-emerald-500" : "bg-neutral-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          acceptingRequests ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ink/60">Monthly Target</span>
                      <span className="font-semibold text-ink">{monthlyCapacity} sessions/mo</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface">
                      <div
                        className="h-full rounded-full bg-ink"
                        style={{
                          width: monthlyCapacity > 0 ? `${(sessionsBooked / monthlyCapacity) * 100}%` : "0%",
                        }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-ink/50">
                      {sessionsBooked} of {monthlyCapacity} allocated this month
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                      Recurring Office Hours
                    </p>
                    {weeklyWindows.length === 0 ? (
                      <p className="mt-2 text-xs text-ink/50">No recurring slots added. Use the link below to configure your weekly hours.</p>
                    ) : (
                      <div className="mt-2 flex flex-col gap-2">
                        {weeklyWindows.map((window) => (
                          <div
                            key={window.id}
                            className="flex items-center justify-between rounded-lg bg-surface px-3 py-2 text-sm"
                          >
                            <span className="font-medium text-ink">{window.day}s</span>
                            <span className="text-ink/60">
                              {window.startTime} - {window.endTime}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link
                    to="/onboarding/mentor/availability-capacity"
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-surface-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface"
                  >
                    Edit Recurring Slots
                  </Link>
                </div>

                <div className="rounded-2xl border border-surface-line bg-white p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-ink">Mentor Readiness</p>
                    <span className="text-xs font-medium text-ink/50">
                      {readinessCompleteCount} of {readinessChecks.length} complete
                    </span>
                  </div>
                  <ul className="mt-3 space-y-2.5">
                    {readinessChecks.map((check) => (
                      <li key={check.label} className="flex items-center gap-2.5 text-sm">
                        {check.complete ? (
                          <CheckCircle2 size={16} className="shrink-0 text-accent-green" />
                        ) : (
                          <Circle size={16} className="shrink-0 text-ink/30" />
                        )}
                        <span className={check.complete ? "text-ink" : "text-ink/50"}>
                          {check.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-surface-line bg-white p-5">
                  <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
                    <ShieldCheck size={15} />
                    Honor Code Reminder
                  </p>
                  <p className="mt-1 text-sm text-ink/60">
                    Pathfind is built entirely on trust and generous voluntary support.
                    As an official mentor, you agreed to:
                  </p>
                  <ul className="mt-3 space-y-1.5 text-sm text-ink/70">
                    {mentorHonorCodeItems.map((item) => (
                      <li key={item.id} className="flex gap-2">
                        <span className="text-ink/30">—</span>
                        <span>
                          <span className="font-semibold text-ink">{item.title}:</span>{" "}
                          {item.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/honor-code"
                    className="mt-3 inline-block text-xs font-semibold text-accent-blue hover:underline"
                  >
                    Read Complete Mentor Handbook →
                  </Link>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-surface p-4 text-sm text-ink/70">
                  <HandCoins size={16} className="mt-0.5 shrink-0 text-accent-blue" />
                  <p>
                    <span className="font-semibold text-ink">
                      100% Free &amp; Open Tech Mentorship.
                    </span>{" "}
                    Zero hidden fees, zero paywalls. Forever.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INCOMING REQUESTS */}
          {activeTab === "requests" && (
            <div className="mt-6 rounded-3xl border border-surface-line bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-surface-line pb-4">
                <div>
                  <h2 className="text-xl font-bold text-ink">Incoming Mentorship Requests</h2>
                  <p className="text-sm text-ink/60">
                    Review and respond to mentorship requests submitted by Ghana tech transitioners.
                  </p>
                </div>
                <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink">
                  {pendingRequests.length} Pending
                </span>
              </div>

              {pendingRequests.length === 0 ? (
                <div className="mt-6 flex items-start gap-4 rounded-2xl border border-surface-line bg-surface/40 p-6">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-surface-line bg-white text-ink/40">
                    <Inbox size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">No pending requests</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink/60">
                      When a mentee submits a request that matches your listed expertise, it will appear here. Ensure your profile is marked as <span className="font-semibold text-ink">Accepting Mentees</span>.
                    </p>
                  </div>
                </div>
              ) : (
                <ul className="mt-6 space-y-4">
                  {pendingRequests.map((req) => (
                    <li key={req.id} className="rounded-2xl border border-surface-line bg-surface/30 p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <span className="inline-block rounded-full bg-accent-gold/10 px-2.5 py-0.5 text-xs font-semibold text-accent-gold">
                            PENDING REVIEW
                          </span>
                          <h3 className="mt-2 text-lg font-bold text-ink">{req.subject}</h3>
                          <p className="text-xs text-ink/60">
                            Mentee Email: <span className="font-semibold text-ink">{req.mentee_email}</span> &middot; Type:{" "}
                            <span className="font-medium text-ink">{req.request_type.replace(/_/g, " ")}</span> &middot; Submitted on{" "}
                            {new Date(req.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveModalRequest({ id: req.id, status: "accepted" })}
                            className="rounded-xl bg-accent-green px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
                          >
                            Accept Request
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveModalRequest({ id: req.id, status: "declined" })}
                            className="rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                          >
                            Decline
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl bg-white p-4 border border-surface-line">
                        <p className="text-xs font-bold uppercase tracking-wider text-ink/40">Mentee Message</p>
                        <p className="mt-1 text-sm text-ink/80">&ldquo;{req.message}&rdquo;</p>
                      </div>

                      {/* Attachments */}
                      {(req.resume_url || req.portfolio_url || req.github_url) && (
                        <div className="mt-3 flex flex-wrap gap-2 pt-1 text-xs">
                          {req.resume_url && (
                            <a
                              href={req.resume_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-surface-line bg-white px-3 py-1.5 font-medium text-ink hover:bg-surface"
                            >
                              <FileText size={14} className="text-neutral-500" /> Resume Attachment
                            </a>
                          )}
                          {req.portfolio_url && (
                            <a
                              href={req.portfolio_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-surface-line bg-white px-3 py-1.5 font-medium text-ink hover:bg-surface"
                            >
                              <Globe size={14} className="text-neutral-500" /> Portfolio Link
                            </a>
                          )}
                          {req.github_url && (
                            <a
                              href={req.github_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-surface-line bg-white px-3 py-1.5 font-medium text-ink hover:bg-surface"
                            >
                              <Code size={14} className="text-neutral-500" /> GitHub Profile
                            </a>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {/* Declined Requests — always visible if any exist */}
              {requests.filter((r) => r.status === "declined").length > 0 && (
                <div className="mt-8 border-t border-surface-line pt-6">
                  <p className="text-sm font-bold uppercase tracking-wider text-ink/50">
                    Declined ({requests.filter((r) => r.status === "declined").length})
                  </p>
                  <ul className="mt-3 space-y-3">
                    {requests
                      .filter((r) => r.status === "declined")
                      .map((req) => (
                        <li
                          key={req.id}
                          className="rounded-xl border border-red-100 bg-red-50/30 p-4"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-ink/60 line-through">
                                {req.subject}
                              </p>
                              <p className="text-xs text-ink/50">
                                {req.mentee_email} &middot; Declined on{" "}
                                {new Date(req.created_at).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                              {req.response_message && (
                                <p className="mt-1 text-xs italic text-ink/60">
                                  &ldquo;{req.response_message}&rdquo;
                                </p>
                              )}
                            </div>
                            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                              Declined
                            </span>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Cancelled Requests */}
              {requests.filter((r) => r.status === "cancelled").length > 0 && (
                <div className="mt-8 border-t border-surface-line pt-6">
                  <p className="text-sm font-bold uppercase tracking-wider text-ink/50">
                    Cancelled by Mentee ({requests.filter((r) => r.status === "cancelled").length})
                  </p>
                  <ul className="mt-3 space-y-3">
                    {requests
                      .filter((r) => r.status === "cancelled")
                      .map((req) => (
                        <li
                          key={req.id}
                          className="rounded-xl border border-red-100 bg-red-50/30 p-4"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-ink/60 line-through">
                                {req.subject}
                              </p>
                              <p className="text-xs text-ink/50">
                                {req.mentee_email} &middot; Cancelled on{" "}
                                {new Date(req.updated_at).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                              {req.cancellation_reason && (
                                <div className="mt-2 text-xs text-red-800">
                                  <span className="font-bold">Cancellation Reason: </span>
                                  &ldquo;{req.cancellation_reason}&rdquo;
                                </div>
                              )}
                            </div>
                            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                              Cancelled
                            </span>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SCHEDULED SESSIONS */}
          {activeTab === "scheduled" && (
            <div className="mt-6 rounded-3xl border border-surface-line bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-surface-line pb-4">
                <div>
                  <h2 className="text-xl font-bold text-ink">Scheduled &amp; Active Sessions</h2>
                  <p className="text-sm text-ink/60">Mentorship sessions you have accepted.</p>
                </div>
                <span className="rounded-full bg-accent-green/10 px-3 py-1 text-xs font-bold text-accent-green">
                  {acceptedRequests.length} Active
                </span>
              </div>

              {acceptedRequests.length === 0 ? (
                <div className="mt-6 flex items-start gap-4 rounded-2xl border border-surface-line bg-surface/40 p-6">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-surface-line bg-white text-ink/40">
                    <CalendarDays size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">No active sessions yet</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink/60">
                      Once you accept a mentee request, the confirmed session will appear here. You can add a Google Meet or Zoom link for the mentee at that point.
                    </p>
                  </div>
                </div>
              ) : (
                <ul className="mt-6 space-y-4">
                  {acceptedRequests.map((req) => (
                    <li key={req.id} className="rounded-2xl border border-accent-green/20 bg-accent-green/5 p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <span className="inline-block rounded-full bg-accent-green px-2.5 py-0.5 text-xs font-bold text-white">
                            ACCEPTED &amp; CONFIRMED
                          </span>
                          <h3 className="mt-2 text-lg font-bold text-ink">{req.subject}</h3>
                          <p className="text-xs text-ink/60">
                            Mentee Contact: <span className="font-semibold text-ink">{req.mentee_email}</span> &middot; Type:{" "}
                            <span className="font-medium text-ink">{req.request_type.replace(/_/g, " ")}</span>
                          </p>
                          {req.response_message && (
                            <p className="mt-2 text-xs text-emerald-800">
                              <span className="font-bold">Your Note to Mentee: </span>&ldquo;{req.response_message}&rdquo;
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {req.meeting_link && (
                            <a
                              href={req.meeting_link.startsWith("http") ? req.meeting_link : `https://${req.meeting_link}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700 shadow-sm"
                            >
                              <Video size={14} />
                              Join Meeting
                              <ExternalLink size={12} className="opacity-70" />
                            </a>
                          )}
                          <button
                            type="button"
                            disabled={actionLoading === req.id}
                            onClick={() => handleStatusChange(req.id, "completed")}
                            className="rounded-xl bg-ink px-4 py-2 text-xs font-bold text-white hover:opacity-90 disabled:opacity-50"
                          >
                            {actionLoading === req.id ? "Updating…" : "Mark as Completed"}
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* TAB 4: PAST MENTEES & FEEDBACK */}
          {activeTab === "feedback" && (
            <div className="mt-6 rounded-3xl border border-surface-line bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold text-ink">Past Mentees &amp; Completed History</h2>
              <p className="text-sm text-ink/60">Records of completed mentorship calls.</p>

              {completedRequests.length === 0 ? (
                <div className="mt-6 flex items-start gap-4 rounded-2xl border border-surface-line bg-surface/40 p-6">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-surface-line bg-white text-ink/40">
                    <Users size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">No completed sessions yet</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink/60">
                      Sessions you mark as completed will be archived here, along with mentee contact history. Your completed count contributes to your community standing.
                    </p>
                  </div>
                </div>
              ) : (
                <ul className="mt-6 space-y-3">
                  {completedRequests.map((req) => (
                    <li key={req.id} className="rounded-xl border border-surface-line p-4">
                      <p className="text-sm font-bold text-ink">{req.subject}</p>
                      <p className="text-xs text-ink/60">
                        Mentee: {req.mentee_email} &middot; Date: {new Date(req.updated_at).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* TAB 5: AVAILABILITY & SETTINGS */}
          {activeTab === "availability" && (
            <div className="mt-6 rounded-3xl border border-surface-line bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold text-ink">Availability &amp; Profile Settings</h2>
              <p className="text-sm text-ink/60">Manage your recurring office hours and visibility.</p>

              <div className="mt-6 space-y-4 max-w-xl">
                <div className="flex items-center justify-between rounded-2xl bg-surface p-4">
                  <div>
                    <p className="text-sm font-bold text-ink">Accepting new mentee requests</p>
                    <p className="text-xs text-ink/50">Show profile in public mentor directory</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={acceptingRequests}
                    onClick={toggleAcceptingRequests}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                      acceptingRequests ? "bg-emerald-500" : "bg-neutral-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        acceptingRequests ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="rounded-2xl border border-surface-line p-4">
                  <p className="text-sm font-bold text-ink">Recurring Weekly Office Hours</p>
                  {weeklyWindows.length === 0 ? (
                    <p className="mt-2 text-xs text-ink/50">No recurring office hours configured yet. Add your available windows below.</p>
                  ) : (
                    <ul className="mt-3 space-y-2">
                      {weeklyWindows.map((w) => (
                        <li key={w.id} className="flex justify-between rounded-lg bg-surface px-3 py-2 text-xs">
                          <span className="font-semibold text-ink">{w.day}s</span>
                          <span>{w.startTime} – {w.endTime} ({w.maxCalls} calls)</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link
                    to="/onboarding/mentor/availability-capacity"
                    className="mt-4 inline-flex items-center justify-center rounded-xl bg-ink px-4 py-2 text-xs font-bold text-white hover:opacity-90"
                  >
                    Edit Availability Windows
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Response Note Modal */}
      {activeModalRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-ink">
              {activeModalRequest.status === "accepted" ? "Accept Request" : "Decline Request"}
            </h3>
            <p className="mt-1 text-xs text-ink/60">
              {activeModalRequest.status === "accepted"
                ? "Add an optional note or video room link for the mentee."
                : "Add an optional explanation or feedback for the mentee."}
            </p>

            <textarea
              rows={3}
              value={responseNote}
              onChange={(e) => setResponseNote(e.target.value)}
              placeholder={
                activeModalRequest.status === "accepted"
                  ? "Glad to help! Let's connect at this time..."
                  : "Thank you for reaching out. Unfortunately..."
              }
              className="mt-3 w-full rounded-xl border border-surface-line p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
            />

            {activeModalRequest.status === "accepted" && (
              <div className="mt-3">
                <label className="block text-xs font-semibold text-ink">Meeting / Video Link (optional)</label>
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/abc-defg-hij"
                  className="mt-1 w-full rounded-xl border border-surface-line p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
                />
              </div>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveModalRequest(null);
                  setResponseNote("");
                  setMeetingLink("");
                }}
                className="rounded-xl border border-surface-line bg-white px-4 py-2 text-xs font-semibold text-ink hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading === activeModalRequest.id}
                onClick={() => handleStatusChange(activeModalRequest.id, activeModalRequest.status, responseNote, meetingLink)}
                className={`rounded-xl px-4 py-2 text-xs font-bold text-white ${
                  activeModalRequest.status === "accepted" ? "bg-accent-green" : "bg-red-600"
                }`}
              >
                {actionLoading === activeModalRequest.id ? "Saving…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MentorDashboardPage;

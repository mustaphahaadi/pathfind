import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutGrid,
  CalendarDays,
  Bookmark,
  FileText,
  Target,
  Settings,
  Search,
  Sparkles,
  CalendarCheck2,
  History,
  Lightbulb,
  Video,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  ExternalLink,
  Pencil,
  Save,
  Bell,
  User,
  Check,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProfileHeaderCard from "../components/profile/ProfileHeaderCard";
import QuickStartRoadmap from "../components/profile/QuickStartRoadmap";
import MentorMiniCard from "../components/profile/MentorMiniCard";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { useSessionsStore } from "../store/useSessionsStore";
import { useAuthStore } from "../store/useAuthStore";
import { api } from "../lib/api";
import type {
  MentorshipRequestRead,
  MentorProfileRead,
  SavedMentorRead,
  SessionNoteRead,
  GoalRead,
} from "../types/api";
import type { Mentor } from "../types/mentor";
import { mentors } from "../data/mentors";
import { getRecommendedMentors } from "../lib/getRecommendedMentors";

type TabId = "overview" | "sessions" | "saved" | "notes" | "goals" | "settings";

const tabs: { id: TabId; label: string; icon: typeof LayoutGrid }[] = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "sessions", label: "Upcoming Sessions", icon: CalendarDays },
  { id: "saved", label: "Saved Mentors", icon: Bookmark },
  { id: "notes", label: "Notes & Resources", icon: FileText },
  { id: "goals", label: "Mentorship Goals & Tracks", icon: Target },
  { id: "settings", label: "Settings", icon: Settings },
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const user = useAuthStore((s) => s.user);
  const fullName = user?.profile?.full_name || useOnboardingStore.getState().fullName;
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);
  const technicalTracks = useOnboardingStore((state) => state.technicalTracks);
  const savedMentorIds = useSessionsStore((state) => state.savedMentorIds);

  const [requests, setRequests] = useState<MentorshipRequestRead[]>([]);
  const [dbMentors, setDbMentors] = useState<MentorProfileRead[]>([]);
  const [dbSavedMentors, setDbSavedMentors] = useState<SavedMentorRead[]>([]);
  const [sessionNotes, setSessionNotes] = useState<SessionNoteRead[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteResource, setNewNoteResource] = useState("");
  const [creatingNote, setCreatingNote] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);

  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editResource, setEditResource] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // Fix 16 — Goals state (backed by DB)
  const [goals, setGoals] = useState<GoalRead[]>([]);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalCategory, setNewGoalCategory] = useState("Technical Skill");
  const [newGoalTargetDate, setNewGoalTargetDate] = useState("Q4 2026");
  const [showGoalForm, setShowGoalForm] = useState(false);

  // Fix 16 — Settings state (backed by DB & profile endpoint)
  const updateUser = useAuthStore((s) => s.updateUser);
  const [settingsName, setSettingsName] = useState(user?.profile?.full_name || "");
  const [settingsLocation, setSettingsLocation] = useState(user?.profile?.location || "");
  const [settingsBio, setSettingsBio] = useState(user?.profile?.bio || "");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);

  const [prevProfile, setPrevProfile] = useState(user?.profile);
  if (user?.profile !== prevProfile) {
    setPrevProfile(user?.profile);
    if (user?.profile) {
      setSettingsName(user.profile.full_name || "");
      setSettingsLocation(user.profile.location || "");
      setSettingsBio(user.profile.bio || "");
    }
  }

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    try {
      const created = await api.goals.create({
        title: newGoalTitle.trim(),
        category: newGoalCategory,
        target_date: newGoalTargetDate.trim() || "Q4 2026",
      });
      setGoals((prev) => [created, ...prev]);
      setNewGoalTitle("");
      setShowGoalForm(false);
    } catch {
      // fallback
    }
  };

  const handleToggleGoal = async (goalId: number, currentCompleted: boolean) => {
    try {
      const updated = await api.goals.update(goalId, { completed: !currentCompleted });
      setGoals((prev) => prev.map((g) => (g.id === goalId ? updated : g)));
    } catch {
      // fallback
    }
  };

  const handleDeleteGoal = async (goalId: number) => {
    try {
      await api.goals.delete(goalId);
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
    } catch {
      // fallback
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMessage(null);
    try {
      if (user) {
        const updatedUser = await api.profiles.update({
          full_name: settingsName.trim() || user.profile?.full_name || "Mentee User",
          location: settingsLocation.trim() || user.profile?.location || "Ghana / Remote",
          bio: settingsBio.trim(),
        });
        updateUser(updatedUser);
      }
      const updatedSettings = await api.settings.update({
        email_notifications: emailNotifs,
        session_reminders: sessionReminders,
        weekly_digest: weeklyDigest,
      });
      setEmailNotifs(updatedSettings.email_notifications);
      setSessionReminders(updatedSettings.session_reminders);
      setWeeklyDigest(updatedSettings.weekly_digest);
      setSettingsMessage("Settings saved successfully!");
    } catch {
      setSettingsMessage("Failed to save settings. Please try again.");
    } finally {
      setSavingSettings(false);
      setTimeout(() => setSettingsMessage(null), 4000);
    }
  };

  useEffect(() => {
    api.requests
      .list()
      .then(setRequests)
      .catch(() => {})
      .finally(() => setLoadingRequests(false));

    api.mentors
      .list()
      .then(setDbMentors)
      .catch(() => {});

    api.savedMentors
      .list()
      .then(setDbSavedMentors)
      .catch(() => {});

    api.notes
      .list()
      .then(setSessionNotes)
      .catch(() => {});
    api.goals
      .list()
      .then(setGoals)
      .catch(() => {});

    api.settings
      .get()
      .then((s) => {
        setEmailNotifs(s.email_notifications);
        setSessionReminders(s.session_reminders);
        setWeeklyDigest(s.weekly_digest);
      })
      .catch(() => {});
  }, []);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    setCreatingNote(true);
    try {
      const created = await api.notes.create({
        title: newNoteTitle,
        content: newNoteContent,
        resource_url: newNoteResource.trim() || undefined,
      });
      setSessionNotes((prev) => [created, ...prev]);
      setNewNoteTitle("");
      setNewNoteContent("");
      setNewNoteResource("");
      setShowNoteForm(false);
    } catch {
      // fallback
    } finally {
      setCreatingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    try {
      await api.notes.delete(noteId);
      setSessionNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch {
      // fallback
    }
  };

  const startEditNote = (note: SessionNoteRead) => {
    setEditingNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditResource(note.resource_url ?? "");
  };

  const handleSaveNote = async (noteId: number) => {
    if (!editTitle.trim() || !editContent.trim()) return;
    setSavingNote(true);
    try {
      const updated = await api.notes.update(noteId, {
        title: editTitle.trim(),
        content: editContent.trim(),
        resource_url: editResource.trim() || null,
      });
      setSessionNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, ...updated } : n)),
      );
      setEditingNoteId(null);
    } catch {
      // fallback
    } finally {
      setSavingNote(false);
    }
  };
  const handleCancelRequest = async (requestId: string) => {
    setCancellingId(requestId);
    try {
      await api.requests.cancel(requestId);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch {
      // ignore
    } finally {
      setCancellingId(null);
    }
  };

  const sessions = requests.map((r) => ({
    id: r.id,
    mentorId: String(r.mentor_id),
    mentorName: r.mentor_profile?.full_name || "Mentor",
    mentorRole: r.mentor_profile?.job_title || "Tech Professional",
    mentorCompany: r.mentor_profile?.company || "",
    mentorImage: r.mentor_profile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    dateLabel: new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    timeLabel: new Date(r.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    durationMinutes: 45,
    videoLink: "#",
    focusTopicLabels: [r.request_type],
    note: r.message,
    status: r.status,
  }));

  const latestSession = sessions.find((s) => s.status === "accepted" || s.status === "pending");
  const latestSessionMentor = latestSession
    ? {
        id: latestSession.mentorId,
        name: latestSession.mentorName,
        role: latestSession.mentorRole,
        company: latestSession.mentorCompany,
        imageUrl: latestSession.mentorImage,
      }
    : null;

  const mappedRealMentors: Mentor[] = dbMentors.map((p) => ({
    id: String(p.user_id),
    name: p.full_name,
    role: p.job_title || "Senior Engineer",
    company: p.company || "Technology Partner",
    imageUrl: p.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    category: "Software Engineering",
    trackId: "software-engineering",
    tags: p.expertise_tags ? p.expertise_tags.split(",").map((s) => s.trim()) : ["Software Engineering", "Career Guidance"],
    available: true,
    verified: true,
    rating: 5,
    reviewCount: 12,
    sessionsGiven: (p.years_of_experience || 3) * 8 + 4,
    bio: p.bio || "Passionate software engineering mentor helping mentees grow their technical careers.",
    nextOpening: "Available this week",
    sessionFormat: "1:1 Video (45m)",
    durationMinutes: 45,
    matchScore: 98,
    location: p.location || "Ghana / Remote",
    language: "English",
    attendanceRate: 100,
    responseTime: "Usually responds in 2 hours",
    philosophy: "Empowering developers to build robust systems and clear career paths.",
    aboutParagraphs: [p.bio || "Dedicated mentor with extensive industry experience."],
    skillGroups: [
      {
        groupLabel: "Core Engineering",
        skills: p.expertise_tags ? p.expertise_tags.split(",").map((s) => s.trim()) : ["Software Architecture"],
      },
    ],
    experience: [
      {
        title: p.job_title || "Senior Engineer",
        org: p.company || "Tech Enterprise",
        location: p.location || "Remote",
        period: "2021 — Present",
        description: "Leading development teams and mentoring junior engineers.",
      },
    ],
    reviews: [],
  }));

  const combinedMentors = [...mappedRealMentors, ...mentors];
  const uniqueMentorsMap = new Map<string, Mentor>();
  combinedMentors.forEach((m) => {
    if (!uniqueMentorsMap.has(m.id)) {
      uniqueMentorsMap.set(m.id, m);
    }
  });
  const allAvailableMentors = Array.from(uniqueMentorsMap.values());

  const firstName = fullName.split(" ")[0] || "there";
  const recommended = getRecommendedMentors(technicalTracks, 4, allAvailableMentors);
  const savedMentors = allAvailableMentors.filter((mentor) => savedMentorIds.includes(mentor.id));

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header variant="solid" />

      <main className="flex-1 px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <ProfileHeaderCard />

          <div className="mt-6 flex gap-1 overflow-x-auto rounded-2xl border border-surface-line bg-white p-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-ink text-white" : "text-ink/60 hover:bg-surface"
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                  {tab.id === "sessions" && (
                    <span
                      className={`rounded-full px-1.5 text-xs ${
                        isActive ? "bg-white/20" : "bg-surface"
                      }`}
                    >
                      {sessions.length}
                    </span>
                  )}
                  {tab.id === "saved" && (
                    <span
                      className={`rounded-full px-1.5 text-xs ${
                        isActive ? "bg-white/20" : "bg-surface"
                      }`}
                    >
                      {dbSavedMentors.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {activeTab === "overview" && (
            <div className="mt-6">
              {latestSession && latestSessionMentor ? (
                <div className="rounded-3xl border border-surface-line bg-white p-6 sm:p-8">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-accent-blue" />
                    <p className="text-xs font-semibold tracking-wide text-accent-blue">
                      NEXT UPCOMING SESSION
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col gap-4 rounded-2xl bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={latestSessionMentor.imageUrl}
                        alt={latestSessionMentor.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-bold text-ink">
                          {latestSessionMentor.name}{" "}
                          <span className="font-normal text-ink/50">
                            {latestSessionMentor.company}
                          </span>
                        </p>
                        <p className="text-sm text-ink/60">
                          {latestSessionMentor.role}
                        </p>
                        <p className="mt-1 text-xs text-ink/50">
                          {latestSession.dateLabel} &middot; {latestSession.timeLabel} &middot;{" "}
                          {latestSession.durationMinutes}m video
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/mentors/${latestSessionMentor.id}/schedule`}
                        className="inline-flex items-center justify-center rounded-xl border border-surface-line bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-surface"
                      >
                        Reschedule
                      </Link>
                      <a
                        href={latestSession.videoLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      >
                        <Video size={15} />
                        Join Meeting Room
                      </a>
                    </div>
                  </div>

                  {(latestSession.focusTopicLabels.length > 0 || latestSession.note) && (
                    <p className="mt-4 text-sm text-ink/70">
                      <span className="font-semibold text-ink">Prepared Topic: </span>
                      {[latestSession.focusTopicLabels.join(", "), latestSession.note]
                        .filter(Boolean)
                        .join(" — ")}
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-3xl border border-surface-line bg-white p-6 sm:p-8">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-blue/10 px-3 py-1.5 text-xs font-semibold text-accent-blue">
                    <Sparkles size={13} />
                    Welcome to Pathfind
                  </span>
                  <h1 className="mt-4 text-3xl font-extrabold text-ink">
                    Welcome, {firstName} 👋
                  </h1>
                  <p className="mt-2 text-base text-ink/60">
                    Let&apos;s find someone who can help you with your career goals.
                  </p>
                  <p className="mt-3 max-w-2xl text-sm text-ink/60">
                    You&apos;re one step away from getting tailored 1:1 guidance. Browse
                    vetted volunteer mentors ready to support your career transition.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      to="/mentors"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      <Search size={15} />
                      Find a Mentor
                    </Link>
                    <Link
                      to="/mentors"
                      state={{ matched: true }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-surface-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface"
                    >
                      <Sparkles size={15} />
                      Explore Recommended Matches
                    </Link>
                  </div>

                  <div className="mt-6 border-t border-surface-line pt-6">
                    <p className="text-xs font-semibold tracking-wide text-ink/40">
                      YOUR QUICK START ROADMAP
                    </p>
                    <QuickStartRoadmap
                      step1Completed={hasCompletedOnboarding}
                      step2Completed={sessions.length > 0}
                    />
                  </div>

                  <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-dashed border-surface-line p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-ink/60">
                        <CalendarCheck2 size={18} />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-ink">
                          No upcoming sessions booked yet{" "}
                          <span className="ml-1 rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-ink/60">
                            0 Scheduled
                          </span>
                        </p>
                        <p className="mt-0.5 text-sm text-ink/60">
                          Volunteer mentors release new session blocks weekly. Your
                          monthly allowance gives you 4 free 1:1 sessions every 30 days.
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/mentors"
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-surface-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface"
                    >
                      <CalendarDays size={15} />
                      Browse Mentor Availability
                    </Link>
                  </div>
                </div>
              )}

              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
                <div className="rounded-3xl border border-surface-line bg-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-bold text-ink">
                        Recommended For You{" "}
                        <span className="ml-1 rounded-full bg-accent-green/10 px-2 py-0.5 text-xs font-semibold text-accent-green">
                          Hand-picked
                        </span>
                      </p>
                      <p className="mt-0.5 text-sm text-ink/60">
                        Curated based on your onboarding answers.
                      </p>
                    </div>
                    <Link
                      to="/mentors"
                      className="text-sm font-semibold text-accent-blue hover:underline"
                    >
                      Explore All Mentors
                    </Link>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {recommended.map((mentor) => (
                      <MentorMiniCard key={mentor.id} mentor={mentor} />
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-surface-line bg-white p-6">
                  <p className="flex items-center gap-1.5 text-base font-bold text-ink">
                    <History size={16} />
                    Recent Activity
                  </p>

                  {sessions.length === 0 ? (
                    <div className="mt-4 flex flex-col items-center rounded-2xl bg-surface p-6 text-center">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink/40">
                        <History size={18} />
                      </span>
                      <p className="mt-3 text-sm font-bold text-ink">
                        No session activity yet
                      </p>
                      <p className="mt-1 text-sm text-ink/60">
                        Key takeaways and resources shared by mentors during 1:1 calls
                        will automatically appear here after your first session.
                      </p>
                    </div>
                  ) : (
                    <ul className="mt-4 space-y-3">
                      {[...sessions].reverse().map((session) => {
                        return (
                          <li
                            key={session.id}
                            className="rounded-xl bg-surface p-3 text-sm text-ink/70"
                          >
                            Booked a session with{" "}
                            <span className="font-semibold text-ink">
                              {session.mentorName}
                            </span>{" "}
                            for {session.dateLabel} at {session.timeLabel}.
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-accent-gold/10 p-3.5 text-sm text-ink/70">
                    <Lightbulb size={16} className="mt-0.5 shrink-0 text-accent-gold" />
                    <p>
                      <span className="font-semibold text-ink">Mentee Pro Tip: </span>
                      Mentors appreciate specific session goals! Add 2 or 3 bullet
                      points to your booking notes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "sessions" && (
            <div className="mt-6 rounded-3xl border border-surface-line bg-white p-6">
              <p className="text-base font-bold text-ink">Submitted Requests &amp; Sessions</p>
              {loadingRequests ? (
                <p className="mt-2 text-sm text-ink/60">Loading requests…</p>
              ) : requests.length === 0 ? (
                <p className="mt-2 text-sm text-ink/60">
                  You haven&apos;t submitted any mentorship requests yet.{" "}
                  <Link to="/mentors" className="font-semibold text-accent-blue hover:underline">
                    Browse mentors
                  </Link>{" "}
                  to request a 1:1 session.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {requests.map((req) => (
                    <li
                      key={req.id}
                      className="flex flex-col gap-3 rounded-2xl border border-surface-line bg-white p-5 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-base font-bold text-ink">{req.subject}</p>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              req.status === "accepted"
                                ? "bg-accent-green/10 text-accent-green"
                                : req.status === "declined"
                                ? "bg-red-50 text-red-600"
                                : "bg-accent-gold/10 text-accent-gold"
                            }`}
                          >
                            {req.status === "accepted" ? (
                              <CheckCircle2 size={12} />
                            ) : req.status === "declined" ? (
                              <XCircle size={12} />
                            ) : (
                              <Clock size={12} />
                            )}
                            {req.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-ink/60">
                          Type: <span className="font-medium text-ink/80">{req.request_type.replace(/_/g, " ")}</span> &middot; Submitted on{" "}
                          {new Date(req.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                        <p className="mt-2 text-xs text-ink/70">
                          <span className="font-semibold text-ink">Your Note: </span>
                          &ldquo;{req.message}&rdquo;
                        </p>

                        {req.response_message && (
                          <div
                            className={`mt-3 rounded-xl border p-3 text-xs ${
                              req.status === "accepted"
                                ? "border-accent-green/20 bg-accent-green/5 text-accent-green"
                                : "border-red-200 bg-red-50 text-red-700"
                            }`}
                          >
                            <span className="font-bold">Mentor Note: </span>
                            &ldquo;{req.response_message}&rdquo;
                          </div>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end sm:justify-center">
                        {req.mentor_profile ? (
                          <Link
                            to={`/mentors/${req.mentor_profile.id}`}
                            className="inline-flex items-center justify-center rounded-xl border border-surface-line bg-white px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:bg-surface"
                          >
                            View {req.mentor_profile.full_name}
                          </Link>
                        ) : (
                          <span className="text-xs text-ink/40">Mentor #{req.mentor_id}</span>
                        )}

                        {req.status === "pending" && (
                          <button
                            type="button"
                            disabled={cancellingId === req.id}
                            onClick={() => handleCancelRequest(req.id)}
                            className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                          >
                            {cancellingId === req.id ? "Cancelling…" : "Cancel Request"}
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === "saved" && (
            <div className="mt-6 rounded-3xl border border-surface-line bg-white p-6">
              <p className="text-base font-bold text-ink">Saved Mentors</p>
              {dbSavedMentors.length === 0 && savedMentors.length === 0 ? (
                <p className="mt-2 text-sm text-ink/60">
                  You haven&apos;t saved any mentors yet. Browse mentors and click the bookmark button to save them.
                </p>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {dbSavedMentors.map((item) => {
                    const p = item.mentor_profile;
                    if (!p) return null;
                    const mappedMentor: Mentor = {
                      id: String(p.user_id),
                      name: p.full_name,
                      role: p.job_title,
                      company: p.company,
                      imageUrl: p.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
                      category: "Software Engineering",
                      trackId: "software-engineering",
                      tags: p.expertise_tags ? p.expertise_tags.split(",").map((s: string) => s.trim()) : ["Software Engineering"],
                      available: true,
                      verified: true,
                      rating: 5,
                      reviewCount: 12,
                      sessionsGiven: 24,
                      bio: p.bio,
                      nextOpening: "Available this week",
                      sessionFormat: "1:1 Video (45m)",
                      durationMinutes: 45,
                      matchScore: 98,
                      location: p.location || "Ghana / Remote",
                      language: "English",
                      attendanceRate: 100,
                      responseTime: "Usually responds in 2 hours",
                      philosophy: "Mentorship for career growth",
                      aboutParagraphs: [p.bio],
                      skillGroups: [],
                      experience: [],
                      reviews: [],
                    };
                    return <MentorMiniCard key={item.id} mentor={mappedMentor} />;
                  })}
                  {savedMentors.map((mentor) => (
                    <MentorMiniCard key={mentor.id} mentor={mentor} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "notes" && (
            <div className="mt-6 rounded-3xl border border-surface-line bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-bold text-ink">Notes &amp; Session Resources</p>
                  <p className="mt-0.5 text-xs text-ink/60">
                    Keep track of key takeaways, action items, and resources shared during your mentorship calls.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNoteForm(!showNoteForm)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                >
                  <Plus size={14} />
                  {showNoteForm ? "Close Form" : "Add Note"}
                </button>
              </div>

              {showNoteForm && (
                <form onSubmit={handleCreateNote} className="mt-5 rounded-2xl border border-surface-line bg-surface/30 p-4 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-ink">Title</label>
                    <input
                      type="text"
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      placeholder="e.g., CV Feedback & Portfolio Action Items"
                      className="mt-1 w-full rounded-xl border border-surface-line px-3.5 py-2 text-sm text-ink focus:border-ink"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink">Note &amp; Action Plan</label>
                    <textarea
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      placeholder="Write down the key advice and bullet points discussed..."
                      rows={3}
                      className="mt-1 w-full rounded-xl border border-surface-line p-3.5 text-sm text-ink focus:border-ink"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink">Resource Link (Optional)</label>
                    <input
                      type="url"
                      value={newNoteResource}
                      onChange={(e) => setNewNoteResource(e.target.value)}
                      placeholder="https://github.com/..."
                      className="mt-1 w-full rounded-xl border border-surface-line px-3.5 py-2 text-sm text-ink focus:border-ink"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={creatingNote}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-5 py-2 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {creatingNote ? "Saving Note…" : "Save Note"}
                  </button>
                </form>
              )}

              {sessionNotes.length === 0 ? (
                <div className="mt-6 flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-sm font-semibold text-ink/60">No notes created yet.</p>
                  <p className="mt-1 text-xs text-ink/40 max-w-sm">
                    Click &ldquo;Add Note&rdquo; above to record notes, links, and homework from your mentorship sessions.
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {sessionNotes.map((note) => (
                    <div
                      key={note.id}
                      className="flex flex-col gap-3 rounded-2xl border border-surface-line bg-surface/20 p-4 transition-all hover:bg-surface/50"
                    >
                      {editingNoteId === note.id ? (
                        /* ── Inline Edit Form ── */
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Title"
                            className="w-full rounded-xl border border-surface-line px-3.5 py-2 text-sm font-semibold text-ink focus:border-ink"
                          />
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            placeholder="Note content…"
                            rows={3}
                            className="w-full rounded-xl border border-surface-line p-3.5 text-sm text-ink focus:border-ink"
                          />
                          <input
                            type="url"
                            value={editResource}
                            onChange={(e) => setEditResource(e.target.value)}
                            placeholder="Resource link (optional)"
                            className="w-full rounded-xl border border-surface-line px-3.5 py-2 text-sm font-semibold text-ink focus:border-ink"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleSaveNote(note.id)}
                              disabled={savingNote}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                            >
                              {savingNote ? "Saving…" : "Save Changes"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingNoteId(null)}
                              className="inline-flex items-center rounded-xl border border-surface-line bg-white px-4 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-surface"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* ── Read View ── */
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-1">
                            <h4 className="text-base font-extrabold text-ink">{note.title}</h4>
                            <p className="text-xs text-ink/50">
                              {new Date(note.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                            <p className="pt-1 text-sm text-ink/80 whitespace-pre-line">{note.content}</p>
                            {note.resource_url && (
                              <a
                                href={note.resource_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline pt-1"
                              >
                                Resource Link <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                          <div className="flex shrink-0 gap-2">
                            <button
                              type="button"
                              onClick={() => startEditNote(note)}
                              className="inline-flex items-center gap-1 rounded-xl border border-surface-line bg-white px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-surface"
                            >
                              <Pencil size={12} />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteNote(note.id)}
                              className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                            >
                              <Trash2 size={13} />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Goals Tab ── */}
          {activeTab === "goals" && (
            <div className="mt-6 space-y-6">
              <div className="flex flex-col gap-4 rounded-3xl border border-surface-line bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-ink">Mentorship Goals & Trackers</h3>
                  <p className="mt-1 text-xs text-ink/60">
                    Track your skill progression, career milestones, and project goals during your mentorship journey.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGoalForm(!showGoalForm)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <Plus size={14} />
                  {showGoalForm ? "Cancel" : "Add New Goal"}
                </button>
              </div>

              {/* Progress Bar */}
              <div className="rounded-2xl border border-surface-line bg-surface/30 p-5">
                <div className="flex items-center justify-between text-xs font-semibold text-ink">
                  <span>Overall Goals Completion</span>
                  <span>
                    {goals.filter((g) => g.completed).length} of {goals.length} completed (
                    {goals.length > 0
                      ? Math.round((goals.filter((g) => g.completed).length / goals.length) * 100)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-surface-line">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{
                      width: `${
                        goals.length > 0
                          ? Math.round((goals.filter((g) => g.completed).length / goals.length) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Goal Form */}
              {showGoalForm && (
                <form
                  onSubmit={handleAddGoal}
                  className="space-y-4 rounded-2xl border border-surface-line bg-white p-5 shadow-sm"
                >
                  <h4 className="text-sm font-bold text-ink">Set a New Mentorship Goal</h4>
                  <div>
                    <label className="text-xs font-semibold text-ink/80">Goal Title</label>
                    <input
                      type="text"
                      required
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      placeholder="e.g. Master React Server Components & Streaming"
                      className="mt-1 w-full rounded-xl border border-surface-line px-3.5 py-2 text-sm text-ink focus:border-ink"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-ink/80">Category</label>
                      <select
                        value={newGoalCategory}
                        onChange={(e) => setNewGoalCategory(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-surface-line px-3 py-2 text-sm text-ink focus:border-ink"
                      >
                        <option value="Technical Skill">Technical Skill</option>
                        <option value="Career Growth">Career Growth</option>
                        <option value="Open Source">Open Source</option>
                        <option value="Leadership">Leadership & Management</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-ink/80">Target Timeline</label>
                      <input
                        type="text"
                        value={newGoalTargetDate}
                        onChange={(e) => setNewGoalTargetDate(e.target.value)}
                        placeholder="e.g. Q4 2026 or Dec 2026"
                        className="mt-1 w-full rounded-xl border border-surface-line px-3 py-2 text-sm text-ink focus:border-ink"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
                    >
                      Save Goal
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowGoalForm(false)}
                      className="rounded-xl border border-surface-line bg-white px-4 py-2 text-xs font-semibold text-ink hover:bg-surface"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Goals List */}
              <div className="space-y-3">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className={`flex items-center justify-between gap-4 rounded-2xl border p-4 transition-all ${
                      goal.completed
                        ? "border-emerald-200 bg-emerald-50/30 text-ink/70"
                        : "border-surface-line bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleGoal(goal.id, goal.completed)}
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                          goal.completed
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-surface-line hover:border-ink"
                        }`}
                      >
                        {goal.completed && <Check size={14} strokeWidth={3} />}
                      </button>
                      <div>
                        <p
                          className={`text-sm font-semibold text-ink ${
                            goal.completed ? "line-through opacity-60" : ""
                          }`}
                        >
                          {goal.title}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-medium text-ink/70">
                            {goal.category}
                          </span>
                          <span className="text-xs text-ink/40">• Target: {goal.target_date}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="rounded-lg p-1.5 text-ink/40 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Settings Tab ── */}
          {activeTab === "settings" && (
            <div className="mt-6 space-y-6">
              <form onSubmit={handleSaveSettings} className="space-y-6 rounded-3xl border border-surface-line bg-white p-6 sm:p-8">
                <div>
                  <h3 className="text-lg font-bold text-ink">Account & Profile Settings</h3>
                  <p className="mt-1 text-xs text-ink/60">
                    Update your display profile details and platform preferences.
                  </p>
                </div>

                {settingsMessage && (
                  <div
                    className={`rounded-2xl p-4 text-xs font-semibold ${
                      settingsMessage.includes("successfully")
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {settingsMessage}
                  </div>
                )}

                <div className="space-y-4 border-t border-surface-line pt-5">
                  <h4 className="text-sm font-bold text-ink flex items-center gap-2">
                    <User size={16} /> Profile Details
                  </h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-ink/80">Full Name</label>
                      <input
                        type="text"
                        value={settingsName}
                        onChange={(e) => setSettingsName(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-surface-line px-3.5 py-2.5 text-sm text-ink focus:border-ink"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-ink/80">Location</label>
                      <input
                        type="text"
                        value={settingsLocation}
                        onChange={(e) => setSettingsLocation(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-surface-line px-3.5 py-2.5 text-sm text-ink focus:border-ink"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-ink/80">Bio / About</label>
                    <textarea
                      rows={3}
                      value={settingsBio}
                      onChange={(e) => setSettingsBio(e.target.value)}
                      placeholder="Brief summary of your background and what you hope to achieve with mentorship…"
                      className="mt-1 w-full rounded-xl border border-surface-line p-3.5 text-sm text-ink focus:border-ink"
                    />
                  </div>
                </div>

                <div className="space-y-4 border-t border-surface-line pt-5">
                  <h4 className="text-sm font-bold text-ink flex items-center gap-2">
                    <Bell size={16} /> Notification Preferences
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailNotifs}
                        onChange={(e) => setEmailNotifs(e.target.checked)}
                        className="h-4 w-4 rounded border-surface-line accent-ink"
                      />
                      <div>
                        <p className="text-sm font-semibold text-ink">Session Request Notifications</p>
                        <p className="text-xs text-ink/50">Receive email alerts when session requests are created or updated.</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sessionReminders}
                        onChange={(e) => setSessionReminders(e.target.checked)}
                        className="h-4 w-4 rounded border-surface-line accent-ink"
                      />
                      <div>
                        <p className="text-sm font-semibold text-ink">Session Reminders</p>
                        <p className="text-xs text-ink/50">Receive reminder emails 15 minutes before scheduled mentorship calls.</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={weeklyDigest}
                        onChange={(e) => setWeeklyDigest(e.target.checked)}
                        className="h-4 w-4 rounded border-surface-line accent-ink"
                      />
                      <div>
                        <p className="text-sm font-semibold text-ink">Weekly Mentorship Digest</p>
                        <p className="text-xs text-ink/50">Summary of upcoming community events, recommended mentors, and goals progress.</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="border-t border-surface-line pt-5">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    <Save size={16} />
                    {savingSettings ? "Saving…" : "Save Preferences"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;

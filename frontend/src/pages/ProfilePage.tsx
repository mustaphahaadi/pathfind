import { useState } from "react";
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
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProfileHeaderCard from "../components/profile/ProfileHeaderCard";
import QuickStartRoadmap from "../components/profile/QuickStartRoadmap";
import MentorMiniCard from "../components/profile/MentorMiniCard";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { useSessionsStore } from "../store/useSessionsStore";
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

  const fullName = useOnboardingStore((state) => state.fullName);
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);
  const technicalTracks = useOnboardingStore((state) => state.technicalTracks);
  const sessions = useSessionsStore((state) => state.sessions);
  const savedMentorIds = useSessionsStore((state) => state.savedMentorIds);

  const firstName = fullName.split(" ")[0] || "there";
  const latestSession = sessions[sessions.length - 1] ?? null;
  const latestSessionMentor = latestSession
    ? mentors.find((mentor) => mentor.id === latestSession.mentorId)
    : null;

  const recommended = getRecommendedMentors(technicalTracks, 4);
  const savedMentors = mentors.filter((mentor) => savedMentorIds.includes(mentor.id));

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
                      {savedMentorIds.length}
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
                        const mentor = mentors.find((m) => m.id === session.mentorId);
                        return (
                          <li
                            key={session.id}
                            className="rounded-xl bg-surface p-3 text-sm text-ink/70"
                          >
                            Booked a session with{" "}
                            <span className="font-semibold text-ink">
                              {mentor?.name ?? "a mentor"}
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
              <p className="text-base font-bold text-ink">Upcoming Sessions</p>
              {sessions.length === 0 ? (
                <p className="mt-2 text-sm text-ink/60">
                  You haven&apos;t booked any sessions yet.{" "}
                  <Link to="/mentors" className="font-semibold text-accent-blue hover:underline">
                    Browse mentors
                  </Link>{" "}
                  to book your first free 1:1.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {sessions.map((session) => {
                    const mentor = mentors.find((m) => m.id === session.mentorId);
                    return (
                      <li
                        key={session.id}
                        className="flex flex-col gap-2 rounded-xl border border-surface-line p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          {mentor && (
                            <img
                              src={mentor.imageUrl}
                              alt={mentor.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <p className="text-sm font-bold text-ink">
                              {mentor?.name ?? "Mentor"}
                            </p>
                            <p className="text-xs text-ink/60">
                              {session.dateLabel} &middot; {session.timeLabel}
                            </p>
                          </div>
                        </div>
                        <a
                          href={session.videoLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          Join Meeting Room
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          {activeTab === "saved" && (
            <div className="mt-6 rounded-3xl border border-surface-line bg-white p-6">
              <p className="text-base font-bold text-ink">Saved Mentors</p>
              {savedMentors.length === 0 ? (
                <p className="mt-2 text-sm text-ink/60">
                  You haven&apos;t saved any mentors yet.
                </p>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {savedMentors.map((mentor) => (
                    <MentorMiniCard key={mentor.id} mentor={mentor} />
                  ))}
                </div>
              )}
            </div>
          )}

          {(activeTab === "notes" || activeTab === "goals" || activeTab === "settings") && (
            <div className="mt-6 rounded-3xl border border-surface-line bg-white p-10 text-center">
              <p className="text-base font-bold text-ink">
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </p>
              <p className="mt-2 text-sm text-ink/60">This section is coming soon.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;

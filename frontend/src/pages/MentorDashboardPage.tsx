import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Inbox,
  CalendarDays,
  Users,
  Settings,
  Eye,
  Pencil,
  CalendarClock,
  ClipboardList,
  Link2,
  MessageCircle,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Circle,
  Lightbulb,
  HandCoins,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useMentorOnboardingStore } from "../store/useMentorOnboardingStore";
import { mentorHonorCodeItems } from "../data/mentor-onboarding/options";

type TabId = "overview" | "requests" | "scheduled" | "feedback" | "availability";

const tabs: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "requests", label: "Incoming Requests" },
  { id: "scheduled", label: "Scheduled Sessions" },
  { id: "feedback", label: "Past Mentees & Feedback" },
  { id: "availability", label: "Availability & Settings" },
];

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const MentorDashboardPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const fullName = useMentorOnboardingStore((state) => state.fullName);
  const weeklyWindows = useMentorOnboardingStore((state) => state.weeklyWindows);
  const acceptingRequests = useMentorOnboardingStore((state) => state.acceptingRequests);
  const agreedHonorCodeIds = useMentorOnboardingStore((state) => state.agreedHonorCodeIds);
  const hasCompletedOnboarding = useMentorOnboardingStore((state) => state.hasCompletedOnboarding);
  const toggleAcceptingRequests = useMentorOnboardingStore((state) => state.toggleAcceptingRequests);

  const firstName = fullName.split(" ")[0] || "there";
  const monthlyCapacity = weeklyWindows.reduce((sum, window) => sum + window.maxCalls, 0);
  const shareLink = `pathfind.org/m/${slugify(fullName) || "your-profile"}`;

  // Honest zero state: there's no real backend connecting mentees to a custom
  // mentor, so a freshly published mentor genuinely has no bookings, mentees,
  // or ratings yet — nothing here is a placeholder for hidden real data.
  const sessionsBooked = 0;
  const menteesGuided = 0;
  const hasRatings = false;

  const readinessChecks = [
    { label: "Profile Published", complete: hasCompletedOnboarding },
    { label: "Availability Configured", complete: weeklyWindows.length > 0 },
    { label: "Honor Code Signed", complete: agreedHonorCodeIds.length === mentorHonorCodeItems.length },
  ];
  const readinessCompleteCount = readinessChecks.filter((check) => check.complete).length;

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header variant="solid" />

      <main className="flex-1 px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-green/10 px-3 py-1.5 text-xs font-semibold text-accent-green">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
              Profile Active &amp; Published
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-ink">
              Volunteer Tier: {monthlyCapacity} / Mo
            </span>
          </div>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">
                Welcome to Pathfind, {firstName}
              </h1>
              <p className="mt-1 max-w-xl text-sm text-ink/60">
                Your profile is visible to mentees worldwide. You&apos;re offering{" "}
                {monthlyCapacity} free volunteer mentorship session
                {monthlyCapacity === 1 ? "" : "s"} each calendar month.
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                to="/mentors/you"
                className="inline-flex items-center gap-1.5 rounded-xl border border-surface-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface"
              >
                <Eye size={15} />
                Preview Public Profile
              </Link>
              <Link
                to="/onboarding/mentor/identity-verification"
                className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <Pencil size={15} />
                Edit Profile
              </Link>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-surface-line bg-white p-4">
              <p className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-ink/40">
                Sessions Committed
                <CalendarClock size={15} />
              </p>
              <p className="mt-2 text-3xl font-extrabold text-ink">
                {sessionsBooked}
                <span className="text-base font-medium text-ink/40"> / {monthlyCapacity} booked</span>
              </p>
              <p className="mt-1 text-xs text-ink/50">
                {sessionsBooked} of {monthlyCapacity} monthly sessions booked so far.
              </p>
            </div>
            <div className="rounded-2xl border border-surface-line bg-white p-4">
              <p className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-ink/40">
                Mentees Guided
                <Users size={15} />
              </p>
              <p className="mt-2 text-3xl font-extrabold text-ink">{menteesGuided}</p>
              <p className="mt-1 text-xs text-ink/50">Mentees guided so far.</p>
            </div>
            <div className="rounded-2xl border border-surface-line bg-white p-4">
              <p className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-ink/40">
                Community Standing
                <ShieldCheck size={15} />
              </p>
              <p className="mt-2 text-3xl font-extrabold text-ink">
                {hasRatings ? "5.0 ★" : "—"}
              </p>
              <p className="mt-1 text-xs text-ink/50">
                {hasRatings
                  ? "Average mentee rating"
                  : "No ratings yet — these appear after your first completed session."}
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-1 overflow-x-auto rounded-2xl border border-surface-line bg-white p-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${
                  tab.id === activeTab ? "bg-ink text-white" : "text-ink/60 hover:bg-surface"
                }`}
              >
                {tab.label}
                {tab.id !== "overview" && tab.id !== "availability" && (
                  <span
                    className={`rounded-full px-1.5 text-xs ${
                      tab.id === activeTab ? "bg-white/20" : "bg-surface"
                    }`}
                  >
                    0
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
              <div className="flex flex-col gap-6">
                <div className="rounded-3xl border border-surface-line bg-white p-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-blue/10 px-3 py-1.5 text-xs font-semibold text-accent-blue">
                    Welcome Aboard
                  </span>
                  <h2 className="mt-3 text-xl font-bold text-ink">Your profile is live!</h2>
                  <p className="mt-1 text-sm text-ink/60">
                    Once mentees discover you in the directory, your upcoming sessions and
                    booking requests will appear here. In the meantime, make sure your
                    availability and discussion topics are up to date.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      to="/onboarding/mentor/availability-capacity"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      <ClipboardList size={15} />
                      View &amp; Update Availability
                    </Link>
                    <Link
                      to="/mentors/you"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-surface-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface"
                    >
                      Preview Public Directory Card
                    </Link>
                    <a
                      href="mailto:volunteers@pathfind.org?subject=Slack%20community%20invite"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-surface-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface"
                    >
                      <MessageCircle size={15} />
                      Explore Community Slack
                    </a>
                  </div>
                </div>

                <div className="rounded-3xl border border-surface-line bg-white p-6">
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1.5 text-base font-bold text-ink">
                      <CalendarDays size={17} />
                      Upcoming Scheduled Session
                    </p>
                    <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-ink/60">
                      {sessionsBooked} Booked
                    </span>
                  </div>
                  <div className="mt-4 flex flex-col items-center rounded-2xl bg-surface p-8 text-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink/40">
                      <CalendarDays size={20} />
                    </span>
                    <p className="mt-3 text-sm font-bold text-ink">No scheduled sessions yet</p>
                    <p className="mt-1 max-w-sm text-sm text-ink/60">
                      When a mentee reserves one of your available slots, the booking
                      details and video link will show up here.
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-surface-line bg-white p-6">
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1.5 text-base font-bold text-ink">
                      <Inbox size={17} />
                      Pending Mentee Requests
                    </p>
                    <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-ink/60">
                      0 Pending
                    </span>
                  </div>
                  <div className="mt-4 flex flex-col items-center rounded-2xl bg-surface p-8 text-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink/40">
                      <Mail size={20} />
                    </span>
                    <p className="mt-3 text-sm font-bold text-ink">No pending requests</p>
                    <p className="mt-1 max-w-sm text-sm text-ink/60">
                      Requests from mentees matching your focus topics will arrive here
                      for your review.
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-surface-line bg-white p-6">
                  <p className="flex items-center gap-1.5 text-base font-bold text-ink">
                    <Lightbulb size={17} />
                    Mentor Quick Tips
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-surface-line p-4">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                        1
                      </span>
                      <p className="mt-2 text-sm font-bold text-ink">Share your direct link</p>
                      <p className="mt-1 text-sm text-ink/60">
                        Share your mentor link on LinkedIn or X to let early-career
                        engineers know your door is open.
                      </p>
                      <p className="mt-3 flex items-center gap-1 border-t border-surface-line pt-2 text-xs text-ink/50">
                        <Link2 size={12} />
                        {shareLink}
                      </p>
                    </div>
                    <div className="rounded-xl border border-surface-line p-4">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                        2
                      </span>
                      <p className="mt-2 text-sm font-bold text-ink">Keep availability current</p>
                      <p className="mt-1 text-sm text-ink/60">
                        Update your recurring windows whenever your schedule changes to
                        avoid conflicting bookings.
                      </p>
                      <p className="mt-3 border-t border-surface-line pt-2 text-xs text-ink/50">
                        {weeklyWindows.length} window{weeklyWindows.length === 1 ? "" : "s"} active
                      </p>
                    </div>
                    <div className="rounded-xl border border-surface-line p-4">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                        3
                      </span>
                      <p className="mt-2 text-sm font-bold text-ink">Honor code standard</p>
                      <p className="mt-1 text-sm text-ink/60">
                        Prepare for focused sessions with zero sales pitches or
                        recruiting bias, per the community Honor Code.
                      </p>
                      <p className="mt-3 border-t border-surface-line pt-2 text-xs text-ink/50">
                        {agreedHonorCodeIds.length}/{mentorHonorCodeItems.length} pledges signed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

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
                        acceptingRequests ? "bg-ink" : "bg-surface-line"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                          acceptingRequests ? "translate-x-5" : "translate-x-0.5"
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
                      <p className="mt-2 text-sm text-ink/50">No recurring windows set yet.</p>
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

          {activeTab !== "overview" && (
            <div className="mt-6 rounded-3xl border border-surface-line bg-white p-10 text-center">
              <p className="text-base font-bold text-ink">
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </p>
              <p className="mt-2 text-sm text-ink/60">
                Nothing here yet — this fills in once mentees start requesting sessions
                with you.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MentorDashboardPage;

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  LayoutGrid,
  Link2,
  Copy,
  Check,
  Star,
  RefreshCw,
  ClipboardCheck,
  MessagesSquare,
} from "lucide-react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useMentorOnboardingStore } from "../../store/useMentorOnboardingStore";
import { mentorDisciplines, mentorshipTopics, getSkillLabel } from "../../data/mentor-onboarding/options";
import { getInitials } from "../../lib/getInitials";
import { mentorOnboardingStepPath } from "../../data/mentor-onboarding/steps";

const nextSteps = [
  {
    icon: RefreshCw,
    title: "Booking Requests & Calendar Sync",
    description:
      "When mentees book, confirmed events sync automatically to your Google Calendar with dedicated Google Meet video links.",
    footer: "2-way sync active",
  },
  {
    icon: ClipboardCheck,
    title: "Review & Manage Sessions",
    description:
      "Review mentee agendas, submitted context documents, and focus dilemmas directly in your Mentor Dashboard before every session.",
    footer: "Dashboard access ready",
  },
  {
    icon: MessagesSquare,
    title: "Volunteer Community & Slack",
    description:
      "An invitation to Pathfind's private volunteer mentor Slack community has been dispatched to your primary email inbox.",
    footer: "Check your inbox",
  },
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const MentorProfileCreatedPage = () => {
  const [copied, setCopied] = useState(false);

  const avatarUrl = useMentorOnboardingStore((state) => state.avatarUrl);
  const fullName = useMentorOnboardingStore((state) => state.fullName);
  const currentTitle = useMentorOnboardingStore((state) => state.currentTitle);
  const company = useMentorOnboardingStore((state) => state.company);
  const location = useMentorOnboardingStore((state) => state.location);
  const primaryDiscipline = useMentorOnboardingStore((state) => state.primaryDiscipline);
  const topics = useMentorOnboardingStore((state) => state.topics);
  const motivation = useMentorOnboardingStore((state) => state.motivation);
  const weeklyWindows = useMentorOnboardingStore((state) => state.weeklyWindows);

  const disciplineLabel = mentorDisciplines.find((d) => d.id === primaryDiscipline)?.label;
  const topicLabels = topics.map(getSkillLabel);
  const monthlyCapacity = weeklyWindows.reduce((sum, window) => sum + window.maxCalls, 0);
  const shareLink = `pathfind.org/m/${slugify(fullName) || "your-profile"}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${shareLink}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can fail in some environments — fail silently.
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header variant="solid" />

      <main className="flex-1 px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-surface-line bg-white px-3 py-1.5 text-xs font-semibold text-accent-green">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
            Profile Published &amp; Live
          </span>

          <h1 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
            Your mentor profile is live!
          </h1>
          <p className="mt-2 text-base text-ink/60">
            Mentees across the global tech community can now discover your
            background, read your focus topics, and book available volunteer
            sessions.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/mentors/you"
              className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              View My Profile
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/mentor-dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl border border-surface-line bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface"
            >
              <LayoutGrid size={16} />
              Go to Dashboard
            </Link>
          </div>

          <div className="mx-auto mt-4 flex max-w-md items-center gap-2 rounded-xl border border-surface-line bg-white px-4 py-2.5">
            <Link2 size={15} className="shrink-0 text-ink/40" />
            <span className="flex-1 truncate text-left text-sm text-ink/70">{shareLink}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-surface px-2.5 py-1.5 text-xs font-semibold text-ink"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied" : "Share Link"}
            </button>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                Real-Time Preview
              </p>
              <p className="text-base font-bold text-ink">
                How your card appears in the mentor directory
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-green/10 px-3 py-1.5 text-xs font-semibold text-accent-green">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
              Live in Directory
            </span>
          </div>

          <div className="mt-4 rounded-2xl border border-surface-line bg-white p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={fullName} className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink text-lg font-bold text-white">
                    {getInitials(fullName)}
                  </span>
                )}
                <div>
                  <p className="flex items-center gap-1.5 text-lg font-bold text-ink">
                    {fullName}
                    <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-semibold text-ink/60">
                      New Mentor
                    </span>
                  </p>
                  <p className="text-sm text-ink/60">
                    {currentTitle} {company ? `@ ${company}` : ""} &middot; {location}
                  </p>
                </div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-ink">
                {monthlyCapacity} sessions/mo open
              </span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              &ldquo;{motivation.slice(0, 200) || "Your motivation statement will appear here."}
              {motivation.length > 200 ? "…" : ""}&rdquo;
            </p>

            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink/40">
              Primary Guidance Topics
            </p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {disciplineLabel && (
                <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-ink">
                  {disciplineLabel}
                </span>
              )}
              {topicLabels.slice(0, 2).map((label) => (
                <span key={label} className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-ink">
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-surface-line pt-3">
              <span className="inline-flex items-center gap-1.5 text-sm text-ink/60">
                <Star size={13} className="text-accent-gold" fill="currentColor" strokeWidth={0} />
                45 min 1:1 Video Calls &middot; 100% Free / Voluntary
              </span>
              <span className="inline-flex items-center justify-center rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white">
                Book a Session
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">
            Volunteer Workflow
          </p>
          <h2 className="mt-1 text-2xl font-extrabold text-ink">
            What to expect next as a mentor
          </h2>
          <p className="mt-1 text-sm text-ink/60">
            Pathfind takes care of scheduling, notifications, and logistics so you can
            focus entirely on meaningful human dialogue.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {nextSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="rounded-2xl border border-surface-line bg-white p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-accent-blue">
                    <Icon size={17} />
                  </span>
                  <p className="mt-3 text-sm font-bold text-ink">{step.title}</p>
                  <p className="mt-1 text-sm text-ink/60">{step.description}</p>
                  <p className="mt-3 border-t border-surface-line pt-2 text-xs font-medium text-accent-blue">
                    {step.footer}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-white p-4 text-sm text-ink/70 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-accent-green" />
                Profile visibility: Public
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-accent-green" />
                Monthly capacity: {monthlyCapacity} of {monthlyCapacity} slots available
              </span>
            </div>
            <Link
              to={mentorOnboardingStepPath("availability-capacity")}
              className="font-semibold text-accent-blue hover:underline"
            >
              Adjust availability settings anytime
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MentorProfileCreatedPage;

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CircleCheck,
  Calendar,
  Video,
  Copy,
  Check,
  Info,
  Target,
  Link2,
  Headphones,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { mentors } from "../data/mentors";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { useSessionsStore, selectLastBooking } from "../store/useSessionsStore";

const tips = [
  {
    number: "01",
    label: "Focus Over Breadth",
    icon: Target,
    title: "Prepare 1-2 specific dilemmas",
    description:
      "Formulate crisp questions where tactical perspective creates immediate clarity rather than abstract overview.",
    footer: "Tip: Write down your top priorities first",
  },
  {
    number: "02",
    label: "Viewable Docs",
    icon: Link2,
    title: "Share reference links",
    description:
      "Ensure portfolios, docs, or case studies have view/comment permissions enabled ahead of time.",
    footer: "Tip: Verify share links in an incognito window",
  },
  {
    number: "03",
    label: "Test Mic & Headphones",
    icon: Headphones,
    title: "Quiet audio setup",
    description:
      "Join a couple minutes early with headphones to test audio and ensure an uninterrupted discussion.",
    footer: "Tip: Be ready 2 minutes before start time",
  },
];

const BookingConfirmedPage = () => {
  const [copied, setCopied] = useState(false);
  const fullName = useOnboardingStore((state) => state.fullName);
  const email = useOnboardingStore((state) => state.email);
  const booking = useSessionsStore(selectLastBooking);

  const mentor = booking ? mentors.find((item) => item.id === booking.mentorId) : null;

  const handleCopyLink = async () => {
    if (!booking) return;
    try {
      await navigator.clipboard.writeText(booking.videoLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can fail in some environments — fail silently.
    }
  };

  if (!booking || !mentor) {
    return (
      <div className="flex min-h-screen flex-col bg-surface">
        <Header variant="solid" />
        <main className="flex flex-1 flex-col items-center justify-center px-5 py-20 text-center">
          <h1 className="text-2xl font-extrabold text-ink">No booking to show</h1>
          <p className="mt-2 text-sm text-ink/60">
            You haven&apos;t confirmed a session yet.
          </p>
          <Link
            to="/mentors"
            className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white"
          >
            Browse Mentors
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header variant="solid" />

      <main className="flex-1 px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-surface-line bg-white px-3 py-1.5 text-xs font-semibold text-accent-green">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
            Booking Confirmed
          </span>

          <h1 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
            You&apos;re scheduled with {mentor.name}!
          </h1>
          <p className="mt-2 text-base text-ink/60">
            A calendar invitation and Google Meet link have been sent to{" "}
            <span className="font-medium text-ink">{email || "your email"}</span>.
          </p>

          <div className="mt-6 rounded-3xl border border-surface-line bg-white p-6 text-left sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-line pb-5">
              <div className="flex items-center gap-3">
                <img
                  src={mentor.imageUrl}
                  alt={mentor.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
                    {mentor.name}
                    <span className="rounded-full bg-accent-blue/10 px-2 py-0.5 text-[11px] font-semibold text-accent-blue">
                      Verified Mentor
                    </span>
                  </p>
                  <p className="text-sm text-ink/60">
                    {mentor.role} at {mentor.company}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-ink">
                {booking.durationMinutes}-min Advisory
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-ink/60">
                    <Calendar size={16} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                      Date &amp; Time
                    </p>
                    <p className="text-sm font-medium text-ink">{booking.dateLabel}</p>
                    <p className="text-sm text-ink/60">
                      {booking.timeLabel} &middot; {booking.durationMinutes} mins
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-ink/60">
                    <Video size={16} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                      Video Room
                    </p>
                    <p className="text-sm font-medium text-ink">{booking.videoLink}</p>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-accent-blue hover:underline"
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? "Copied!" : "Copy Link"}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                  Focus Topics Selected
                </p>
                {booking.focusTopicLabels.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {booking.focusTopicLabels.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-ink"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-ink/50">None selected</p>
                )}

                {booking.note && (
                  <>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink/40">
                      Direct Note to {mentor.name.split(" ")[0]}
                    </p>
                    <p className="mt-1.5 rounded-xl bg-surface p-3 text-sm italic text-ink/70">
                      &ldquo;{booking.note}&rdquo;
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-surface-line pt-5">
              <p className="text-sm text-ink/60">
                {fullName ? `${fullName} · ` : ""}1 of 4 monthly voluntary slots used
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-3.5 py-2 text-xs font-semibold text-white"
                >
                  + Google Calendar
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-surface-line bg-white px-3.5 py-2 text-xs font-semibold text-ink"
                >
                  Apple Calendar
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-surface-line bg-white px-3.5 py-2 text-xs font-semibold text-ink"
                >
                  Outlook (.ics)
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-left">
            <h2 className="text-xl font-bold text-ink">
              How to make the most of your {booking.durationMinutes} minutes
            </h2>
            <p className="mt-1 text-sm text-ink/60">
              Recommended guidance for high-impact advisory conversations.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {tips.map((tip) => {
                const Icon = tip.icon;
                return (
                  <div key={tip.number} className="rounded-2xl border border-surface-line bg-white p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold tracking-wide text-accent-blue">
                        {tip.number} / {tip.label.toUpperCase()}
                      </p>
                      <Icon size={16} className="text-ink/40" />
                    </div>
                    <p className="mt-2 text-sm font-bold text-ink">{tip.title}</p>
                    <p className="mt-1 text-sm text-ink/60">{tip.description}</p>
                    <p className="mt-3 border-t border-surface-line pt-2 text-xs text-ink/50">
                      {tip.footer}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-accent-blue/5 p-4 text-left text-sm text-ink/70">
            <Info size={16} className="mt-0.5 shrink-0 text-accent-blue" />
            <p>
              Need to reschedule or cancel? Please give {mentor.name.split(" ")[0]} at
              least 24 hours notice so another community member can take the voluntary
              slot. You can manage this anytime from your dashboard.
            </p>
          </div>

          <div className="mt-8 flex flex-col-reverse items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/mentors"
              className="inline-flex items-center justify-center rounded-xl border border-surface-line bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface"
            >
              Browse More Mentors
            </Link>
            <Link
              to="/profile"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <CircleCheck size={16} />
              View My Sessions &amp; Dashboard
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingConfirmedPage;

import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Video,
  Star,
  HandCoins,
  Lightbulb,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { mentors } from "../data/mentors";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { useSessionsStore } from "../store/useSessionsStore";
import { getUpcomingDays } from "../lib/getUpcomingDays";

const timeSlots = ["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "4:15 PM"];
const MAX_FOCUS_TOPICS = 2;

const ScheduleSessionPage = () => {
  const { mentorId } = useParams<{ mentorId: string }>();
  const navigate = useNavigate();
  const mentor = mentors.find((item) => item.id === mentorId);

  const fullName = useOnboardingStore((state) => state.fullName);
  const email = useOnboardingStore((state) => state.email);
  const addSession = useSessionsStore((state) => state.addSession);

  const upcomingDays = useMemo(() => getUpcomingDays(7), []);
  const [selectedDayIso, setSelectedDayIso] = useState(upcomingDays[0]?.iso ?? "");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [note, setNote] = useState("");

  if (!mentor) {
    return (
      <div className="flex min-h-screen flex-col bg-surface">
        <Header variant="solid" />
        <main className="flex flex-1 flex-col items-center justify-center px-5 py-20 text-center">
          <h1 className="text-2xl font-extrabold text-ink">Mentor not found</h1>
          <p className="mt-2 text-sm text-ink/60">
            This mentor profile doesn&apos;t exist or may have been removed.
          </p>
          <Link
            to="/mentors"
            className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white"
          >
            <ArrowLeft size={15} />
            Back to Mentors
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const selectedDay = upcomingDays.find((day) => day.iso === selectedDayIso) ?? null;
  const canConfirm = selectedDay !== null && selectedTime !== null;

  const toggleTopic = (tag: string) => {
    setSelectedTopics((current) => {
      if (current.includes(tag)) return current.filter((item) => item !== tag);
      if (current.length >= MAX_FOCUS_TOPICS) return current;
      return [...current, tag];
    });
  };

  const handleConfirm = () => {
    if (!canConfirm || !selectedDay || !selectedTime) return;

    addSession({
      mentorId: mentor.id,
      dateLabel: selectedDay.fullLabel,
      timeLabel: selectedTime,
      durationMinutes: mentor.durationMinutes,
      focusTopicLabels: selectedTopics,
      note,
      videoLink: `https://meet.google.com/${mentor.id}-session`,
    });

    navigate("/booking-confirmed");
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header variant="solid" />

      <main className="flex-1 px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-1.5 text-sm text-ink/50">
              <Link to="/mentors" className="hover:text-ink">
                Back to Mentors
              </Link>
              <span>/</span>
              <span>{mentor.name}</span>
              <span>/</span>
              <span className="font-medium text-ink">Schedule Session</span>
            </p>
            <span className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white">
              Step 1 of 2: Schedule &amp; Agenda
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
            Select Date &amp; Details
          </h1>
          <p className="mt-1 text-base text-ink/60">
            Choose an available time slot on {mentor.name.split(" ")[0]}&apos;s calendar
            and outline topics for your {mentor.durationMinutes}-minute discussion.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl border border-surface-line bg-white p-5">
                <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
                  <Calendar size={15} />
                  Pick a day
                </p>
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {upcomingDays.map((day) => {
                    const isSelected = day.iso === selectedDayIso;
                    return (
                      <button
                        key={day.iso}
                        type="button"
                        onClick={() => {
                          setSelectedDayIso(day.iso);
                          setSelectedTime(null);
                        }}
                        className={`flex shrink-0 flex-col items-center rounded-xl border px-4 py-2.5 text-center transition-colors ${
                          isSelected
                            ? "border-ink bg-ink text-white"
                            : "border-surface-line bg-white text-ink hover:border-ink/30"
                        }`}
                      >
                        <span className="text-xs font-medium uppercase opacity-70">
                          {day.weekdayShort}
                        </span>
                        <span className="text-lg font-bold">{day.dayNumber}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedDay && (
                  <div className="mt-4 border-t border-surface-line pt-4">
                    <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
                      <Clock size={15} />
                      Available slots for {selectedDay.fullLabel}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {timeSlots.map((time) => {
                        const isSelected = time === selectedTime;
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                              isSelected
                                ? "border-ink bg-ink text-white"
                                : "border-surface-line bg-white text-ink hover:border-ink/30"
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-3 flex items-center gap-1.5 text-xs text-ink/50">
                      <Video size={13} />
                      Google Meet link automatically generated upon confirmation
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-surface-line bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-ink">What would you like to focus on?</p>
                  <span className="text-xs font-medium text-ink/50">
                    {selectedTopics.length} of {MAX_FOCUS_TOPICS} selected
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-ink/60">
                  Select up to {MAX_FOCUS_TOPICS} areas you&apos;d like {mentor.name.split(" ")[0]}{" "}
                  to concentrate on.
                </p>

                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {mentor.tags.map((tag) => {
                    const isSelected = selectedTopics.includes(tag);
                    const isDisabled = !isSelected && selectedTopics.length >= MAX_FOCUS_TOPICS;
                    return (
                      <button
                        key={tag}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => toggleTopic(tag)}
                        className={`flex items-start gap-2.5 rounded-xl border p-3 text-left text-sm transition-colors ${
                          isSelected
                            ? "border-ink bg-surface"
                            : isDisabled
                              ? "cursor-not-allowed border-surface-line bg-surface/40 text-ink/40"
                              : "border-surface-line bg-white hover:border-ink/30"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 ${
                            isSelected ? "border-ink bg-ink" : "border-surface-line"
                          }`}
                        >
                          {isSelected && <span className="h-1.5 w-1.5 rounded-sm bg-white" />}
                        </span>
                        <span className="font-medium text-ink">{tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-surface-line bg-white p-5">
                <p className="text-sm font-bold text-ink">
                  Specific questions or topics{" "}
                  <span className="font-normal text-ink/50">(Optional)</span>
                </p>
                <p className="mt-0.5 text-sm text-ink/60">
                  Providing context helps your mentor prepare tactical, high-impact advice.
                </p>
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value.slice(0, 500))}
                  rows={4}
                  placeholder={`Share any specific context, dilemmas, or links you'd like ${mentor.name.split(" ")[0]} to review prior to the call...`}
                  className="mt-3 w-full rounded-xl border border-surface-line px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
                />
                <p className="mt-1.5 text-right text-xs text-ink/40">{note.length} / 500 words</p>
              </div>

              <div className="rounded-2xl border border-surface-line bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-ink">Mentee Details</p>
                  <Link
                    to="/onboarding/mentee/about-you"
                    className="text-xs font-medium text-accent-blue hover:underline"
                  >
                    Edit in Profile
                  </Link>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-ink/50">Full Name</p>
                    <p className="text-sm font-medium text-ink">{fullName || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ink/50">Email Address</p>
                    <p className="text-sm font-medium text-ink">{email || "Not set"}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <Link
                  to="/mentors"
                  className="inline-flex items-center justify-center rounded-xl border border-surface-line bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface"
                >
                  Cancel / Return
                </Link>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!canConfirm}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity ${
                    canConfirm ? "bg-ink hover:opacity-90" : "cursor-not-allowed bg-ink/40"
                  }`}
                >
                  Confirm &amp; Book Session
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <aside className="h-fit rounded-2xl border border-surface-line bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                Mentorship Session
              </p>
              <p className="mt-1 text-lg font-bold text-ink">Booking Overview</p>

              <div className="mt-4 flex items-center gap-3 border-b border-surface-line pb-4">
                <img
                  src={mentor.imageUrl}
                  alt={mentor.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-ink">{mentor.name}</p>
                  <p className="text-xs text-ink/60">
                    {mentor.role} at {mentor.company}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-ink/60">
                    <Star size={11} className="text-accent-gold" fill="currentColor" strokeWidth={0} />
                    {mentor.rating} ({mentor.reviewCount} reviews) &middot; {mentor.sessionsGiven}{" "}
                    sessions given
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">Date</p>
                  <p className="font-medium text-ink">{selectedDay?.fullLabel ?? "Select a date"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                    Time &amp; Duration
                  </p>
                  <p className="font-medium text-ink">
                    {selectedTime ?? "Select a time"} &middot; {mentor.durationMinutes} minutes
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                    Location
                  </p>
                  <p className="font-medium text-ink">Google Meet</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                    Selected Focus
                  </p>
                  <p className="font-medium text-ink">
                    {selectedTopics.length > 0 ? selectedTopics.join(", ") : "None selected yet"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-surface p-3.5 text-sm text-ink/70">
                <HandCoins size={16} className="mt-0.5 shrink-0 text-accent-blue" />
                <p>
                  <span className="font-semibold text-ink">Free &amp; Voluntary: </span>
                  No payment or card required. Rescheduling is available up to 24 hours
                  before the session.
                </p>
              </div>

              <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-accent-gold/10 p-3.5 text-sm text-ink/70">
                <Lightbulb size={16} className="mt-0.5 shrink-0 text-accent-gold" />
                <p>
                  <span className="font-semibold text-ink">Tip: </span>
                  Come with 1-2 specific questions rather than a broad overview for the
                  best outcome.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ScheduleSessionPage;

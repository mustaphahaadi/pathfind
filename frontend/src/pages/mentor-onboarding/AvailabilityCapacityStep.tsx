import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, Plus, Trash2, Info, ShieldCheck, CalendarClock } from "lucide-react";
import { useMentorOnboardingStore } from "../../store/useMentorOnboardingStore";
import { mentorOnboardingStepPath } from "../../data/mentor-onboarding/steps";
import { weekdayOptions, timeOptions } from "../../data/mentor-onboarding/options";
import { getSessionCapacity } from "../../lib/timeMath";
import SidebarInfoCard from "../../components/mentor-onboarding/SidebarInfoCard";

const schedulingSteps = [
  "Mentees request only within your published blocks.",
  "You review their question agenda before accepting.",
  "Pause availability anytime with 1 click during busy work sprints.",
];

const AvailabilityCapacityStep = () => {
  const timezone = useMentorOnboardingStore((state) => state.timezone);
  const weeklyWindows = useMentorOnboardingStore((state) => state.weeklyWindows);
  const addWeeklyWindow = useMentorOnboardingStore((state) => state.addWeeklyWindow);
  const removeWeeklyWindow = useMentorOnboardingStore((state) => state.removeWeeklyWindow);

  const [day, setDay] = useState(weekdayOptions[4]);
  const [startTime, setStartTime] = useState("6:00 PM");
  const [endTime, setEndTime] = useState("9:00 PM");

  const capacity = getSessionCapacity(startTime, endTime);
  const canAddWindow = capacity > 0;

  const handleAddWindow = () => {
    if (!canAddWindow) return;
    addWeeklyWindow({ day, startTime, endTime, maxCalls: capacity });
  };

  const canContinue = weeklyWindows.length > 0;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-3xl border border-surface-line bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-ink">Recurring Weekly Availability</h2>
            <p className="mt-1 max-w-sm text-sm text-ink/60">
              Define the weekly recurring time blocks when you&apos;re open for 45-minute
              mentoring calls.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-ink">
            <Clock size={13} />
            {timezone || "Set your timezone in Step 1"}
          </span>
        </div>

        <div className="mt-6 border-t border-surface-line pt-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Active Weekly Windows</p>
            <span className="text-xs font-medium text-surface-muted">
              {weeklyWindows.length} window{weeklyWindows.length === 1 ? "" : "s"} configured
            </span>
          </div>

          {weeklyWindows.length === 0 ? (
            <p className="mt-3 rounded-xl border border-dashed border-surface-line p-4 text-sm text-ink/50">
              No recurring windows yet — add one below.
            </p>
          ) : (
            <div className="mt-3 flex flex-col gap-3">
              {weeklyWindows.map((window) => (
                <div
                  key={window.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-surface-line p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-xs font-bold text-ink">
                      {window.day.slice(0, 2)}
                    </span>
                    <div>
                      <p className="flex items-center gap-2 text-sm font-bold text-ink">
                        {window.day}
                        <span className="rounded-full bg-accent-green/10 px-2 py-0.5 text-[11px] font-semibold text-accent-green">
                          ACTIVE
                        </span>
                      </p>
                      <p className="text-sm text-ink/60">
                        {window.startTime} - {window.endTime} (up to {window.maxCalls} calls)
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeWeeklyWindow(window.id)}
                    aria-label={`Remove ${window.day} window`}
                    className="rounded-lg p-2 text-ink/40 hover:bg-surface hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 rounded-xl border border-dashed border-surface-line p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">Add Another Recurring Window</p>
              <span className="text-xs font-medium text-surface-muted">45-min increments</span>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label htmlFor="day" className="text-xs font-medium text-ink/60">
                  Day of Week
                </label>
                <select
                  id="day"
                  value={day}
                  onChange={(event) => setDay(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-surface-line bg-white px-3 py-2.5 text-sm text-ink"
                >
                  {weekdayOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="startTime" className="text-xs font-medium text-ink/60">
                  Start Time
                </label>
                <select
                  id="startTime"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-surface-line bg-white px-3 py-2.5 text-sm text-ink"
                >
                  {timeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="endTime" className="text-xs font-medium text-ink/60">
                  End Time
                </label>
                <select
                  id="endTime"
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-surface-line bg-white px-3 py-2.5 text-sm text-ink"
                >
                  {timeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddWindow}
              disabled={!canAddWindow}
              className={`mt-3 inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                canAddWindow
                  ? "border-surface-line bg-white text-ink hover:bg-surface"
                  : "cursor-not-allowed border-surface-line bg-surface text-ink/40"
              }`}
            >
              <Plus size={15} />
              Add Time Window
            </button>
            {!canAddWindow && (
              <p className="mt-1.5 text-xs text-red-500">
                End time must be after start time by at least 45 minutes.
              </p>
            )}
          </div>

          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-surface p-3.5 text-sm text-ink/70">
            <Info size={16} className="mt-0.5 shrink-0 text-accent-blue" />
            <p>
              Mentees will be able to book 45-minute sessions within these recurring
              hours. You can pause or adjust these anytime without losing your profile
              rank.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-surface-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to={mentorOnboardingStepPath("domain-skills")}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-surface-line bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface"
          >
            <ArrowLeft size={16} />
            Back to Step 2
          </Link>
          <div className="flex flex-col-reverse items-center gap-3 sm:flex-row">
            <Link
              to="/mentors"
              className="text-sm font-medium text-ink/60 transition-colors hover:text-ink"
            >
              Save Draft
            </Link>
            <Link
              to={canContinue ? mentorOnboardingStepPath("honor-code-review") : "#"}
              aria-disabled={!canContinue}
              onClick={(event) => {
                if (!canContinue) event.preventDefault();
              }}
              className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity sm:w-auto ${
                canContinue ? "bg-ink hover:opacity-90" : "cursor-not-allowed bg-ink/40"
              }`}
            >
              Continue to Step 4: Review &amp; Honor Code
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <SidebarInfoCard icon={CalendarClock} title="How Scheduling Works">
          <ol className="space-y-3">
            {schedulingSteps.map((step, index) => (
              <li key={step} className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </SidebarInfoCard>

        <SidebarInfoCard icon={ShieldCheck} title="Privacy & Spam Protection">
          <p>
            Zero spam. Mentees cannot message you directly without an approved booking
            agenda.
          </p>
        </SidebarInfoCard>

        <div className="rounded-2xl border border-surface-line bg-white p-5">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=faces&q=80"
              alt="Priya Shah"
              className="h-11 w-11 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-bold text-ink">Priya Shah</p>
              <p className="text-xs text-ink/60">Senior Engineer @ Databricks</p>
            </div>
          </div>
          <blockquote className="mt-3 border-l-2 border-surface-line pl-3 text-sm italic text-ink/70">
            &ldquo;Pathfind&apos;s recurring-window model gave me the exact boundary I
            needed. I can actually provide meaningful career guidance without getting
            burned out.&rdquo;
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCapacityStep;

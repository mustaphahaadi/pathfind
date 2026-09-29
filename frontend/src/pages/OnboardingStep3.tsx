import { Check, Video, CalendarDays, FileCode2, HandHeart, CheckCircle2, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { OnboardingLayout } from "../components/OnboardingLayout";
import { useAppStore } from "../store/useAppStore";
import type { Proficiency } from "../types";

export function OnboardingStep3() {
  const nav = useNavigate();
  const { onboarding, updateOnboarding, completeOnboarding } = useAppStore();
  const levels: Proficiency[] = ["Beginner", "Intermediate", "Advanced"];

  const toggle = (v: string) => {
    const a = onboarding.formats;
    updateOnboarding({
      formats: a.includes(v) ? a.filter((x) => x !== v) : [...a, v],
    });
  };

  const options: Array<[string, typeof Video]> = [
    ["1:1 Video Calls (45 mins)", Video],
    ["Async Portfolio & Code Review", FileCode2],
    ["Mock Technical Interview", CalendarDays],
    ["Monthly Strategic Check-ins", CalendarDays],
  ];

  return (
    <OnboardingLayout step={3}>
      <div>
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/80 bg-indigo-50/70 px-3 py-1 text-xs font-semibold text-indigo-700">
            <SlidersHorizontal size={13} />
            Mentorship Calibration
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Calibrate your experience &amp; readiness
          </h1>
          <p className="mt-2 max-w-3xl text-base text-neutral-600">
            Ensuring high-value sessions tailored to your proficiency and commitment to voluntary mentorship.
          </p>
        </div>

        <section className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs md:p-8">
          <h2 className="text-lg font-bold text-neutral-900">Select your current technical proficiency</h2>
          <p className="mt-1 text-xs text-neutral-500">
            Mentors leverage this to calibrate the depth of code reviews and career strategic talks.
          </p>
          <div className="mt-6 space-y-2.5">
            {levels.map((x, i) => (
              <button
                key={x}
                type="button"
                onClick={() => updateOnboarding({ proficiency: x })}
                className={`w-full rounded-xl border p-4 text-left transition-all ${
                  onboarding.proficiency === x
                    ? "border-neutral-900 bg-neutral-50/80 ring-1 ring-neutral-900"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`size-4 rounded-full border flex items-center justify-center ${
                      onboarding.proficiency === x ? "border-neutral-900 bg-neutral-900" : "border-neutral-300"
                    }`}
                  >
                    {onboarding.proficiency === x && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                  <span className="flex-1">
                    <b className="block text-sm font-semibold text-neutral-900">{x}</b>
                    <small className="text-xs text-neutral-500">
                      {i === 0
                        ? "Just starting or <1 yr coding/designing. Focusing on foundational basics and syntax."
                        : i === 1
                        ? "1–2 yrs building projects or working in early roles. Ready for architecture reviews."
                        : "3+ yrs experience. Focusing on staff/lead dynamics, advanced system design, and specialized scale."}
                    </small>
                  </span>
                  {i > 0 && (
                    <span className="text-[10px] font-semibold text-neutral-500">
                      {i === 1 ? "1–2 Yrs" : "3+ Yrs"}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs md:p-8">
          <h2 className="text-lg font-bold text-neutral-900">How do you prefer to meet?</h2>
          <p className="mt-1 text-xs text-neutral-500">Select all formats that match your schedule and learning preferences.</p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {options.map(([label, Icon]) => {
              const C = Icon;
              const active = onboarding.formats.includes(String(label));
              return (
                <button
                  type="button"
                  key={String(label)}
                  onClick={() => toggle(String(label))}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                    active
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                  }`}
                >
                  <C size={14} />
                  {label}
                  {active && <Check size={13} className="ml-0.5" />}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6">
          <div className="flex gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-2xs">
              <HandHeart size={18} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="font-bold text-neutral-900">Voluntary Mentorship Pledge</h2>
              <p className="mt-1 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                Mentors are verified senior industry leaders donating their personal time freely. Come with a prepared agenda, test your audio/video beforehand, and respect scheduled times.
              </p>
              <label className="mt-4 flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4 text-xs font-semibold text-neutral-800">
                <input
                  type="checkbox"
                  checked={onboarding.pledgeAccepted}
                  onChange={(e) => updateOnboarding({ pledgeAccepted: e.target.checked })}
                  className="mt-0.5"
                />
                I agree to come to every session with a prepared agenda and commit to respecting volunteer time.
              </label>
            </div>
          </div>
        </section>

        <div className="mt-6 flex items-center gap-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 size={18} />
          </span>
          <div>
            <b className="text-sm font-bold text-neutral-900">All set! We found 34 matching mentors ready for your background.</b>
            <p className="text-xs text-neutral-600">Including specialists in React, Systems Design, and Early Career Transition.</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-neutral-200/80 pt-6">
          <button
            onClick={() => nav("/onboarding/2")}
            className="rounded-xl border border-neutral-200 px-5 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            &larr; Back
          </button>
          <Button
            disabled={!onboarding.pledgeAccepted}
            onClick={() => {
              completeOnboarding();
              nav("/mentors");
            }}
            className="rounded-xl px-5 py-2.5 text-xs font-semibold"
          >
            Complete Setup &amp; Explore Mentors &rarr;
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
}

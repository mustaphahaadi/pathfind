import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Plus, TrendingUp, Lightbulb, Award } from "lucide-react";
import { useMentorOnboardingStore } from "../../store/useMentorOnboardingStore";
import { mentorOnboardingStepPath } from "../../data/mentor-onboarding/steps";
import {
  mentorDisciplines,
  mentorshipTopics,
  menteeStagePreferences,
} from "../../data/mentor-onboarding/options";
import SidebarInfoCard from "../../components/mentor-onboarding/SidebarInfoCard";

const MAX_WORDS = 500;

const inDemandTopics = [
  { label: "System Architecture", share: "34% of sessions" },
  { label: "Resume & Project Storytelling", share: "29% of sessions" },
  { label: "Behavioral STAR Framework", share: "22% of sessions" },
  { label: "Overcoming Impostor Syndrome", share: "15% of sessions" },
];

const DomainSkillsStep = () => {
  const primaryDiscipline = useMentorOnboardingStore((state) => state.primaryDiscipline);
  const topics = useMentorOnboardingStore((state) => state.topics);
  const motivation = useMentorOnboardingStore((state) => state.motivation);
  const targetStages = useMentorOnboardingStore((state) => state.targetStages);

  const setPrimaryDiscipline = useMentorOnboardingStore((state) => state.setPrimaryDiscipline);
  const toggleTopic = useMentorOnboardingStore((state) => state.toggleTopic);
  const setMotivation = useMentorOnboardingStore((state) => state.setMotivation);
  const toggleTargetStage = useMentorOnboardingStore((state) => state.toggleTargetStage);

  const wordCount = motivation.trim().length === 0 ? 0 : motivation.trim().split(/\s+/).length;

  const handleMotivationChange = (value: string) => {
    const words = value.trim().split(/\s+/).filter(Boolean);
    if (words.length <= MAX_WORDS) {
      setMotivation(value);
    }
  };

  const canContinue =
    primaryDiscipline !== null &&
    topics.length > 0 &&
    motivation.trim().length > 0 &&
    targetStages.length > 0;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-3xl border border-surface-line bg-white p-6 sm:p-8">
        <h2 className="text-xl font-bold text-ink">Expertise &amp; Focus Areas</h2>
        <p className="mt-1 text-sm text-ink/60">
          Tell us where you can make the biggest impact for career transitioners.
        </p>

        <div className="mt-6 border-t border-surface-line pt-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">
              Primary Discipline <span className="text-red-500">*</span>
            </p>
            <span className="text-xs font-medium text-surface-muted">Select one</span>
          </div>

          <div
            className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2"
            role="radiogroup"
            aria-label="Primary discipline"
          >
            {mentorDisciplines.map((discipline) => {
              const Icon = discipline.icon;
              const isSelected = primaryDiscipline === discipline.id;
              return (
                <button
                  key={discipline.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setPrimaryDiscipline(discipline.id)}
                  className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors ${
                    isSelected
                      ? "border-ink bg-surface/60"
                      : "border-surface-line bg-white hover:border-ink/30"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                        isSelected ? "border-ink bg-ink" : "border-surface-line"
                      }`}
                    >
                      {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                    <span className="text-sm font-semibold text-ink">{discipline.label}</span>
                  </span>
                  <Icon size={18} className="shrink-0 text-ink/40" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 border-t border-surface-line pt-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">
              Mentorship Topics &amp; Core Competencies <span className="text-red-500">*</span>
            </p>
            <span className="text-xs font-medium text-surface-muted">{topics.length} selected</span>
          </div>
          <p className="mt-0.5 text-sm text-ink/60">
            Select the specific subjects where you feel comfortable giving actionable
            critique and step-by-step guidance.
          </p>

          <div className="mt-3 flex flex-wrap gap-2.5">
            {mentorshipTopics.map((topic) => {
              const isSelected = topics.includes(topic.id);
              return (
                <button
                  key={topic.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleTopic(topic.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
                    isSelected
                      ? "border-ink bg-ink text-white"
                      : "border-surface-line bg-white text-ink hover:border-ink/30"
                  }`}
                >
                  {isSelected ? <Check size={14} strokeWidth={2.5} /> : <Plus size={14} strokeWidth={2.5} />}
                  {topic.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 border-t border-surface-line pt-5">
          <div className="flex items-center justify-between">
            <label htmlFor="motivation" className="text-sm font-semibold text-ink">
              Why do you want to volunteer on Pathfind? What advice do you wish you had
              early in your career? <span className="text-red-500">*</span>
            </label>
            <span className="shrink-0 text-xs font-medium text-surface-muted">
              {wordCount} / {MAX_WORDS} words
            </span>
          </div>
          <textarea
            id="motivation"
            value={motivation}
            onChange={(event) => handleMotivationChange(event.target.value)}
            rows={5}
            placeholder="Share your story and what draws you to mentoring career transitioners..."
            className="mt-2 w-full rounded-xl border border-surface-line px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
          />
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-accent-blue">
            This statement will be prominently visible on your public mentor card and
            profile.
          </p>
        </div>

        <div className="mt-6 border-t border-surface-line pt-5">
          <p className="text-sm font-semibold text-ink">
            Target Mentee Stage Preference <span className="text-red-500">*</span>
          </p>
          <p className="mt-0.5 text-sm text-ink/60">
            Check all stages where you feel your guidance delivers maximum velocity.
          </p>

          <div className="mt-3 flex flex-col gap-3">
            {menteeStagePreferences.map((stage) => {
              const isSelected = targetStages.includes(stage.id);
              return (
                <button
                  key={stage.id}
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  onClick={() => toggleTargetStage(stage.id)}
                  className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                    isSelected
                      ? "border-ink bg-surface/60"
                      : "border-surface-line bg-white hover:border-ink/30"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
                      isSelected ? "border-ink bg-ink text-white" : "border-surface-line text-transparent"
                    }`}
                  >
                    <Check size={13} strokeWidth={3} />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink">{stage.label}</span>
                    <span className="mt-1 block text-sm text-ink/60">{stage.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-surface-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to={mentorOnboardingStepPath("identity-verification")}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-surface-line bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface"
          >
            <ArrowLeft size={16} />
            Back to Step 1
          </Link>
          <div className="flex flex-col-reverse items-center gap-3 sm:flex-row">
            <Link
              to="/mentors"
              className="text-sm font-medium text-ink/60 transition-colors hover:text-ink"
            >
              Save Draft
            </Link>
            <Link
              to={canContinue ? mentorOnboardingStepPath("availability-capacity") : "#"}
              aria-disabled={!canContinue}
              onClick={(event) => {
                if (!canContinue) event.preventDefault();
              }}
              className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity sm:w-auto ${
                canContinue ? "bg-ink hover:opacity-90" : "cursor-not-allowed bg-ink/40"
              }`}
            >
              Continue to Step 3: Availability
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <SidebarInfoCard icon={TrendingUp} title="In-Demand Topics">
          <p className="mb-3 text-ink/60">
            Transitioners currently book these themes most frequently on Pathfind:
          </p>
          <ul className="space-y-2.5">
            {inDemandTopics.map((topic) => (
              <li key={topic.label} className="flex items-center justify-between">
                <span className="text-ink">{topic.label}</span>
                <span className="font-semibold text-accent-blue">{topic.share}</span>
              </li>
            ))}
          </ul>
        </SidebarInfoCard>

        <SidebarInfoCard icon={Lightbulb} title="Quality Over Quantity" tone="accent">
          <p>
            Mentors who specify 3-4 focused discussion topics report 40% higher session
            satisfaction compared to broad generalists.
          </p>
        </SidebarInfoCard>

        <div className="rounded-2xl border border-surface-line bg-white p-5">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent-green">
            <Award size={14} />
            Platform Milestone
          </p>
          <p className="mt-2 text-3xl font-extrabold text-ink">12,400+</p>
          <p className="mt-1 text-sm text-ink/60">
            Mentorship hours freely contributed by engineers and leaders since launch.
            Every session builds a more inclusive tech ecosystem.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DomainSkillsStep;

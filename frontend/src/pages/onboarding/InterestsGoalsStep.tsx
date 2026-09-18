import { useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Plus, X } from "lucide-react";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { technicalTracks, menteeTechnicalSkills } from "../../data/onboarding/technicalTracks";
import { coreObjectives } from "../../data/onboarding/coreObjectives";
import { getSkillLabel } from "../../data/mentor-onboarding/options";
import { mentors } from "../../data/mentors";
import { onboardingStepPath } from "../../data/onboarding/steps";
import ToggleChip from "../../components/onboarding/ToggleChip";
import ObjectiveCard from "../../components/onboarding/ObjectiveCard";
import AvatarStack from "../../components/onboarding/AvatarStack";

const InterestsGoalsStep = () => {
  const [customSkillInput, setCustomSkillInput] = useState("");

  const selectedTracks = useOnboardingStore((state) => state.technicalTracks);
  const selectedObjectives = useOnboardingStore((state) => state.coreObjectives);
  const toggleTechnicalTrack = useOnboardingStore((state) => state.toggleTechnicalTrack);
  const toggleCoreObjective = useOnboardingStore((state) => state.toggleCoreObjective);

  const canContinue = selectedTracks.length > 0 && selectedObjectives.length > 0;

  const selectedTrackLabels = selectedTracks.map(getSkillLabel);

  const handleAddCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (trimmed && !selectedTracks.includes(trimmed)) {
      toggleTechnicalTrack(trimmed);
      setCustomSkillInput("");
    }
  };

  const handleCustomSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustomSkill();
    }
  };

  const predefinedTrackAndSkillIds = new Set([
    ...technicalTracks.map((t) => t.id),
    ...menteeTechnicalSkills.map((s) => s.id),
  ]);
  const customSkills = selectedTracks.filter((t) => !predefinedTrackAndSkillIds.has(t));

  const matchingMentorCount = Math.max(
    6,
    40 - selectedTracks.length * 3 - selectedObjectives.length * 2,
  );

  return (
    <div>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-green/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-accent-green">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
        100% Free &amp; Voluntary Community
      </span>

      <h1 className="mt-5 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
        What are your interests and goals?
      </h1>
      <p className="mt-2 max-w-xl text-base leading-relaxed text-ink/60">
        Select your primary technical tracks and what you want to achieve
        with your mentor. We use this to curate volunteer leaders with
        matching practical experience.
      </p>

      <div className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-ink">
              Technical Tracks &amp; Fields
            </p>
            <p className="mt-0.5 text-sm text-ink/60">
              What areas are you interested in? Select all that apply.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink">
            {selectedTracks.length} SELECTED
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2.5">
          {technicalTracks.map((track) => (
            <ToggleChip
              key={track.id}
              label={track.label}
              isSelected={selectedTracks.includes(track.id)}
              onToggle={() => toggleTechnicalTrack(track.id)}
            />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-ink">
              Specific Technical Skills
            </p>
            <p className="mt-0.5 text-sm text-ink/60">
              Select the specific technologies you want to learn or improve, or add your own custom skills below.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink">
            {selectedTracks.filter(t => menteeTechnicalSkills.some(s => s.id === t) || !predefinedTrackAndSkillIds.has(t)).length} SELECTED
          </span>
        </div>

        {/* Custom skill input */}
        <div className="mt-3 flex items-center gap-2">
          <input
            type="text"
            value={customSkillInput}
            onChange={(e) => setCustomSkillInput(e.target.value)}
            onKeyDown={handleCustomSkillKeyDown}
            placeholder="Add custom skill to learn (e.g. GraphQL, TailwindCSS, Kubernetes)..."
            className="flex-1 rounded-xl border border-surface-line px-3.5 py-2 text-xs text-ink placeholder:text-ink/35 focus:border-ink outline-none"
          />
          <button
            type="button"
            onClick={handleAddCustomSkill}
            disabled={!customSkillInput.trim()}
            className="inline-flex items-center gap-1 rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Plus size={14} />
            Add
          </button>
        </div>

        {/* Custom skills rendered */}
        {customSkills.length > 0 && (
          <div className="mt-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-blue">Custom Skills</p>
            <div className="flex flex-wrap gap-2">
              {customSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-ink bg-ink px-3 py-1.5 text-xs font-medium text-white"
                >
                  {getSkillLabel(skill)}
                  <button
                    type="button"
                    onClick={() => toggleTechnicalTrack(skill)}
                    className="text-white/70 hover:text-white"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 space-y-4">
          {["Languages", "Frameworks", "Databases", "Cloud & DevOps", "Data & Analytics", "Product & Design", "Backend & Architecture"].map((category) => {
            const categorySkills = menteeTechnicalSkills.filter((skill) => skill.category === category);
            if (categorySkills.length === 0) return null;
            return (
              <div key={category}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/40">{category}</p>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <ToggleChip
                      key={skill.id}
                      label={skill.label}
                      isSelected={selectedTracks.includes(skill.id)}
                      onToggle={() => toggleTechnicalTrack(skill.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-ink">Core Objectives</p>
            <p className="mt-0.5 text-sm text-ink/60">
              What do you want help with? Select all that apply.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink">
            {selectedObjectives.length} SELECTED
          </span>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {coreObjectives.map((objective) => (
            <ObjectiveCard
              key={objective.id}
              title={objective.title}
              description={objective.description}
              isSelected={selectedObjectives.includes(objective.id)}
              onToggle={() => toggleCoreObjective(objective.id)}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <AvatarStack avatarUrls={mentors.slice(0, 4).map((mentor) => mentor.imageUrl)} />
          <div>
            <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
              {matchingMentorCount} mentors available
            </p>
            <p className="mt-0.5 text-sm text-ink/60">
              {selectedTrackLabels.length > 0
                ? `Matching ${selectedTrackLabels.join(" & ")} with selected goals.`
                : "Select a track above to see matching mentors."}
            </p>
          </div>
        </div>
        <span className="w-fit shrink-0 rounded-full border border-surface-line bg-white px-3 py-1.5 text-xs font-semibold text-accent-blue">
          Zero Platform Fees
        </span>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-surface-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to={onboardingStepPath("about-you")}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-surface-line px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface"
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        <div className="flex flex-col-reverse items-center gap-3 sm:flex-row">
          <Link
            to="/profile"
            className="text-sm font-medium text-ink/60 transition-colors hover:text-ink"
          >
            Save &amp; Exit
          </Link>
          <Link
            to={canContinue ? onboardingStepPath("experience-readiness") : "#"}
            aria-disabled={!canContinue}
            onClick={(event) => {
              if (!canContinue) event.preventDefault();
            }}
            className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity sm:w-auto ${
              canContinue ? "bg-ink hover:opacity-90" : "cursor-not-allowed bg-ink/40"
            }`}
          >
            Continue to Experience &amp; Readiness
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InterestsGoalsStep;

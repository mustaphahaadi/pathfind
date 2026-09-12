import { SlidersHorizontal } from "lucide-react";
import type { MentorCategory } from "../../types/mentor";

const disciplines: MentorCategory[] = [
  "Software Engineering",
  "UX & Product Design",
  "Product Management",
  "Brand & Design Systems",
  "Technical Writing",
];

interface MentorFiltersSidebarProps {
  skillQuery: string;
  onSkillQueryChange: (value: string) => void;
  selectedDisciplines: MentorCategory[];
  onToggleDiscipline: (discipline: MentorCategory) => void;
  availableOnly: boolean;
  onToggleAvailableOnly: () => void;
  onClearAll: () => void;
}

const MentorFiltersSidebar = ({
  skillQuery,
  onSkillQueryChange,
  selectedDisciplines,
  onToggleDiscipline,
  availableOnly,
  onToggleAvailableOnly,
  onClearAll,
}: MentorFiltersSidebarProps) => {
  const activeCount = selectedDisciplines.length + (availableOnly ? 1 : 0);

  return (
    <aside className="h-fit rounded-2xl border border-surface-line bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
          <SlidersHorizontal size={15} />
          Filters
        </p>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-medium text-accent-blue hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="mt-4">
        <label htmlFor="skill-search" className="text-xs font-semibold uppercase tracking-wide text-ink/50">
          Search Specific Skills
        </label>
        <input
          id="skill-search"
          type="text"
          value={skillQuery}
          onChange={(event) => onSkillQueryChange(event.target.value)}
          placeholder="e.g. React, Figma, SQL..."
          className="mt-1.5 w-full rounded-xl border border-surface-line px-3 py-2 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
        />
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
          Disciplines {selectedDisciplines.length > 0 && `· Selected ${selectedDisciplines.length}`}
        </p>
        <div className="mt-2 flex flex-col gap-2">
          {disciplines.map((discipline) => (
            <label key={discipline} className="flex items-center gap-2.5 text-sm text-ink/80">
              <input
                type="checkbox"
                checked={selectedDisciplines.includes(discipline)}
                onChange={() => onToggleDiscipline(discipline)}
                className="h-4 w-4 rounded border-surface-line accent-ink"
              />
              {discipline}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-surface-line pt-4">
        <label className="flex items-center gap-2.5 text-sm text-ink/80">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={onToggleAvailableOnly}
            className="h-4 w-4 rounded border-surface-line accent-ink"
          />
          Available only
        </label>
      </div>
    </aside>
  );
};

export default MentorFiltersSidebar;

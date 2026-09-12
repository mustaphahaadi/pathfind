interface RadioOptionCardProps {
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
  /** Shown as a pill when NOT selected (e.g. "1-2 Yrs"). When selected, "SELECTED" (or selectedLabel) shows instead. */
  tag?: string;
  selectedLabel?: string;
}

const RadioOptionCard = ({
  title,
  description,
  isSelected,
  onSelect,
  tag,
  selectedLabel = "SELECTED",
}: RadioOptionCardProps) => {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={onSelect}
      className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
        isSelected
          ? "border-ink bg-surface/60"
          : "border-surface-line bg-white hover:border-ink/30"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          isSelected ? "border-ink bg-ink" : "border-surface-line"
        }`}
      >
        {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
      </span>

      <span className="flex-1">
        <span className="flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-ink">{title}</span>
          {(tag || isSelected) && (
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${
                isSelected ? "bg-ink text-white" : "bg-surface text-ink/60"
              }`}
            >
              {isSelected ? selectedLabel : tag}
            </span>
          )}
        </span>
        <span className="mt-1 block text-sm text-ink/60">{description}</span>
      </span>
    </button>
  );
};

export default RadioOptionCard;

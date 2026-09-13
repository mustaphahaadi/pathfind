interface SimpleRadioTileProps {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
}

const SimpleRadioTile = ({ label, isSelected, onSelect }: SimpleRadioTileProps) => {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={onSelect}
      className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
        isSelected
          ? "border-ink bg-surface/60 text-ink"
          : "border-surface-line bg-white text-ink/80 hover:border-ink/30"
      }`}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
          isSelected ? "border-ink bg-ink" : "border-surface-line"
        }`}
      >
        {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      </span>
      {label}
    </button>
  );
};

export default SimpleRadioTile;

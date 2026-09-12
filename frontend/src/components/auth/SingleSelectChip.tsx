interface SingleSelectChipProps {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
}

const SingleSelectChip = ({ label, isSelected, onSelect }: SingleSelectChipProps) => {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={onSelect}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        isSelected
          ? "border-ink bg-ink text-white"
          : "border-surface-line bg-white text-ink hover:border-ink/30"
      }`}
    >
      {label}
    </button>
  );
};

export default SingleSelectChip;

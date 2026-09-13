import { Check } from "lucide-react";

interface ObjectiveCardProps {
  title: string;
  description: string;
  isSelected: boolean;
  onToggle: () => void;
}

const ObjectiveCard = ({
  title,
  description,
  isSelected,
  onToggle,
}: ObjectiveCardProps) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isSelected}
      onClick={onToggle}
      className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
        isSelected
          ? "border-ink bg-surface/60"
          : "border-surface-line bg-white hover:border-ink/30"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
          isSelected
            ? "border-ink bg-ink text-white"
            : "border-surface-line text-transparent"
        }`}
      >
        <Check size={13} strokeWidth={3} />
      </span>
      <span>
        <span className="block text-sm font-bold text-ink">{title}</span>
        <span className="mt-1 block text-sm text-ink/60">{description}</span>
      </span>
    </button>
  );
};

export default ObjectiveCard;

import { Check, Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ToggleChipProps {
  label: string;
  isSelected: boolean;
  onToggle: () => void;
  /** A fixed semantic icon (e.g. Video, CalendarClock) shown leading, regardless of selection.
   *  When omitted, a Plus/Check leading icon toggles based on selection instead. */
  icon?: LucideIcon;
}

const ToggleChip = ({ label, isSelected, onToggle, icon: Icon }: ToggleChipProps) => {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onToggle}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
        isSelected
          ? "border-ink bg-ink text-white"
          : "border-surface-line bg-white text-ink hover:border-ink/30"
      }`}
    >
      {Icon ? (
        <Icon size={16} strokeWidth={1.75} />
      ) : isSelected ? (
        <Check size={15} strokeWidth={2.5} />
      ) : (
        <Plus size={15} strokeWidth={2.5} />
      )}
      {label}
      {Icon && isSelected && <Check size={15} strokeWidth={2.5} />}
    </button>
  );
};

export default ToggleChip;

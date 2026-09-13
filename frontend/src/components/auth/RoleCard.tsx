import type { KeyboardEvent, MouseEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import type { RoleOption } from "../../types/auth";

interface RoleCardProps {
  role: RoleOption;
  isSelected: boolean;
  onSelect: () => void;
}

/**
 * The card body is a selectable "preview" (radio-like highlight), while the
 * bottom CTA is the actual navigation into that role's sign-up page. Kept as
 * separate interactive elements (a div + a real Link) rather than nesting a
 * link/button inside a button, which isn't valid HTML.
 */
const RoleCard = ({ role, isSelected, onSelect }: RoleCardProps) => {
  const Icon = role.icon;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  };

  const stopSelectPropagation = (event: MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
  };

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className={`flex h-full cursor-pointer flex-col rounded-2xl border bg-white p-6 text-left transition-colors ${
        isSelected ? "border-ink" : "border-surface-line hover:border-ink/30"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
            isSelected ? "bg-ink text-white" : "bg-surface text-ink"
          }`}
        >
          <Icon size={20} strokeWidth={1.75} />
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
            isSelected ? "bg-ink text-white" : "bg-surface text-ink/70"
          }`}
        >
          {isSelected ? "SELECTED" : role.tagLabel.toUpperCase()}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-bold text-ink">{role.title}</h3>
      <p className="mt-1 text-sm text-ink/60">{role.description}</p>

      <ul className="mt-4 flex-1 space-y-2.5">
        {role.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2.5 text-sm text-ink/75">
            <Check
              size={16}
              strokeWidth={2.5}
              className="mt-0.5 shrink-0 text-accent-blue"
            />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <Link
        to={`/join/${role.id}`}
        onClick={stopSelectPropagation}
        className={`mt-6 inline-flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-semibold transition-opacity hover:opacity-90 ${
          isSelected ? "bg-ink text-white" : "border border-surface-line bg-white text-ink"
        }`}
      >
        {role.ctaLabel}
        <ArrowRight size={15} />
      </Link>
    </div>
  );
};

export default RoleCard;

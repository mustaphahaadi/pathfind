import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { statusOptions } from "../../data/onboarding/statusOptions";
import { getInitials } from "../../lib/getInitials";

interface UserMenuLinkProps {
  className?: string;
}

/** The signed-in avatar block shown in the header once someone has a name on file. */
const UserMenuLink = ({ className = "" }: UserMenuLinkProps) => {
  const fullName = useOnboardingStore((state) => state.fullName);
  const avatarUrl = useOnboardingStore((state) => state.avatarUrl);
  const status = useOnboardingStore((state) => state.status);

  const statusLabel = statusOptions.find((option) => option.id === status)?.title;

  return (
    <Link
      to="/profile"
      className={`flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-surface ${className}`}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={fullName}
          className="h-9 w-9 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
          {getInitials(fullName)}
        </span>
      )}
      <span className="hidden text-left sm:block">
        <span className="block text-sm font-semibold leading-tight text-ink">
          {fullName}
        </span>
        <span className="block text-xs leading-tight text-ink/50">
          Mentee{statusLabel ? ` · ${statusLabel}` : ""}
        </span>
      </span>
      <ChevronDown size={16} className="hidden shrink-0 text-ink/40 sm:block" />
    </Link>
  );
};

export default UserMenuLink;

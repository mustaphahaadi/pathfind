import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LayoutGrid,
  CalendarDays,
  Bookmark,
  Target,
  FileText,
  Settings,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { useSessionsStore } from "../../store/useSessionsStore";
import { statusOptions } from "../../data/onboarding/statusOptions";
import { getInitials } from "../../lib/getInitials";

interface UserMenuLinkProps {
  className?: string;
}

const menuItems = [
  { label: "Dashboard", icon: LayoutGrid, to: "/profile" },
  { label: "My Sessions", icon: CalendarDays, to: "/profile", badgeKey: "sessions" as const },
  { label: "Saved Mentors", icon: Bookmark, to: "/profile" },
  { label: "Goals & Career Tracks", icon: Target, to: "/onboarding/mentee/interests-goals" },
  { label: "Notes & Resources", icon: FileText, to: "/profile" },
];

const secondaryItems = [
  { label: "Settings & Preferences", icon: Settings, to: "/profile" },
  { label: "Honor Code & Guidelines", icon: ShieldCheck, to: "/honor-code" },
];

/** The signed-in avatar block + dropdown menu shown in the header once someone has a name on file. */
const UserMenuLink = ({ className = "" }: UserMenuLinkProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fullName = useOnboardingStore((state) => state.fullName);
  const email = useOnboardingStore((state) => state.email);
  const avatarUrl = useOnboardingStore((state) => state.avatarUrl);
  const status = useOnboardingStore((state) => state.status);
  const resetOnboarding = useOnboardingStore((state) => state.reset);
  const upcomingSessionCount = useSessionsStore((state) => state.sessions.length);

  const statusLabel = statusOptions.find((option) => option.id === status)?.title;

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleSignOut = () => {
    setIsOpen(false);
    resetOnboarding();
    navigate("/auth");
  };

  const avatar = avatarUrl ? (
    <img src={avatarUrl} alt={fullName} className="h-9 w-9 shrink-0 rounded-full object-cover" />
  ) : (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
      {getInitials(fullName)}
    </span>
  );

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex items-center gap-1 rounded-xl px-1 py-1 transition-colors hover:bg-surface">
        <Link to="/profile" aria-label="Go to your profile">
          {avatar}
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className="flex items-center gap-1.5 rounded-lg px-1.5 py-1"
        >
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold leading-tight text-ink">
              {fullName}
            </span>
            <span className="block text-xs leading-tight text-ink/50">
              Mentee{statusLabel ? ` · ${statusLabel}` : ""}
            </span>
          </span>
          <ChevronDown
            size={16}
            className={`hidden shrink-0 text-ink/40 transition-transform sm:block ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 w-72 overflow-hidden rounded-2xl border border-surface-line bg-white shadow-lg"
        >
          <div className="flex items-center gap-3 border-b border-surface-line p-4">
            {avatar}
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink">{fullName}</p>
              <p className="truncate text-xs text-ink/50">{email}</p>
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-[11px] font-medium text-ink/70">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                Mentee{statusLabel ? ` · ${statusLabel}` : ""}
              </span>
            </div>
          </div>

          <div className="p-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm text-ink/80 transition-colors hover:bg-surface"
                >
                  <span className="flex items-center gap-2.5">
                    <Icon size={16} className="text-ink/50" />
                    {item.label}
                  </span>
                  {item.badgeKey === "sessions" && upcomingSessionCount > 0 && (
                    <span className="rounded-full bg-accent-blue/10 px-2 py-0.5 text-xs font-semibold text-accent-blue">
                      {upcomingSessionCount} upcoming
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-surface-line p-1.5">
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink/80 transition-colors hover:bg-surface"
                >
                  <Icon size={16} className="text-ink/50" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-surface-line p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenuLink;

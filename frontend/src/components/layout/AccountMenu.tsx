import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AccountMenuItem {
  label: string;
  icon: LucideIcon;
  to: string;
  badge?: ReactNode;
}

interface AccountMenuProps {
  avatar: ReactNode;
  name: string;
  subtitle: string;
  email?: string;
  profileTo: string;
  menuItems: AccountMenuItem[];
  secondaryItems: AccountMenuItem[];
  onSignOut: () => void;
  className?: string;
  isOverlay?: boolean;
}

/**
 * Shared presentational shell for the signed-in header block: an avatar that
 * links straight to the profile/dashboard, and a name/chevron that toggles a
 * dropdown menu (closes on outside click or Escape). Used by both the mentee
 * and mentor identities — each supplies its own menu items and sign-out logic.
 */
const AccountMenu = ({
  avatar,
  name,
  subtitle,
  email,
  profileTo,
  menuItems,
  secondaryItems,
  onSignOut,
  className = "",
  isOverlay = false,
}: AccountMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    onSignOut();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        className={`flex items-center gap-2 rounded-full px-2 py-1.5 backdrop-blur-md transition-all ${
          isOverlay
            ? "bg-white/10 border border-white/20 text-white shadow-sm hover:bg-white/20"
            : "bg-white border border-surface-line text-ink shadow-sm hover:bg-surface"
        }`}
      >
        <Link to={profileTo} aria-label="Go to your dashboard" className="shrink-0">
          {avatar}
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className="flex items-center gap-1.5 pr-2 text-left"
        >
          <span className="hidden sm:block">
            <span
              className={`block text-xs font-bold leading-snug truncate max-w-[130px] ${
                isOverlay ? "text-white" : "text-ink"
              }`}
            >
              {name}
            </span>
            <span
              className={`block text-[11px] font-medium leading-none truncate max-w-[130px] ${
                isOverlay ? "text-white/80" : "text-ink/60"
              }`}
            >
              {subtitle}
            </span>
          </span>
          <ChevronDown
            size={15}
            className={`hidden shrink-0 transition-transform sm:block ${
              isOverlay ? "text-white/80" : "text-ink/60"
            } ${isOpen ? "rotate-180" : ""}`}
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
              <p className="truncate text-sm font-bold text-ink">{name}</p>
              {email && <p className="truncate text-xs text-ink/50">{email}</p>}
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-[11px] font-medium text-ink/70">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                {subtitle}
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
                  {item.badge}
                </Link>
              );
            })}
          </div>

          {secondaryItems.length > 0 && (
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
          )}

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

export default AccountMenu;

import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  CalendarDays,
  Bookmark,
  Target,
  FileText,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { useSessionsStore } from "../../store/useSessionsStore";
import { statusOptions } from "../../data/onboarding/statusOptions";
import { getInitials } from "../../lib/getInitials";
import AccountMenu, { type AccountMenuItem } from "./AccountMenu";

interface UserMenuLinkProps {
  className?: string;
}

/** The signed-in mentee avatar block + dropdown menu shown once a mentee has a name on file. */
const UserMenuLink = ({ className = "" }: UserMenuLinkProps) => {
  const navigate = useNavigate();

  const fullName = useOnboardingStore((state) => state.fullName);
  const email = useOnboardingStore((state) => state.email);
  const avatarUrl = useOnboardingStore((state) => state.avatarUrl);
  const status = useOnboardingStore((state) => state.status);
  const resetOnboarding = useOnboardingStore((state) => state.reset);
  const upcomingSessionCount = useSessionsStore((state) => state.sessions.length);

  const statusLabel = statusOptions.find((option) => option.id === status)?.title;
  const subtitle = `Mentee${statusLabel ? ` · ${statusLabel}` : ""}`;

  const avatar = avatarUrl ? (
    <img src={avatarUrl} alt={fullName} className="h-9 w-9 shrink-0 rounded-full object-cover" />
  ) : (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
      {getInitials(fullName)}
    </span>
  );

  const menuItems: AccountMenuItem[] = [
    { label: "Dashboard", icon: LayoutGrid, to: "/profile" },
    {
      label: "My Sessions",
      icon: CalendarDays,
      to: "/profile",
      badge:
        upcomingSessionCount > 0 ? (
          <span className="rounded-full bg-accent-blue/10 px-2 py-0.5 text-xs font-semibold text-accent-blue">
            {upcomingSessionCount} upcoming
          </span>
        ) : undefined,
    },
    { label: "Saved Mentors", icon: Bookmark, to: "/profile" },
    { label: "Goals & Career Tracks", icon: Target, to: "/onboarding/mentee/interests-goals" },
    { label: "Notes & Resources", icon: FileText, to: "/profile" },
  ];

  const secondaryItems: AccountMenuItem[] = [
    { label: "Settings & Preferences", icon: Settings, to: "/profile" },
    { label: "Honor Code & Guidelines", icon: ShieldCheck, to: "/honor-code" },
  ];

  return (
    <AccountMenu
      className={className}
      avatar={avatar}
      name={fullName}
      subtitle={subtitle}
      email={email}
      profileTo="/profile"
      menuItems={menuItems}
      secondaryItems={secondaryItems}
      onSignOut={() => {
        resetOnboarding();
        navigate("/auth");
      }}
    />
  );
};

export default UserMenuLink;

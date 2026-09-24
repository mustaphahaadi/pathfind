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
import { useAuthStore } from "../../store/useAuthStore";
import { statusOptions } from "../../data/onboarding/statusOptions";
import { getInitials } from "../../lib/getInitials";
import { resolveMediaUrl } from "../../lib/resolveMediaUrl";
import AccountMenu, { type AccountMenuItem } from "./AccountMenu";

interface UserMenuLinkProps {
  className?: string;
  isOverlay?: boolean;
}

/** The signed-in mentee avatar block + dropdown menu shown once a mentee has a name on file. */
const UserMenuLink = ({ className = "", isOverlay = false }: UserMenuLinkProps) => {
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const onboardingFullName = useOnboardingStore((state) => state.fullName);
  const onboardingEmail = useOnboardingStore((state) => state.email);
  const onboardingAvatarUrl = useOnboardingStore((state) => state.avatarUrl);
  const status = useOnboardingStore((state) => state.status);
  const resetOnboarding = useOnboardingStore((state) => state.reset);
  const upcomingSessionCount = useSessionsStore((state) => state.sessions.length);

  const fullName = user?.profile?.full_name || onboardingFullName || "Mentee User";
  const email = user?.email || onboardingEmail;
  const avatarUrl = user?.profile?.avatar_url || onboardingAvatarUrl;

  const statusLabel = statusOptions.find((option) => option.id === status)?.title;
  const isAdmin = user?.role === "admin";
  const subtitle = isAdmin
    ? "Platform Administrator"
    : `Mentee${statusLabel ? ` · ${statusLabel}` : ""}`;

  const avatar = avatarUrl ? (
    <img
      src={resolveMediaUrl(avatarUrl)!}
      alt={fullName}
      className={`h-9 w-9 shrink-0 rounded-full object-cover ring-2 ${
        isOverlay ? "ring-white/80" : "ring-black/10"
      }`}
    />
  ) : (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black shadow-sm ${
        isOverlay ? "bg-white text-ink ring-2 ring-white/80" : "bg-ink text-white ring-2 ring-black/10"
      }`}
    >
      {getInitials(fullName)}
    </span>
  );

  const menuItems: AccountMenuItem[] = isAdmin
    ? [
        { label: "Admin Verification Queue", icon: ShieldCheck, to: "/admin" },
        { label: "Verified Mentors Directory", icon: LayoutGrid, to: "/mentors" },
        { label: "Community Stories", icon: FileText, to: "/stories" },
      ]
    : [
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

  const secondaryItems: AccountMenuItem[] = isAdmin
    ? [
        { label: "Platform Honor Code", icon: ShieldCheck, to: "/honor-code" },
      ]
    : [
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
      profileTo={isAdmin ? "/admin" : "/profile"}
      menuItems={menuItems}
      secondaryItems={secondaryItems}
      isOverlay={isOverlay}
      onSignOut={() => {
        logout();
        resetOnboarding();
        navigate("/auth");
      }}
    />
  );
};

export default UserMenuLink;

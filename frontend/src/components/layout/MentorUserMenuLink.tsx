import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Inbox,
  CalendarDays,
  Users,
  CalendarClock,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import { useMentorOnboardingStore } from "../../store/useMentorOnboardingStore";
import { useAuthStore } from "../../store/useAuthStore";
import { getInitials } from "../../lib/getInitials";
import { resolveMediaUrl } from "../../lib/resolveMediaUrl";
import AccountMenu, { type AccountMenuItem } from "./AccountMenu";

interface MentorUserMenuLinkProps {
  className?: string;
  isOverlay?: boolean;
}

/** The signed-in mentor avatar block + dropdown menu shown once a mentor has published their profile. */
const MentorUserMenuLink = ({ className = "", isOverlay = false }: MentorUserMenuLinkProps) => {
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const onboardingFullName = useMentorOnboardingStore((state) => state.fullName);
  const onboardingWorkEmail = useMentorOnboardingStore((state) => state.workEmail);
  const onboardingAvatarUrl = useMentorOnboardingStore((state) => state.avatarUrl);
  const onboardingTitle = useMentorOnboardingStore((state) => state.currentTitle);
  const onboardingCompany = useMentorOnboardingStore((state) => state.company);
  const resetOnboarding = useMentorOnboardingStore((state) => state.reset);

  const fullName = user?.profile?.full_name || onboardingFullName || "Volunteer Mentor";
  const workEmail = user?.email || onboardingWorkEmail;
  const avatarUrl = user?.profile?.avatar_url || onboardingAvatarUrl;
  const currentTitle = user?.profile?.job_title || onboardingTitle;
  const company = user?.profile?.company || onboardingCompany;

  const subtitle = [currentTitle, company].filter(Boolean).join(" @ ") || "Volunteer Mentor";

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

  const menuItems: AccountMenuItem[] = [
    { label: "Dashboard", icon: LayoutGrid, to: "/mentor-dashboard" },
    { label: "Incoming Requests", icon: Inbox, to: "/mentor-dashboard" },
    { label: "Scheduled Sessions", icon: CalendarDays, to: "/mentor-dashboard" },
    { label: "Past Mentees & Feedback", icon: Users, to: "/mentor-dashboard" },
    {
      label: "Availability & Settings",
      icon: CalendarClock,
      to: "/onboarding/mentor/availability-capacity",
    },
  ];

  const secondaryItems: AccountMenuItem[] = [
    { label: "Mentor Docs", icon: BookOpen, to: "/how-it-works" },
    { label: "Honor Code & Guidelines", icon: ShieldCheck, to: "/honor-code" },
  ];

  return (
    <AccountMenu
      className={className}
      avatar={avatar}
      name={fullName}
      subtitle={subtitle}
      email={workEmail}
      profileTo="/mentor-dashboard"
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

export default MentorUserMenuLink;

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
import AccountMenu, { type AccountMenuItem } from "./AccountMenu";

interface MentorUserMenuLinkProps {
  className?: string;
}

/** The signed-in mentor avatar block + dropdown menu shown once a mentor has published their profile. */
const MentorUserMenuLink = ({ className = "" }: MentorUserMenuLinkProps) => {
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const fullName = user?.profile?.full_name || useMentorOnboardingStore((state) => state.fullName) || "Volunteer Mentor";
  const workEmail = user?.email || useMentorOnboardingStore((state) => state.workEmail);
  const avatarUrl = user?.profile?.avatar_url || useMentorOnboardingStore((state) => state.avatarUrl);
  const currentTitle = user?.profile?.job_title || useMentorOnboardingStore((state) => state.currentTitle);
  const company = user?.profile?.company || useMentorOnboardingStore((state) => state.company);
  const resetOnboarding = useMentorOnboardingStore((state) => state.reset);

  const subtitle = [currentTitle, company].filter(Boolean).join(" @ ") || "Volunteer Mentor";

  const avatar = avatarUrl ? (
    <img src={avatarUrl} alt={fullName} className="h-9 w-9 shrink-0 rounded-full object-cover" />
  ) : (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
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
      onSignOut={() => {
        logout();
        resetOnboarding();
        navigate("/auth");
      }}
    />
  );
};

export default MentorUserMenuLink;

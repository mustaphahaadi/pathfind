import { Video, FileCode2, MessagesSquare, CalendarClock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { MeetingPreference } from "../../types/onboarding";

export const meetingPreferences: (MeetingPreference & { icon: LucideIcon })[] = [
  { id: "video-calls", label: "1:1 Video Calls (45 mins)", icon: Video },
  { id: "async-review", label: "Async Portfolio & Code Review", icon: FileCode2 },
  { id: "mock-interview", label: "Mock Technical Interview", icon: MessagesSquare },
  { id: "strategic-checkins", label: "Monthly Strategic Check-ins", icon: CalendarClock },
];

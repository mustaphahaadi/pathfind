import { Compass, HeartHandshake } from "lucide-react";
import type { RoleOption } from "../types/auth";

export const roleOptions: RoleOption[] = [
  {
    id: "mentee",
    title: "I'm a Mentee",
    description: "Looking for free career guidance & session bookings",
    tagLabel: "Mentee",
    icon: Compass,
    bullets: [
      "100% free 1:1 sessions with verified senior tech professionals",
      "Personalized roadmap, goals, and session action plans",
      "Direct access to mock interviews, resume teardowns, and architecture advice",
    ],
    ctaLabel: "Sign Up as Mentee",
  },
  {
    id: "mentor",
    title: "I'm a Mentor",
    description: "Volunteering your time to guide transitioning tech talent",
    tagLabel: "Volunteer",
    icon: HeartHandshake,
    bullets: [
      "Give back on your own schedule (cap at 1–2 sessions/month)",
      "Screen and accept mentee requests that match your focus areas",
      "Join our private network of vetted staff engineers & design leaders",
    ],
    ctaLabel: "Apply as Mentor",
  },
];

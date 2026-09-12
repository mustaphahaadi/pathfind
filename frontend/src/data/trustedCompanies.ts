import { Grid2x2, Camera, Triangle, CircleDot, Shuffle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface TrustedCompany {
  name: string;
  icon?: LucideIcon;
}

export const trustedCompanies: TrustedCompany[] = [
  { name: "Stripe" },
  { name: "Figma", icon: Grid2x2 },
  { name: "Datadog", icon: Camera },
  { name: "Vercel", icon: Triangle },
  { name: "Google", icon: CircleDot },
  { name: "DoorDash", icon: Shuffle },
];

import type { LucideIcon } from "lucide-react";

export type AuthRole = "mentee" | "mentor";

export interface RoleOption {
  id: AuthRole;
  title: string;
  description: string;
  tagLabel: string;
  icon: LucideIcon;
  bullets: string[];
  ctaLabel: string;
}

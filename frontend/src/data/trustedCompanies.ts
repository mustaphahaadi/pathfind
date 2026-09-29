import {
  Rocket,
  GraduationCap,
  Radio,
  ShoppingBag,
  Smartphone,
  Leaf,
  Zap,
  Globe,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface TrustedCompany {
  name: string;
  icon?: LucideIcon;
}

export const trustedCompanies: TrustedCompany[] = [
  { name: "AmaliTech", icon: Rocket },
  { name: "GenerationGhana", icon: GraduationCap },
  { name: "MTN Ghana", icon: Radio },
  { name: "Hubtel", icon: ShoppingBag },
  { name: "Vodafone Ghana", icon: Smartphone },
  { name: "Farmerline", icon: Leaf },
  { name: "Kofa", icon: Zap },
  { name: "Ghana Tech Lab", icon: Globe },
];

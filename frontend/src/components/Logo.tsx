import { Logo as UiLogo } from "./ui/Logo";

export function Logo({ light = false, size = "md" }: { light?: boolean; size?: "sm" | "md" | "lg" }) {
  return <UiLogo light={light} size={size} />;
}
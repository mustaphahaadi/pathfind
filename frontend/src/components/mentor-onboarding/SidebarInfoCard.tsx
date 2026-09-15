import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface SidebarInfoCardProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  tone?: "default" | "accent";
}

const SidebarInfoCard = ({ icon: Icon, title, children, tone = "default" }: SidebarInfoCardProps) => {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        tone === "accent"
          ? "border-accent-blue/20 bg-accent-blue/5"
          : "border-surface-line bg-white"
      }`}
    >
      <p className="flex items-center gap-2 text-sm font-bold text-ink">
        <Icon size={16} className="text-accent-blue" />
        {title}
      </p>
      <div className="mt-3 text-sm text-ink/70">{children}</div>
    </div>
  );
};

export default SidebarInfoCard;

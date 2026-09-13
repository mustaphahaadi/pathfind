import { Lock } from "lucide-react";

const PlatformPromiseBanner = () => {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-surface-line bg-white px-5 py-4 text-sm text-ink/70">
      <Lock size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" />
      <p>
        Pathfind is a voluntary, zero-paywall platform. Mentees never pay;
        mentors never sell services or courses.
      </p>
    </div>
  );
};

export default PlatformPromiseBanner;

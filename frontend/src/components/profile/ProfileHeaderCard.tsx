import { Link } from "react-router-dom";
import { Pencil, SlidersHorizontal, ShieldCheck, HandCoins, Clock } from "lucide-react";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { useSessionsStore } from "../../store/useSessionsStore";
import { useAuthStore } from "../../store/useAuthStore";
import { technicalTracks } from "../../data/onboarding/technicalTracks";
import { getInitials } from "../../lib/getInitials";
import { getProfileReadiness } from "../../lib/getProfileReadiness";

const ProfileHeaderCard = () => {
  const user = useAuthStore((s) => s.user);
  const onboarding = useOnboardingStore();
  const sessions = useSessionsStore((state) => state.sessions);

  const name = user?.profile?.full_name || onboarding.fullName || "Mentee Profile";
  const avatarUrl = user?.profile?.avatar_url || onboarding.avatarUrl;
  const location = user?.profile?.location || onboarding.location;
  const seekingLabels = technicalTracks
    .filter((track) => onboarding.technicalTracks.includes(track.id))
    .slice(0, 2)
    .map((track) => track.label);

  const readiness = getProfileReadiness(onboarding);
  const remainingSlots = Math.max(0, 4 - sessions.length);

  return (
    <div className="overflow-hidden rounded-3xl border border-surface-line bg-white shadow-sm transition-all hover:shadow-md">
      {/* Rich dark solid executive banner */}
      <div className="relative h-24 bg-slate-950 p-6 sm:h-28">
        <div className="flex items-center justify-between text-white/80">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Verified Mentee
          </span>
          <span className="text-xs font-semibold tracking-wide text-white/60 uppercase">
            Pathfind Talent Network
          </span>
        </div>
      </div>

      <div className="px-6 pb-6 sm:px-8">
        <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="relative z-10 flex items-end gap-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="h-20 w-20 rounded-2xl border-4 border-white bg-white object-cover shadow-md ring-2 ring-slate-900/10"
              />
            ) : (
              <span className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-slate-900 text-2xl font-black text-white shadow-md">
                {getInitials(name)}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/onboarding/mentee/about-you"
              className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow"
            >
              <Pencil size={14} />
              Edit Profile Info
            </Link>
            <Link
              to="/onboarding/mentee/interests-goals"
              className="inline-flex items-center gap-1.5 rounded-xl border border-surface-line bg-surface/50 px-4 py-2.5 text-sm font-semibold text-ink transition-all hover:bg-surface hover:border-ink/20"
            >
              <SlidersHorizontal size={14} />
              Customize Match Goals
            </Link>
          </div>
        </div>

        <div className="mt-3">
          <h1 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">{name}</h1>
          <p className="mt-1 text-sm font-medium text-ink/60">
            {seekingLabels.length > 0 && (
              <>Seeking: {seekingLabels.join(" & ")}{location ? " · " : ""}</>
            )}
            {location || "Ghana / Remote"}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          <div className="flex items-center gap-3.5 rounded-2xl border border-surface-line bg-surface/40 p-4 transition-colors hover:bg-surface">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <ShieldCheck size={20} strokeWidth={2} />
            </span>
            <div>
              <p className="text-xs font-medium text-ink/50">Profile Readiness</p>
              <p className="text-sm font-extrabold text-ink">
                {readiness}% Prepared for Sessions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-surface-line bg-surface/40 p-4 transition-colors hover:bg-surface">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
              <HandCoins size={20} strokeWidth={2} />
            </span>
            <div>
              <p className="text-xs font-medium text-ink/50">Mentorship Pledge</p>
              <p className="text-sm font-extrabold text-ink">
                {onboarding.pledgeAgreed ? "Signed & Community Verified" : "Not Yet Signed"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-surface-line bg-surface/40 p-4 transition-colors hover:bg-surface">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <Clock size={20} strokeWidth={2} />
            </span>
            <div>
              <p className="text-xs font-medium text-ink/50">Monthly Allowance</p>
              <p className="text-sm font-extrabold text-ink">
                {remainingSlots} of 4 Free Slots Available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeaderCard;

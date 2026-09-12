import { Link } from "react-router-dom";
import { Pencil, SlidersHorizontal, ShieldCheck, HandCoins, Clock } from "lucide-react";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { useSessionsStore } from "../../store/useSessionsStore";
import { technicalTracks } from "../../data/onboarding/technicalTracks";
import { getInitials } from "../../lib/getInitials";
import { getProfileReadiness } from "../../lib/getProfileReadiness";

const ProfileHeaderCard = () => {
  const onboarding = useOnboardingStore();
  const sessions = useSessionsStore((state) => state.sessions);

  const name = onboarding.fullName || "Your Pathfind Profile";
  const seekingLabels = technicalTracks
    .filter((track) => onboarding.technicalTracks.includes(track.id))
    .slice(0, 2)
    .map((track) => track.label);

  const readiness = getProfileReadiness(onboarding);
  const remainingSlots = Math.max(0, 4 - sessions.length);

  return (
    <div className="overflow-hidden rounded-3xl border border-surface-line bg-white">
      <div className="h-20 bg-gradient-to-r from-surface to-accent-blue/10" />

      <div className="px-6 pb-6 sm:px-8">
        <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            {onboarding.avatarUrl ? (
              <img
                src={onboarding.avatarUrl}
                alt={name}
                className="h-20 w-20 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <span className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-ink text-xl font-bold text-white">
                {getInitials(name)}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/onboarding/mentee/about-you"
              className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Pencil size={14} />
              Edit Profile Info
            </Link>
            <Link
              to="/onboarding/mentee/interests-goals"
              className="inline-flex items-center gap-1.5 rounded-xl border border-surface-line bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-surface"
            >
              <SlidersHorizontal size={14} />
              Customize Match Goals
            </Link>
          </div>
        </div>

        <h1 className="mt-4 text-2xl font-extrabold text-ink">{name}</h1>
        <p className="mt-1 text-sm text-ink/60">
          {seekingLabels.length > 0 && (
            <>Seeking: {seekingLabels.join(" & ")}{onboarding.location ? " · " : ""}</>
          )}
          {onboarding.location}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-accent-green">
              <ShieldCheck size={18} strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-xs text-ink/50">Profile Readiness</p>
              <p className="text-sm font-bold text-ink">
                {readiness}% Prepared for Sessions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-accent-blue">
              <HandCoins size={18} strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-xs text-ink/50">Mentorship Pledge</p>
              <p className="text-sm font-bold text-ink">
                {onboarding.pledgeAgreed ? "Signed & Community Verified" : "Not Yet Signed"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-accent-gold">
              <Clock size={18} strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-xs text-ink/50">Monthly Allowance</p>
              <p className="text-sm font-bold text-ink">
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

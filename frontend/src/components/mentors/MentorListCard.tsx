import { Link } from "react-router-dom";
import { Star, BadgeCheck, Calendar, Sparkles, Bell } from "lucide-react";
import type { Mentor } from "../../types/mentor";

interface MentorListCardProps {
  mentor: Mentor;
  showMatchBadge?: boolean;
}

const MentorListCard = ({ mentor, showMatchBadge = false }: MentorListCardProps) => {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-surface-line bg-white p-4 sm:flex-row sm:p-5">
      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl sm:h-auto sm:w-40">
        <img src={mentor.imageUrl} alt={mentor.name} className="h-full w-full object-cover" />
        <span
          className={`absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-ink ${
            mentor.available ? "" : "text-ink/50"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              mentor.available ? "bg-accent-green" : "bg-ink/30"
            }`}
          />
          {mentor.available ? "Available" : "Unavailable"}
        </span>
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-lg font-bold text-ink">{mentor.name}</h3>
              {mentor.verified && (
                <BadgeCheck size={16} className="text-accent-blue" fill="currentColor" />
              )}
              {showMatchBadge && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-green/10 px-2 py-0.5 text-xs font-semibold text-accent-green">
                  <Sparkles size={11} />
                  Matched with your goals
                </span>
              )}
            </div>
            <p className="text-sm text-ink/60">
              {mentor.role} at <span className="font-medium text-ink">{mentor.company}</span>
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-ink">
            <Star size={12} className="text-accent-gold" fill="currentColor" strokeWidth={0} />
            {mentor.rating} ({mentor.reviewCount} reviews)
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-ink/70">&ldquo;{mentor.bio}&rdquo;</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {mentor.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-surface px-2 py-1 text-xs font-medium text-ink/70"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-surface-line pt-3">
          <span className="inline-flex items-center gap-1.5 text-sm text-ink/60">
            <Calendar size={14} />
            Next opening: <span className="font-medium text-ink">{mentor.nextOpening}</span>
            <span className="hidden sm:inline">&middot; {mentor.sessionFormat}</span>
          </span>

          {mentor.available ? (
            <Link
              to={`/mentors/${mentor.id}/schedule`}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Book Free Session
            </Link>
          ) : (
            <button
              type="button"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-surface-line bg-white px-4 py-2 text-sm font-semibold text-ink"
            >
              <Bell size={14} />
              Join Waitlist
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default MentorListCard;

import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Mentor } from "../../types/mentor";

interface MentorMiniCardProps {
  mentor: Mentor;
  ctaLabel?: string;
}

const MentorMiniCard = ({ mentor, ctaLabel = "Book session" }: MentorMiniCardProps) => {
  return (
    <div className="rounded-2xl border border-surface-line bg-white p-4">
      <Link to={`/mentors/${mentor.id}`} className="flex items-start gap-3">
        <img
          src={mentor.imageUrl}
          alt={mentor.name}
          className="h-11 w-11 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-bold text-ink hover:underline">{mentor.name}</p>
            {mentor.available && (
              <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-accent-green">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                Available
              </span>
            )}
          </div>
          <p className="truncate text-xs text-ink/60">
            {mentor.role} @ {mentor.company}
          </p>
        </div>
      </Link>

      <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-accent-blue/10 px-2.5 py-1 text-xs font-semibold text-accent-blue">
        {mentor.matchScore}% Goal Match
      </span>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {mentor.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-surface px-2 py-1 text-xs font-medium text-ink/70"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-surface-line pt-3">
        <span className="inline-flex items-center gap-1 text-xs text-ink/60">
          <Star size={13} className="text-accent-gold" fill="currentColor" strokeWidth={0} />
          {mentor.sessionsGiven} sessions given
        </span>
        <Link
          to={`/mentors/${mentor.id}/schedule`}
          className="inline-flex items-center justify-center rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
};

export default MentorMiniCard;

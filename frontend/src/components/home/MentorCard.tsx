import { ArrowRight } from "lucide-react";
import type { Mentor } from "../../types/mentor";

interface MentorCardProps {
  mentor: Mentor;
}

const MentorCard = ({ mentor }: MentorCardProps) => {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <div className="relative aspect-[4/5] w-full">
        <img
          src={mentor.imageUrl}
          alt={mentor.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {mentor.available && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
            Available
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-ink">
          100% Free
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
          {mentor.company}
        </p>
        <h3 className="mt-1 text-base font-bold text-ink">{mentor.name}</h3>
        <p className="text-sm text-muted">{mentor.role}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {mentor.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-cream px-2 py-1 text-xs font-medium text-ink/80"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          type="button"
          className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full border border-line bg-white py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-cream"
        >
          Book Session
          <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
};

export default MentorCard;

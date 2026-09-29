import type { KeyboardEvent, MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BadgeCheck, MapPin } from "lucide-react";
import { getInitials } from "../../lib/getInitials";
import { resolveMediaUrl } from "../../lib/resolveMediaUrl";
import type { MentorProfileRead } from "../../types/api";

interface MentorListCardProps {
  mentor: MentorProfileRead;
}

const MentorListCard = ({ mentor }: MentorListCardProps) => {
  const navigate = useNavigate();
  const profilePath = `/mentors/${mentor.user_id}`;

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate(profilePath);
    }
  };

  const stopPropagation = (event: MouseEvent<HTMLElement>) =>
    event.stopPropagation();

  const tags = mentor.expertise_tags.filter(Boolean).slice(0, 5);

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={() => navigate(profilePath)}
      onKeyDown={handleKeyDown}
      className="flex cursor-pointer flex-col gap-4 rounded-2xl border border-surface-line bg-white p-4 transition-colors hover:border-ink/30 sm:flex-row sm:p-5"
    >
      {/* Avatar */}
      <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-xl sm:h-auto sm:w-36">
        {mentor.avatar_url ? (
          <img
            src={resolveMediaUrl(mentor.avatar_url)!}
            alt={mentor.full_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full min-h-[9rem] w-full items-center justify-center bg-ink text-2xl font-bold text-white sm:min-h-0">
            {getInitials(mentor.full_name)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-lg font-bold text-ink hover:underline">
                {mentor.full_name}
              </h3>
              <BadgeCheck size={16} className="text-emerald-600 fill-emerald-50" />
            </div>
            <p className="text-sm text-ink/60">
              {mentor.job_title} at{" "}
              <span className="font-medium text-ink">{mentor.company}</span>
            </p>
            {mentor.location && (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-ink/50">
                <MapPin size={11} />
                {mentor.location}
              </p>
            )}
          </div>
          <span className="shrink-0 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-ink">
            {mentor.years_of_experience}y exp
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink/70">
          &ldquo;{mentor.bio}&rdquo;
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-surface px-2 py-1 text-xs font-medium text-ink/70"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-surface-line pt-3">
          <span className="text-xs text-ink/50">
            Availability: {mentor.availability}
          </span>
          <Link
            to={`/mentors/${mentor.user_id}/schedule`}
            onClick={stopPropagation}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Request Mentorship
          </Link>
        </div>
      </div>
    </article>
  );
};

export default MentorListCard;

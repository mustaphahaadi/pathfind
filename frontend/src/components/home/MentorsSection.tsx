import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { api } from "../../lib/api";
import { getInitials } from "../../lib/getInitials";
import type { MentorProfileRead } from "../../types/api";

const MentorsSection = () => {
  const [mentors, setMentors] = useState<MentorProfileRead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.mentors
      .list()
      .then(setMentors)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-5 py-14 sm:px-8 sm:py-16 bg-surface">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-lg">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-green/10 px-3 py-1 text-xs font-semibold text-accent-green">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
              VERIFIED MENTORS
            </span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
              Gain insights from our exceptional mentors
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink/60">
              Our incredible global mentors and industry practitioners volunteer their time 100% free to accelerate your tech career.
            </p>
          </div>
          <Link
            to="/mentors"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:underline"
          >
            Browse all mentors ({mentors.length})
            <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="mt-12 flex items-center justify-center py-10 text-ink/50">
            <Loader2 className="animate-spin text-ink" size={24} />
            <span className="ml-2 text-sm font-medium">Loading available mentors…</span>
          </div>
        ) : mentors.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-surface-line bg-white p-8 text-center">
            <p className="text-base font-bold text-ink">No mentors listed yet</p>
            <p className="mt-1 text-sm text-ink/60">Be the first volunteer mentor to join our community!</p>
            <Link
              to="/join/mentor"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white"
            >
              Apply as a Mentor
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {mentors.slice(0, 4).map((mentor) => {
              const tags = mentor.expertise_tags.split(",").map((t) => t.trim()).filter(Boolean);
              return (
                <article
                  key={mentor.id}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl border border-surface-line bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-start gap-3">
                      {mentor.avatar_url ? (
                        <img
                          src={mentor.avatar_url}
                          alt={mentor.full_name}
                          className="h-14 w-14 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink text-base font-bold text-white">
                          {getInitials(mentor.full_name)}
                        </span>
                      )}
                      <div>
                        <h3 className="text-base font-bold text-ink">{mentor.full_name}</h3>
                        <p className="text-xs text-ink/60">
                          {mentor.job_title} @ <span className="font-semibold text-ink">{mentor.company}</span>
                        </p>
                        <p className="mt-1 text-xs text-ink/50">{mentor.years_of_experience} yrs exp</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-ink/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 border-t border-surface-line pt-4">
                    <Link
                      to={`/mentors/${mentor.id}/schedule`}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-ink py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      Request 1:1 Session
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            to="/mentors"
            className="inline-flex items-center gap-2 rounded-xl border border-surface-line bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface"
          >
            Explore all volunteer mentors
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MentorsSection;

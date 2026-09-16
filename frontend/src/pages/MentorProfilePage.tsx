import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  BadgeCheck,
  MapPin,
  Clock,
  MessageSquare,
  Video,
  Mail,
  ShieldCheck,
  ListChecks,
  ArrowLeft,
  Loader2,
  Calendar,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { api } from "../lib/api";
import { getInitials } from "../lib/getInitials";
import type { MentorProfileRead } from "../types/api";

const MentorProfilePage = () => {
  const { mentorId } = useParams<{ mentorId: string }>();

  const [mentor, setMentor] = useState<MentorProfileRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mentorId) return;

    setLoading(true);
    setError(null);

    api.mentors
      .get(Number(mentorId))
      .then((data) => {
        setMentor(data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load mentor profile.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [mentorId]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-surface">
        <Header variant="solid" />
        <main className="flex flex-1 items-center justify-center py-20 text-ink/60">
          <Loader2 className="animate-spin text-ink" size={28} />
          <span className="ml-2 font-medium">Loading mentor profile…</span>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !mentor) {
    return (
      <div className="flex min-h-screen flex-col bg-surface">
        <Header variant="solid" />
        <main className="flex flex-1 flex-col items-center justify-center px-5 py-20 text-center">
          <h1 className="text-2xl font-extrabold text-ink">Mentor not found</h1>
          <p className="mt-2 text-sm text-ink/60">
            {error || "This mentor profile doesn't exist or may have been removed."}
          </p>
          <Link
            to="/mentors"
            className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white"
          >
            Back to Mentors Directory
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const tags = mentor.expertise_tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header variant="solid" />

      <main className="flex-1 px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="flex items-center gap-1.5 text-sm text-ink/50">
            <Link to="/mentors" className="hover:text-ink">
              Mentors
            </Link>
            <span>/</span>
            <span className="font-medium text-ink">{mentor.full_name}</span>
            <Link to="/mentors" className="ml-auto flex items-center gap-1 hover:text-ink">
              <ArrowLeft size={13} />
              Back to directory
            </Link>
          </p>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
            {mentor.avatar_url ? (
              <img
                src={mentor.avatar_url}
                alt={mentor.full_name}
                className="h-24 w-24 shrink-0 rounded-2xl object-cover"
              />
            ) : (
              <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-ink text-2xl font-bold text-white">
                {getInitials(mentor.full_name)}
              </span>
            )}

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">
                  {mentor.full_name}
                </h1>
                {mentor.linkedin_url && (
                  <a
                    href={mentor.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-accent-blue/10 px-2.5 py-1 text-xs font-semibold text-accent-blue hover:underline"
                  >
                    <BadgeCheck size={13} />
                    Verified Expert
                  </a>
                )}
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-green/10 px-2.5 py-1 text-xs font-semibold text-accent-green">
                  Volunteer Mentor
                </span>
              </div>

              <p className="mt-1 text-base text-ink/60">
                {mentor.job_title} at{" "}
                <span className="font-medium text-ink">{mentor.company}</span>
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink/50">
                {mentor.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={13} />
                    {mentor.location}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Clock size={13} />
                  {mentor.years_of_experience} year{mentor.years_of_experience === 1 ? "" : "s"} exp
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar size={13} />
                  {mentor.availability}
                </span>
              </div>
            </div>

            <div className="shrink-0 sm:self-center">
              <Link
                to={`/mentors/${mentor.id}/schedule`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-sm"
              >
                <Video size={16} />
                Request 1:1 Mentorship
              </Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl border border-surface-line bg-white p-5 sm:p-6">
                <p className="flex items-center gap-2 text-lg font-bold text-ink">
                  <MessageSquare size={17} />
                  About &amp; Background
                </p>
                <div className="mt-3 text-sm leading-relaxed text-ink/70 whitespace-pre-line">
                  {mentor.bio || "No background details provided yet."}
                </div>
              </div>

              <div className="rounded-2xl border border-surface-line bg-white p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2 text-lg font-bold text-ink">
                    <ListChecks size={17} />
                    Expertise &amp; Focus Topics
                  </p>
                  <span className="text-xs font-medium text-ink/50">
                    {tags.length} topics
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.length === 0 ? (
                    <p className="text-sm text-ink/50">No focus topics specified.</p>
                  ) : (
                    tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-ink"
                      >
                        {tag}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="rounded-2xl border border-surface-line bg-white p-5">
                <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
                  <ShieldCheck size={16} className="text-accent-green" />
                  Community Honor Code Signed
                </p>
                <p className="mt-2 text-xs leading-relaxed text-ink/60">
                  This mentor offers completely free, voluntary 1:1 sessions for tech career guidance. Zero sales pitches or fees, ever.
                </p>
              </div>

              <div className="rounded-2xl bg-surface p-5 text-sm text-ink/70">
                <p className="font-bold text-ink">Availability Windows</p>
                <p className="mt-1 text-xs text-ink/60">{mentor.availability}</p>
                <div className="mt-4 border-t border-surface-line pt-3">
                  <Link
                    to={`/mentors/${mentor.id}/schedule`}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-ink py-2.5 text-xs font-semibold text-white"
                  >
                    <Mail size={14} />
                    Submit Mentorship Request
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MentorProfilePage;

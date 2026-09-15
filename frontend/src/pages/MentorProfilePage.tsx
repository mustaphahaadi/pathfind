import { Link, useParams } from "react-router-dom";
import {
  Star,
  BadgeCheck,
  MapPin,
  Languages,
  Clock,
  MessageSquare,
  Video,
  Mail,
  ShieldCheck,
  ListChecks,
  ArrowLeft,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { mentors } from "../data/mentors";
import { useMentorOnboardingStore } from "../store/useMentorOnboardingStore";
import { mentorDisciplines, mentorshipTopics } from "../data/mentor-onboarding/options";
import { getInitials } from "../lib/getInitials";
import { getRecommendedMentors } from "../lib/getRecommendedMentors";
import type { Mentor, SkillGroup } from "../types/mentor";

const buildOwnProfile = (): Mentor | null => {
  const state = useMentorOnboardingStore.getState();
  if (!state.hasCompletedOnboarding) return null;

  const disciplineLabel = mentorDisciplines.find((d) => d.id === state.primaryDiscipline)?.label;
  const topicLabels = mentorshipTopics
    .filter((topic) => state.topics.includes(topic.id))
    .map((topic) => topic.label);

  const skillGroups: SkillGroup[] = [
    ...(disciplineLabel ? [{ groupLabel: "Primary Domain", skills: [disciplineLabel] }] : []),
    ...(topicLabels.length > 0
      ? [{ groupLabel: "Mentorship Topics", skills: topicLabels }]
      : []),
  ];

  const monthlyCapacity = state.weeklyWindows.reduce((sum, w) => sum + w.maxCalls, 0);

  return {
    id: "you",
    name: state.fullName || "Your Name",
    role: state.currentTitle || "Your Title",
    company: state.company || "Your Company",
    imageUrl: state.avatarUrl ?? "",
    category: "Software Engineering",
    trackId: state.primaryDiscipline ?? "other",
    tags: topicLabels,
    available: monthlyCapacity > 0,
    verified: Boolean(state.linkedinUrl),
    rating: 0,
    reviewCount: 0,
    sessionsGiven: 0,
    bio: state.motivation || "Your motivation statement from onboarding will appear here.",
    nextOpening: state.weeklyWindows[0]
      ? `${state.weeklyWindows[0].day}s, ${state.weeklyWindows[0].startTime}`
      : "No availability set yet",
    sessionFormat: "1:1 Video (45m)",
    durationMinutes: 45,
    matchScore: 0,
    location: state.location || "Not set",
    language: "English",
    attendanceRate: 100,
    responseTime: "New mentor — response time not yet established",
    philosophy: state.motivation || "Add your mentorship philosophy from Step 2 of onboarding.",
    aboutParagraphs: state.motivation
      ? [state.motivation]
      : ["Complete your onboarding motivation statement to populate this section."],
    skillGroups,
    experience: [],
    reviews: [],
  };
};

const MentorProfilePage = () => {
  const { mentorId } = useParams<{ mentorId: string }>();

  const isOwnProfile = mentorId === "you";
  const mentor = isOwnProfile ? buildOwnProfile() : mentors.find((m) => m.id === mentorId) ?? null;

  if (!mentor) {
    return (
      <div className="flex min-h-screen flex-col bg-surface">
        <Header variant="solid" />
        <main className="flex flex-1 flex-col items-center justify-center px-5 py-20 text-center">
          <h1 className="text-2xl font-extrabold text-ink">
            {isOwnProfile ? "You haven't published a mentor profile yet" : "Mentor not found"}
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            {isOwnProfile
              ? "Finish the volunteer mentor application to see your live profile here."
              : "This mentor profile doesn't exist or may have been removed."}
          </p>
          <Link
            to={isOwnProfile ? "/onboarding/mentor/identity-verification" : "/mentors"}
            className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white"
          >
            {isOwnProfile ? "Start Mentor Application" : "Back to Mentors"}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const similarMentors = isOwnProfile
    ? []
    : getRecommendedMentors([mentor.trackId], 4).filter((item) => item.id !== mentor.id).slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header variant="solid" />

      <main className="flex-1 px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl">
          {!isOwnProfile && (
            <p className="flex flex-wrap items-center gap-1.5 text-sm text-ink/50">
              <Link to="/mentors" className="hover:text-ink">
                Mentors
              </Link>
              <span>/</span>
              <span>{mentor.category}</span>
              <span>/</span>
              <span className="font-medium text-ink">{mentor.name}</span>
              <Link to="/mentors" className="ml-auto flex items-center gap-1 hover:text-ink">
                <ArrowLeft size={13} />
                Back to search
              </Link>
            </p>
          )}

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
            {mentor.imageUrl ? (
              <img
                src={mentor.imageUrl}
                alt={mentor.name}
                className="h-24 w-24 shrink-0 rounded-2xl object-cover"
              />
            ) : (
              <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-ink text-2xl font-bold text-white">
                {getInitials(mentor.name)}
              </span>
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">{mentor.name}</h1>
                {mentor.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent-blue/10 px-2.5 py-1 text-xs font-semibold text-accent-blue">
                    <BadgeCheck size={13} />
                    Verified Expert
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-green/10 px-2.5 py-1 text-xs font-semibold text-accent-green">
                  Voluntary Mentor
                </span>
              </div>
              <p className="mt-1 text-base text-ink/60">
                {mentor.role} at <span className="font-medium text-ink">{mentor.company}</span>
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink/50">
                <span className="inline-flex items-center gap-1">
                  <MapPin size={13} />
                  {mentor.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Languages size={13} />
                  {mentor.language}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={13} />
                  {mentor.responseTime}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl border border-surface-line bg-white p-4 sm:grid-cols-4">
            <div className="text-center sm:text-left">
              <p className="flex items-center justify-center gap-1 text-lg font-bold text-ink sm:justify-start">
                <Star size={15} className="text-accent-gold" fill="currentColor" strokeWidth={0} />
                {mentor.reviewCount > 0 ? mentor.rating : "—"}
              </p>
              <p className="text-xs text-ink/50">
                {mentor.reviewCount > 0 ? `${mentor.reviewCount} reviews` : "No reviews yet"}
              </p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-lg font-bold text-ink">{mentor.sessionsGiven}</p>
              <p className="text-xs text-ink/50">Completed sessions</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-lg font-bold text-ink">{mentor.attendanceRate}%</p>
              <p className="text-xs text-ink/50">Attendance rate</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-lg font-bold text-ink">Direct 1:1</p>
              <p className="text-xs text-ink/50">Advisory format</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl border border-surface-line bg-white p-5 sm:p-6">
                <p className="flex items-center gap-2 text-lg font-bold text-ink">
                  <MessageSquare size={17} />
                  About Me
                </p>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink/70">
                  {mentor.aboutParagraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-4 rounded-xl bg-surface p-4">
                  <p className="text-sm font-bold text-ink">My Mentorship Philosophy</p>
                  <p className="mt-1.5 text-sm italic text-ink/70">&ldquo;{mentor.philosophy}&rdquo;</p>
                </div>
              </div>

              <div className="rounded-2xl border border-surface-line bg-white p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2 text-lg font-bold text-ink">
                    <ListChecks size={17} />
                    Skills &amp; Competencies
                  </p>
                  <span className="text-xs font-medium text-ink/50">
                    {mentor.skillGroups.reduce((sum, group) => sum + group.skills.length, 0)} core areas
                  </span>
                </div>
                <div className="mt-3 flex flex-col gap-4">
                  {mentor.skillGroups.length === 0 ? (
                    <p className="text-sm text-ink/50">No skills listed yet.</p>
                  ) : (
                    mentor.skillGroups.map((group) => (
                      <div key={group.groupLabel}>
                        <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                          {group.groupLabel}
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-2">
                          {group.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-ink"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-surface-line bg-white p-5 sm:p-6">
                <p className="text-lg font-bold text-ink">Experience &amp; Track Record</p>
                {mentor.experience.length === 0 ? (
                  <p className="mt-2 text-sm text-ink/50">
                    {isOwnProfile
                      ? "Your work history isn't shown here yet — this section highlights notable roles over time."
                      : "No experience history listed."}
                  </p>
                ) : (
                  <div className="mt-4 space-y-5">
                    {mentor.experience.map((role, index) => (
                      <div key={role.title} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              index === 0 ? "bg-ink" : "border-2 border-surface-line bg-white"
                            }`}
                          />
                          {index < mentor.experience.length - 1 && (
                            <span className="mt-1 w-px flex-1 bg-surface-line" />
                          )}
                        </div>
                        <div className="pb-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <p className="text-sm font-bold text-ink">{role.title}</p>
                            <p className="text-xs text-ink/50">{role.period}</p>
                          </div>
                          <p className="text-sm text-accent-blue">
                            {role.org} &middot; {role.location}
                          </p>
                          <p className="mt-1 text-sm text-ink/60">{role.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-surface-line bg-white p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-ink">Mentee Reviews &amp; Testimonials</p>
                  {mentor.reviewCount > 0 && (
                    <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
                      All ({mentor.reviewCount})
                    </span>
                  )}
                </div>
                {mentor.reviews.length === 0 ? (
                  <p className="mt-2 text-sm text-ink/50">
                    {isOwnProfile
                      ? "No reviews yet — they'll appear here after your first completed sessions."
                      : "No reviews yet."}
                  </p>
                ) : (
                  <div className="mt-3 flex flex-col gap-4">
                    {mentor.reviews.map((review) => (
                      <div key={review.reviewerName} className="rounded-xl border border-surface-line p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-ink">{review.reviewerName}</p>
                            <p className="text-xs text-ink/50">{review.reviewerRole}</p>
                          </div>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink">
                            <Star size={12} className="text-accent-gold" fill="currentColor" strokeWidth={0} />
                            5.0
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-ink/70">&ldquo;{review.quote}&rdquo;</p>
                        <p className="mt-2 text-xs text-ink/40">
                          Session Topic: {review.sessionTopic} &middot; {review.date}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {similarMentors.length > 0 && (
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-ink">Similar Mentors You Might Like</p>
                    <Link to="/mentors" className="text-sm font-semibold text-accent-blue hover:underline">
                      Browse all mentors
                    </Link>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {similarMentors.map((similar) => (
                      <Link
                        key={similar.id}
                        to={`/mentors/${similar.id}`}
                        className="rounded-xl border border-surface-line bg-white p-3 transition-colors hover:border-ink/30"
                      >
                        <img
                          src={similar.imageUrl}
                          alt={similar.name}
                          className="h-28 w-full rounded-lg object-cover"
                        />
                        <p className="mt-2 text-sm font-bold text-ink">{similar.name}</p>
                        <p className="text-xs text-ink/60">
                          {similar.role} at {similar.company}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="flex h-fit flex-col gap-5">
              <div className="rounded-2xl border border-surface-line bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                  Mentorship Session
                </p>
                <p className="mt-1 text-lg font-bold text-ink">1:1 Advisory Call</p>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-ink/60">
                  <Video size={14} />
                  {mentor.durationMinutes} minutes 1:1 video mentorship
                </p>
                <p className="mt-1 text-sm text-ink/60">Google Meet (calendar invite auto-sent)</p>
                <p className="mt-1 text-sm text-ink/60">Zero credit card or payment info needed</p>

                <div className="mt-4 rounded-xl bg-surface p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                    Next Available Slot
                  </p>
                  <p className="mt-1 text-sm font-bold text-ink">{mentor.nextOpening}</p>
                </div>

                {isOwnProfile ? (
                  <p className="mt-4 rounded-xl bg-surface p-3 text-center text-sm text-ink/60">
                    This is your own public profile — mentees will see a booking button
                    here instead.
                  </p>
                ) : mentor.available ? (
                  <Link
                    to={`/mentors/${mentor.id}/schedule`}
                    className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Book a Session
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-surface-line bg-white px-4 py-3 text-sm font-semibold text-ink"
                  >
                    Join Waitlist
                  </button>
                )}

                <a
                  href={`mailto:hello@pathfind.org?subject=Question for ${mentor.name}`}
                  className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-surface-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface"
                >
                  <Mail size={15} />
                  Send a Message / Ask Question
                </a>
              </div>

              <div className="rounded-2xl border border-surface-line bg-white p-4 text-sm text-ink/70">
                <p className="flex items-start gap-2">
                  <ShieldCheck size={15} className="mt-0.5 shrink-0 text-accent-blue" />
                  <span>
                    <span className="font-semibold text-ink">Honor Code: </span>
                    {mentor.name.split(" ")[0]} donates personal time outside {mentor.company}.
                    Please give 24h cancellation notice so slots can be given to other
                    waitlisted community members.
                  </span>
                </p>
              </div>

              <div className="rounded-2xl border border-surface-line bg-white p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-ink">
                  <ListChecks size={15} />
                  What to prepare before your call
                </p>
                <ol className="mt-2 space-y-2 text-sm text-ink/70">
                  <li className="flex gap-2">
                    <span className="font-semibold text-ink">1.</span>
                    1-2 focused questions or an explicit career dilemma you want solved.
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-ink">2.</span>A public link to your
                    current resume, LinkedIn, or portfolio.
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-ink">3.</span>
                    Headphones and a quiet space for clear, high-signal dialogue.
                  </li>
                </ol>
              </div>

              <div className="rounded-2xl border border-surface-line bg-surface p-4 text-center text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                  Pathfind Guarantee
                </p>
                <p className="mt-1 font-semibold text-ink">
                  No sales pitches. No affiliate links. Zero subscription locks. Ever.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MentorProfilePage;

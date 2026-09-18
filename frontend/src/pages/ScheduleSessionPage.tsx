import { useEffect, useState, type FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { getInitials } from "../lib/getInitials";
import { api } from "../lib/api";
import { useAuthStore } from "../store/useAuthStore";
import type { MentorProfileRead, RequestType } from "../types/api";

const REQUEST_TYPES: { value: RequestType; label: string; description: string }[] = [
  {
    value: "cv_review",
    label: "CV / Resume Review",
    description: "Get specific feedback on your resume for tech roles.",
  },
  {
    value: "portfolio_feedback",
    label: "Portfolio Feedback",
    description: "Improve the way you present your projects and design work.",
  },
  {
    value: "career_path_conversation",
    label: "Career Path Conversation",
    description: "Discuss your long-term direction and how to get there.",
  },
  {
    value: "interview_preparation",
    label: "Interview Preparation",
    description: "Practice technical or behavioural interviews with an expert.",
  },
  {
    value: "role_industry_insight",
    label: "Role & Industry Insight",
    description: "Understand day-to-day realities of a specific role or company.",
  },
];

const ScheduleSessionPage = () => {
  const { mentorId } = useParams<{ mentorId: string }>();
  const user = useAuthStore((s) => s.user);

  const [mentor, setMentor] = useState<MentorProfileRead | null>(null);
  const [loadingMentor, setLoadingMentor] = useState(true);
  const [mentorError, setMentorError] = useState<string | null>(null);

  const [requestType, setRequestType] = useState<RequestType>("career_path_conversation");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  useEffect(() => {
    if (!mentorId) return;
    const load = async () => {
      try {
        const [data, typesData] = await Promise.all([
          api.mentors.get(Number(mentorId)),
          api.requests.listTypes().catch(() => []),
        ]);
        setMentor(data);
        if (typesData.length > 0) {
          setAvailableTypes(typesData);
        }
      } catch (err) {
        setMentorError(err instanceof Error ? err.message : "Could not load mentor.");
      } finally {
        setLoadingMentor(false);
      }
    };
    load();
  }, [mentorId]);

  const canSubmit =
    subject.trim().length > 0 &&
    message.trim().length > 20 &&
    !!user;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit || !mentor) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      await api.requests.create({
        mentor_id: mentor.user_id,
        request_type: requestType,
        subject: subject.trim(),
        message: message.trim(),
        resume_url: resumeUrl.trim() || null,
        portfolio_url: portfolioUrl.trim() || null,
        github_url: githubUrl.trim() || null,
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to send request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingMentor) {
    return (
      <div className="flex min-h-screen flex-col bg-surface">
        <Header variant="solid" />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 size={32} className="animate-spin text-ink/30" />
        </main>
        <Footer />
      </div>
    );
  }

  if (mentorError || !mentor) {
    return (
      <div className="flex min-h-screen flex-col bg-surface">
        <Header variant="solid" />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-semibold text-ink">Mentor not found</p>
            <Link to="/mentors" className="mt-3 text-sm text-accent-blue hover:underline">
              Back to mentors
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col bg-surface">
        <Header variant="solid" />
        <main className="flex flex-1 items-center justify-center px-5">
          <div className="mx-auto max-w-md rounded-3xl border border-surface-line bg-white p-8 text-center">
            <CheckCircle2 size={44} className="mx-auto text-accent-green" />
            <h1 className="mt-4 text-2xl font-extrabold text-ink">Request sent!</h1>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">
              Your mentorship request has been sent to{" "}
              <strong>{mentor.full_name}</strong>. They will review your message and
              respond within a few days.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                to="/profile"
                className="inline-flex items-center justify-center rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                View my requests
              </Link>
              <Link
                to="/mentors"
                className="text-sm font-medium text-ink/60 hover:text-ink"
              >
                Explore more mentors
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header variant="solid" />

      <main className="flex-1 px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Back link */}
          <Link
            to={`/mentors/${mentor.user_id}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-ink"
          >
            <ArrowLeft size={15} />
            Back to profile
          </Link>

          <h1 className="mt-5 text-2xl font-extrabold text-ink sm:text-3xl">
            Request Mentorship
          </h1>

          {/* Mentor summary */}
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-surface-line bg-white p-4">
            {mentor.avatar_url ? (
              <img
                src={mentor.avatar_url}
                alt={mentor.full_name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
                {getInitials(mentor.full_name)}
              </div>
            )}
            <div>
              <p className="font-bold text-ink">{mentor.full_name}</p>
              <p className="text-sm text-ink/60">
                {mentor.job_title} at {mentor.company}
              </p>
            </div>
          </div>

          {/* Auth guard */}
          {!user && (
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
              You need to{" "}
              <Link to="/auth" className="underline font-medium">sign in</Link>
              {" "}before sending a request.
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">

            {/* Request type */}
            <div className="rounded-3xl border border-surface-line bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-ink">
                  What type of session do you need?{" "}
                  <span className="text-red-500">*</span>
                </h2>
                {availableTypes.length > 0 && (
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                    Synced with API ({availableTypes.length} types)
                  </span>
                )}
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {REQUEST_TYPES.map((type) => {
                  const isSelected = requestType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setRequestType(type.value)}
                      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                        isSelected
                          ? "border-ink bg-surface/50"
                          : "border-surface-line bg-white hover:border-ink/30"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                          isSelected ? "border-ink bg-ink" : "border-surface-line"
                        }`}
                      >
                        {isSelected && (
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-ink">
                          {type.label}
                        </span>
                        <span className="mt-0.5 block text-sm text-ink/60">
                          {type.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subject + Message */}
            <div className="rounded-3xl border border-surface-line bg-white p-6">
              <h2 className="text-base font-bold text-ink">Your request</h2>

              <div className="mt-4">
                <label htmlFor="subject" className="text-sm font-medium text-ink">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Feedback on my SWE resume before applying to Google"
                  className="mt-1.5 w-full rounded-xl border border-surface-line px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="message" className="text-sm font-medium text-ink">
                  Detailed message <span className="text-red-500">*</span>
                </label>
                <p className="mb-1.5 text-xs text-ink/50">
                  Describe your background, specific questions, and what you hope to get out of the session. Mentors are more likely to accept well-prepared requests.
                </p>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="I am a self-taught developer with 2 years of experience in React... I would love feedback on..."
                  className="w-full rounded-xl border border-surface-line px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
                />
                {message.length > 0 && message.trim().length <= 20 && (
                  <p className="mt-1.5 text-xs font-medium text-amber-600">
                    Please provide at least 20 characters so your mentor has enough context ({message.trim().length}/20).
                  </p>
                )}
              </div>
            </div>

            {/* Optional links */}
            <div className="rounded-3xl border border-surface-line bg-white p-6">
              <h2 className="text-base font-bold text-ink">Supporting links (optional)</h2>
              <p className="mt-1 text-sm text-ink/60">
                Helps your mentor review your work before the session.
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="resumeUrl" className="text-sm font-medium text-ink">
                    Resume / CV URL
                  </label>
                  <input
                    id="resumeUrl"
                    type="url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="mt-1.5 w-full rounded-xl border border-surface-line px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
                  />
                </div>
                <div>
                  <label htmlFor="portfolioUrl" className="text-sm font-medium text-ink">
                    Portfolio / Website URL
                  </label>
                  <input
                    id="portfolioUrl"
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://yourportfolio.com"
                    className="mt-1.5 w-full rounded-xl border border-surface-line px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
                  />
                </div>
                <div>
                  <label htmlFor="githubUrl" className="text-sm font-medium text-ink">
                    GitHub Profile / Repo URL
                  </label>
                  <input
                    id="githubUrl"
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/yourname"
                    className="mt-1.5 w-full rounded-xl border border-surface-line px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
                  />
                </div>
              </div>
            </div>

            {submitError && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {submitError}
              </p>
            )}

            <div className="flex items-center justify-between">
              <Link
                to={`/mentors/${mentor.user_id}`}
                className="text-sm font-medium text-ink/60 hover:text-ink"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? "Sending…" : "Send Request"}
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ScheduleSessionPage;

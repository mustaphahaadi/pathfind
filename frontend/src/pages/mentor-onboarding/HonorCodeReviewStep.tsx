import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ShieldCheck, Rocket, Star, LifeBuoy, Link2, PenLine } from "lucide-react";
import { useMentorOnboardingStore } from "../../store/useMentorOnboardingStore";
import { mentorOnboardingStepPath } from "../../data/mentor-onboarding/steps";
import { mentorDisciplines, mentorshipTopics, mentorHonorCodeItems } from "../../data/mentor-onboarding/options";
import { getInitials } from "../../lib/getInitials";
import SidebarInfoCard from "../../components/mentor-onboarding/SidebarInfoCard";
import { api } from "../../lib/api";
import { useAuthStore } from "../../store/useAuthStore";

const whatHappensNext = [
  {
    title: "Instant Review",
    description: "Verification team checks LinkedIn credentials within 24-48 hours.",
  },
  {
    title: "Profile Goes Live",
    description: "Your public card appears in the Explore Mentors directory once verified.",
  },
  {
    title: "Manage Requests",
    description: "You review each booking request and agenda before accepting.",
  },
];

const perks = [
  "Private Slack community with 1,000+ tech leaders and innovators.",
  "Exclusive quarterly volunteer roundtables & leadership exchanges.",
  "Meaningful 1:1 impact tracking on your personal mentor dashboard.",
];

const HonorCodeReviewStep = () => {
  const navigate = useNavigate();

  const avatarUrl = useMentorOnboardingStore((state) => state.avatarUrl);
  const fullName = useMentorOnboardingStore((state) => state.fullName);
  const workEmail = useMentorOnboardingStore((state) => state.workEmail);
  const password = useMentorOnboardingStore((state) => state.password);
  const yearsOfExperience = useMentorOnboardingStore((state) => state.yearsOfExperience);
  const currentTitle = useMentorOnboardingStore((state) => state.currentTitle);
  const company = useMentorOnboardingStore((state) => state.company);
  const location = useMentorOnboardingStore((state) => state.location);
  const linkedinUrl = useMentorOnboardingStore((state) => state.linkedinUrl);
  const primaryDiscipline = useMentorOnboardingStore((state) => state.primaryDiscipline);
  const topics = useMentorOnboardingStore((state) => state.topics);
  const motivation = useMentorOnboardingStore((state) => state.motivation);
  const weeklyWindows = useMentorOnboardingStore((state) => state.weeklyWindows);
  const agreedHonorCodeIds = useMentorOnboardingStore((state) => state.agreedHonorCodeIds);
  const digitalSignature = useMentorOnboardingStore((state) => state.digitalSignature);

  const toggleHonorCodeItem = useMentorOnboardingStore((state) => state.toggleHonorCodeItem);
  const setDigitalSignature = useMentorOnboardingStore((state) => state.setDigitalSignature);
  const completeOnboarding = useMentorOnboardingStore((state) => state.completeOnboarding);

  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);

  const effectiveFullName = fullName.trim() || user?.profile?.full_name || "";
  const effectiveWorkEmail = workEmail.trim() || user?.email || "";

  const disciplineLabel = mentorDisciplines.find((d) => d.id === primaryDiscipline)?.label;
  const topicLabels = mentorshipTopics
    .filter((topic) => topics.includes(topic.id))
    .map((topic) => topic.label);
  const monthlyCeiling = weeklyWindows.reduce((sum, window) => sum + window.maxCalls, 0);

  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const allAgreed = agreedHonorCodeIds.length === mentorHonorCodeItems.length;
  const signatureMatches =
    digitalSignature.trim().length > 0 &&
    (effectiveFullName.length === 0 ||
      digitalSignature.trim().toLowerCase() === effectiveFullName.trim().toLowerCase() ||
      digitalSignature.trim().toLowerCase() === fullName.trim().toLowerCase());
  const canPublish = allAgreed && signatureMatches;

  const handlePublish = async () => {
    if (!canPublish) return;
    setPublishError(null);
    setPublishing(true);

    // Build expertise_tags: "Discipline, Topic1, Topic2, ..."
    const tagParts = [
      ...(disciplineLabel ? [disciplineLabel] : []),
      ...topicLabels,
    ];
    const expertiseTags = tagParts.join(", ") || user?.profile?.expertise_tags || "General";

    // Build availability string from weekly windows
    const availabilityStr =
      weeklyWindows.length > 0
        ? weeklyWindows
            .map((w) => `${w.day} ${w.startTime}–${w.endTime} (${w.maxCalls} calls)`)
            .join("; ")
        : user?.profile?.availability || "Flexible";

    try {
      await api.auth.signUpMentor({
        email: effectiveWorkEmail,
        password: password || "password123",
        full_name: effectiveFullName || "Mentor",
        job_title: currentTitle || user?.profile?.job_title || "Mentor",
        company: company || user?.profile?.company || "Independent",
        years_of_experience: yearsOfExperience || user?.profile?.years_of_experience || 1,
        bio: motivation || user?.profile?.bio || "Passionate about helping the next generation.",
        expertise_tags: expertiseTags,
        availability: availabilityStr,
        avatar_url: avatarUrl || user?.profile?.avatar_url || null,
        location: location || user?.profile?.location || null,
        linkedin_url: linkedinUrl || user?.profile?.linkedin_url || null,
      });

      // Auto sign-in
      const token = await api.auth.signIn({ email: effectiveWorkEmail, password: password || "password123" });
      const updatedUser = await api.auth.me(token.access_token);
      setAuth(token.access_token, updatedUser);

      completeOnboarding();
      navigate("/onboarding/mentor/complete");
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="flex flex-col gap-6">
        <div className="rounded-3xl border border-surface-line bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-ink">Profile Summary</h2>
              <p className="mt-1 text-sm text-ink/60">Review how your profile will appear to the community.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-green/10 px-3 py-1.5 text-xs font-semibold text-accent-green">
              <Check size={13} />
              All 3 steps completed
            </span>
          </div>

          <div className="mt-5 flex items-start justify-between gap-3 border-t border-surface-line pt-5">
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <img src={avatarUrl} alt={fullName} className="h-14 w-14 rounded-full object-cover" />
              ) : (
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-base font-bold text-white">
                  {getInitials(fullName)}
                </span>
              )}
              <div>
                <p className="flex items-center gap-1.5 text-base font-bold text-ink">
                  {fullName || "Your Name"}
                  {linkedinUrl && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent-blue/10 px-2 py-0.5 text-[11px] font-semibold text-accent-blue">
                      <Link2 size={11} />
                      LinkedIn Verified
                    </span>
                  )}
                </p>
                <p className="text-sm text-ink/60">
                  {currentTitle || "Your title"} {company ? `@ ${company}` : ""}
                </p>
                <p className="text-xs text-ink/50">{location}</p>
              </div>
            </div>
            <Link
              to={mentorOnboardingStepPath("identity-verification")}
              className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-accent-blue hover:underline"
            >
              <PenLine size={12} />
              Edit
            </Link>
          </div>

          <div className="mt-5 border-t border-surface-line pt-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">Primary Domain</p>
              <Link
                to={mentorOnboardingStepPath("domain-skills")}
                className="inline-flex items-center gap-1 text-xs font-semibold text-accent-blue hover:underline"
              >
                <PenLine size={12} />
                Edit
              </Link>
            </div>
            <p className="mt-1 text-base font-bold text-ink">{disciplineLabel ?? "Not set"}</p>

            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink/40">Target Topics</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {topicLabels.length > 0 ? (
                topicLabels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-ink"
                  >
                    {label}
                  </span>
                ))
              ) : (
                <span className="text-sm text-ink/50">No topics selected</span>
              )}
            </div>
          </div>

          <div className="mt-5 border-t border-surface-line pt-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                Availability &amp; Capacity
              </p>
              <Link
                to={mentorOnboardingStepPath("availability-capacity")}
                className="inline-flex items-center gap-1 text-xs font-semibold text-accent-blue hover:underline"
              >
                <PenLine size={12} />
                Edit
              </Link>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-surface p-3">
                <p className="text-xs text-ink/50">Monthly Ceiling</p>
                <p className="text-sm font-bold text-ink">
                  {monthlyCeiling} sessions / month, 45 min each
                </p>
              </div>
              <div className="rounded-xl bg-surface p-3">
                <p className="text-xs text-ink/50">Recurring Windows</p>
                {weeklyWindows.length > 0 ? (
                  weeklyWindows.map((window) => (
                    <p key={window.id} className="text-sm font-medium text-ink">
                      {window.day}s {window.startTime} - {window.endTime}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-ink/50">None configured</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 border-t border-surface-line pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">
              Public Mentor Bio Preview
            </p>
            <p className="mt-2 rounded-xl bg-surface p-3.5 text-sm italic text-ink/70">
              {motivation
                ? `"${motivation.slice(0, 220)}${motivation.length > 220 ? "…" : ""}"`
                : "Your \"why I volunteer\" statement from Step 2 will appear here."}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-surface-line bg-white p-6 sm:p-8">
          <p className="flex items-center gap-2 text-lg font-bold text-ink">
            <ShieldCheck size={18} className="text-accent-blue" />
            The Volunteer Mentor Honor Code
          </p>
          <p className="mt-1 text-sm text-ink/60">
            Pathfind is anchored in mutual respect, non-commercial ethics, and
            voluntary knowledge sharing. Every session is 100% free for mentees.
          </p>

          <div className="mt-4 flex flex-col gap-3">
            {mentorHonorCodeItems.map((item) => {
              const isChecked = agreedHonorCodeIds.includes(item.id);
              return (
                <label
                  key={item.id}
                  className="flex items-start gap-3 rounded-xl border border-surface-line p-4"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleHonorCodeItem(item.id)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-surface-line accent-ink"
                  />
                  <span>
                    <span className="block text-sm font-bold text-ink">{item.title}</span>
                    <span className="mt-0.5 block text-sm text-ink/60">{item.description}</span>
                  </span>
                </label>
              );
            })}
          </div>

          <div className="mt-5 rounded-xl border border-surface-line bg-surface p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">Legally Binding Digital Signature</p>
              <span className="text-xs font-medium text-ink/50">Step 4 Acknowledgment</span>
            </div>
            <input
              type="text"
              value={digitalSignature}
              onChange={(event) => setDigitalSignature(event.target.value)}
              placeholder="Type your full name to sign"
              className="mt-2 w-full rounded-lg border border-surface-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
            />
            {digitalSignature.length > 0 && !signatureMatches && (
              <p className="mt-1.5 text-xs text-red-500">
                Your signature must match the full name from Step 1 (&ldquo;{fullName}&rdquo;).
              </p>
            )}
            <p className="mt-2 flex items-start gap-1.5 text-xs text-ink/50">
              By clicking Agree &amp; Publish Profile, your public mentor card will be
              submitted for immediate community verification.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to={mentorOnboardingStepPath("availability-capacity")}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-surface-line bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface"
          >
            <ArrowLeft size={16} />
            Back to Step 3: Availability
          </Link>
          <div className="flex flex-col gap-2 sm:items-end">
            {publishError && (
              <p className="text-xs text-red-500">{publishError}</p>
            )}
            <div className="flex flex-col-reverse items-center gap-3 sm:flex-row">
              <Link
                to="/mentors"
                className="text-sm font-medium text-ink/60 transition-colors hover:text-ink"
              >
                Save Draft
              </Link>
              <button
                type="button"
                onClick={handlePublish}
                disabled={!canPublish || publishing}
                className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity sm:w-auto ${
                  canPublish && !publishing ? "bg-ink hover:opacity-90" : "cursor-not-allowed bg-ink/40"
                }`}
              >
                {publishing ? "Publishing…" : "Agree & Publish Profile"}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <SidebarInfoCard icon={Rocket} title="What Happens Next?">
          <ol className="space-y-3">
            {whatHappensNext.map((step, index) => (
              <li key={step.title} className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-white">
                  {index + 1}
                </span>
                <span>
                  <span className="block font-semibold text-ink">{step.title}</span>
                  <span className="text-ink/60">{step.description}</span>
                </span>
              </li>
            ))}
          </ol>
        </SidebarInfoCard>

        <SidebarInfoCard icon={Star} title="Volunteer Mentor Perks" tone="accent">
          <ul className="space-y-2.5">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-2">
                <Check size={14} className="mt-0.5 shrink-0 text-accent-blue" />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </SidebarInfoCard>

        <SidebarInfoCard icon={LifeBuoy} title="Need Assistance?">
          <p>
            Have questions about mentoring boundaries, time commitment, or calendar
            sync?
          </p>
          <a
            href="mailto:volunteers@pathfind.org"
            className="mt-2 inline-block text-xs font-semibold text-accent-blue hover:underline"
          >
            Chat with our Volunteer Coordinator
          </a>
        </SidebarInfoCard>
      </div>
    </div>
  );
};

export default HonorCodeReviewStep;

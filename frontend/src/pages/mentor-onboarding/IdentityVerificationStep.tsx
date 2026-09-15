import { useRef, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Upload, Link2, Lock, HeartHandshake, ShieldCheck } from "lucide-react";
import { useMentorOnboardingStore } from "../../store/useMentorOnboardingStore";
import { mentorOnboardingStepPath } from "../../data/mentor-onboarding/steps";
import { getInitials } from "../../lib/getInitials";
import SidebarInfoCard from "../../components/mentor-onboarding/SidebarInfoCard";

const timezones = [
  "Pacific Time (UTC-8:00)",
  "Mountain Time (UTC-7:00)",
  "Central Time (UTC-6:00)",
  "Eastern Time (UTC-5:00)",
  "UTC",
  "Central European Time (UTC+1:00)",
];

const IdentityVerificationStep = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarUrl = useMentorOnboardingStore((state) => state.avatarUrl);
  const fullName = useMentorOnboardingStore((state) => state.fullName);
  const workEmail = useMentorOnboardingStore((state) => state.workEmail);
  const currentTitle = useMentorOnboardingStore((state) => state.currentTitle);
  const company = useMentorOnboardingStore((state) => state.company);
  const location = useMentorOnboardingStore((state) => state.location);
  const timezone = useMentorOnboardingStore((state) => state.timezone);
  const linkedinUrl = useMentorOnboardingStore((state) => state.linkedinUrl);

  const setAvatarUrl = useMentorOnboardingStore((state) => state.setAvatarUrl);
  const setFullName = useMentorOnboardingStore((state) => state.setFullName);
  const setWorkEmail = useMentorOnboardingStore((state) => state.setWorkEmail);
  const setCurrentTitle = useMentorOnboardingStore((state) => state.setCurrentTitle);
  const setCompany = useMentorOnboardingStore((state) => state.setCompany);
  const setLocation = useMentorOnboardingStore((state) => state.setLocation);
  const setTimezone = useMentorOnboardingStore((state) => state.setTimezone);
  const setLinkedinUrl = useMentorOnboardingStore((state) => state.setLinkedinUrl);

  const canContinue =
    fullName.trim().length > 0 &&
    workEmail.trim().length > 0 &&
    currentTitle.trim().length > 0 &&
    company.trim().length > 0 &&
    location.trim().length > 0 &&
    timezone.trim().length > 0 &&
    linkedinUrl.trim().length > 0;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
    event.target.value = "";
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-3xl border border-surface-line bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-surface-line pb-5">
          <div>
            <h2 className="text-xl font-bold text-ink">Professional Identity &amp; Verification</h2>
            <p className="mt-1 max-w-md text-sm text-ink/60">
              Help mentees discover your professional background and verify your domain
              track record.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent-blue/10 px-3 py-1.5 text-xs font-semibold text-accent-blue">
            <ShieldCheck size={13} />
            Verified Identity
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-4 rounded-2xl bg-surface p-4 sm:flex-row sm:items-center">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Headshot preview" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink text-lg font-bold text-white">
              {getInitials(fullName)}
            </div>
          )}
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Upload size={14} />
              Upload headshot
            </button>
            {avatarUrl && (
              <button
                type="button"
                onClick={() => setAvatarUrl(null)}
                className="text-sm font-medium text-ink/60 hover:text-ink"
              >
                Remove
              </button>
            )}
          </div>
        </div>
        <p className="mt-2 text-xs text-surface-muted">
          Recommended: Clear portrait, JPG or PNG. Minimum 400x400px. Professional,
          welcoming appearance.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="text-sm font-medium text-ink">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Jane Doe"
              className="mt-1.5 w-full rounded-xl border border-surface-line px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
            />
          </div>
          <div>
            <label htmlFor="workEmail" className="text-sm font-medium text-ink">
              Work Email <span className="text-red-500">*</span>
            </label>
            <input
              id="workEmail"
              type="email"
              value={workEmail}
              onChange={(event) => setWorkEmail(event.target.value)}
              placeholder="jane@company.com"
              className="mt-1.5 w-full rounded-xl border border-surface-line px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
            />
            <p className="mt-1.5 text-xs text-surface-muted">
              We never share or expose your email to public mentees.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="currentTitle" className="text-sm font-medium text-ink">
              Current Title <span className="text-red-500">*</span>
            </label>
            <input
              id="currentTitle"
              type="text"
              value={currentTitle}
              onChange={(event) => setCurrentTitle(event.target.value)}
              placeholder="Staff Software Engineer"
              className="mt-1.5 w-full rounded-xl border border-surface-line px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
            />
          </div>
          <div>
            <label htmlFor="company" className="text-sm font-medium text-ink">
              Company / Organization <span className="text-red-500">*</span>
            </label>
            <input
              id="company"
              type="text"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="Stripe"
              className="mt-1.5 w-full rounded-xl border border-surface-line px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="location" className="text-sm font-medium text-ink">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="San Francisco, CA"
              className="mt-1.5 w-full rounded-xl border border-surface-line px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
            />
          </div>
          <div>
            <label htmlFor="timezone" className="text-sm font-medium text-ink">
              Primary Timezone <span className="text-red-500">*</span>
            </label>
            <select
              id="timezone"
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-surface-line bg-white px-4 py-3 text-sm text-ink focus:border-ink"
            >
              <option value="">Select a timezone</option>
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="linkedinUrl" className="text-sm font-medium text-ink">
            Verified Profile Link <span className="text-red-500">*</span>
          </label>
          <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-surface-line px-4 py-3 focus-within:border-ink">
            <Link2 size={16} className="text-ink/40" />
            <input
              id="linkedinUrl"
              type="url"
              value={linkedinUrl}
              onChange={(event) => setLinkedinUrl(event.target.value)}
              placeholder="https://linkedin.com/in/your-name"
              className="w-full text-sm text-ink placeholder:text-ink/35 outline-none"
            />
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-surface p-3.5 text-sm text-ink/70">
          <Lock size={16} className="mt-0.5 shrink-0 text-accent-blue" />
          <p>
            Used solely by our volunteer committee to verify senior tech experience
            before issuing your volunteer badge. This link will not be publicized
            unless you choose to display it on your public card.
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-surface-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/mentors"
            className="inline-flex items-center justify-center rounded-xl border border-surface-line bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface"
          >
            Save Draft
          </Link>
          <Link
            to={canContinue ? mentorOnboardingStepPath("domain-skills") : "#"}
            aria-disabled={!canContinue}
            onClick={(event) => {
              if (!canContinue) event.preventDefault();
            }}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity ${
              canContinue ? "bg-ink hover:opacity-90" : "cursor-not-allowed bg-ink/40"
            }`}
          >
            Continue to Step 2: Domain &amp; Skills
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border border-surface-line bg-white p-5">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=100&h=100&fit=crop&crop=faces&q=80"
              alt="Elena Chen"
              className="h-11 w-11 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-bold text-ink">Elena Chen</p>
              <p className="text-xs text-ink/60">Staff SWE at Stripe</p>
            </div>
          </div>
          <blockquote className="mt-3 border-l-2 border-surface-line pl-3 text-sm italic text-ink/70">
            &ldquo;Volunteering here is the most fulfilling hour of my month.&rdquo;
          </blockquote>
          <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-accent-blue">
            <ShieldCheck size={13} />
            Volunteer Mentor since 2022
          </p>
        </div>

        <SidebarInfoCard icon={HeartHandshake} title="Why Volunteer with Pathfind?" tone="accent">
          <ul className="space-y-3">
            <li>
              <p className="font-semibold text-ink">100% voluntary &amp; free forever</p>
              <p className="text-ink/60">
                No commissions, no hidden subscription costs, and no transactional
                consulting fees.
              </p>
            </li>
            <li>
              <p className="font-semibold text-ink">You control your schedule</p>
              <p className="text-ink/60">
                Commit as little as 1 hr/month. Pause or adjust booking windows at any
                time.
              </p>
            </li>
            <li>
              <p className="font-semibold text-ink">Mentees submit clear agendas</p>
              <p className="text-ink/60">
                No vague catch-ups. Mentees must submit questions, code repo, or resume
                ahead of sessions.
              </p>
            </li>
          </ul>
        </SidebarInfoCard>

        <SidebarInfoCard icon={ShieldCheck} title="Privacy & Boundary Guarantee">
          <p>
            Your personal email, phone number, and calendar stay private. We generate
            end-to-end masked calendar placeholders and safe automated video links for
            every scheduled chat.
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-ink/50">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
            Zero spam &middot; Strict code of conduct
          </p>
        </SidebarInfoCard>
      </div>
    </div>
  );
};

export default IdentityVerificationStep;

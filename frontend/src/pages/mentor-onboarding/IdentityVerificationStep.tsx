import { useRef, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Upload, Link2, Lock, HeartHandshake, ShieldCheck } from "lucide-react";
import { useMentorOnboardingStore } from "../../store/useMentorOnboardingStore";
import { mentorOnboardingStepPath } from "../../data/mentor-onboarding/steps";
import { getInitials } from "../../lib/getInitials";
import SidebarInfoCard from "../../components/mentor-onboarding/SidebarInfoCard";
import { api } from "../../lib/api";
import { resolveMediaUrl } from "../../lib/resolveMediaUrl";

const IdentityVerificationStep = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const avatarUrl = useMentorOnboardingStore((s) => s.avatarUrl);
  const fullName = useMentorOnboardingStore((s) => s.fullName);
  const workEmail = useMentorOnboardingStore((s) => s.workEmail);
  const currentTitle = useMentorOnboardingStore((s) => s.currentTitle);
  const company = useMentorOnboardingStore((s) => s.company);
  const location = useMentorOnboardingStore((s) => s.location);
  const linkedinUrl = useMentorOnboardingStore((s) => s.linkedinUrl);
  const yearsOfExp = useMentorOnboardingStore((s) => s.yearsOfExperience);

  const setAvatarUrl = useMentorOnboardingStore((s) => s.setAvatarUrl);
  const setFullName = useMentorOnboardingStore((s) => s.setFullName);
  const setWorkEmail = useMentorOnboardingStore((s) => s.setWorkEmail);
  const setCurrentTitle = useMentorOnboardingStore((s) => s.setCurrentTitle);
  const setCompany = useMentorOnboardingStore((s) => s.setCompany);
  const setLocation = useMentorOnboardingStore((s) => s.setLocation);
  const setLinkedinUrl = useMentorOnboardingStore((s) => s.setLinkedinUrl);
  const setYearsOfExp = useMentorOnboardingStore((s) => s.setYearsOfExperience);

  const canContinue =
    fullName.trim().length > 0 &&
    workEmail.trim().length > 0 &&
    currentTitle.trim().length > 0 &&
    company.trim().length > 0 &&
    yearsOfExp >= 0;

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadError(null);
    setUploading(true);
    try {
      const result = await api.upload(file);
      const fullUrl = resolveMediaUrl(result.url);
      setAvatarUrl(fullUrl);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-3xl border border-surface-line bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-surface-line pb-5">
          <div>
            <h2 className="text-xl font-bold text-ink">Professional Identity & Verification</h2>
            <p className="mt-1 max-w-md text-sm text-ink/60">
              Help mentees discover your professional background and verify your domain track record.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent-blue/10 px-3 py-1.5 text-xs font-semibold text-accent-blue">
            <ShieldCheck size={13} />
            Verified Identity
          </span>
        </div>

        {/* Avatar upload */}
        <div className="mt-5 flex flex-col gap-4 rounded-2xl bg-surface p-4 sm:flex-row sm:items-center">
          {avatarUrl ? (
            <img src={resolveMediaUrl(avatarUrl)!} alt="Headshot preview" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink text-lg font-bold text-white">
              {getInitials(fullName)}
            </div>
          )}
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <Upload size={14} />
              {uploading ? "Uploading…" : "Upload headshot"}
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
        {uploadError && (
          <p className="mt-2 text-xs text-red-500">{uploadError}</p>
        )}
        <p className="mt-2 text-xs text-surface-muted">
          Recommended: Clear portrait, JPG or PNG. Minimum 400×400px.
        </p>

        {/* Name + Email */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="text-sm font-medium text-ink">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
              onChange={(e) => setWorkEmail(e.target.value)}
              placeholder="jane@company.com"
              className="mt-1.5 w-full rounded-xl border border-surface-line px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
            />
            <p className="mt-1.5 text-xs text-surface-muted">
              We never share your email with mentees.
            </p>
          </div>
        </div>

        {/* Title + Company */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="currentTitle" className="text-sm font-medium text-ink">
              Current Title <span className="text-red-500">*</span>
            </label>
            <input
              id="currentTitle"
              type="text"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
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
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Stripe"
              className="mt-1.5 w-full rounded-xl border border-surface-line px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
            />
          </div>
        </div>

        {/* Years of experience + Location */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="yearsOfExp" className="text-sm font-medium text-ink">
              Years of Experience <span className="text-red-500">*</span>
            </label>
            <input
              id="yearsOfExp"
              type="number"
              min={0}
              max={50}
              value={yearsOfExp}
              onChange={(e) => setYearsOfExp(Number(e.target.value))}
              placeholder="8"
              className="mt-1.5 w-full rounded-xl border border-surface-line px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
            />
          </div>
          <div>
            <label htmlFor="location" className="text-sm font-medium text-ink">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="San Francisco, CA"
              className="mt-1.5 w-full rounded-xl border border-surface-line px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
            />
          </div>
        </div>

        {/* LinkedIn */}
        <div className="mt-5">
          <label htmlFor="linkedinUrl" className="text-sm font-medium text-ink">
            LinkedIn Profile URL
          </label>
          <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-surface-line px-4 py-3 focus-within:border-ink">
            <Link2 size={16} className="text-ink/40" />
            <input
              id="linkedinUrl"
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/your-name"
              className="w-full text-sm text-ink placeholder:text-ink/35 outline-none"
            />
          </div>
          <div className="mt-2 flex items-start gap-2 text-xs text-ink/50">
            <Lock size={13} className="mt-0.5 shrink-0 text-accent-blue" />
            Used to verify senior tech experience. Not publicized without your consent.
          </div>
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
            onClick={(e) => { if (!canContinue) e.preventDefault(); }}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity ${
              canContinue ? "bg-ink hover:opacity-90" : "cursor-not-allowed bg-ink/40"
            }`}
          >
            Continue to Step 2: Domain & Skills
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <SidebarInfoCard icon={HeartHandshake} title="Why Volunteer with Pathfind?" tone="accent">
          <ul className="space-y-3">
            <li>
              <p className="font-semibold text-ink">100% voluntary & free forever</p>
              <p className="text-ink/60">No commissions, no hidden costs.</p>
            </li>
            <li>
              <p className="font-semibold text-ink">You control your schedule</p>
              <p className="text-ink/60">Commit as little as 1 hr/month. Pause anytime.</p>
            </li>
            <li>
              <p className="font-semibold text-ink">Mentees submit clear agendas</p>
              <p className="text-ink/60">No vague catch-ups. Prepared questions only.</p>
            </li>
          </ul>
        </SidebarInfoCard>

        <SidebarInfoCard icon={ShieldCheck} title="Privacy & Boundary Guarantee">
          <p>
            Your personal email, phone, and calendar stay private. We generate
            end-to-end masked calendar placeholders for every scheduled chat.
          </p>
        </SidebarInfoCard>
      </div>
    </div>
  );
};

export default IdentityVerificationStep;

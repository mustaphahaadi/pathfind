import { useRef, useEffect, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Clock, HandCoins, Upload, ArrowRight, Check } from "lucide-react";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { useAuthStore } from "../../store/useAuthStore";
import { api } from "../../lib/api";
import { statusOptions } from "../../data/onboarding/statusOptions";
import { onboardingStepPath } from "../../data/onboarding/steps";
import { getInitials } from "../../lib/getInitials";
import RadioOptionCard from "../../components/onboarding/RadioOptionCard";
import type { UserOut } from "../../types/api";

const AboutYouStep = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const avatarUrl = useOnboardingStore((state) => state.avatarUrl);
  const fullName = useOnboardingStore((state) => state.fullName);
  const email = useOnboardingStore((state) => state.email);
  const location = useOnboardingStore((state) => state.location);
  const status = useOnboardingStore((state) => state.status);

  const setAvatarUrl = useOnboardingStore((state) => state.setAvatarUrl);
  const setFullName = useOnboardingStore((state) => state.setFullName);
  const setEmail = useOnboardingStore((state) => state.setEmail);
  const setLocation = useOnboardingStore((state) => state.setLocation);
  const setStatus = useOnboardingStore((state) => state.setStatus);
  const initFromUser = useOnboardingStore((state) => state.initFromUser);

  useEffect(() => {
    if (user) {
      initFromUser(user);
    }
  }, [user, initFromUser]);

  const syncAuthUser = async () => {
    if (user) {
      try {
        const updatedUser = await api.profiles.update({
          full_name: fullName || user.profile?.full_name || "Mentee User",
          avatar_url: avatarUrl || user.profile?.avatar_url || null,
          location: location || user.profile?.location || "Ghana / Remote",
        });
        updateUser(updatedUser);
      } catch {
        const updatedUser: UserOut = {
          ...user,
          email: email || user.email,
          profile: {
            ...(user.profile || {
              id: user.id,
              user_id: user.id,
              job_title: "Mentee",
              company: "Pathfind Network",
              years_of_experience: 1,
              bio: "",
              expertise_tags: "",
              availability: "Available",
              linkedin_url: null,
            }),
            full_name: fullName || user.profile?.full_name || "Mentee User",
            avatar_url: avatarUrl || user.profile?.avatar_url || null,
            location: location || user.profile?.location || "Ghana / Remote",
          },
        };
        updateUser(updatedUser);
      }
    }
  };

  const canContinue = fullName.trim().length > 0 && email.trim().length > 0 && status !== null;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarUrl(URL.createObjectURL(file));
    }
    event.target.value = "";
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-sm font-medium text-ink/70 transition-colors hover:text-ink"
      >
        <ChevronLeft size={15} />
        Personalized Mentee Setup
      </button>

      <h1 className="mt-5 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
        Tell us about yourself
      </h1>
      <p className="mt-2 max-w-lg text-base leading-relaxed text-ink/60">
        Help mentors understand where you are starting from so we can
        personalize your match.
      </p>

      <div className="mt-6 border-t border-surface-line pt-6">
        <p className="text-sm font-semibold text-ink">Profile Photo</p>
        <div className="mt-3 flex flex-col gap-4 rounded-2xl bg-surface p-4 sm:flex-row sm:items-center">
          <div className="relative shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile preview"
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink text-lg font-bold text-white">
                {getInitials(fullName)}
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent-green text-white ring-2 ring-white">
              <Check size={12} strokeWidth={3} />
            </span>
          </div>

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
              Upload Photo
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
          JPG, PNG or GIF up to 5MB. Clear face photo recommended.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="text-sm font-medium text-ink">
            Full Name
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
          <label htmlFor="email" className="text-sm font-medium text-ink">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mt-1.5 w-full rounded-xl border border-surface-line px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="location" className="text-sm font-medium text-ink">
          Location &amp; Time Zone
        </label>
        <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-surface-line px-4 py-3 focus-within:border-ink">
          <Clock size={16} className="text-ink/40" />
          <input
            id="location"
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="San Francisco, CA (UTC-7)"
            className="w-full text-sm text-ink placeholder:text-ink/35 outline-none"
          />
        </div>
        <p className="mt-1.5 text-xs text-surface-muted">
          Helps align schedules across time zones.
        </p>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">
            What best describes your current status?
          </p>
          <span className="text-[11px] font-medium tracking-wide text-surface-muted">
            SINGLE SELECTION
          </span>
        </div>

        <div className="mt-3 flex flex-col gap-3" role="radiogroup" aria-label="Current status">
          {statusOptions.map((option) => (
            <RadioOptionCard
              key={option.id}
              title={option.title}
              description={option.description}
              isSelected={status === option.id}
              onSelect={() => setStatus(option.id)}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl bg-surface p-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-accent-blue">
          <HandCoins size={18} strokeWidth={1.75} />
        </span>
        <div>
          <p className="text-sm font-bold text-ink">Always 100% Free &amp; Open</p>
          <p className="mt-0.5 text-sm text-ink/60">
            Pathfind mentors are seasoned industry volunteers giving back
            their time. You will never be asked to pay fees, purchase
            subscriptions, or provide financial details.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-surface-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/profile"
          onClick={syncAuthUser}
          className="inline-flex items-center justify-center rounded-xl border border-surface-line px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface"
        >
          Save &amp; Exit
        </Link>
        <Link
          to={canContinue ? onboardingStepPath("interests-goals") : "#"}
          aria-disabled={!canContinue}
          onClick={(event) => {
            if (!canContinue) {
              event.preventDefault();
            } else {
              syncAuthUser();
            }
          }}
          className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity ${
            canContinue ? "bg-ink hover:opacity-90" : "cursor-not-allowed bg-ink/40"
          }`}
        >
          Continue to Interests &amp; Goals
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default AboutYouStep;

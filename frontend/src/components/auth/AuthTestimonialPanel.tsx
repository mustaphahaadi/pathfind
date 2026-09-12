interface AuthTestimonialPanelProps {
  quote: string;
  name: string;
  role: string;
  avatarUrl: string;
  company: string;
}

const AuthTestimonialPanel = ({
  quote,
  name,
  role,
  avatarUrl,
  company,
}: AuthTestimonialPanelProps) => {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl bg-surface p-8 text-center sm:p-10">
      <p className="max-w-sm text-2xl font-semibold leading-snug text-ink">
        &lsquo;{quote}&rsquo;
      </p>

      <img
        src={avatarUrl}
        alt={name}
        className="mt-8 h-16 w-16 rounded-full object-cover"
      />
      <p className="mt-4 text-base font-bold text-ink">{name}</p>
      <p className="text-sm text-ink/60">{role}</p>

      <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-sm">
        <span className="h-2 w-2 rounded-full bg-accent-blue" />
        {company}
      </span>
    </div>
  );
};

export default AuthTestimonialPanel;

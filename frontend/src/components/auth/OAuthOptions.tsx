import GoogleIcon from "../icons/GoogleIcon";
import GitHubIcon from "../icons/GitHubIcon";

const OAuthOptions = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-surface-line py-3 text-sm font-medium text-ink transition-colors hover:bg-surface"
        >
          <GoogleIcon size={18} />
          Continue with Google
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-surface-line py-3 text-sm font-medium text-ink transition-colors hover:bg-surface"
        >
          <GitHubIcon size={18} />
          Continue with GitHub
        </button>
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-surface-line" />
        <span className="text-xs font-medium tracking-wide text-surface-muted">
          OR CONTINUE WITH EMAIL
        </span>
        <div className="h-px flex-1 bg-surface-line" />
      </div>
    </>
  );
};

export default OAuthOptions;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { footerNavLinks } from "../../data/navigation";
import { api } from "../../lib/api";

const Footer = () => {
  const [healthy, setHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    api.health()
      .then((res) => setHealthy(res.status === "healthy"))
      .catch(() => setHealthy(false));
  }, []);

  return (
    <footer className="border-t border-black/10 px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
          <p className="text-sm text-ink/60">
            <span className="font-extrabold tracking-tight text-ink">
              Pathfind
            </span>
            <span className="mx-2 text-ink/30">·</span>
            © 2024 Pathfind. 100% Free &amp; Open Tech Mentorship.
          </p>

          {healthy !== null && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 sm:ml-3">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              API Operational
            </span>
          )}
        </div>

        <nav
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-ink/70"
          aria-label="Footer"
        >
          {footerNavLinks.map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export { Footer, Footer as MinimalFooter };
export default Footer;

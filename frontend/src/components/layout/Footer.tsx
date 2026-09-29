import { Link } from "react-router-dom";
import { footerNavLinks } from "../../data/navigation";
import { Logo } from "../ui/Logo";

const Footer = () => {
  return (
    <footer className="border-t border-black/10 px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Logo size="sm" />
          <p className="text-sm text-ink/60">
            <span className="mx-2 text-ink/30 hidden sm:inline">·</span>
            © 2026 Pathfind. 100% Free &amp; Open Tech Mentorship.
          </p>

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

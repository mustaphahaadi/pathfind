import { Link } from "react-router-dom";
import { footerNavLinks } from "../../data/navigation";

const Footer = () => {
  return (
    <footer className="border-t border-black/10 px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm text-ink/60">
          <span className="font-extrabold tracking-tight text-ink">
            Pathfind
          </span>
          <span className="mx-2 text-ink/30">·</span>
          © 2024 Pathfind. 100% Free &amp; Open Tech Mentorship.
        </p>

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

export default Footer;

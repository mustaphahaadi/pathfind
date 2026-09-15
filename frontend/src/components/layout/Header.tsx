import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { marketingNavLinks, appNavLinks } from "../../data/navigation";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { useMentorOnboardingStore } from "../../store/useMentorOnboardingStore";
import UserMenuLink from "./UserMenuLink";
import MentorUserMenuLink from "./MentorUserMenuLink";

interface HeaderProps {
  /** "overlay" sits on top of a dark hero image with light text (marketing landing page).
   *  "solid" is a plain white app-shell header used on every other, in-product page. */
  variant?: "overlay" | "solid";
}

const Header = ({ variant = "overlay" }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMenteeSignedIn = useOnboardingStore((state) => state.fullName.trim().length > 0);
  const isMentorSignedIn = useMentorOnboardingStore(
    (state) => state.hasCompletedOnboarding && state.fullName.trim().length > 0,
  );
  // A mentor who has published takes precedence if, hypothetically, both flows were touched.
  const isSignedIn = isMentorSignedIn || isMenteeSignedIn;

  if (variant === "solid") {
    return (
      <header className="relative z-30 border-b border-surface-line bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" className="text-xl font-extrabold tracking-tight text-ink">
            Pathfind
          </Link>

          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Primary"
          >
            {appNavLinks.map((link) => {
              const isActive =
                location.pathname.startsWith(link.to) ||
                (link.to === "/join/mentor" && location.pathname.startsWith("/onboarding/mentor"));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-ink underline decoration-2 underline-offset-8"
                      : "text-ink/70 hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {isSignedIn ? (
            <div className="hidden lg:flex">
              {isMentorSignedIn ? <MentorUserMenuLink /> : <UserMenuLink />}
            </div>
          ) : (
            <div className="hidden items-center gap-5 lg:flex">
              <Link
                to="/auth"
                className="text-sm font-medium text-ink/70 transition-colors hover:text-ink"
              >
                Sign In
              </Link>
              <Link
                to="/mentors"
                className="inline-flex items-center justify-center rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Book a Session
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-xl border border-surface-line p-2 text-ink lg:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="border-t border-surface-line bg-white px-5 py-4 lg:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {appNavLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface"
                >
                  {link.label}
                </Link>
              ))}
              {isSignedIn ? (
                isMentorSignedIn ? (
                  <MentorUserMenuLink className="mt-2" />
                ) : (
                  <UserMenuLink className="mt-2" />
                )
              ) : (
                <>
                  <Link
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/mentors"
                    onClick={() => setIsMenuOpen(false)}
                    className="mt-2 inline-flex items-center justify-center rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white"
                  >
                    Book a Session
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>
    );
  }

  return (
    <header className="relative z-30 flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
      <Link to="/" className="text-xl font-extrabold tracking-tight text-white">
        Pathfind
      </Link>

      <nav
        className="hidden items-center gap-1 rounded-full bg-white/10 px-2 py-2 backdrop-blur-sm lg:flex"
        aria-label="Primary"
      >
        {marketingNavLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="rounded-full px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Link
        to="/join"
        className="hidden items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90 sm:inline-flex"
      >
        Sign Up
        <ArrowUpRight size={16} />
      </Link>

      <button
        type="button"
        onClick={() => setIsMenuOpen((open) => !open)}
        className="inline-flex items-center justify-center rounded-full bg-white/10 p-2 text-white lg:hidden"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-full z-40 mx-4 mt-2 rounded-2xl bg-white p-4 shadow-xl lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {marketingNavLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-ink hover:bg-cream"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/join"
              onClick={() => setIsMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
            >
              Sign Up
              <ArrowUpRight size={16} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

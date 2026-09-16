import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { marketingNavLinks } from "../../data/navigation";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { useMentorOnboardingStore } from "../../store/useMentorOnboardingStore";
import { useAuthStore } from "../../store/useAuthStore";
import UserMenuLink from "./UserMenuLink";
import MentorUserMenuLink from "./MentorUserMenuLink";
import { Logo } from "../ui/Logo";

interface HeaderProps {
  /** "overlay" sits on top of a dark hero background with light text.
   *  "solid" sits on white/light backgrounds across app pages. */
  variant?: "overlay" | "solid";
}

const Header = ({ variant = "overlay" }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const authUser = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const menteeFullName = useOnboardingStore((state) => state.fullName);
  const mentorHasCompleted = useMentorOnboardingStore((state) => state.hasCompletedOnboarding);
  const mentorFullName = useMentorOnboardingStore((state) => state.fullName);

  const isAuthSignedIn = !!token;
  const isMenteeSignedIn = menteeFullName.trim().length > 0;
  const isMentorSignedIn =
    authUser?.role === "mentor" ||
    (mentorHasCompleted && mentorFullName.trim().length > 0);
  const isSignedIn = isAuthSignedIn || isMentorSignedIn || isMenteeSignedIn;

  const isOverlay = variant === "overlay";

  return (
    <header
      className={`relative z-30 transition-all ${
        isOverlay
          ? "px-5 py-5 sm:px-8 sm:py-6"
          : "border-b border-surface-line bg-white/95 backdrop-blur-md px-5 py-4 sm:px-8"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Brand Logo */}
        <Logo light={isOverlay} />

        {/* Floating Pill Nav Bar */}
        <nav
          className={`hidden items-center gap-1 rounded-full px-2 py-1.5 backdrop-blur-md transition-all lg:flex ${
            isOverlay
              ? "bg-white/10 border border-white/15 text-white/90 shadow-sm"
              : "bg-surface border border-surface-line text-ink/80 shadow-sm"
          }`}
          aria-label="Primary"
        >
          {marketingNavLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  isOverlay
                    ? isActive
                      ? "bg-white text-ink shadow-sm"
                      : "text-white/90 hover:bg-white/15 hover:text-white"
                    : isActive
                    ? "bg-ink text-white shadow-sm"
                    : "text-ink/70 hover:bg-black/5 hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions / User Profile Menu */}
        {isSignedIn ? (
          <div className="hidden lg:flex">
            {isMentorSignedIn ? (
              <MentorUserMenuLink isOverlay={isOverlay} />
            ) : (
              <UserMenuLink isOverlay={isOverlay} />
            )}
          </div>
        ) : (
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/auth"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                isOverlay ? "text-white/90 hover:text-white" : "text-ink/70 hover:text-ink"
              }`}
            >
              Sign In
            </Link>
            <Link
              to="/join"
              className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-all shadow-sm ${
                isOverlay
                  ? "bg-white text-ink hover:opacity-90"
                  : "bg-ink text-white hover:opacity-90"
              }`}
            >
              Sign Up
              <ArrowUpRight size={16} />
            </Link>
          </div>
        )}

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className={`inline-flex items-center justify-center rounded-full p-2.5 transition-colors lg:hidden ${
            isOverlay
              ? "bg-white/10 text-white hover:bg-white/20"
              : "border border-surface-line bg-surface text-ink hover:bg-cream-dark"
          }`}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div
          className={`absolute left-0 right-0 top-full z-40 mx-4 mt-2 rounded-3xl p-5 shadow-2xl backdrop-blur-xl border transition-all lg:hidden ${
            isOverlay
              ? "bg-slate-950/95 border-white/20 text-white"
              : "bg-white/98 border-surface-line text-ink"
          }`}
        >
          <nav className="flex flex-col gap-1.5" aria-label="Mobile">
            {marketingNavLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? isOverlay
                        ? "bg-white text-ink"
                        : "bg-ink text-white"
                      : isOverlay
                      ? "hover:bg-white/10"
                      : "hover:bg-surface"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="mt-3 border-t border-black/10 pt-3">
              {isSignedIn ? (
                isMentorSignedIn ? (
                  <MentorUserMenuLink className="w-full" />
                ) : (
                  <UserMenuLink className="w-full" />
                )
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full rounded-2xl border border-surface-line py-3 text-center text-sm font-semibold hover:bg-surface"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/join"
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-2xl bg-ink py-3 text-sm font-semibold text-white shadow-sm"
                  >
                    Sign Up
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

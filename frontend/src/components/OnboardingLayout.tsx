import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Progress } from "./Progress";
import { Footer } from "./Footer";
export function OnboardingLayout({
  step,
  children,
}: {
  step: 1 | 2 | 3;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f8ff]">
      <header className="border-b bg-white">
        <div className="shell flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden text-xs text-neutral-400 sm:block">
              • Mentee Onboarding
            </span>
          </div>
          <Link to="/mentors" className="text-sm font-medium text-neutral-500">
            Skip for now
          </Link>
        </div>
      </header>
      <main className="shell max-w-[900px] py-7 md:py-10">
        <Progress step={step} />
        {children}
      </main>
      <Footer />
    </div>
  );
}

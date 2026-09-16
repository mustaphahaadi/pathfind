import { Link } from "react-router-dom";
import { ArrowRight, Code2, ShieldCheck, HeartHandshake, Lock, Terminal } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const OpenSourcePage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Header variant="solid" />

      <main className="flex-1 px-5 py-10 sm:px-8 lg:py-16">
        <div className="mx-auto max-w-5xl">
          {/* Header Banner */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-green/10 px-3.5 py-1 text-xs font-semibold text-accent-green">
              <Code2 size={14} />
              OPEN & VOLUNTARY INFRASTRUCTURE
            </span>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl lg:text-5xl">
              100% Free & Open Tech Mentorship
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
              Pathfind is built on the principle that quality career guidance, mock interviews, and code reviews should be accessible to everyone — with zero paywalls and full platform transparency.
            </p>
          </div>

          {/* Core Commitments Grid */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-surface-line bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-green/10 text-accent-green">
                <ShieldCheck size={24} />
              </div>
              <h2 className="mt-4 text-lg font-bold text-ink">Zero Paywalls & No Monetization</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Mentees never pay a single cent. Mentors volunteer purely to give back. Pathfind does not sell premium courses, upselling packages, or paid subscriptions.
              </p>
            </div>

            <div className="rounded-3xl border border-surface-line bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-blue/10 text-accent-blue">
                <HeartHandshake size={24} />
              </div>
              <h2 className="mt-4 text-lg font-bold text-ink">Volunteer Verification Standard</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Every mentor profile goes through manual admin verification of their work email and domain credentials before appearing in our public directory.
              </p>
            </div>

            <div className="rounded-3xl border border-surface-line bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600">
                <Lock size={24} />
              </div>
              <h2 className="mt-4 text-lg font-bold text-ink">Data Privacy & Security</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Mentee data and session notes are private to the session participants. We do not sell user data, track advertising profiles, or monetize community metadata.
              </p>
            </div>

            <div className="rounded-3xl border border-surface-line bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                <Terminal size={24} />
              </div>
              <h2 className="mt-4 text-lg font-bold text-ink">Open Source Codebase</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Pathfind's React frontend and FastAPI backend are open source. Developers can inspect API contracts, audit security rules, and contribute features.
              </p>
            </div>
          </div>

          {/* Technology Stack & Repository Links */}
          <div className="mt-12 rounded-3xl border border-surface-line bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-ink flex items-center gap-2">
              <Code2 size={20} />
              Open Source Architecture
            </h2>
            <p className="mt-2 text-sm text-ink/70">
              Pathfind is powered by modern, reliable web technologies engineered for speed, safety, and developer accessibility:
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-surface-line bg-cream p-4">
                <p className="text-xs font-bold uppercase text-ink/50">Frontend</p>
                <p className="mt-1 text-base font-bold text-ink">React 19 + TypeScript</p>
                <p className="mt-1 text-xs text-ink/60">Vite build tooling, Tailwind CSS styling, Zustand state management.</p>
              </div>

              <div className="rounded-2xl border border-surface-line bg-cream p-4">
                <p className="text-xs font-bold uppercase text-ink/50">Backend API</p>
                <p className="mt-1 text-base font-bold text-ink">FastAPI + Python 3.14</p>
                <p className="mt-1 text-xs text-ink/60">SQLAlchemy ORM, SQLite database, Pydantic schemas, Pytest test suite.</p>
              </div>

              <div className="rounded-2xl border border-surface-line bg-cream p-4">
                <p className="text-xs font-bold uppercase text-ink/50">Security & Auth</p>
                <p className="mt-1 text-base font-bold text-ink">JWT + bcrypt</p>
                <p className="mt-1 text-xs text-ink/60">Bearer tokens, HTTP-only authentication, role-based route guards.</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-surface-line pt-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              >
                <Code2 size={14} />
                View GitHub Repository
              </a>
              <Link
                to="/community-guidelines"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink hover:underline"
              >
                Read Community Guidelines
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OpenSourcePage;

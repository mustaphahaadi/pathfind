import { ShieldAlert, CheckCircle2, XCircle, Heart, ArrowRight } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const GuidelinesPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header variant="solid" />

      <main className="flex-1 px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-blue/10 px-3.5 py-1.5 text-xs font-semibold text-accent-blue">
              <ShieldAlert size={14} />
              COMMUNITY GUIDELINES
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-ink sm:text-5xl">
              Fostering a Safe &amp; Welcoming Environment
            </h1>
            <p className="mt-4 text-base text-ink/60 sm:text-lg">
              Our community standards ensure that every mentorship session remains safe, professional, and inclusive.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-surface-line bg-white p-8">
              <div className="flex items-center gap-2 text-accent-green font-bold text-lg">
                <CheckCircle2 size={22} />
                Encouraged Behaviors
              </div>
              <ul className="mt-4 space-y-3 text-sm text-ink/70">
                <li className="flex gap-2">
                  <span className="font-bold text-ink">&bull;</span>
                  <span><strong>Active Listening:</strong> Pay full attention and give thoughtful, constructive responses.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-ink">&bull;</span>
                  <span><strong>Growth Mindset:</strong> Welcome constructive critiques and view feedback as a learning opportunity.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-ink">&bull;</span>
                  <span><strong>Inclusivity:</strong> Embrace diverse backgrounds, learning paths, and levels of experience.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-surface-line bg-white p-8">
              <div className="flex items-center gap-2 text-red-600 font-bold text-lg">
                <XCircle size={22} />
                Strictly Prohibited
              </div>
              <ul className="mt-4 space-y-3 text-sm text-ink/70">
                <li className="flex gap-2">
                  <span className="font-bold text-red-600">&bull;</span>
                  <span><strong>Harassment or Discrimination:</strong> Any hate speech, harassment, or bias will result in immediate permanent bans.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-red-600">&bull;</span>
                  <span><strong>Commercial Pitching:</strong> Paid course sales, affiliate links, or paid consulting offers are forbidden.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-red-600">&bull;</span>
                  <span><strong>No-shows:</strong> Failing to attend scheduled sessions without 24h cancellation harms community trust.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 rounded-3xl bg-ink p-8 text-center text-white sm:p-10">
            <Heart className="mx-auto text-accent-gold" size={28} />
            <h3 className="mt-3 text-2xl font-bold">Reporting Violations</h3>
            <p className="mt-2 text-sm text-white/70 max-w-lg mx-auto">
              If you experience or witness behavior that violates these guidelines, please contact our community team immediately at safety@pathfind.org.
            </p>
            <div className="mt-6">
              <a
                href="mailto:safety@pathfind.org?subject=Community%20Guideline%20Report"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-ink"
              >
                Report an Issue
                <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GuidelinesPage;

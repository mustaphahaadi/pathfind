import { Link } from "react-router-dom";
import { ShieldCheck, HeartHandshake, Users, Sparkles, Globe, Target, ArrowRight } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const AboutPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header variant="solid" />

      <main className="flex-1 px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-blue/10 px-3.5 py-1.5 text-xs font-semibold text-accent-blue">
              <Sparkles size={14} />
              ABOUT PATHFIND
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-ink sm:text-5xl">
              Democratizing Tech Mentorship for Everyone
            </h1>
            <p className="mt-4 text-base text-ink/60 sm:text-lg">
              Pathfind was built on a simple belief: world-class career guidance should never be locked behind paywalls, subscription fees, or exclusive networks.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-surface-line bg-white p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent-green/10 text-accent-green">
                <HeartHandshake size={24} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink">100% Free Forever</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink/60">
                Zero booking fees, zero commission, zero commercial upsells. Every mentor on Pathfind volunteers their time out of goodwill.
              </p>
            </div>

            <div className="rounded-2xl border border-surface-line bg-white p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue">
                <ShieldCheck size={24} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink">Verified Practitioners</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink/60">
                Our mentors are experienced engineers, product managers, and designers working at top tech companies worldwide.
              </p>
            </div>

            <div className="rounded-2xl border border-surface-line bg-white p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent-gold/10 text-accent-gold">
                <Globe size={24} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink">Global Accessibility</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink/60">
                Connecting mentees from emerging markets and underrepresented backgrounds with industry leaders across time zones.
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-3xl border border-surface-line bg-white p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-ink">Our Mission</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/70 sm:text-base">
              Breaking into tech can feel overwhelming, especially for self-taught developers, bootcamp graduates, and individuals without existing industry connections. Pathfind bridges this gap by creating direct 1:1 mentorship opportunities.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink/70 sm:text-base">
              Whether you need feedback on your technical architecture, advice on navigating technical interviews, or guidance on product management careers, our community of volunteers is here to support you at every stage.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 border-t border-surface-line pt-8 sm:grid-cols-2">
              <div className="flex gap-3">
                <Users className="mt-1 shrink-0 text-accent-blue" size={20} />
                <div>
                  <h4 className="text-sm font-bold text-ink">Community First</h4>
                  <p className="mt-1 text-xs text-ink/60">Built by developers and practitioners who received mentorship themselves and want to give back.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Target className="mt-1 shrink-0 text-accent-green" size={20} />
                <div>
                  <h4 className="text-sm font-bold text-ink">Action-Oriented</h4>
                  <p className="mt-1 text-xs text-ink/60">Focused on practical, actionable feedback—from code reviews to mock interview preparation.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-3xl bg-ink p-8 text-center text-white sm:p-12">
            <h2 className="text-2xl font-extrabold sm:text-3xl">Ready to get started?</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-white/70">
              Join thousands of mentees accelerating their tech careers, or share your knowledge as a volunteer mentor.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/mentors"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-90"
              >
                Find a Mentor
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/join/mentor"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20"
              >
                Become a Volunteer Mentor
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;

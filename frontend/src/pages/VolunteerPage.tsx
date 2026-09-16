import { Link } from "react-router-dom";
import { ShieldCheck, HeartHandshake, Users, ArrowRight, CheckCircle2, Clock, Award } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const VolunteerPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header variant="solid" />

      <main className="flex-1 px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-green/10 px-3.5 py-1.5 text-xs font-semibold text-accent-green">
              <HeartHandshake size={14} />
              VOLUNTEER MENTORS
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-ink sm:text-5xl">
              Pay It Forward to the Next Generation of Tech Talent
            </h1>
            <p className="mt-4 text-base text-ink/60 sm:text-lg">
              Share your hard-earned industry experience with aspiring developers and engineers. 1-2 hours a month makes a life-changing difference.
            </p>

            <div className="mt-8">
              <Link
                to="/onboarding/mentor/identity-verification"
                className="inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-sm"
              >
                Apply as a Volunteer Mentor
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-surface-line bg-white p-6">
              <Clock className="text-accent-blue" size={24} />
              <h3 className="mt-3 text-lg font-bold text-ink">Flexible Commitment</h3>
              <p className="mt-1 text-xs leading-relaxed text-ink/60">
                Set your monthly availability capacity. Whether it&apos;s 1 call or 5 calls per month, you stay in full control.
              </p>
            </div>

            <div className="rounded-2xl border border-surface-line bg-white p-6">
              <Award className="text-accent-green" size={24} />
              <h3 className="mt-3 text-lg font-bold text-ink">Verified Recognition</h3>
              <p className="mt-1 text-xs leading-relaxed text-ink/60">
                Receive an official Pathfind Mentor badge on your public profile and LinkedIn recognition.
              </p>
            </div>

            <div className="rounded-2xl border border-surface-line bg-white p-6">
              <Users className="text-accent-gold" size={24} />
              <h3 className="mt-3 text-lg font-bold text-ink">Private Mentor Community</h3>
              <p className="mt-1 text-xs leading-relaxed text-ink/60">
                Connect with fellow senior staff engineers, VPs, and technical leaders in our mentor-only network.
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-3xl border border-surface-line bg-white p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-ink">What We Look For</h2>
            <div className="mt-6 space-y-4">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 shrink-0 text-accent-green" size={20} />
                <div>
                  <h4 className="text-sm font-bold text-ink">Proven Industry Experience</h4>
                  <p className="mt-0.5 text-xs text-ink/60">Typically 2+ years of professional experience in software engineering, product management, DevOps, or UI/UX design.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 shrink-0 text-accent-green" size={20} />
                <div>
                  <h4 className="text-sm font-bold text-ink">Empathy &amp; Generosity</h4>
                  <p className="mt-0.5 text-xs text-ink/60">A genuine desire to coach, listen, and offer constructive, encouraging career feedback.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 shrink-0 text-accent-green" size={20} />
                <div>
                  <h4 className="text-sm font-bold text-ink">Commitment to Honor Code</h4>
                  <p className="mt-0.5 text-xs text-ink/60">Pledge to offer 100% free sessions without commercial pitch sales or referral fees.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-3xl bg-ink p-8 text-center text-white sm:p-12">
            <ShieldCheck className="mx-auto text-accent-green" size={32} />
            <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">Join Our Volunteer Network</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/70">
              Applications take less than 3 minutes. Start guiding mentees today.
            </p>
            <div className="mt-6">
              <Link
                to="/onboarding/mentor/identity-verification"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90"
              >
                Start Mentor Application
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VolunteerPage;

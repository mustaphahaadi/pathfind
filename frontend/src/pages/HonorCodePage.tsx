import { Link } from "react-router-dom";
import { ShieldCheck, CheckCircle2, HeartHandshake, Lock, ArrowRight } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { mentorHonorCodeItems } from "../data/mentor-onboarding/options";

const HonorCodePage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header variant="solid" />

      <main className="flex-1 px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-gold/10 px-3.5 py-1.5 text-xs font-semibold text-accent-gold">
              <ShieldCheck size={14} />
              COMMUNITY TRUST &amp; SAFETY
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-ink sm:text-5xl">
              Pathfind Community Honor Code
            </h1>
            <p className="mt-4 text-base text-ink/60 sm:text-lg">
              Pathfind thrives on mutual trust, generosity, and professional respect. Every member pledges to uphold these principles.
            </p>
          </div>

          <div className="mt-12 rounded-3xl border border-surface-line bg-white p-8 sm:p-10">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-ink">
              <HeartHandshake className="text-accent-blue" size={24} />
              Mentor Pledges
            </h2>
            <p className="mt-2 text-sm text-ink/60">
              All volunteer mentors agree to the following commitments before joining the platform:
            </p>

            <div className="mt-6 space-y-5">
              {mentorHonorCodeItems.map((item) => (
                <div key={item.id} className="flex gap-3.5 rounded-xl bg-surface p-4">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent-green" />
                  <div>
                    <h4 className="text-base font-bold text-ink">{item.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-ink/60">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-surface-line bg-white p-8 sm:p-10">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-ink">
              <Lock className="text-accent-green" size={24} />
              Mentee Pledges
            </h2>
            <p className="mt-2 text-sm text-ink/60">
              Mentees agree to uphold the following standards during every interaction:
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex gap-3.5 rounded-xl bg-surface p-4">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent-green" />
                <div>
                  <h4 className="text-base font-bold text-ink">Punctuality &amp; Preparation</h4>
                  <p className="mt-1 text-xs leading-relaxed text-ink/60">
                    Arrive on time, test audio/video beforehand, and come prepared with clear goals and questions.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 rounded-xl bg-surface p-4">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent-green" />
                <div>
                  <h4 className="text-base font-bold text-ink">Respectful Communication</h4>
                  <p className="mt-1 text-xs leading-relaxed text-ink/60">
                    Treat mentors with respect, accept feedback constructively, and respect mentor personal boundaries.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 rounded-xl bg-surface p-4">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent-green" />
                <div>
                  <h4 className="text-base font-bold text-ink">No Unsolicited Job Demands</h4>
                  <p className="mt-1 text-xs leading-relaxed text-ink/60">
                    Mentorship calls are for learning and career advice. Never demand job referrals or employment favors.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/mentors"
              className="inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-sm"
            >
              Explore Mentors &amp; Connect
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HonorCodePage;

import { Link } from "react-router-dom";
import { Lock, ShieldCheck, Eye, Database } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const PrivacyPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header variant="solid" />

      <main className="flex-1 px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-blue/10 px-3.5 py-1.5 text-xs font-semibold text-accent-blue">
              <Lock size={14} />
              PRIVACY POLICY
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-ink sm:text-5xl">
              Your Privacy Matters to Us
            </h1>
            <p className="mt-4 text-base text-ink/60 sm:text-lg">
              We respect your personal data and are committed to protecting your privacy.
            </p>
          </div>

          <div className="mt-12 rounded-3xl border border-surface-line bg-white p-8 sm:p-10 space-y-8">
            <section>
              <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
                <Database size={20} className="text-accent-blue" />
                Information We Collect
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Pathfind collects minimal information necessary to facilitate free mentorship connections:
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-ink/70 list-disc list-inside">
                <li>Account credentials (email address and encrypted password).</li>
                <li>Profile details you provide (full name, job title, company, bio, expertise tags, avatar image).</li>
                <li>Mentorship request details (subject, notes, resume or portfolio URLs).</li>
              </ul>
            </section>

            <section className="border-t border-surface-line pt-6">
              <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
                <Eye size={20} className="text-accent-green" />
                How We Use Your Information
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Your data is strictly used to render public mentor directory profiles and transmit 1:1 mentorship requests to mentors. We never sell your data, use commercial trackers, or share your contact details with third-party advertisers.
              </p>
            </section>

            <section className="border-t border-surface-line pt-6">
              <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
                <ShieldCheck size={20} className="text-accent-gold" />
                Data Protection &amp; Security
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                All data transmitted to Pathfind is encrypted in transit via SSL/TLS and protected with standard database security measures. Password hashes use modern cryptographic algorithms.
              </p>
            </section>

            <div className="border-t border-surface-line pt-6 text-xs text-ink/50">
              Last updated: September 2026. For privacy inquiries, email privacy@pathfind.org.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;

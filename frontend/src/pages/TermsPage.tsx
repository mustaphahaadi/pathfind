import { FileText } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const TermsPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header variant="solid" />

      <main className="flex-1 px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-gold/10 px-3.5 py-1.5 text-xs font-semibold text-accent-gold">
              <FileText size={14} />
              TERMS OF SERVICE
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-ink sm:text-5xl">
              Terms of Service &amp; User Agreement
            </h1>
            <p className="mt-4 text-base text-ink/60 sm:text-lg">
              The rules governing the use of the Pathfind open mentorship platform.
            </p>
          </div>

          <div className="mt-12 rounded-3xl border border-surface-line bg-white p-8 sm:p-10 space-y-6">
            <section>
              <h2 className="text-lg font-bold text-ink">1. Platform Purpose</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Pathfind provides a voluntary web platform connecting mentees seeking technical career advice with volunteer mentors. All mentorship sessions are 100% free of charge.
              </p>
            </section>

            <section className="border-t border-surface-line pt-6">
              <h2 className="text-lg font-bold text-ink">2. User Account &amp; Eligibility</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Users must provide accurate registration details and maintain the security of their login credentials. Users are responsible for all activity originating from their accounts.
              </p>
            </section>

            <section className="border-t border-surface-line pt-6">
              <h2 className="text-lg font-bold text-ink">3. Non-Commercial Policy</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Pathfind is strictly non-commercial. Mentors and mentees may not use sessions to sell paid coaching services, pitch financial products, or engage in deceptive solicitations.
              </p>
            </section>

            <section className="border-t border-surface-line pt-6">
              <h2 className="text-lg font-bold text-ink">4. Limitation of Liability</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Mentorship guidance provided by volunteers is informational only. Pathfind is not liable for employment decisions, career outcomes, or advice provided by individual members.
              </p>
            </section>

            <div className="border-t border-surface-line pt-6 text-xs text-ink/50">
              Last updated: September 2026. For terms inquiries, email legal@pathfind.org.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;

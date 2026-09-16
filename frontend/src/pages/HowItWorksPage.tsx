import { Link } from "react-router-dom";
import { Search, Calendar, Video, CheckCircle2, ArrowRight, Lightbulb, MessageSquare } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const HowItWorksPage = () => {
  const steps = [
    {
      num: "01",
      title: "Discover & Filter Mentors",
      description: "Browse our global directory of verified software engineers, product managers, and tech leaders. Filter by expertise, track, or experience.",
      icon: Search,
    },
    {
      num: "02",
      title: "Submit a 1:1 Request",
      description: "Select a mentor and submit a structured mentorship request outlining your goals, questions, or resume link.",
      icon: MessageSquare,
    },
    {
      num: "03",
      title: "Receive Mentor Acceptance",
      description: "The mentor reviews your request and accepts it. You'll receive a notification and session confirmation.",
      icon: Calendar,
    },
    {
      num: "04",
      title: "Connect & Grow",
      description: "Meet 1:1 via video for a focused 45-minute guidance session. Receive actionable feedback and next steps.",
      icon: Video,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header variant="solid" />

      <main className="flex-1 px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-green/10 px-3.5 py-1.5 text-xs font-semibold text-accent-green">
              <CheckCircle2 size={14} />
              HOW PATHFIND WORKS
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-ink sm:text-5xl">
              Simple, Transparent &amp; Completely Free
            </h1>
            <p className="mt-4 text-base text-ink/60 sm:text-lg">
              Here is how you connect with experienced practitioners in four easy steps.
            </p>
          </div>

          <div className="mt-12 space-y-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="flex flex-col gap-6 rounded-3xl border border-surface-line bg-white p-6 sm:flex-row sm:items-center sm:p-8"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink text-xl font-extrabold text-white">
                    {step.num}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Icon size={18} className="text-accent-blue" />
                      <h3 className="text-xl font-bold text-ink">{step.title}</h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ink/60">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 rounded-3xl border border-surface-line bg-white p-8 sm:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-gold/10 text-accent-gold">
                <Lightbulb size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink">Tips for a Great Mentorship Session</h3>
                <ul className="mt-3 space-y-2.5 text-sm text-ink/70">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                    <span><strong>Be Specific:</strong> Share 2-3 precise questions or code files in your initial request.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                    <span><strong>Respect Time:</strong> Join 2 minutes early and prepare your questions in advance.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                    <span><strong>Follow Up:</strong> Send a brief thank-you note sharing progress after your call.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/mentors"
              className="inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-sm"
            >
              Browse Available Mentors
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorksPage;

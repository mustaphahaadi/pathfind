import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="px-5 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[32px] bg-navy px-6 py-14 text-center sm:px-10 sm:py-20 shadow-md">
          <p className="text-xs font-medium tracking-wide text-white/60">
            100% Free · Accessible to All
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-[2.75rem]">
            Ready to accelerate your career with guidance from top
            practitioners?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/70">
            Join thousands of aspiring tech talents receiving tailored, weekly
            guidance from vetted volunteer mentors.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/mentors"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90"
            >
              Find a Free Mentor
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/join/mentor"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Volunteer to Mentor
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

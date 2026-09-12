import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { offerings } from "../../data/offerings";
import OfferingCard from "./OfferingCard";

const MissionSection = () => {
  return (
    <section className="px-3 py-6 sm:px-6">
      <div className="rounded-[28px] border border-line bg-white p-6 sm:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div>
            <p className="text-sm font-medium text-muted">Offerings</p>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
              Your Growth, Our Mission
            </h2>
            <p className="mt-3 max-w-sm text-base leading-relaxed text-muted">
              Tailored 1:1 sessions and community programs designed to
              unlock your potential with zero paywalls and 100% voluntary
              guidance.
            </p>
            <Link
              to="/mentors"
              className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Book a Free Session
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {offerings.map((offering) => (
              <OfferingCard key={offering.id} offering={offering} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;

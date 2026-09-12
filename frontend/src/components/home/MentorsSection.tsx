import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { mentors } from "../../data/mentors";
import { useMentorFilterStore } from "../../store/useMentorFilterStore";
import MentorCard from "./MentorCard";
import MentorFilterTabs from "./MentorFilterTabs";

const MentorsSection = () => {
  const activeFilter = useMentorFilterStore((state) => state.activeFilter);

  const filteredMentors = useMemo(() => {
    const list =
      activeFilter === "All Mentors"
        ? mentors
        : mentors.filter((mentor) => mentor.category === activeFilter);
    return list.slice(0, 4);
  }, [activeFilter]);

  return (
    <section className="px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-lg">
            <h2 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
              Gain insights from our exceptional mentors
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              Our incredible global mentors and industry practitioners
              volunteer their time 100% free to accelerate your career
              transition.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent-green/10 px-3 py-1.5 text-sm font-medium text-accent-green">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
            1,200+ Available
          </span>
        </div>

        <div className="mt-8">
          <MentorFilterTabs />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredMentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <p className="mt-10 text-center text-sm text-muted">
            No mentors in this category yet — check back soon.
          </p>
        )}

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-cream-dark"
          >
            Explore all 1,200+ volunteer mentors across all stacks
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MentorsSection;

import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BadgeCheck, X, HandCoins } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import MentorListCard from "../components/mentors/MentorListCard";
import MentorFiltersSidebar from "../components/mentors/MentorFiltersSidebar";
import { mentors } from "../data/mentors";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { technicalTracks } from "../data/onboarding/technicalTracks";
import { statusOptions } from "../data/onboarding/statusOptions";
import type { MentorCategory } from "../types/mentor";

const buildMatchFilters = (): string[] => {
  const state = useOnboardingStore.getState();
  const trackLabels = technicalTracks
    .filter((track) => state.technicalTracks.includes(track.id))
    .map((track) => track.label);
  const statusLabel = statusOptions.find((option) => option.id === state.status)?.title;
  const filters = [...(statusLabel ? [statusLabel] : []), ...trackLabels];
  if (state.proficiency === "beginner") filters.push("Beginner friendly");
  return filters;
};

const BrowseMentorsPage = () => {
  const location = useLocation();
  const isPersonalized = Boolean((location.state as { matched?: boolean } | null)?.matched);

  const fullName = useOnboardingStore((state) => state.fullName);
  const technicalTrackIds = useOnboardingStore((state) => state.technicalTracks);

  const [activeMatchFilters, setActiveMatchFilters] = useState<string[]>(buildMatchFilters);
  const [skillQuery, setSkillQuery] = useState("");
  const [selectedDisciplines, setSelectedDisciplines] = useState<MentorCategory[]>([]);
  const [availableOnly, setAvailableOnly] = useState(false);

  const firstName = fullName.split(" ")[0] || "there";
  const trackLabels = technicalTracks
    .filter((track) => technicalTrackIds.includes(track.id))
    .map((track) => track.label);

  const filteredMentors = useMemo(() => {
    const query = skillQuery.trim().toLowerCase();

    let list = mentors.filter((mentor) => {
      const matchesQuery =
        query.length === 0 ||
        mentor.name.toLowerCase().includes(query) ||
        mentor.company.toLowerCase().includes(query) ||
        mentor.role.toLowerCase().includes(query) ||
        mentor.tags.some((tag) => tag.toLowerCase().includes(query));

      const matchesDiscipline =
        selectedDisciplines.length === 0 || selectedDisciplines.includes(mentor.category);

      const matchesAvailability = !availableOnly || mentor.available;

      return matchesQuery && matchesDiscipline && matchesAvailability;
    });

    if (isPersonalized) {
      list = [...list].sort((a, b) => b.matchScore - a.matchScore);
    }

    return list;
  }, [skillQuery, selectedDisciplines, availableOnly, isPersonalized]);

  const toggleDiscipline = (discipline: MentorCategory) => {
    setSelectedDisciplines((current) =>
      current.includes(discipline)
        ? current.filter((item) => item !== discipline)
        : [...current, discipline],
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header variant="solid" />

      <main className="flex-1 px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-7xl">
          {isPersonalized ? (
            <div className="rounded-3xl border border-surface-line bg-white p-6 sm:p-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-blue/10 px-3 py-1.5 text-xs font-semibold text-accent-blue">
                <BadgeCheck size={14} />
                Onboarding Complete &middot; Profile Activated
              </span>

              <h1 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
                Welcome to Pathfind, {firstName}.
              </h1>
              <p className="mt-2 max-w-2xl text-base text-ink/60">
                Here are {mentors.length} vetted mentors matched to your career transition
                goals{trackLabels.length > 0 ? ` in ${trackLabels.join(" & ")}` : ""}.
              </p>

              {activeMatchFilters.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-surface-line pt-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                    Active match filters:
                  </span>
                  {activeMatchFilters.map((filter) => (
                    <span
                      key={filter}
                      className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      {filter}
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMatchFilters((current) =>
                            current.filter((item) => item !== filter),
                          )
                        }
                        aria-label={`Remove ${filter} filter`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => setActiveMatchFilters(buildMatchFilters())}
                    className="text-xs font-medium text-accent-blue hover:underline"
                  >
                    Reset match criteria
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-sm text-ink/50">
                <Link to="/profile" className="hover:text-ink">
                  Dashboard
                </Link>{" "}
                &gt; <span className="font-medium text-ink">Find a Mentor</span>
              </p>
              <h1 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">
                Find a Mentor
              </h1>
              <p className="mt-2 max-w-2xl text-base text-ink/60">
                Explore verified senior tech professionals offering 1:1 volunteer
                mentorship sessions. Filter by domain, skills, or company.
              </p>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
            <MentorFiltersSidebar
              skillQuery={skillQuery}
              onSkillQueryChange={setSkillQuery}
              selectedDisciplines={selectedDisciplines}
              onToggleDiscipline={toggleDiscipline}
              availableOnly={availableOnly}
              onToggleAvailableOnly={() => setAvailableOnly((value) => !value)}
              onClearAll={() => {
                setSelectedDisciplines([]);
                setAvailableOnly(false);
                setSkillQuery("");
              }}
            />

            <div>
              <p className="text-sm text-ink/60">
                {filteredMentors.length} curated mentor
                {filteredMentors.length === 1 ? "" : "s"} found
              </p>

              <div className="mt-3 flex flex-col gap-4">
                {filteredMentors.map((mentor) => (
                  <MentorListCard
                    key={mentor.id}
                    mentor={mentor}
                    showMatchBadge={isPersonalized && trackLabels.length > 0 && mentor.matchScore >= 90}
                  />
                ))}

                {filteredMentors.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-surface-line bg-white p-10 text-center text-sm text-ink/60">
                    No mentors match your current filters — try clearing a few.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-accent-blue/5 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-accent-blue">
                <HandCoins size={18} strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-sm font-bold text-ink">The Pathfind Pledge</p>
                <p className="mt-0.5 text-sm text-ink/60">
                  Every session on Pathfind is completely voluntary, free of charge,
                  and strictly educational.
                </p>
              </div>
            </div>
            <Link
              to="/honor-code"
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-surface-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface"
            >
              Read Our Honor Code
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BrowseMentorsPage;

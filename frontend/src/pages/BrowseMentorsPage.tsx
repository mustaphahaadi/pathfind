import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BadgeCheck, X, HandCoins, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import MentorListCard from "../components/mentors/MentorListCard";
import MentorFiltersSidebar from "../components/mentors/MentorFiltersSidebar";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { technicalTracks } from "../data/onboarding/technicalTracks";
import { statusOptions } from "../data/onboarding/statusOptions";
import { api } from "../lib/api";
import type { MentorProfileRead } from "../types/api";
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

/** Maps frontend discipline labels → actual expertise_tags keywords stored in the DB.
 *  Derived from seeded mentor data to guarantee every checkbox returns results.
 */
const disciplineKeywordMap: Record<string, string[]> = {
  // Software engineers: Backend, Frontend, DevOps, Data Engineers
  "Software Engineering": [
    "Python", "FastAPI", "PostgreSQL", "AWS",
    "React", "TypeScript", "JavaScript", "HTML/CSS",
    "Java", "Spring Boot", "APIs",
    "Docker", "CI/CD", "Linux", "Cloud Infrastructure",
    "Node", "Go", "Ruby", "GraphQL",
  ],
  // UX/UI designers
  "UX & Product Design": [
    "Figma", "UX Research", "Wireframing", "Design Systems",
    "UX", "UI", "User Experience", "Prototyping",
  ],
  // Product managers
  "Product Management": [
    "Product Strategy", "Agile", "User Research", "Product Discovery",
    "Roadmap", "Scrum", "Stakeholder",
  ],
  // Brand/design – overlaps with UX seed data
  "Brand & Design Systems": [
    "Design Systems", "Figma", "Branding", "Visual Design",
    "Illustration", "Typography",
  ],
  // Technical writers – no dedicated seed yet, search on writing-adjacent tags
  "Technical Writing": [
    "Technical Writing", "Documentation", "API Docs", "Developer Relations",
    "Markdown", "Content",
  ],
  // Data analysts and data scientists
  "Data & Analytics": [
    "SQL", "Power BI", "Excel", "Data Visualization",
    "Python", "Machine Learning", "Statistics", "Data Analysis",
    "Tableau", "BigQuery", "dbt",
  ],
  // Cloud and DevOps engineers
  "Cloud & DevOps": [
    "AWS", "Docker", "CI/CD", "Linux", "Cloud Infrastructure",
    "Kubernetes", "Terraform", "GCP", "Azure", "Jenkins",
  ],
};

/** Converts a list of selected discipline labels into OR-searched keywords for the API. */
const disciplinesToExpertiseQuery = (disciplines: string[]): string | undefined => {
  if (disciplines.length === 0) return undefined;
  const keywords = disciplines.flatMap((d) => disciplineKeywordMap[d] ?? [d]);
  // Deduplicate
  return [...new Set(keywords)].join(",");
};

const BrowseMentorsPage = () => {
  const location = useLocation();
  const isPersonalized = Boolean((location.state as { matched?: boolean } | null)?.matched);

  const fullName = useOnboardingStore((state) => state.fullName);
  const technicalTrackIds = useOnboardingStore((state) => state.technicalTracks);

  const [activeMatchFilters, setActiveMatchFilters] = useState<string[]>(buildMatchFilters);
  const [skillQuery, setSkillQuery] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [availableOnly, setAvailableOnly] = useState(false);

  const [mentors, setMentors] = useState<MentorProfileRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const firstName = fullName.split(" ")[0] || "there";
  const trackLabels = technicalTracks
    .filter((track) => technicalTrackIds.includes(track.id))
    .map((track) => track.label);

  // Fetch mentors from the real API
  useEffect(() => {
    let cancelled = false;
    const fetchMentors = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const result = await api.mentors.list({
          query: skillQuery || undefined,
          expertise: disciplinesToExpertiseQuery(selectedExpertise),
          verified_only: true,
          limit: 50,
        });
        if (!cancelled) setMentors(result);
      } catch (err) {
        if (!cancelled)
          setLoadError(err instanceof Error ? err.message : "Failed to load mentors.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const timer = setTimeout(fetchMentors, 300); // debounce
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [skillQuery, selectedExpertise, availableOnly]);

  // Client-side filter for availability when availableOnly is toggled
  const filteredMentors = useMemo(
    () =>
      availableOnly
        ? mentors.filter((m) => m.availability?.toLowerCase().includes("available"))
        : mentors,
    [mentors, availableOnly],
  );

  const toggleExpertise = (label: string) => {
    setSelectedExpertise((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );
  };

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [skillQuery, selectedExpertise, availableOnly]);

  const totalPages = Math.ceil(filteredMentors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedMentors = filteredMentors.slice(startIndex, endIndex);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header variant="solid" />

      <main className="flex-1 px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Personalized banner */}
          {isPersonalized && activeMatchFilters.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent-blue/20 bg-accent-blue/5 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <BadgeCheck size={16} className="text-accent-blue" />
                <span className="text-sm font-semibold text-ink">
                  Matched for {firstName} based on:
                </span>
                {activeMatchFilters.map((filter) => (
                  <span
                    key={filter}
                    className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-ink"
                  >
                    {filter}
                    <button
                      type="button"
                      onClick={() =>
                        setActiveMatchFilters((f) => f.filter((item) => item !== filter))
                      }
                      className="text-ink/40 hover:text-ink"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              {trackLabels.length > 0 && (
                <span className="text-xs text-ink/50">
                  Showing mentors aligned with: {trackLabels.join(", ")}
                </span>
              )}
            </div>
          )}

          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">
                {isPersonalized ? `Your Mentor Matches, ${firstName}` : "Explore Mentors"}
              </h1>
              <p className="mt-1 text-sm text-ink/60">
                {loading ? "Loading…" : `${filteredMentors.length} verified volunteer mentor${filteredMentors.length !== 1 ? "s" : ""} available`}
              </p>
            </div>
            <Link
              to="/join"
              className="hidden shrink-0 items-center gap-1.5 rounded-xl border border-surface-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface sm:inline-flex"
            >
              <HandCoins size={16} className="text-accent-green" />
              Become a Mentor
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
            {/* Sidebar filters */}
            <MentorFiltersSidebar
              skillQuery={skillQuery}
              onSkillQueryChange={setSkillQuery}
              selectedDisciplines={selectedExpertise as MentorCategory[]}
              onToggleDiscipline={toggleExpertise as (discipline: MentorCategory) => void}
              availableOnly={availableOnly}
              onToggleAvailableOnly={() => setAvailableOnly((prev) => !prev)}
              onClearAll={() => {
                setSelectedExpertise([]);
                setAvailableOnly(false);
              }}
            />

            {/* Mentor list */}
            <div>
              {loading && (
                <div className="flex items-center justify-center py-20">
                  <Loader2 size={28} className="animate-spin text-ink/30" />
                </div>
              )}
              {loadError && (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
                  <p className="text-sm font-semibold text-red-700">{loadError}</p>
                  <p className="mt-1 text-xs text-red-500">
                    Make sure the backend server is running on localhost:8000.
                  </p>
                </div>
              )}
              {!loading && !loadError && (
                <>
                  {filteredMentors.length === 0 ? (
                    <div className="rounded-2xl border border-surface-line bg-white p-10 text-center">
                      <p className="text-sm font-semibold text-ink">No mentors found</p>
                      <p className="mt-1 text-sm text-ink/60">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {displayedMentors.map((mentor) => (
                        <MentorListCard key={mentor.user_id} mentor={mentor} />
                      ))}

                      {/* Pagination Bar */}
                      {totalPages > 1 && (
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-surface-line bg-white p-4 shadow-xs">
                          <p className="text-xs font-semibold text-ink/60">
                            Showing <span className="text-ink font-bold">{startIndex + 1}–{Math.min(endIndex, filteredMentors.length)}</span> of <span className="text-ink font-bold">{filteredMentors.length}</span> mentors
                          </p>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={currentPage === 1}
                              onClick={() => {
                                setCurrentPage((p) => Math.max(1, p - 1));
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="inline-flex items-center justify-center rounded-xl border border-surface-line bg-white px-3 py-1.5 text-xs font-bold text-ink hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              <ChevronLeft size={15} className="mr-1" /> Prev
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                              <button
                                key={pageNum}
                                type="button"
                                onClick={() => {
                                  setCurrentPage(pageNum);
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className={`h-7 w-7 rounded-xl text-xs font-bold transition-all ${
                                  pageNum === currentPage
                                    ? "bg-slate-900 text-white shadow-xs"
                                    : "border border-surface-line bg-white text-ink hover:bg-surface"
                                }`}
                              >
                                {pageNum}
                              </button>
                            ))}
                            <button
                              type="button"
                              disabled={currentPage === totalPages}
                              onClick={() => {
                                setCurrentPage((p) => Math.min(totalPages, p + 1));
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="inline-flex items-center justify-center rounded-xl border border-surface-line bg-white px-3 py-1.5 text-xs font-bold text-ink hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              Next <ChevronRight size={15} className="ml-1" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BrowseMentorsPage;

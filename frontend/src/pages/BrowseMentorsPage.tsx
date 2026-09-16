import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BadgeCheck, X, HandCoins, Loader2 } from "lucide-react";
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

const BrowseMentorsPage = () => {
  const location = useLocation();
  const isPersonalized = Boolean((location.state as { matched?: boolean } | null)?.matched);

  const fullName = useOnboardingStore((state) => state.fullName);
  const technicalTrackIds = useOnboardingStore((state) => state.technicalTracks);

  const [activeMatchFilters, setActiveMatchFilters] = useState<string[]>(buildMatchFilters);
  const [skillQuery, setSkillQuery] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);

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
          expertise: selectedExpertise.length > 0 ? selectedExpertise[0] : undefined,
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
  }, [skillQuery, selectedExpertise]);

  const filteredMentors = useMemo(() => mentors, [mentors]);

  const toggleExpertise = (label: string) => {
    setSelectedExpertise((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );
  };

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
              availableOnly={false}
              onToggleAvailableOnly={() => {}}
              onClearAll={() => setSelectedExpertise([])}
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
                      {filteredMentors.map((mentor) => (
                        <MentorListCard key={mentor.user_id} mentor={mentor} />
                      ))}
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

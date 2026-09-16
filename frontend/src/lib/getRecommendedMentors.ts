import { mentors } from "../data/mentors";
import type { Mentor } from "../types/mentor";

/** Mentors matching the person's chosen tracks first, then the rest, sorted by match score. */
export const getRecommendedMentors = (
  trackIds: string[],
  limit = 4,
  customMentors?: Mentor[],
): Mentor[] => {
  const sourceList = customMentors && customMentors.length > 0 ? customMentors : mentors;
  const byScore = (a: Mentor, b: Mentor) => b.matchScore - a.matchScore;

  if (trackIds.length === 0) {
    return [...sourceList].sort(byScore).slice(0, limit);
  }

  const matched = sourceList.filter((mentor) => trackIds.includes(mentor.trackId)).sort(byScore);
  const rest = sourceList.filter((mentor) => !trackIds.includes(mentor.trackId)).sort(byScore);
  return [...matched, ...rest].slice(0, limit);
};

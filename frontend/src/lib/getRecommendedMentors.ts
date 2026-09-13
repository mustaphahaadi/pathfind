import { mentors } from "../data/mentors";
import type { Mentor } from "../types/mentor";

/** Mentors matching the person's chosen tracks first, then the rest, sorted by match score. */
export const getRecommendedMentors = (trackIds: string[], limit = 4): Mentor[] => {
  const byScore = (a: Mentor, b: Mentor) => b.matchScore - a.matchScore;

  if (trackIds.length === 0) {
    return [...mentors].sort(byScore).slice(0, limit);
  }

  const matched = mentors.filter((mentor) => trackIds.includes(mentor.trackId)).sort(byScore);
  const rest = mentors.filter((mentor) => !trackIds.includes(mentor.trackId)).sort(byScore);
  return [...matched, ...rest].slice(0, limit);
};

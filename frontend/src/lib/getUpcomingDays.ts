export interface UpcomingDay {
  /** ISO date string, used as a stable key. */
  iso: string;
  weekdayShort: string;
  dayNumber: number;
  /** e.g. "Thursday, November 14" */
  fullLabel: string;
}

/** Generates the next `count` calendar days starting today, for a lightweight date picker. */
export const getUpcomingDays = (count = 7): UpcomingDay[] => {
  const days: UpcomingDay[] = [];
  const today = new Date();

  for (let i = 0; i < count; i += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      iso: date.toISOString().slice(0, 10),
      weekdayShort: date.toLocaleDateString(undefined, { weekday: "short" }),
      dayNumber: date.getDate(),
      fullLabel: date.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    });
  }

  return days;
};

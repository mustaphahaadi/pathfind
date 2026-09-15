const parseTimeToMinutes = (time: string): number => {
  const match = time.match(/(\d+):(\d+)\s?(AM|PM)/i);
  if (!match) return 0;
  const hours12 = parseInt(match[1], 10) % 12;
  const minutes = parseInt(match[2], 10);
  const isPM = match[3].toUpperCase() === "PM";
  return (isPM ? hours12 + 12 : hours12) * 60 + minutes;
};

/** How many sessionMinutes-long calls fit between two 12-hour time labels (e.g. "6:00 PM"). */
export const getSessionCapacity = (start: string, end: string, sessionMinutes = 45): number => {
  const duration = parseTimeToMinutes(end) - parseTimeToMinutes(start);
  return duration > 0 ? Math.floor(duration / sessionMinutes) : 0;
};

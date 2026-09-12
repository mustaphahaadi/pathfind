export interface BookedSession {
  id: string;
  mentorId: string;
  dateLabel: string;
  timeLabel: string;
  durationMinutes: number;
  focusTopicLabels: string[];
  note: string;
  videoLink: string;
  createdAt: string;
}

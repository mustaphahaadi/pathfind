import { CalendarDays, CheckCircle2 } from "lucide-react";
import { Button } from "./Button";
import type { Mentor } from "../types/mentor";

export function MentorCard({ mentor }: { mentor: Mentor }) {
  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex gap-5">
        <div className="relative size-28 shrink-0 overflow-hidden rounded-xl sm:size-36">
          <img src={mentor.imageUrl} alt={mentor.name} className="h-full w-full object-cover" />
          <span
            className={`absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-[9px] font-semibold ${
              mentor.available ? "text-emerald-700" : "text-neutral-500"
            }`}
          >
            ● {mentor.available ? "Available" : "Unavailable"}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-xl font-bold">
                {mentor.name} <CheckCircle2 size={15} className="inline text-blue-600" fill="currentColor" />
              </h3>
              <p className="text-sm text-neutral-600">
                {mentor.role} at {mentor.company}
              </p>
            </div>
            <span className="w-fit rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold">
              ★ {mentor.rating} ({mentor.reviewCount} reviews)
            </span>
          </div>
          <p className="mt-3 line-clamp-3 text-sm leading-5 text-neutral-600">“{mentor.bio}”</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {mentor.tags.map((t: string) => (
              <span key={t} className="rounded-lg border border-neutral-200 px-2.5 py-1 text-[10px] text-neutral-600">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3 border-t pt-3 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              <CalendarDays size={14} className="mr-1 inline" />
              Next opening: <b className="text-neutral-700">{mentor.nextOpening}</b> · {mentor.sessionFormat}
            </span>
            <Button disabled={!mentor.available} className="min-h-9 rounded-lg px-4 text-xs">
              {mentor.available ? "Book Free Session →" : "Join Waitlist ♧"}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
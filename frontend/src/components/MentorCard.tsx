import { CalendarDays, CheckCircle2, Star, ArrowRight } from "lucide-react";
import { Button } from "./Button";
import type { Mentor } from "../types/mentor";

export function MentorCard({ mentor }: { mentor: Mentor }) {
  return (
    <article className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
        <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl sm:h-36 sm:w-36">
          <img src={mentor.imageUrl} alt={mentor.name} className="h-full w-full object-cover" />
          <span
            className={`absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-xs px-2.5 py-1 text-[10px] font-semibold border shadow-2xs ${
              mentor.available ? "text-emerald-700 border-emerald-200" : "text-neutral-600 border-neutral-200"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${mentor.available ? "bg-emerald-500" : "bg-neutral-400"}`} />
            {mentor.available ? "Available" : "Unavailable"}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="flex items-center gap-1.5 text-lg font-bold text-neutral-900">
                {mentor.name}
                <CheckCircle2 size={16} className="text-blue-600 fill-blue-600/10" />
              </h3>
              <p className="text-xs font-medium text-neutral-600">
                {mentor.role} at {mentor.company}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 w-fit rounded-full border border-amber-200/80 bg-amber-50/70 px-2.5 py-1 text-xs font-semibold text-amber-800">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              {mentor.rating}
              <span className="text-amber-700/60 font-normal">({mentor.reviewCount} reviews)</span>
            </span>
          </div>

          <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-neutral-600">
            &ldquo;{mentor.bio}&rdquo;
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {mentor.tags.map((t: string) => (
              <span key={t} className="rounded-md border border-neutral-200/80 bg-neutral-50 px-2 py-0.5 text-[10px] font-medium text-neutral-600">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-neutral-100 pt-3 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} className="text-neutral-400" />
              Next opening: <b className="font-semibold text-neutral-800">{mentor.nextOpening}</b> &middot; {mentor.sessionFormat}
            </span>
            <Button disabled={!mentor.available} className="min-h-9 rounded-xl px-4 text-xs font-semibold">
              {mentor.available ? (
                <span className="inline-flex items-center gap-1.5">
                  Book Free Session
                  <ArrowRight size={13} />
                </span>
              ) : (
                "Join Waitlist"
              )}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
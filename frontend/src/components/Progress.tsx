import { Check } from "lucide-react";

export function Progress({ step }: { step: 1 | 2 | 3 }) {
  const labels = ["About You", "Interests & Goals", "Experience & Readiness"];

  return (
    <div className="mb-8 flex overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-2 shadow-xs">
      {labels.map((l, i) => {
        const n = (i + 1) as 1 | 2 | 3;
        const active = n === step;
        const done = n < step;
        return (
          <div
            key={l}
            className={`flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
              active ? "bg-neutral-100/80" : ""
            }`}
          >
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                done
                  ? "bg-emerald-600 text-white"
                  : active
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-400 border border-neutral-200"
              }`}
            >
              {done ? <Check size={14} strokeWidth={2.5} /> : n}
            </span>
            <div className="min-w-0">
              <p
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  active ? "text-neutral-900" : "text-neutral-400"
                }`}
              >
                {active ? "Active step" : `Step ${n}`}
              </p>
              <p className="truncate text-xs font-semibold text-neutral-800">{l}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
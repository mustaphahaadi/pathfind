import { Check } from 'lucide-react'

export interface OnboardingStepMeta {
  step: 1 | 2 | 3
  title: string
}

const STEPS: { step: 1 | 2 | 3; label: string }[] = [
  { step: 1, label: 'About You' },
  { step: 2, label: 'Interests & Goals' },
  { step: 3, label: 'Experience & Readiness' },
]

function statusFor(step: number, current: number) {
  if (step < current) return 'done'
  if (step === current) return 'active'
  return 'upcoming'
}

function statusLabel(step: number, current: number) {
  if (step < current) return 'Completed'
  if (step === current) return current === 3 ? 'Final step' : 'In progress'
  return step === current + 1 ? 'Next step' : 'Upcoming'
}

export function StepTabs({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="grid grid-cols-1 gap-2 rounded-2xl border border-line bg-mist/60 p-2 sm:grid-cols-3">
      {STEPS.map(({ step, label }) => {
        const status = statusFor(step, current)
        return (
          <div
            key={step}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
              status === 'active' ? 'bg-white shadow-soft' : ''
            }`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                status === 'done'
                  ? 'bg-ink text-paper'
                  : status === 'active'
                    ? 'bg-ink text-paper'
                    : 'border border-line bg-white text-ink-soft/60'
              }`}
            >
              {status === 'done' ? <Check size={14} strokeWidth={3} /> : step}
            </span>
            <div className="min-w-0">
              <p
                className={`truncate text-sm font-semibold ${
                  status === 'upcoming' ? 'text-ink-soft/60' : 'text-ink'
                }`}
              >
                {label}
              </p>
              <p
                className={`text-xs font-medium uppercase tracking-wide ${
                  status === 'active'
                    ? 'text-signal'
                    : status === 'done'
                      ? 'text-moss'
                      : 'text-ink-soft/50'
                }`}
              >
                {statusLabel(step, current)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function ProgressBar({ current }: { current: 1 | 2 | 3 }) {
  const pct = Math.round((current / 3) * 100)
  return (
    <div className="h-1.5 w-32 overflow-hidden rounded-full bg-line sm:w-40">
      <div
        className="h-full rounded-full bg-ink transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

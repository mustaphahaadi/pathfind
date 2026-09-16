import { Link } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'
import { ProgressBar } from '@/components/onboarding/StepIndicator'

const STEP_LABELS: Record<1 | 2 | 3, string> = {
  1: 'About You',
  2: 'Interests & Goals',
  3: 'Experience & Readiness',
}

export function OnboardingHeader({
  step,
  skipTo,
}: {
  step: 1 | 2 | 3
  skipTo: string
}) {
  return (
    <div className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-3">
          <Logo withMark />
          <span className="hidden h-4 w-px bg-line sm:block" />
          <span className="hidden items-center gap-1.5 text-xs font-medium text-moss sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-moss" />
            100% Free Mentorship
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <div className="text-right">
            <p className="text-sm font-semibold text-ink">
              Step {step} of 3
              <span className="ml-1.5 font-normal text-ink-soft">
                · {STEP_LABELS[step]}
              </span>
            </p>
          </div>
          <ProgressBar current={step} />
          <Link
            to={skipTo}
            className="text-sm font-medium text-ink-soft hover:text-ink"
          >
            Skip for now
          </Link>
        </div>
      </div>
    </div>
  )
}

import { Outlet, useLocation } from 'react-router-dom'
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader'
import { StepTabs } from '@/components/onboarding/StepIndicator'
import { MinimalFooter } from '@/components/layout/Footer'

const STEP_BY_PATH: Record<string, 1 | 2 | 3> = {
  'about-you': 1,
  'interests-goals': 2,
  'experience-readiness': 3,
}

export function OnboardingLayout() {
  const { pathname } = useLocation()
  const slug = pathname.split('/').filter(Boolean).pop() ?? 'about-you'
  const step = STEP_BY_PATH[slug] ?? 1

  return (
    <div className="flex min-h-screen flex-col bg-mist">
      <OnboardingHeader step={step} skipTo="/mentors" />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
          <StepTabs current={step} />

          <div className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-10">
            <Outlet />
          </div>
        </div>
      </main>

      <MinimalFooter />
    </div>
  )
}

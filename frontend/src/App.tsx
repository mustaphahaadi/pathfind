import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LandingPage } from '@/pages/LandingPage'
import { JoinPage } from '@/pages/JoinPage'
import { MenteeSignupPage } from '@/pages/MenteeSignupPage'
import { MentorSignupPage } from '@/pages/MentorSignupPage'
import { SignInPage } from '@/pages/SignInPage'
import { MentorsPlaceholderPage } from '@/pages/MentorsPlaceholderPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { OnboardingLayout } from '@/pages/onboarding/OnboardingLayout'
import { AboutYouStep } from '@/pages/onboarding/AboutYouStep'
import { InterestsGoalsStep } from '@/pages/onboarding/InterestsGoalsStep'
import { ExperienceReadinessStep } from '@/pages/onboarding/ExperienceReadinessStep'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/signup/mentee" element={<MenteeSignupPage />} />
        <Route path="/signup/mentor" element={<MentorSignupPage />} />
        <Route path="/mentors" element={<MentorsPlaceholderPage />} />

        <Route path="/onboarding" element={<OnboardingLayout />}>
          <Route index element={<Navigate to="about-you" replace />} />
          <Route path="about-you" element={<AboutYouStep />} />
          <Route path="interests-goals" element={<InterestsGoalsStep />} />
          <Route
            path="experience-readiness"
            element={<ExperienceReadinessStep />}
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

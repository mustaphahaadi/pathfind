import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import OnboardingStepper from "../components/onboarding/OnboardingStepper";
import { mentorOnboardingSteps } from "../data/mentor-onboarding/steps";

const MentorOnboardingLayout = () => {
  const location = useLocation();
  const currentStepIndex = Math.max(
    0,
    mentorOnboardingSteps.findIndex((step) => location.pathname.endsWith(step.path)),
  );
  const currentStep = mentorOnboardingSteps[currentStepIndex];

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header variant="solid" />

      <main className="flex-1 px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-blue/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-accent-blue">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-blue" />
            Volunteer Mentor Application
          </span>

          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            {currentStep.heading}
          </h1>
          <p className="mt-1 max-w-2xl text-base text-ink/60">{currentStep.subtitle}</p>

          <div className="mt-6">
            <OnboardingStepper steps={mentorOnboardingSteps} currentStepIndex={currentStepIndex} />
          </div>

          <div className="mt-6">
            <Outlet />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MentorOnboardingLayout;

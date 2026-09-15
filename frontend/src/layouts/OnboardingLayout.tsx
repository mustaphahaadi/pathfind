import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/layout/Footer";
import OnboardingProgressHeader from "../components/onboarding/OnboardingProgressHeader";
import OnboardingStepper from "../components/onboarding/OnboardingStepper";
import { onboardingSteps } from "../data/onboarding/steps";

const OnboardingLayout = () => {
  const location = useLocation();
  const currentStepIndex = Math.max(
    0,
    onboardingSteps.findIndex((step) =>
      location.pathname.endsWith(step.path),
    ),
  );

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <OnboardingProgressHeader currentStepIndex={currentStepIndex} />

      <main className="flex-1 px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <OnboardingStepper steps={onboardingSteps} currentStepIndex={currentStepIndex} />

          <div className="mt-6 rounded-3xl border border-surface-line bg-white p-6 sm:p-10">
            <Outlet />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OnboardingLayout;

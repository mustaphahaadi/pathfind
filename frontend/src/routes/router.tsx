import { createBrowserRouter, Navigate } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import SignInPage from "../pages/SignInPage";
import JoinPage from "../pages/JoinPage";
import MenteeSignUpPage from "../pages/MenteeSignUpPage";
import MentorSignUpPage from "../pages/MentorSignUpPage";
import ProfilePage from "../pages/ProfilePage";
import MentorDashboardPage from "../pages/MentorDashboardPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import BrowseMentorsPage from "../pages/BrowseMentorsPage";
import MentorProfilePage from "../pages/MentorProfilePage";
import ScheduleSessionPage from "../pages/ScheduleSessionPage";
import BookingConfirmedPage from "../pages/BookingConfirmedPage";
import PlaceholderPage from "../pages/PlaceholderPage";

import AboutPage from "../pages/AboutPage";
import HowItWorksPage from "../pages/HowItWorksPage";
import VolunteerPage from "../pages/VolunteerPage";
import HonorCodePage from "../pages/HonorCodePage";
import GuidelinesPage from "../pages/GuidelinesPage";
import PrivacyPage from "../pages/PrivacyPage";
import TermsPage from "../pages/TermsPage";

import AboutYouStep from "../pages/onboarding/AboutYouStep";
import InterestsGoalsStep from "../pages/onboarding/InterestsGoalsStep";
import ExperienceReadinessStep from "../pages/onboarding/ExperienceReadinessStep";
import IdentityVerificationStep from "../pages/mentor-onboarding/IdentityVerificationStep";
import DomainSkillsStep from "../pages/mentor-onboarding/DomainSkillsStep";
import AvailabilityCapacityStep from "../pages/mentor-onboarding/AvailabilityCapacityStep";
import HonorCodeReviewStep from "../pages/mentor-onboarding/HonorCodeReviewStep";
import MentorProfileCreatedPage from "../pages/mentor-onboarding/MentorProfileCreatedPage";

import AuthLayout from "../layouts/AuthLayout";
import OnboardingLayout from "../layouts/OnboardingLayout";
import MentorOnboardingLayout from "../layouts/MentorOnboardingLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/how-it-works",
    element: <HowItWorksPage />,
  },
  {
    path: "/volunteer",
    element: <VolunteerPage />,
  },
  {
    path: "/honor-code",
    element: <HonorCodePage />,
  },
  {
    path: "/community-guidelines",
    element: <GuidelinesPage />,
  },
  {
    path: "/privacy",
    element: <PrivacyPage />,
  },
  {
    path: "/terms",
    element: <TermsPage />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <SignInPage />,
      },
    ],
  },
  {
    path: "/join",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <JoinPage />,
      },
    ],
  },
  {
    path: "/join/mentee",
    element: <MenteeSignUpPage />,
  },
  {
    path: "/join/mentor",
    element: <MentorSignUpPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/mentor-dashboard",
    element: <MentorDashboardPage />,
  },
  {
    path: "/admin",
    element: <AdminDashboardPage />,
  },
  {
    path: "/mentors",
    element: <BrowseMentorsPage />,
  },
  {
    path: "/mentors/:mentorId",
    element: <MentorProfilePage />,
  },
  {
    path: "/mentors/:mentorId/schedule",
    element: <ScheduleSessionPage />,
  },
  {
    path: "/booking-confirmed",
    element: <BookingConfirmedPage />,
  },
  {
    path: "/onboarding/mentee",
    element: <OnboardingLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="about-you" replace />,
      },
      {
        path: "about-you",
        element: <AboutYouStep />,
      },
      {
        path: "interests-goals",
        element: <InterestsGoalsStep />,
      },
      {
        path: "experience-readiness",
        element: <ExperienceReadinessStep />,
      },
    ],
  },
  {
    path: "/onboarding/mentor/complete",
    element: <MentorProfileCreatedPage />,
  },
  {
    path: "/onboarding/mentor",
    element: <MentorOnboardingLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="identity-verification" replace />,
      },
      {
        path: "identity-verification",
        element: <IdentityVerificationStep />,
      },
      {
        path: "domain-skills",
        element: <DomainSkillsStep />,
      },
      {
        path: "availability-capacity",
        element: <AvailabilityCapacityStep />,
      },
      {
        path: "honor-code-review",
        element: <HonorCodeReviewStep />,
      },
    ],
  },
  {
    path: "*",
    element: (
      <PlaceholderPage
        title="Page not found"
        description="The page you're looking for doesn't exist or has moved."
      />
    ),
  },
]);

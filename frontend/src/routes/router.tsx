import { createBrowserRouter, Navigate } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import SignInPage from "../pages/SignInPage";
import JoinPage from "../pages/JoinPage";
import MenteeSignUpPage from "../pages/MenteeSignUpPage";
import MentorSignUpPage from "../pages/MentorSignUpPage";
import ProfilePage from "../pages/ProfilePage";
import MentorDashboardPage from "../pages/MentorDashboardPage";
import BrowseMentorsPage from "../pages/BrowseMentorsPage";
import MentorProfilePage from "../pages/MentorProfilePage";
import ScheduleSessionPage from "../pages/ScheduleSessionPage";
import BookingConfirmedPage from "../pages/BookingConfirmedPage";
import PlaceholderPage from "../pages/PlaceholderPage";
import AboutYouStep from "../pages/onboarding/AboutYouStep";
import InterestsGoalsStep from "../pages/onboarding/InterestsGoalsStep";
import ExperienceReadinessStep from "../pages/onboarding/ExperienceReadinessStep";
import IdentityVerificationStep from "../pages/mentor-onboarding/IdentityVerificationStep";
import DomainSkillsStep from "../pages/mentor-onboarding/DomainSkillsStep";
import AvailabilityCapacityStep from "../pages/mentor-onboarding/AvailabilityCapacityStep";
import HonorCodeReviewStep from "../pages/mentor-onboarding/HonorCodeReviewStep";
import MentorProfileCreatedPage from "../pages/mentor-onboarding/MentorProfileCreatedPage";

import AuthLayout from "../layouts/AuthLayout";
import ContentLayout from "../layouts/ContentLayout";
import OnboardingLayout from "../layouts/OnboardingLayout";
import MentorOnboardingLayout from "../layouts/MentorOnboardingLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
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
    element: <ContentLayout />,
    children: [
      {
        path: "/about",
        element: (
          <PlaceholderPage
            title="About Us"
            description="The story behind Pathfind and the community of volunteer mentors making tech careers accessible to everyone."
          />
        ),
      },
      {
        path: "/how-it-works",
        element: (
          <PlaceholderPage
            title="How It Works"
            description="From matching to your first session — here's how free mentorship on Pathfind actually works."
          />
        ),
      },
      {
        path: "/stories",
        element: (
          <PlaceholderPage
            title="Stories"
            description="Real career transitions from mentees who broke into tech with a Pathfind mentor by their side."
          />
        ),
      },
      {
        path: "/community-guidelines",
        element: (
          <PlaceholderPage
            title="Community Guidelines"
            description="Our expectations for a safe, respectful, and generous mentorship experience."
          />
        ),
      },
      {
        path: "/honor-code",
        element: (
          <PlaceholderPage
            title="Honor Code"
            description="The commitments every mentor and mentee makes when they join Pathfind."
          />
        ),
      },
      {
        path: "/terms",
        element: (
          <PlaceholderPage
            title="Terms of Service"
            description="The terms that govern your use of Pathfind."
          />
        ),
      },
      {
        path: "/open-source",
        element: (
          <PlaceholderPage
            title="Open Source"
            description="Pathfind is built in the open. Explore the projects powering the platform."
          />
        ),
      },
      {
        path: "/privacy",
        element: (
          <PlaceholderPage
            title="Privacy"
            description="How Pathfind collects, uses, and protects your information."
          />
        ),
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
    ],
  },
]);

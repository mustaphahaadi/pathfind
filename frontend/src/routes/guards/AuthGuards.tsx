import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { useMentorOnboardingStore } from "../../store/useMentorOnboardingStore";

/** Returns true if there is an active session (token, mentor store, or mentee store). */
export function useIsAuthenticated() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const menteeName = useOnboardingStore((s) => s.fullName);
  const mentorHasCompleted = useMentorOnboardingStore((s) => s.hasCompletedOnboarding);
  const mentorName = useMentorOnboardingStore((s) => s.fullName);

  const isAuthSignedIn = !!token || !!user;
  const isMenteeSignedIn = menteeName.trim().length > 0;
  const isMentorSignedIn = mentorHasCompleted || mentorName.trim().length > 0;

  return isAuthSignedIn || isMenteeSignedIn || isMentorSignedIn;
}

/** Route guard that protects pages requiring user authentication. */
export function ProtectedRoute() {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}

/** Route guard that prevents already logged-in users from viewing Sign In / Sign Up pages. */
export function GuestOnlyRoute() {
  const isAuthenticated = useIsAuthenticated();
  const user = useAuthStore((s) => s.user);
  const mentorHasCompleted = useMentorOnboardingStore((s) => s.hasCompletedOnboarding);

  if (isAuthenticated) {
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    if (user?.role === "mentor" || mentorHasCompleted) {
      return <Navigate to="/mentor-dashboard" replace />;
    }
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}

/** Route guard that strictly restricts access to Admin role users. */
export function AdminRoute() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  if (!token || user?.role !== "admin") {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}

/** Route guard restricting access to Mentors. */
export function MentorRoute() {
  const isAuthenticated = useIsAuthenticated();
  const user = useAuthStore((s) => s.user);
  const mentorHasCompleted = useMentorOnboardingStore((s) => s.hasCompletedOnboarding);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (user?.role !== "mentor" && !mentorHasCompleted && user?.role !== "admin") {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}

import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

/**
 * Authentication is determined solely by the presence of a valid JWT token
 * and a hydrated user object in the auth store. Onboarding store state is
 * NOT a substitute for authentication — it only controls UI flow within an
 * already-authenticated session.
 */
function useIsAuthenticated() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  return !!token && !!user;
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

  if (isAuthenticated) {
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    if (user?.role === "mentor") {
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

  if (!token || !user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}

/** Route guard restricting access to Mentors (and Admins). */
export function MentorRoute() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  if (!token || !user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role !== "mentor" && user.role !== "admin") {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}

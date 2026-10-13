import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth";

export function Protected({ children, admin }: { children: React.ReactNode; admin?: boolean }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p className="text-stone-500">Loading…</p>;
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (admin && user.role !== "ADMIN") {
    return <Navigate to="/projects" replace />;
  }
  return <>{children}</>;
}

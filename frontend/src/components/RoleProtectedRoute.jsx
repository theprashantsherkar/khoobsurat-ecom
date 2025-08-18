import { useAuth } from "../context/AuthContext.jsx";
import { Navigate } from "react-router-dom";

export default function RoleProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    // If user role not allowed, redirect to an unauthorized page or /role
    return <Navigate to="/role" replace />;
  }

  return children;
}

import { Routes, Route, Navigate } from "react-router-dom";
import Manufacturing from "./pages/Manufacturing.jsx";
import Sales from "./pages/Sales.jsx";
import Dispatch from "./pages/Dispatch.jsx";
import RoleSelection from "./pages/RoleSelection.jsx";
import RoleProtectedRoute from "./components/RoleProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Team from "./pages/Team.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route path="/role" element={<ProtectedRoute><RoleSelection /></ProtectedRoute>} />

<Route
  path="/sales"
  element={
    <RoleProtectedRoute allowedRoles={["sales", "admin"]}>
      <Sales />
    </RoleProtectedRoute>
  }
/>

<Route
  path="/manufacturing"
  element={
    <RoleProtectedRoute allowedRoles={["manufacturing", "admin"]}>
      <Manufacturing />
    </RoleProtectedRoute>
  }
/>

<Route
  path="/dispatch"
  element={
    <RoleProtectedRoute allowedRoles={["manufacturing", "sales", "admin"]}>
      <Dispatch />
    </RoleProtectedRoute>
  }
/>

          <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />

          {/* Redirect default / to /role */}
          <Route path="/" element={<Navigate to="/role" replace />} />

          {/* Single wildcard fallback */}
          <Route path="*" element={<Navigate to="/role" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

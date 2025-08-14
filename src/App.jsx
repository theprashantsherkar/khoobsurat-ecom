import { Routes, Route, Navigate } from "react-router-dom";
import Manufacturing from "./pages/Manufacturing.jsx";
import Sales from "./pages/Sales.jsx";
import Dispatch from "./pages/Dispatch.jsx";
import RoleSelection from "./pages/RoleSelection.jsx";
import Login from "./pages/Login.jsx";
import Team from "./pages/Team.jsx";
import { InventoryProvider } from "./context/InventoryContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <InventoryProvider>
      <AuthProvider>
        <div className="min-h-screen bg-white">
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route
              path="/role"
              element={
                <ProtectedRoute>
                  <RoleSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manufacturing"
              element={
                <ProtectedRoute>
                  <Manufacturing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales"
              element={
                <ProtectedRoute>
                  <Sales />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dispatch"
              element={
                <ProtectedRoute>
                  <Dispatch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/team"
              element={
                <ProtectedRoute>
                  <Team />
                </ProtectedRoute>
              }
            />

            {/* Redirect default / to /role */}
            <Route path="/" element={<Navigate to="/role" replace />} />

            {/* Fallback for unmatched routes */}
            <Route path="*" element={<Navigate to="/role" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </InventoryProvider>
  );
}

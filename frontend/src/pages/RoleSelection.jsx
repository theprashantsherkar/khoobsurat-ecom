import { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function RoleSelection() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect based on user role
      if (user.role === "sales") navigate("/sales");
      else if (user.role === "manufacturing") navigate("/manufacturing");
      else if (user.role === "team") navigate("/team");
      else navigate("/role"); // fallback or admin
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Welcome to Khoobsurat
      </h1>
      <h2 className="text-2xl text-gray-800 mb-8">
        Choose your department
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
        <button
          onClick={() => navigate("/manufacturing")}
          className="bg-white shadow-lg rounded-xl p-6 text-center hover:scale-105 transition-transform border-t-4 border-blue-500"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Manufacturing
          </h2>
          <p className="text-gray-500">View and update manufacturing stock</p>
        </button>

        <button
          onClick={() => navigate("/sales")}
          className="bg-white shadow-lg rounded-xl p-6 text-center hover:scale-105 transition-transform border-t-4 border-green-500"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Sales</h2>
          <p className="text-gray-500">Manage and track sales orders</p>
        </button>

        <button
          onClick={() => navigate("/team")}
          className="bg-white shadow-lg rounded-xl p-6 text-center hover:scale-105 transition-transform border-t-4 border-purple-500"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Team</h2>
          <p className="text-gray-500">View and manage company staff</p>
        </button>
      </div>
    </div>
  );
}

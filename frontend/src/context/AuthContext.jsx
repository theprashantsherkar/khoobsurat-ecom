import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

const login = (username, password) => {
  // Example hardcoded users with roles
  const users = {
    admin: { password: "1234", role: "admin" },
    salesUser: { password: "sales", role: "sales" },
    manufUser: { password: "manuf", role: "manufacturing" },
  };

  const userData = users[username];
  if (userData && userData.password === password) {
    setUser({ username, role: userData.role });
    navigate("/role");
    return true;
  }
  return false;
};


  const logout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

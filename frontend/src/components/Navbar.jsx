import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex gap-6 px-6 py-4 bg-purple-800 text-white text-lg">
      <NavLink
        to="/manufacturing"
        className={({ isActive }) =>
          isActive ? "underline font-bold" : ""
        }
      >
        Manufacturing
      </NavLink>

      <NavLink
        to="/sales"
        className={({ isActive }) =>
          isActive ? "underline font-bold" : ""
        }
      >
        Sales
      </NavLink>

      <NavLink
        to="/dispatch"
        className={({ isActive }) =>
          isActive ? "underline font-bold" : ""
        }
      >
        Dispatch
      </NavLink>
    </nav>
  );
}

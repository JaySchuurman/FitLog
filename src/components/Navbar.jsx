import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-around bg-gray-800 p-4 border-b border-gray-700">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          isActive ? "text-orange-500 font-bold" : "text-gray-300"
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/workouts"
        className={({ isActive }) =>
          isActive ? "text-orange-500 font-bold" : "text-gray-300"
        }
      >
        Workouts
      </NavLink>
      <NavLink
        to="/progress"
        className={({ isActive }) =>
          isActive ? "text-orange-500 font-bold" : "text-gray-300"
        }
      >
        Progress
      </NavLink>
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          isActive ? "text-orange-500 font-bold" : "text-gray-300"
        }
      >
        Settings
      </NavLink>
    </nav>
  );
}

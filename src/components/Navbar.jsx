import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center bg-gray-800 p-4 border-b border-gray-700 relative overflow-visible">
      {/* Links */}
      <div className="flex space-x-4">
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
      </div>

      {/* Login / Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="bg-orange-500 text-white py-1 px-4 rounded hover:bg-orange-400 cursor-pointer"
        >
          {user ? user.email : "Login"}
        </button>

        {/* Dropdown menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded shadow-lg z-50 border border-gray-600">
            {!user && (
              <>
                <NavLink
                  to="/login"
                  className="block px-4 py-2 text-gray-200 hover:bg-gray-600"
                  onClick={() => setDropdownOpen(false)}
                >
                  Inloggen
                </NavLink>
                <NavLink
                  to="/login?mode=register"
                  className="block px-4 py-2 text-gray-200 hover:bg-gray-600"
                  onClick={() => setDropdownOpen(false)}
                >
                  Registreren
                </NavLink>
              </>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-600"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

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
    <nav className="flex flex-col sm:flex-row justify-between items-center bg-gray-800 p-3 sm:p-4 border-b border-gray-700 relative overflow-visible">
      {/* Links */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-2 sm:mb-0">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "text-orange-500 font-bold text-sm sm:text-base" : "text-gray-300 text-sm sm:text-base"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/workouts"
          className={({ isActive }) =>
            isActive ? "text-orange-500 font-bold text-sm sm:text-base" : "text-gray-300 text-sm sm:text-base"
          }
        >
          Workouts
        </NavLink>
        <NavLink
          to="/progress"
          className={({ isActive }) =>
            isActive ? "text-orange-500 font-bold text-sm sm:text-base" : "text-gray-300 text-sm sm:text-base"
          }
        >
          Progress
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "text-orange-500 font-bold text-sm sm:text-base" : "text-gray-300 text-sm sm:text-base"
          }
        >
          Settings
        </NavLink>
      </div>
      {/* Account Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-400 cursor-pointer flex items-center justify-center"
          aria-label="Account menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </button>
        {/* Dropdown menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-gray-700 rounded shadow-lg z-50 border border-gray-600">
            {user && (
              <div className="px-4 py-2 text-gray-200 text-sm border-b border-gray-600">
                {user.email}
              </div>
            )}
            {!user && (
              <>
                <NavLink
                  to="/login"
                  className="block px-4 py-2 text-gray-200 text-sm hover:bg-gray-600"
                  onClick={() => setDropdownOpen(false)}
                >
                  Inloggen
                </NavLink>
                <NavLink
                  to="/login?mode=register"
                  className="block px-4 py-2 text-gray-200 text-sm hover:bg-gray-600"
                  onClick={() => setDropdownOpen(false)}
                >
                  Registreren
                </NavLink>
              </>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-200 text-sm hover:bg-gray-600"
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
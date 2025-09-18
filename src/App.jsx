import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Workouts from "./pages/Workouts";
import NewWorkout from "./pages/NewWorkout";
import Exercises from "./pages/Exercises";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import { auth } from "./firebase";

// PrivateRoute wrapper
function PrivateRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null; // of een spinner

  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  // Dark mode state
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        {/* Dark mode toggle button */}
        <div className="flex justify-end p-2 bg-gray-200 dark:bg-gray-800">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 bg-orange-500 rounded hover:bg-orange-400"
          >
            Toggle {darkMode ? "Light" : "Dark"} Mode
          </button>
        </div>

        {/* Navbar */}
        <Navbar />

        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/workouts"
            element={
              <PrivateRoute>
                <Workouts />
              </PrivateRoute>
            }
          />
          <Route
            path="/new-workout"
            element={
              <PrivateRoute>
                <NewWorkout />
              </PrivateRoute>
            }
          />
          <Route
            path="/exercises"
            element={
              <PrivateRoute>
                <Exercises />
              </PrivateRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <PrivateRoute>
                <Progress />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

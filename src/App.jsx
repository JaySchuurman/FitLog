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

  if (loading) return null; // of een spinner tonen

  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <ThemeProvider>
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <nav className="flex justify-around bg-gray-800 p-4">
          <Link to="/">Home</Link>
          <Link to="/workouts">Workouts</Link>
          <Link to="/exercises">Exercises</Link>
          <Link to="/progress">Progress</Link>
          <Link to="/settings">Settings</Link>
          <Link to="/login">Login</Link>
        </nav>

        <Routes>
          {/* Private routes */}
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

          {/* Login pagina blijft open */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
    </ThemeProvider>
  );
}

export default App;

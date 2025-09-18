import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Workouts from "./pages/Workouts";
import NewWorkout from "./pages/NewWorkout";
import Exercises from "./pages/Exercises";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import { ThemeProvider } from "./components/ThemeProvider";


function App() {
  return (
    <ThemeProvider>
    <Router>
      <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
        <nav className="flex justify-around bg-gray-200 dark:bg-gray-800 p-4">
          <Link to="/">Home</Link>
          <Link to="/workouts">Workouts</Link>
          <Link to="/exercises">Exercises</Link>
          <Link to="/progress">Progress</Link>
          <Link to="/settings">Settings</Link>
          <Link to="/login">Login</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/new-workout" element={<NewWorkout />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
    </ThemeProvider>
  );
}

export default App;

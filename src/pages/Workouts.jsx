import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import WorkoutCard from "../components/WorkoutCard";

export default function Workouts() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("workouts")) || [];
    setWorkouts(stored);
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Mijn Workouts</h1>

      {workouts.length > 0 ? (
        workouts.map((w, index) => (
          <WorkoutCard key={index} title={w.name} exercises={w.exercises} />
        ))
      ) : (
        <p className="text-gray-300">Nog geen workouts beschikbaar.</p>
      )}

      <button
        onClick={() => navigate("/new-workout")}
        className="mt-6 w-full bg-blue-500 py-2 rounded-xl font-semibold hover:bg-blue-400"
      >
        + Nieuwe workout maken
      </button>
    </div>
  );
}

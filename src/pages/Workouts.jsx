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

  function handleDeleteWorkout(index) {
    const updated = workouts.filter((_, i) => i !== index);
    setWorkouts(updated);
    localStorage.setItem("workouts", JSON.stringify(updated));
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Mijn Workouts</h1>

      {workouts.length > 0 ? (
        workouts.map((w, index) => (
          <div key={index} className="relative">
            <WorkoutCard title={w.name} exercises={w.exercises} />
            <button
              onClick={() => handleDeleteWorkout(index)}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-400"
            >
              Verwijder
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-300">Nog geen workouts beschikbaar.</p>
      )}

      <button
        onClick={() => navigate("/new-workout")}
        className="mt-6 w-full bg-orange-500 py-2 rounded-xl font-semibold hover:bg-orange-400"
      >
        + Nieuwe workout maken
      </button>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WorkoutCard from "../components/WorkoutCard";

export default function Home() {
  const navigate = useNavigate();
  const [dailyWorkouts, setDailyWorkouts] = useState({});
  const [todayWorkouts, setTodayWorkouts] = useState([]);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    // Alle geplande workouts ophalen
    const storedDaily = JSON.parse(localStorage.getItem("dailyWorkouts")) || {};
    setDailyWorkouts(storedDaily);

    // Alle beschikbare workouts ophalen
    const storedWorkouts = JSON.parse(localStorage.getItem("workouts")) || [];
    setWorkouts(storedWorkouts);

    // Vandaag’s workout ophalen
    const todayKey = new Date().toDateString();
    setTodayWorkouts(storedDaily[todayKey] || []);
  }, []);

  // Functie om workout details (exercises) erbij te zoeken
  const getWorkoutDetails = (name) => {
    return workouts.find((w) => w.name === name);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-2 text-white">Vandaag’s Workout</h2>

        {todayWorkouts.length > 0 ? (
          <div className="space-y-4">
            {todayWorkouts.map((workoutName, index) => {
              const workout = getWorkoutDetails(workoutName);
              return workout ? (
                <WorkoutCard
                  key={index}
                  title={workout.name}
                  exercises={workout.exercises}
                />
              ) : (
                <p key={index} className="text-gray-400">
                  {workoutName} (details niet gevonden)
                </p>
              );
            })}
          </div>
        ) : (
          <>
            <p className="text-gray-400">Geen workout gepland vandaag.</p>
            <button
              onClick={() => navigate("/workouts")}
              className="mt-4 w-full bg-orange-500 py-2 rounded-xl font-semibold text-white hover:bg-orange-400"
            >
              Workout toevoegen
            </button>
          </>
        )}
      </div>
    </div>
  );
}

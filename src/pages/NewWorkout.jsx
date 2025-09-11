import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Exercises from "./Exercises"; // je self-contained Exercises component

export default function NewWorkout() {
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [workoutName, setWorkoutName] = useState("");
  const navigate = useNavigate();

  const handleExercisesChange = (exercises) => {
    setSelectedExercises(exercises);
  };

  const saveWorkout = () => {
  if (!workoutName) return alert("Geef je workout een naam!");
  const newWorkout = { name: workoutName, exercises: selectedExercises };
  const stored = JSON.parse(localStorage.getItem("workouts")) || [];
  localStorage.setItem("workouts", JSON.stringify([...stored, newWorkout]));
  alert("Workout opgeslagen!");
  navigate("/workouts");
};


  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Nieuwe Workout Maken</h1>

      <input
        type="text"
        placeholder="Workout naam"
        value={workoutName}
        onChange={(e) => setWorkoutName(e.target.value)}
        className="w-full p-2 rounded border border-gray-300 text-black"
      />

      <Exercises
  selectedExercises={selectedExercises}
  onChange={setSelectedExercises} // nu ontvangt NewWorkout de selectie
/>


      <button
        onClick={saveWorkout}
        className="mt-4 w-full bg-green-500 py-2 rounded-xl font-semibold hover:bg-green-400"
      >
        Opslaan
      </button>
    </div>
  );
}

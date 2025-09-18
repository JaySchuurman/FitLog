import React, { useState, useEffect } from "react";

// Zelfgemaakte oefeningen per lichaamsdeel
const exercisesData = {
  chest: [
    {
      id: "pushup",
      name: "Push-Up",
      description: "Een klassieke push-up om je borstspieren te versterken.",
      image: "/images/pushup.png",
    },
    {
      id: "benchpress",
      name: "Bench Press",
      description: "Gebruik een halter om je borst en triceps te trainen.",
      image: "/images/benchpress.png",
    },
  ],
  arms: [
    {
      id: "bicep_curl",
      name: "Bicep Curl",
      description: "Biceps trainen met dumbbells of halters.",
      image: "/images/bicep_curl.png",
    },
    {
      id: "tricep_dip",
      name: "Tricep Dip",
      description: "Gebruik een bankje om je triceps te versterken.",
      image: "/images/tricep-dip.png",
    },
  ],
  legs: [
    {
      id: "squat",
      name: "Squat",
      description: "Train je benen en billen door te squatten.",
      image: "/images/squat.png",
    },
    {
      id: "lunge",
      name: "Lunge",
      description: "Uitvalspassen om je quadriceps te trainen.",
      image: "/images/lunge.png",
    },
  ],
  core: [
    {
      id: "plank",
      name: "Plank",
      description: "Versterk je core door in plankpositie te blijven.",
      image: "/images/plank.png",
    },
    {
      id: "crunch",
      name: "Crunch",
      description: "Buikspieroefening voor een sterke core.",
      image: "/images/crunch.png",
    },
  ],
  back: [
    {
      id: "pullup",
      name: "Pull-Up",
      description: "Rugspieren trainen door jezelf op te trekken.",
      image: "/images/pull-up.png",
    },
    {
      id: "row",
      name: "Dumbbell Row",
      description: "Rugspieren trainen met dumbbells.",
      image: "/images/row.png",
    },
  ],
  shoulders: [
    {
      id: "shoulder_press",
      name: "Shoulder Press",
      description: "Train je schouders met dumbbells of halters.",
      image: "/images/shoulder_press.png",
    },
    {
      id: "lateral_raise",
      name: "Lateral Raise",
      description: "Zijdelingse schoudertraining met dumbbells.",
      image: "/images/lateral_raise.png",
    },
  ],
};

function Exercises({ selectedExercises: parentSelected = [], onChange }) {
  const [selectedBodyPart, setSelectedBodyPart] = useState("chest");
  const [selectedExercises, setSelectedExercises] = useState(parentSelected);

  const bodyParts = Object.keys(exercisesData);

  // Synchroniseer lokale selectie met parent
  useEffect(() => {
    onChange && onChange(selectedExercises);
  }, [selectedExercises, onChange]);

  const toggleExercise = (exercise) => {
    const exists = selectedExercises.find((e) => e.id === exercise.id);
    let updated;
    if (exists) {
      updated = selectedExercises.filter((e) => e.id !== exercise.id);
    } else {
      updated = [...selectedExercises, { ...exercise, sets: 3, reps: 12 }];
    }
    setSelectedExercises(updated);
  };

  const updateExercise = (id, field, value) => {
    const updated = selectedExercises.map((e) =>
      e.id === id ? { ...e, [field]: Number(value) } : e
    );
    setSelectedExercises(updated);
  };

  const exercises = exercisesData[selectedBodyPart];

  return (
    <div>
      {/* Bodypart buttons */}
      <div className="flex gap-4 mb-6 flex-wrap mt-5 ml-5">
        {bodyParts.map((part) => (
          <button
            key={part}
            onClick={() => setSelectedBodyPart(part)}
            className={`px-4 py-2 rounded ${
              selectedBodyPart === part
                ? "bg-orange-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {part.charAt(0).toUpperCase() + part.slice(1)}
          </button>
        ))}
      </div>

      {/* Exercises grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9 ml-5">
        {exercises.map((exercise) => {
          const isSelected = selectedExercises.find((e) => e.id === exercise.id);
          return (
            <div
              key={exercise.id}
              onClick={() => toggleExercise(exercise)}
              className={`p-4 rounded-md shadow-md cursor-pointer flex flex-col justify-between transition-all duration-200 ${
                isSelected
                  ? "bg-green-600 text-white scale-105"
                  : "bg-gray-800 text-white hover:scale-105"
              }`}
            >
              <div className="overflow-hidden rounded mb-2">
                <img
                  src={exercise.image}
                  alt={exercise.name}
                  className="h-40 w-full object-cover transition-transform duration-300 transform hover:scale-110"
                />
              </div>
              <h3 className="text-lg font-semibold">{exercise.name}</h3>
              <p className="text-gray-300 mb-2">{exercise.description}</p>
              {isSelected && (
                <div className="flex gap-2 justify-center">
                  <input
                    type="number"
                    min="1"
                    value={isSelected.sets}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateExercise(exercise.id, "sets", e.target.value)}
                    className="w-12 text-black rounded px-1"
                  />
                  <input
                    type="number"
                    min="1"
                    value={isSelected.reps}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateExercise(exercise.id, "reps", e.target.value)}
                    className="w-12 text-black rounded px-1"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Exercises;

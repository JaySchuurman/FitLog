import WorkoutCard from "../components/WorkoutCard";

export default function Workouts() {
  const workouts = [
    { id: 1, title: "Push Day", exercises: ["Bench Press", "Shoulder Press"] },
    { id: 2, title: "Pull Day", exercises: ["Pull Ups", "Barbell Row"] },
    { id: 3, title: "Leg Day", exercises: ["Squats", "Lunges"] },
  ];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Mijn Workouts</h1>
      {workouts.map((w) => (
        <WorkoutCard key={w.id} title={w.title} exercises={w.exercises} />
      ))}

      <button className="mt-6 w-full bg-blue-500 py-2 rounded-xl font-semibold hover:bg-blue-400">
        + Nieuwe workout maken
      </button>
    </div>
  );
}

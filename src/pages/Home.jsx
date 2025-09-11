import WorkoutCard from "../components/WorkoutCard";

export default function Home() {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-2">Vandaag’s Workout</h2>
        <p className="text-gray-400">Geen workout gepland vandaag.</p>
        <button className="mt-4 w-full bg-orange-500 py-2 rounded-xl font-semibold text-black hover:bg-orange-400">
          Nieuwe workout toevoegen
        </button>
      </div>

      <WorkoutCard
        title="Push Day"
        exercises={["Bench Press", "Shoulder Press"]}
      />
    </div>
  );
}

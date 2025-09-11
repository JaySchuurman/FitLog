export default function ExerciseCard({ exercise, isSelected, onToggle }) {
  return (
    <div
      onClick={() => onToggle(exercise)}
      className={`p-4 rounded-xl shadow-md cursor-pointer transition-colors ${
        isSelected ? "bg-orange-500 text-black" : "bg-gray-800 text-white hover:bg-gray-700"
      }`}
    >
      <h2 className="text-lg font-semibold">{exercise.name}</h2>
      <p className="text-gray-400">{exercise.muscle}</p>
    </div>
  );
}

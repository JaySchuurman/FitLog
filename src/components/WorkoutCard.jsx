export default function WorkoutCard({ title, exercises }) {
  return (
    <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="text-gray-400 mt-2">
        {exercises.map((ex, idx) => (
          <li key={idx}>• {ex}</li>
        ))}
      </ul>
    </div>
  );
}

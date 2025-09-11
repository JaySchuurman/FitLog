export default function WorkoutCard({ title, exercises }) {
  return (
    <div className="bg-gray-800 p-4 rounded-md shadow-md">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      {exercises.length > 0 ? (
        <ul className="list-disc list-inside text-gray-300">
          {exercises.map((exercise, index) => (
            <li key={index}>
              {exercise.name} - {exercise.sets} sets x {exercise.reps} reps
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">Geen oefeningen toegevoegd</p>
      )}
    </div>
  );
}

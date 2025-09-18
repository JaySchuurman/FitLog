import { useEffect, useState } from "react";

export default function Home() {
  const [dailyWorkouts, setDailyWorkouts] = useState({});
  const [todayWorkouts, setTodayWorkouts] = useState([]);

  useEffect(() => {
    const storedDaily = JSON.parse(localStorage.getItem("dailyWorkouts")) || {};
    setDailyWorkouts(storedDaily);

    const todayKey = new Date().toDateString();
    setTodayWorkouts(storedDaily[todayKey] || []);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Home</h1>

      {/* Workouts voor vandaag */}
      <div className="bg-gray-200 p-4 rounded-xl shadow-md border border-orange-300">
        <h2 className="text-xl font-semibold mb-2">
          Workouts voor vandaag ({new Date().toLocaleDateString("nl-NL")}):
        </h2>
        {todayWorkouts.length > 0 ? (
          <ul className="list-disc list-inside">
            {todayWorkouts.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">Nog geen workouts ingepland voor vandaag.</p>
        )}
      </div>

      {/* Optioneel: Toon ook een overzicht van komende dagen */}
      {Object.keys(dailyWorkouts).length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Geplande workouts:</h2>
          <ul className="space-y-1">
            {Object.entries(dailyWorkouts).map(([date, workouts], i) => (
              <li key={i} className="bg-white p-3 rounded-lg shadow-sm border">
                <strong>{date}:</strong> {workouts.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

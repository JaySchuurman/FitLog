import { useEffect, useState } from "react";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const [user, setUser] = useState(null);
  const [todayWorkouts, setTodayWorkouts] = useState([]);
  const [upcomingWorkouts, setUpcomingWorkouts] = useState([]);
  const [workoutToRepeat, setWorkoutToRepeat] = useState(null);
  const [repeatDate, setRepeatDate] = useState(new Date().toISOString().slice(0, 10));

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Haal workouts op
  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "workouts"),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const todayStr = new Date().toISOString().slice(0, 10);

        // Functie om datum te normaliseren
        const getDateStr = (w) =>
          typeof w.date === "string"
            ? w.date
            : w.date.toDate?.()?.toISOString().slice(0, 10) || new Date(w.date).toISOString().slice(0, 10);

        // Filter duplicaten op dezelfde dag
        const filterDuplicates = (workouts) => {
          return workouts.filter((w, index, arr) => {
            const duplicates = arr.filter(
              (other) =>
                getDateStr(other) === getDateStr(w) &&
                JSON.stringify(other.exercises) === JSON.stringify(w.exercises)
            );
            // Laat alleen de eerste voorkomen
            return duplicates[0].id === w.id;
          });
        };

        const today = filterDuplicates(
          data.filter((w) => getDateStr(w) === todayStr)
        );

        const upcoming = filterDuplicates(
          data.filter((w) => getDateStr(w) > todayStr)
        );

        setTodayWorkouts(today);
        setUpcomingWorkouts(upcoming);
      } catch (err) {
        console.error("Error fetching workouts:", err);
      }
    };
    fetchWorkouts();
  }, [user]);

  // Kopieer workout naar nieuwe datum
  const copyWorkout = async (workout, newDate) => {
    if (!user) return alert("Log in om workouts te kopiëren.");
    try {
      await addDoc(collection(db, "workouts"), {
        userId: user.uid,
        name: `${workout.name} (herhaald)`,
        exercises: workout.exercises,
        exerciseCount: workout.exercises.length,
        date: newDate,
        createdAt: new Date(),
        copiedFromId: workout.id, // <- nieuwe property
      });
      setWorkoutToRepeat(null);
      alert(`Workout '${workout.name}' gekopieerd naar ${newDate}`);
    } catch (err) {
      console.error("Error copying workout:", err);
      alert("Fout bij het kopiëren van de workout.");
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {user && (
        <p className="text-lg mb-4">
          Welkom <span className="font-bold">{user.email}</span>!
        </p>
      )}

      {/* 🔁 Dropdown om workout te herhalen */}
      <div className="bg-gray-800 p-4 rounded-2xl shadow-lg flex flex-col md:flex-row items-start md:items-center gap-2 mb-6">
        <select
          value={workoutToRepeat ? workoutToRepeat.id : ""}
          onChange={(e) => {
            const selectedWorkout = [...todayWorkouts, ...upcomingWorkouts].find(
              (w) => w.id === e.target.value
            );
            setWorkoutToRepeat(selectedWorkout || null);
          }}
          className="p-2 rounded bg-gray-700 text-white border border-gray-600 flex-1 min-w-[200px]"
        >
          {([...todayWorkouts, ...upcomingWorkouts].length > 0) ? (
            <>
              <option value="">Selecteer een workout om te herhalen</option>
              {[...todayWorkouts, ...upcomingWorkouts].map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.date}, {w.exerciseCount} oefeningen)
                </option>
              ))}
            </>
          ) : (
            <option value="">Geen workouts beschikbaar</option>
          )}
        </select>

        <input
          type="date"
          value={repeatDate}
          onChange={(e) => setRepeatDate(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white border border-gray-600"
        />

        <button
          onClick={() => workoutToRepeat && copyWorkout(workoutToRepeat, repeatDate)}
          className={`px-4 py-2 rounded ${
            workoutToRepeat
              ? "bg-orange-500 hover:bg-orange-400 text-white"
              : "bg-gray-600 cursor-not-allowed text-gray-400"
          }`}
          disabled={!workoutToRepeat}
        >
          Bevestigen
        </button>
      </div>

      {/* Vandaag’s workouts */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-2 text-gray-400">Vandaag’s Workout</h2>
        {todayWorkouts.length > 0 ? (
          <div className="mt-2">
            {todayWorkouts.map((workout) => (
              <div key={workout.id} className="mb-3">
                <p className="font-bold text-white">{workout.name}</p>
                {workout.exercises && workout.exercises.length > 0 ? (
                  <ul className="text-gray-300 list-disc list-inside">
                    {workout.exercises.map((ex, i) => (
                      <li key={i}>
                        {ex.sets == null && ex.reps == null && ex.weight == null && ex.time == null
                          ? ex.name
                          : `${ex.name} (${
                              ex.sets === 1 ? "1 set" : `${ex.sets || 0} sets`
                            }, ${
                              ex.reps === 1 ? "1 rep" : `${ex.reps || 0} reps`
                            }${ex.weight ? `, ${ex.weight} kg` : ""}${ex.time ? `, ${ex.time}` : ""})`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-300">Geen oefeningen toegevoegd</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Geen workouts gepland voor vandaag.</p>
        )}
      </div>

      {/* Geplande toekomstige workouts */}
      {upcomingWorkouts.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mt-6">
          <h2 className="text-xl font-bold mb-2 text-gray-400">Geplande Toekomstige Workouts</h2>
          <ul className="mt-2">
            {upcomingWorkouts.map((workout) => (
              <li key={workout.id} className="mb-3 text-gray-200">
                <strong>{workout.date}:</strong> {workout.name} ({workout.exerciseCount} oefeningen)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

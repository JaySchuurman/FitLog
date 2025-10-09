import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

export default function WorkoutsPage() {
  const [user, setUser] = useState(null);
  const [workoutName, setWorkoutName] = useState("");
  const [exerciseInput, setExerciseInput] = useState("");
  const [sets, setSets] = useState(1);
  const [reps, setReps] = useState(1);
  const [weight, setWeight] = useState("");
  const [time, setTime] = useState("");
  const [exercises, setExercises] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [todayWorkouts, setTodayWorkouts] = useState([]);
  const [upcomingWorkouts, setUpcomingWorkouts] = useState([]);

  // 🔸 Modal state
  const [showRepeatModal, setShowRepeatModal] = useState(false);
  const [workoutToRepeat, setWorkoutToRepeat] = useState(null);
  const [repeatDate, setRepeatDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  // Auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Voeg oefening toe
  const addExercise = () => {
    if (exerciseInput.trim() === "" || sets <= 0 || reps <= 0) {
      alert(
        "Vul een geldige oefeningnaam, sets (minimaal 1) en reps (minimaal 1) in."
      );
      return;
    }
    setExercises([
      ...exercises,
      {
        name: exerciseInput.trim(),
        email: user ? user.email : "",
        sets: Number(sets),
        reps: Number(reps),
        weight: weight ? Number(weight) : null,
        time: time ? time.trim() : null,
      },
    ]);
    setExerciseInput("");
    setSets(1);
    setReps(1);
    setWeight("");
    setTime("");
  };

  // Voeg workout toe
  const addWorkout = async () => {
    if (!workoutName.trim() || exercises.length === 0 || !user) {
      alert("Vul een workoutnaam in en voeg minimaal één oefening toe.");
      return;
    }
    try {
      await addDoc(collection(db, "workouts"), {
        userId: user.uid,
        name: workoutName.trim(),
        exercises,
        exerciseCount: exercises.length,
        date: selectedDate,
        createdAt: new Date(),
      });
      setWorkoutName("");
      setExercises([]);
      fetchWorkouts(user.uid);
    } catch (err) {
      console.error("Error adding workout:", err);
      alert("Fout bij het toevoegen van de workout.");
    }
  };

  // Haal workouts op
  const fetchWorkouts = async (userId) => {
    if (!userId) return;
    try {
      const q = query(
        collection(db, "workouts"),
        where("userId", "==", userId),
        orderBy("date", "asc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const todayStr = new Date().toISOString().slice(0, 10);

      setTodayWorkouts(
        data.filter((w) => {
          const workoutDate = new Date(w.date);
          return workoutDate.toISOString().slice(0, 10) === todayStr;
        })
      );

      setUpcomingWorkouts(
        data.filter((w) => {
          const workoutDate = new Date(w.date);
          return workoutDate.toISOString().slice(0, 10) !== todayStr;
        })
      );
    } catch (err) {
      console.error("Error fetching workouts:", err);
    }
  };

  useEffect(() => {
    if (user) fetchWorkouts(user.uid);
  }, [user]);

  // 🔸 Workout kopiëren
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
      });
      setShowRepeatModal(false);
      setWorkoutToRepeat(null);
      fetchWorkouts(user.uid);
      alert(`Workout '${workout.name}' gekopieerd naar ${newDate}`);
    } catch (err) {
      console.error("Error copying workout:", err);
      alert("Fout bij het kopiëren van de workout.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Workouts</h1>

      {/* 🔁 Algemene herhaal-knop */}
      <button
        onClick={() => setShowRepeatModal(true)}
        className="bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded mb-4"
      >
        🔁 Deze workout wil ik herhalen
      </button>

      {/* Nieuwe workout toevoegen */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg space-y-3">
        <h2 className="text-xl font-bold text-gray-300">
          Nieuwe workout toevoegen
        </h2>
        <input
          type="text"
          placeholder="Naam van workout (bijv. Krachttraining)"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Oefening (bijv. Deadlift)"
            value={exerciseInput}
            onChange={(e) => setExerciseInput(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white border border-gray-600"
          />
          <input
            type="number"
            placeholder="Aantal sets"
            value={sets}
            min="1"
            onChange={(e) => setSets(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white border border-gray-600"
          />
          <input
            type="number"
            placeholder="Aantal reps"
            value={reps}
            min="1"
            onChange={(e) => setReps(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white border border-gray-600"
          />
          <input
            type="number"
            placeholder="Gewicht (optioneel, in kg)"
            value={weight}
            step="0.5"
            min="0"
            onChange={(e) => setWeight(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white border border-gray-600"
          />
          <input
            type="text"
            placeholder="Tijd (optioneel, bijv. 30s)"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white border border-gray-600"
          />
          <button
            onClick={addExercise}
            className="bg-orange-500 px-4 py-2 rounded hover:bg-orange-400 md:col-span-2"
          >
            Voeg oefening toe
          </button>
        </div>
        {exercises.length > 0 && (
          <ul className="list-disc list-inside text-gray-200">
            {exercises.map((ex, i) => (
              <li key={i}>
                {ex.name} ({ex.sets} sets, {ex.reps} reps
                {ex.weight ? `, ${ex.weight} kg` : ""}
                {ex.time ? `, ${ex.time}` : ""})
              </li>
            ))}
          </ul>
        )}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
        />
        <button
          onClick={addWorkout}
          disabled={!user}
          className={`w-full py-2 rounded mt-2 ${
            user
              ? "bg-orange-500 hover:bg-orange-400"
              : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          Voeg Workout toe
        </button>
      </div>    

      {/* Geplande workouts */}
      {upcomingWorkouts.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Geplande workouts:</h2>
          <ul className="space-y-1">
            {upcomingWorkouts.map((w) => (
              <li
                key={w.id}
                className="bg-gray-700 p-3 rounded-lg shadow-sm border text-gray-200"
              >
                <strong>{w.date}:</strong> {w.name} ({w.exerciseCount} oefeningen)
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 🔸 Herhaal-modal */}
      {showRepeatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md">
            {!workoutToRepeat ? (
              <>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Kies een workout om te herhalen
                </h3>
                <ul className="max-h-60 overflow-y-auto text-gray-300 mb-4">
                  {[...todayWorkouts, ...upcomingWorkouts].length > 0 ? (
                    [...todayWorkouts, ...upcomingWorkouts].map((w) => (
                      <li
                        key={w.id}
                        onClick={() => {
                          setWorkoutToRepeat(w);
                          setRepeatDate(new Date().toISOString().slice(0, 10));
                        }}
                        className="p-2 mb-1 rounded bg-gray-700 hover:bg-gray-600 cursor-pointer"
                      >
                        {w.name} – {w.date} ({w.exerciseCount} oefeningen)
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">
                      Geen workouts beschikbaar om te herhalen.
                    </p>
                  )}
                </ul>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowRepeatModal(false)}
                    className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-500"
                  >
                    Sluiten
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Herhaal workout: {workoutToRepeat.name}
                </h3>
                <label className="block text-gray-300 mb-2">
                  Kies een nieuwe datum:
                </label>
                <input
                  type="date"
                  value={repeatDate}
                  onChange={(e) => setRepeatDate(e.target.value)}
                  className="w-full p-2 mb-4 rounded bg-gray-700 text-white border border-gray-600"
                />
                <div className="flex justify-between">
                  <button
                    onClick={() => setWorkoutToRepeat(null)}
                    className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-500"
                  >
                    ← Terug
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowRepeatModal(false)}
                      className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-500"
                    >
                      Annuleren
                    </button>
                    <button
                      onClick={() => copyWorkout(workoutToRepeat, repeatDate)}
                      className="px-3 py-1 rounded bg-orange-500 hover:bg-orange-400"
                    >
                      Bevestigen
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

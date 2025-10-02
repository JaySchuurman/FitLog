import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";

export default function WorkoutsPage() {
  const [user, setUser] = useState(null);
  const [workoutName, setWorkoutName] = useState("");
  const [exerciseInput, setExerciseInput] = useState("");
  const [sets, setSets] = useState(1);
  const [reps, setReps] = useState(1);
  const [weight, setWeight] = useState("");
  const [time, setTime] = useState("");
  const [exercises, setExercises] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [todayWorkouts, setTodayWorkouts] = useState([]);
  const [upcomingWorkouts, setUpcomingWorkouts] = useState([]);

  // Auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Voeg oefening toe aan de lijst
  const addExercise = () => {
    if (exerciseInput.trim() === "" || sets <= 0 || reps <= 0) {
      alert("Vul een geldige oefeningnaam, sets (minimaal 1) en reps (minimaal 1) in.");
      return;
    }
    setExercises([...exercises, {
      name: exerciseInput.trim(),
      email: user ? user.email : "",
      sets: Number(sets),
      reps: Number(reps),
      weight: weight ? Number(weight) : null,
      time: time ? time.trim() : null
    }]);
    setExerciseInput("");
    setSets(1);
    setReps(1);
    setWeight("");
    setTime("");
  };

  // Voeg workout toe aan Firebase
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
      fetchWorkouts(user.uid); // Direct refresh
    } catch (err) {
      console.error("Error adding workout:", err);
      alert("Fout bij het toevoegen van de workout.");
    }
  };

  // Haal workouts van gebruiker op
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
      // Workouts van vandaag
      setTodayWorkouts(
        data.filter((w) => {
          const workoutDate = new Date(w.date);
          return workoutDate.toISOString().slice(0, 10) === todayStr;
        })
      );
      // Komende workouts
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

  // Fetch workouts zodra user beschikbaar is
  useEffect(() => {
    if (user) {
      fetchWorkouts(user.uid);
    }
  }, [user]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Workouts</h1>
      {/* Nieuwe workout toevoegen */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg space-y-3">
        <h2 className="text-xl font-bold text-gray-300">Nieuwe workout toevoegen</h2>
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
                {ex.name} ({ex.sets} sets, {ex.reps} reps{ex.weight ? `, ${ex.weight} kg` : ""}{ex.time ? `, ${ex.time}` : ""}) door: {ex.email}
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
            user ? "bg-orange-500 hover:bg-orange-400" : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          Voeg Workout toe
        </button>
      </div>
      {/* Workouts voor vandaag */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-2 text-gray-400">
          Workouts voor vandaag ({new Date().toLocaleDateString("nl-NL")}):
        </h2>
        {todayWorkouts.length > 0 ? (
          <ul className="list-disc list-inside">
            {todayWorkouts.map((w) => (
              <li key={w.id}>
                {w.name} ({w.exerciseCount} oefeningen): {w.exercises.map(ex => 
                  `${ex.name} (${ex.sets} sets, ${ex.reps} reps${ex.weight ? `, ${ex.weight} kg` : ""}${ex.time ? `, ${ex.time}` : ""})`
                ).join(", ")}
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-bold mb-2 text-gray-400">Nog geen workouts ingepland voor vandaag.</p>
        )}
      </div>
      {/* Komende workouts */}
      {upcomingWorkouts.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Geplande workouts:</h2>
          <ul className="space-y-1">
            {upcomingWorkouts.map((w) => (
              <li
                key={w.id}
                className="bg-gray-700 p-3 rounded-lg shadow-sm border text-gray-200"
              >
                <strong>{w.date}:</strong> {w.name} ({w.exerciseCount} oefeningen) – {w.exercises.map(ex => 
                  `${ex.name} (${ex.sets} sets, ${ex.reps} reps${ex.weight ? `, ${ex.weight} kg` : ""}${ex.time ? `, ${ex.time}` : ""})`
                ).join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
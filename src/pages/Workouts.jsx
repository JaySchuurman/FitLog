import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";

export default function WorkoutsPage() {
  const [user, setUser] = useState(null);
  const [workoutName, setWorkoutName] = useState("");
  const [exerciseInput, setExerciseInput] = useState("");
  const [exercises, setExercises] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [todayWorkouts, setTodayWorkouts] = useState([]);
  const [upcomingWorkouts, setUpcomingWorkouts] = useState([]);

  // 🔥 Auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Voeg oefening toe aan de lijst
  const addExercise = () => {
    if (exerciseInput.trim() !== "") {
      setExercises([...exercises, exerciseInput.trim()]);
      setExerciseInput("");
    }
  };

  // Voeg workout toe aan Firebase
  const addWorkout = async () => {
    if (!workoutName || exercises.length === 0 || !user) return;

    try {
      await addDoc(collection(db, "workouts"), {
        userId: user.uid,
        name: workoutName,
        exercises,
        exerciseCount: exercises.length,
        date: selectedDate, // yyyy-mm-dd
        createdAt: new Date(),
      });

      setWorkoutName("");
      setExercises([]);
      fetchWorkouts(user.uid); // direct refresh
    } catch (err) {
      console.error("Error adding workout:", err);
    }
  };

  // Haal workouts van gebruiker op
  const fetchWorkouts = async (userId) => {
    if (!userId) return;

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
        const workoutDate = new Date(w.date); // altijd Date object
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
          placeholder="Naam van workout"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
        />

        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Voeg oefening toe"
            value={exerciseInput}
            onChange={(e) => setExerciseInput(e.target.value)}
            className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600"
          />
          <button
            onClick={addExercise}
            className="bg-orange-500 px-4 rounded hover:bg-orange-400"
          >
            Voeg toe
          </button>
        </div>

        {exercises.length > 0 && (
          <ul className="list-disc list-inside text-gray-200">
            {exercises.map((ex, i) => (
              <li key={i}>{ex}</li>
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
                {w.name} ({w.exerciseCount} oefeningen): {w.exercises.join(", ")}
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
                <strong>{w.date}:</strong> {w.name} ({w.exerciseCount} oefeningen) – {w.exercises.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

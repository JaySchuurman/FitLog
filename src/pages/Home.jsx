import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "/firebase";
import { onAuthStateChanged } from "firebase/auth";
import WorkoutCard from "../components/WorkoutCard";

export default function Home() {
  const [workouts, setWorkouts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 🔥 Firebase Auth listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "workouts"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWorkouts(data);
      } catch (err) {
        console.error("Error fetching workouts:", err);
      }
    };

    fetchWorkouts();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {user && (
        <p className="text-lg mb-4">
          Welkom <span className="font-bold">{user.email}</span>!
        </p>
      )}

      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-2 text-gray-400">Vandaag’s Workout</h2>
        <p className="text-gray-400">Geen workout gepland vandaag.</p>
        <button className="mt-4 w-full bg-orange-500 py-2 rounded-xl font-semibold text-white hover:bg-orange-400">
          Nieuwe workout toevoegen
        </button>

        <div className="mt-6 bg-gray-700 p-4 rounded-xl text-white">
          <h3 className="font-semibold mb-2">📂 Workouts of the day</h3>
          {workouts.length > 0 ? (
            workouts.map((workout) => (
              <div key={workout.id} className="mb-3">
                <p className="font-bold">{workout.id}</p>
                <p className="text-gray-300">{workout.information}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No workouts found</p>
          )}
        </div>
      </div>

      <WorkoutCard title="Push Day" exercises={["Bench Press", "Shoulder Press"]} />
    </div>
  );
}

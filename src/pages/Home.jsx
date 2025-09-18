import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const [user, setUser] = useState(null);
  const [todayWorkouts, setTodayWorkouts] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!user) return;

      try {
        const todayStr = new Date().toISOString().slice(0, 10); // yyyy-mm-dd

        const q = query(
          collection(db, "workouts"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Filter alleen workouts van vandaag
        const todays = data.filter((w) => w.date === todayStr);

        setTodayWorkouts(todays);
      } catch (err) {
        console.error("Error fetching workouts:", err);
      }
    };

    fetchWorkouts();
  }, [user]);

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {user && (
        <p className="text-lg mb-4">
          Welkom <span className="font-bold">{user.email}</span>!
        </p>
      )}

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
                      <li key={i}>{ex}</li>
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
    </div>
  );
}

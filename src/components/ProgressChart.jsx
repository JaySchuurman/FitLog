import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
export default function ProgressPRBlock() {
  const STORAGE_KEY = "fitlog_pr_records_v1";
  const [records, setRecords] = useState([]);
  const [lift, setLift] = useState("Deadlift");
  const [weight, setWeight] = useState(120);
  const [unit, setUnit] = useState("kgs");
  const [note, setNote] = useState("");
  const [user, setUser] = useState(null);
  const [workoutStats, setWorkoutStats] = useState({ "1d": 0, "7d": 0, "30d": 0 });
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setRecords(JSON.parse(raw));
    } catch (e) {
      console.warn("Couldn't load saved PRs", e);
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.warn("Couldn't save PRs", e);
    }
  }, [records]);
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
        const q = query(
          collection(db, "workouts"),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const now = new Date();
        const periods = {
          "1d": 1 * 24 * 60 * 60 * 1000,
          "7d": 7 * 24 * 60 * 60 * 1000,
          "30d": 30 * 24 * 60 * 60 * 1000,
        };
        const stats = { "1d": 0, "7d": 0, "30d": 0 };
        Object.keys(periods).forEach((period) => {
          const startDate = new Date(now.getTime() - periods[period]).toISOString().slice(0, 10);
          const filteredWorkouts = data.filter((w) => {
            const workoutDate = new Date(w.date);
            return workoutDate >= new Date(startDate) && w.exercises.some(ex => ex.email === user.email);
          });
          const workoutCount = filteredWorkouts.length;
          stats[period] = period === "1d" ? workoutCount : (workoutCount / (periods[period] / (24 * 60 * 60 * 1000))).toFixed(1);
        });
        setWorkoutStats(stats);
      } catch (err) {
        console.error("Error fetching workouts:", err);
      }
    };
    fetchWorkouts();
  }, [user]);
  function addRecord(e) {
    e.preventDefault();
    if (!weight || Number(weight) <= 0) return;
    const newRec = {
      id: Date.now(),
      lift,
      weight: Number(weight),
      unit,
      note: note.trim(),
      date: new Date().toISOString(),
    };
    setRecords((r) => [newRec, ...r]);
    setWeight(unit === "kgs" ? 120 : 265);
    setNote("");
  }
  function removeRecord(id) {
    setRecords((r) => r.filter((x) => x.id !== id));
  }
  function lbsToKgs(lbs) {
    return lbs * 0.45359237;
  }
  function kgsToLbs(kgs) {
    return kgs / 0.45359237;
  }
  const totalInKgs = records.reduce((acc, r) => acc + (r.unit === "kgs" ? r.weight : lbsToKgs(r.weight)), 0);
  const totalDisplay = unit === "kgs" ? totalInKgs : kgsToLbs(totalInKgs);
  const formatNumber = (n) => Number(n).toLocaleString(undefined, { maximumFractionDigits: 1 });
  const maxWorkouts = Math.max(...Object.values(workoutStats), 1);
  const yAxisTicks = [Math.ceil(maxWorkouts), Math.ceil(maxWorkouts / 2), 0];
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg text-gray-100 max-w-4xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-semibold">PR & Records</h2>
          <p className="text-sm text-gray-300 mt-1">Voeg je persoonlijke records toe voor het deadliften, benchen en squatten</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-300">Totaal</div>
          <div className="text-xl font-medium">{formatNumber(totalDisplay)} {unit.toUpperCase()}</div>
          <div className="flex gap-2 mt-2 justify-end">
            <button onClick={() => setUnit("kgs")} className={`px-2 py-1 rounded text-sm ${unit === "kgs" ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-100"}`}>Kgs</button>
            <button onClick={() => setUnit("lbs")} className={`px-2 py-1 rounded text-sm ${unit === "lbs" ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-100"}`}>Lbs</button>
          </div>
        </div>
      </div>
      <form onSubmit={addRecord} className="grid grid-cols-1 md:grid-cols-1 gap-3 mb-5">
        <select value={lift} onChange={(e) => setLift(e.target.value)} className="p-2 rounded bg-gray-700 text-gray-100">
          <option>Deadlift</option>
          <option>Squat</option>
          <option>Bench</option>
        </select>
        <div className="flex">
          <input type="number" min="0" step="0.5" value={weight} onChange={(e) => setWeight(e.target.value)} className="p-2 rounded-l bg-gray-700 text-gray-100 flex-1" />
          <select value={unit} onChange={(e) => setUnit(e.target.value)} className="p-2 rounded-r bg-gray-700 text-gray-100">
            <option value="kgs">kgs</option>
            <option value="lbs">lbs</option>
          </select>
        </div>
        <div className="flex gap-2">
          <input placeholder="Optioneel: korte notitie (bv. belt, raw)" value={note} onChange={(e) => setNote(e.target.value)} className="p-2 rounded bg-gray-700 text-gray-100 flex-1" />
          <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded font-semibold">Voeg PR toe</button>
        </div>
      </form>
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Recente records</h3>
        {records.length === 0 ? (
          <p className="text-sm text-gray-300">Nog geen records</p>
        ) : (
          <ul className="space-y-2">
            {records.map((r) => {
              const weightInDisplay = r.unit === unit ? r.weight : (unit === "kgs" ? lbsToKgs(r.weight) : kgsToLbs(r.weight));
              return (
                <li key={r.id} className="flex justify-between items-center bg-gray-700 p-3 rounded">
                  <div>
                    <div className="font-semibold">{r.lift} — {formatNumber(weightInDisplay)} {unit.toUpperCase()}</div>
                    <div className="text-xs text-gray-300">{r.note || "Geen notitie"} • {new Date(r.date).toLocaleString()}</div>
                  </div>
                  <button onClick={() => removeRecord(r.id)} className="px-2 py-1 rounded bg-red-600 text-white text-sm">Verwijder</button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Statistieken</h3>
        <div className="bg-gray-900 rounded p-6 text-gray-400">
          <p className="text-center mb-3">Gemiddeld aantal workouts</p>
          <div className="flex items-start">
            <div className="flex flex-col justify-between h-40 mr-2 text-right text-sm">
              {yAxisTicks.map((tick, idx) => (
                <span key={idx}>{tick}</span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 flex-1">
              {["1d", "7d", "30d"].map((period) => (
                <div key={period} className="flex flex-col items-center relative group">
                  <div
                    className="bg-orange-500 w-full transition-opacity"
                    style={{ height: `${(workoutStats[period] / maxWorkouts) * 100}px`, minHeight: "10px" }}
                  >
                    <span className="absolute top-[-1.5rem] left-1/2 transform -translate-x-1/2 text-xs bg-gray-700 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {workoutStats[period]}
                    </span>
                  </div>
                  <span className="mt-2 text-sm">{period === "1d" ? "1 Dag" : period === "7d" ? "7 Dagen" : "30 Dagen"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
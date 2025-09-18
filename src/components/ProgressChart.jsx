import React, { useEffect, useState } from "react";

export default function ProgressPRBlock() {
  const STORAGE_KEY = "fitlog_pr_records_v1";
  const [records, setRecords] = useState([]);
  const [lift, setLift] = useState("Deadlift");
  const [weight, setWeight] = useState(120);
  const [unit, setUnit] = useState("kgs");
  const [note, setNote] = useState("");

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
      <div className="bg-gray-900 rounded p-6 text-center text-gray-400">
        {/* Placeholder voor grafiek */}
        <p>Aantal workouts per maand (placeholder)</p>
        <div className="grid grid-cols-6 gap-2 mt-3">
          {/* Simpele staafjes per maand */}
          {[4, 2, 5, 3, 6, 2].map((val, idx) => (
            <div key={idx} className="bg-orange-500 w-full" style={{ height: `${val * 10}px` }}></div>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
}

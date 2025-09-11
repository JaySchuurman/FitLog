import React, { useEffect, useState } from "react";
import "./ProgressChart.css";

// ProgressPRBlock.jsx
// Een simpele PR-block component: voeg records toe voor Deadlift, Squat en Bench,
// kies KGS of LBS (standaard KGS), toon totaal en bewaar in localStorage.
// Later kun je hier Recharts inpluggen (placeholder aanwezig).

export default function ProgressPRBlock() {
  const STORAGE_KEY = "fitlog_pr_records_v1";
  const [records, setRecords] = useState([]);
  const [lift, setLift] = useState("Deadlift");
  const [weight, setWeight] = useState(120);
  const [unit, setUnit] = useState("kgs"); // 'kgs' of 'lbs'
  const [note, setNote] = useState("");

  // laad opgeslagen records
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setRecords(JSON.parse(raw));
    } catch (e) {
      console.warn("Couldn't load saved PRs", e);
    }
  }, []);

  // bewaar on change
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
    setWeight((u) => (u === "kgs" ? 120 : 265));
    setNote("");
  }

  function removeRecord(id) {
    setRecords((r) => r.filter((x) => x.id !== id));
  }

  // conversies
  function lbsToKgs(lbs) {
    return lbs * 0.45359237;
  }
  function kgsToLbs(kgs) {
    return kgs / 0.45359237;
  }

  // totaal in de gekozen unit
  const totalInKgs = records.reduce((acc, r) => {
    return acc + (r.unit === "kgs" ? r.weight : lbsToKgs(r.weight));
  }, 0);

  const totalDisplay = unit === "kgs" ? totalInKgs : kgsToLbs(totalInKgs);

  function formatNumber(n) {
    return Number(n).toLocaleString(undefined, { maximumFractionDigits: 1 });
  }

  return (
    <div className="progress-container">
      <div className="progress-header">
        <div>
          <h2 className="progress-title">PR & Records</h2>
          <p className="progress-subtitle">Voeg je persoonlijke records toe voor het deadliften, benchen en squatten</p>
        </div>

        <div className="progress-total">
          <div className="progress-total-label">Totaal</div>
          <div className="progress-total-value">{formatNumber(totalDisplay)} {unit.toUpperCase()}</div>
          <div className="progress-unit-buttons">
            <button onClick={() => setUnit("kgs")} className={unit === "kgs" ? "active" : ""}>
              Kgs
            </button>
            <button onClick={() => setUnit("lbs")} className={unit === "lbs" ? "active" : ""}>
              Lbs
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={addRecord} className="progress-form">
        <select value={lift} onChange={(e) => setLift(e.target.value)}>
          <option>Deadlift</option>
          <option>Squat</option>
          <option>Bench</option>
        </select>

        <div className="progress-weight-input">
          <input
            type="number"
            min="0"
            step="0.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="kgs">kgs</option>
            <option value="lbs">lbs</option>
          </select>
        </div>

        <div className="progress-note-input">
          <input
            placeholder="Optioneel: korte notitie (bv. belt, raw)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button type="submit">Voeg PR toe</button>
        </div>
      </form>

      <div className="progress-records">
        <h3>Recente records</h3>
        {records.length === 0 ? (
          <p>Nog geen records</p>
        ) : (
          <ul>
            {records.map((r) => {
              const weightInDisplay = r.unit === unit ? r.weight : (unit === "kgs" ? lbsToKgs(r.weight) : kgsToLbs(r.weight));
              return (
                <li key={r.id}>
                  <div>
                    <div>{r.lift} — {formatNumber(weightInDisplay)} {unit.toUpperCase()}</div>
                    <div>{r.note || "Geen notitie"} • {new Date(r.date).toLocaleString()}</div>
                  </div>
                  <button onClick={() => removeRecord(r.id)}>Verwijder</button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="progress-chart">
        <div className="progress-chart-placeholder">
          <p>Hier komt later een mooie grafiek van je progressie. (Recharts integration placeholder)</p>
        </div>
      </div>
    </div>
  );
}

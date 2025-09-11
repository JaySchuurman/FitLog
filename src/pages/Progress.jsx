import ProgressChart from "../components/ProgressChart";

export default function Progress() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Progressie</h1>
      <ProgressChart />
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg text-gray-300">
        <p>Statistieken en persoonlijke records komen hier.</p>
      </div>
    </div>
  );
}

export default function Settings() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Instellingen</h1>
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex justify-between items-center">
        <span className="text-gray-300">Dark Mode</span>
        <input type="checkbox" defaultChecked className="accent-orange-500" />
      </div>
    </div>
  );
}

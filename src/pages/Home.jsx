export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Vandaag’s Workout</h1>
      <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
        <p>Geen workout gepland vandaag.</p>
        <button className="mt-4 bg-green-500 px-4 py-2 rounded-xl text-black">
          Nieuwe workout toevoegen
        </button>
      </div>
    </div>
  );
}

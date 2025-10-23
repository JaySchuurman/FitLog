export default function Settings({ darkMode, setDarkMode }) {
  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Instellingen
      </h1>
      <div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 bg-orange-500 rounded hover:bg-orange-400 text-white"
        >
          Toggle {darkMode ? "Light" : "Dark"} Mode
        </button>
      </div>
    </div>
  );
}
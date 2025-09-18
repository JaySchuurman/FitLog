export default function Settings({ darkMode, setDarkMode }) {
  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Instellingen
      </h1>

      <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex justify-between items-center">
        <span className="text-gray-800 dark:text-gray-300">Dark Mode</span>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
            darkMode ? "bg-orange-500" : "bg-gray-400"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
              darkMode ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

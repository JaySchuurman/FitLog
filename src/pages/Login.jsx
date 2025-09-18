

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-white text-center">Login</h2>
            <form className="space-y-4">
                <div>
                    <label className="block text-gray-300 mb-2" htmlFor="email">Email</label>
                    <input type="email" id="email" className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-orange-500" />
                </div>
                <div>
                    <label className="block text-gray-300 mb-2" htmlFor="password">Wachtwoord</label>
                    <input type="password" id="password" className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-orange-500" />
                </div>
                <button type="submit" className="w-full bg-orange-500 py-3 rounded-xl font-semibold text-white hover:bg-orange-400">Inloggen</button>
            </form>
        </div>
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  // Check waar de gebruiker vandaan komt (redirect na login)
  const from = location.state?.from?.pathname || "/";

  // Check query param ?mode=register om direct naar register te gaan
  const params = new URLSearchParams(location.search);
  const mode = params.get("mode");

  const [isRegister, setIsRegister] = useState(mode === "register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Update state bij query param verandering
  useEffect(() => {
    setIsRegister(mode === "register");
  }, [mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate(from, { replace: true }); // terug naar de vorige pagina
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate(from, { replace: true }); // terug naar de vorige pagina
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          {isRegister ? "Registreren" : "Inloggen"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Wachtwoord</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-orange-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-orange-500 py-3 rounded-xl font-semibold text-white hover:bg-orange-400"
          >
            {isRegister ? "Account aanmaken" : "Inloggen"}
          </button>
        </form>

        <div className="my-4 text-center text-gray-400">of</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-blue-600 py-3 rounded-xl font-semibold text-white hover:bg-blue-500"
        >
          Google Login
        </button>

        <p className="mt-6 text-center text-gray-300">
          {isRegister ? "Heb je al een account?" : "Nog geen account?"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-orange-400 hover:underline"
          >
            {isRegister ? "Inloggen" : "Registreren"}
          </button>
        </p>
      </div>
    </div>
  );
}

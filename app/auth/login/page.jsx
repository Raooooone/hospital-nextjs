"use client";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- REDIRECTION AUTOMATIQUE ---
  // Dès que la session est détectée (même via Google/GitHub), on redirige
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      const role = session.user.role;
      if (role === "ADMIN") router.push("/admin");
      else if (role === "MEDECIN") router.push("/medecin");
      else router.push("/patient");
    }
  }, [session, status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // On reste sur la page pour gérer l'erreur ou l'effet de session
    });

    if (res?.error) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
    }
    // Si succès, le useEffect ci-dessus détectera le changement de session et redirigera.
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Connexion à MediCare</h1>

        {error && (
          <p className="text-red-500 bg-red-50 border border-red-200 text-center mb-4 py-2 rounded text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            required 
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black" 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Mot de passe" 
            required 
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black" 
          />
          
          <button 
            type="submit" 
            disabled={loading || status === "loading"}
            className="bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {loading || status === "loading" ? "Traitement..." : "Se connecter"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-2">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-400 text-sm font-bold">OU</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <div className="flex flex-col gap-3">
          <button 
            type="button"
            onClick={() => signIn("google")} 
            className="border border-gray-300 py-2 rounded font-medium hover:bg-gray-50 flex justify-center items-center gap-2 transition-colors text-black"
          >
            🌐 Continuer avec Google
          </button>
          <button 
            type="button"
            onClick={() => signIn("github")} 
            className="bg-gray-900 text-white py-2 rounded font-medium hover:bg-gray-800 flex justify-center items-center gap-2 transition-colors"
          >
            <span className="text-lg">🐙</span> Continuer avec GitHub
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6 font-bold">
          Pas encore de compte ? <Link href="/auth/register" className="text-blue-600 hover:underline">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}
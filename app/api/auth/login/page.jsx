"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    // Appel à NextAuth pour la connexion classique
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // On gère la redirection nous-mêmes
    });

    if (res.error) {
      setError("Email ou mot de passe incorrect");
    } else {
      router.push("/patient"); // Redirige par défaut, le middleware ajustera si c'est un Admin/Médecin
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Connexion à MediCare</h1>

        {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="email" name="email" placeholder="Email" required className="border p-2 rounded" />
          <input type="password" name="password" placeholder="Mot de passe" required className="border p-2 rounded" />
          
          <button type="submit" className="bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">
            Se connecter
          </button>
        </form>

        <div className="my-6 flex items-center gap-2">
          <hr className="flex-1" />
          <span className="text-gray-400 text-sm">OU</span>
          <hr className="flex-1" />
        </div>

        {/* Boutons OAuth (Google / GitHub) */}
        <div className="flex flex-col gap-3">
          <button onClick={() => signIn("google", { callbackUrl: "/patient" })} className="border border-gray-300 py-2 rounded font-medium hover:bg-gray-50 flex justify-center items-center gap-2">
            🌐 Continuer avec Google
          </button>
          <button onClick={() => signIn("github", { callbackUrl: "/patient" })} className="bg-gray-900 text-white py-2 rounded font-medium hover:bg-gray-800 flex justify-center items-center gap-2">
            🐙 Continuer avec GitHub
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Pas encore de compte ? <Link href="/auth/register" className="text-blue-600 hover:underline">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}
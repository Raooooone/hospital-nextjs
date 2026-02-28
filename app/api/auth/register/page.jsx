"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/actions/auth";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const res = await registerUser(formData); // Appel au Backend

    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      // Si succès, on redirige vers le login
      router.push("/auth/login?registered=true");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Créer un compte</h1>

        {error && <p className="text-red-500 text-center mb-4 text-sm bg-red-50 p-2 rounded">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" name="name" placeholder="Nom complet" required className="border p-2 rounded" />
          <input type="email" name="email" placeholder="Adresse Email" required className="border p-2 rounded" />
          <input type="password" name="password" placeholder="Mot de passe" required minLength="6" className="border p-2 rounded" />
          
          <button type="submit" disabled={loading} className="bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 disabled:opacity-50">
            {loading ? "Création en cours..." : "S'inscrire"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Déjà un compte ? <Link href="/auth/login" className="text-blue-600 hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
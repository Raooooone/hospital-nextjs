"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/actions/auth";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("PATIENT"); // État pour suivre le rôle

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const res = await registerUser(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/auth/login?registered=true");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">Créer un compte</h1>
        <p className="text-gray-500 text-center mb-6 text-sm">Rejoignez MediCare</p>

        {error && (
          <p className="text-red-500 text-center mb-4 text-sm bg-red-50 p-2 border border-red-200 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Inputs classiques */}
          <input type="text" name="name" placeholder="Nom complet" required className="border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" />
          <input type="email" name="email" placeholder="Adresse Email" required className="border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" />
          <input type="password" name="password" placeholder="Mot de passe" required minLength="6" className="border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" />

          {/* SÉLECTION DU RÔLE (3 OPTIONS) */}
          <div className="flex flex-col gap-1 mt-2">
            <label className="text-sm font-medium text-gray-700">Je suis un :</label>
            <div className="grid grid-cols-3 gap-2">
              
              <label className={`flex items-center justify-center p-2 border rounded-lg cursor-pointer transition-all ${selectedRole === "PATIENT" ? "border-green-600 bg-green-50" : "hover:bg-gray-50"}`}>
                <input type="radio" name="role" value="PATIENT" className="hidden" onChange={() => setSelectedRole("PATIENT")} defaultChecked />
                <span className="text-xs font-semibold">Patient</span>
              </label>

              <label className={`flex items-center justify-center p-2 border rounded-lg cursor-pointer transition-all ${selectedRole === "MEDECIN" ? "border-green-600 bg-green-50" : "hover:bg-gray-50"}`}>
                <input type="radio" name="role" value="MEDECIN" className="hidden" onChange={() => setSelectedRole("MEDECIN")} />
                <span className="text-xs font-semibold">Médecin</span>
              </label>

              <label className={`flex items-center justify-center p-2 border rounded-lg cursor-pointer transition-all ${selectedRole === "ADMIN" ? "border-red-600 bg-red-50" : "hover:bg-gray-50 border-dashed"}`}>
                <input type="radio" name="role" value="ADMIN" className="hidden" onChange={() => setSelectedRole("ADMIN")} />
                <span className="text-xs font-semibold text-red-600">Admin</span>
              </label>

            </div>
          </div>

          {/* CHAMP SECRET SI ADMIN SÉLECTIONNÉ */}
          {selectedRole === "ADMIN" && (
            <div className="flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-sm font-medium text-red-700">Code d'invitation Admin</label>
              <input 
                type="password" 
                name="adminCode" 
                placeholder="Entrez le code secret" 
                required 
                className="border-2 border-red-200 p-2 rounded focus:border-red-500 outline-none bg-red-50"
              />
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading} 
            className={`py-3 rounded-lg font-bold text-white mt-4 transition-all ${selectedRole === "ADMIN" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
          >
            {loading ? "Chargement..." : "S'inscrire"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Déjà un compte ? <Link href="/auth/login" className="text-blue-600 hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
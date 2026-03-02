// app/components/Navbar.jsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Vérifie bien ce chemin !
import Link from "next/link";
import LogoutButton from "./LogoutButton"; // On sépare le bouton car il a besoin de "use client"

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-bold text-blue-600">MediCare</Link>
        
        {session && (
          <ul className="flex gap-4 text-gray-700 font-medium">
             {/* Tes liens dynamiques ici selon session.user.role */}
             {session.user.role === "ADMIN" && <li><Link href="/admin">Dashboard Admin</Link></li>}
          </ul>
        )}
      </div>

      <div>
        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Bonjour, {session.user.name}</span>
            <LogoutButton /> 
          </div>
        ) : (
          <Link href="/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded">Connexion</Link>
        )}
      </div>
    </nav>
  );
}
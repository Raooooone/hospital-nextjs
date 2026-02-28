import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  if (!session) return null; // Ne rien afficher si non connecté

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
      <div className="font-bold text-xl">
        MediCare App
      </div>
      <div className="flex gap-4 items-center">
        <span className="text-sm bg-blue-800 px-3 py-1 rounded-full">
          Rôle : {session.user.role}
        </span>
        {session.user.role === "ADMIN" && <Link href="/admin">Dashboard Admin</Link>}
        {session.user.role === "MEDECIN" && <Link href="/medecin">Espace Médecin</Link>}
        {session.user.role === "PATIENT" && <Link href="/patient">Espace Patient</Link>}
        
        <LogoutButton />
      </div>
    </nav>
  );
}
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LogoutButton from "./LogoutButton";

// FORCE LE RENDU DYNAMIQUE : Empêche Next.js de mettre la Navbar en cache statique
// C'est essentiel pour que la session soit détectée dès le redirect du login.
export const dynamic = "force-dynamic";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-bold text-blue-600 hover:opacity-80 transition">
          MediCare
        </Link>
        
        {/* Liens de navigation basés sur le rôle */}
        {session && (
          <ul className="flex gap-6 text-gray-600 text-sm font-medium">
            {session.user.role === "ADMIN" && (
              <li>
                <Link href="/admin" className="hover:text-blue-600 transition">Tableau de bord</Link>
              </li>
            )}
            {session.user.role === "MEDECIN" && (
              <li>
                <Link href="/medecin" className="hover:text-blue-600 transition">Planning Patients</Link>
              </li>
            )}
            {session.user.role === "PATIENT" && (
              <li>
                <Link href="/patient" className="hover:text-blue-600 transition">Mes RDV</Link>
              </li>
            )}
          </ul>
        )}
      </div>

      <div className="flex items-center gap-4">
        {session ? (
          <div className="flex items-center gap-4 animate-in fade-in duration-500">
            <div className="hidden sm:block text-right border-r pr-4 border-gray-200">
              <p className="text-sm font-bold text-gray-800">
                {session.user.name}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-blue-500 font-black">
                {session.user.role}
              </p>
            </div>
            <LogoutButton />
          </div>
        ) : (
          <Link 
            href="/auth/login" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md shadow-blue-200 transition-all active:scale-95"
          >
            Connexion
          </Link>
        )}
      </div>
    </nav>
  );
}
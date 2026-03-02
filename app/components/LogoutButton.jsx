"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
    router.refresh(); // Crucial pour vider le cache de la Navbar
  };

  return (
    <button
      onClick={handleLogout}
      className="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-wider"
    >
      Quitter
    </button>
  );
}
"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/auth/login' })}
      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm transition"
    >
      Déconnexion
    </button>
  );
}
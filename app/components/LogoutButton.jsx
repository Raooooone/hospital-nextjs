// app/components/LogoutButton.jsx
"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/auth/login" })}
      className="bg-red-500 text-white px-3 py-1 rounded text-sm"
    >
      Déconnexion
    </button>
  );
}
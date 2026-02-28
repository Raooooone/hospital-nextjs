// /app/actions/admin.js
"use server"; // Indique à Next.js que ceci s'exécute uniquement sur le serveur

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Fonction utilitaire de sécurité
async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Action non autorisée. Réservé aux administrateurs.");
  }
}

export async function createUser(formData) {
  await verifyAdmin(); // Sécurité : on vérifie que c'est bien l'admin qui appelle l'action

  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role");
  
  // Champs optionnels selon le rôle
  const specialite = formData.get("specialite");
  const age = formData.get("age") ? parseInt(formData.get("age")) : null;
  const maladie = formData.get("maladie");

  // Hachage du mot de passe pour la sécurité
  const hashedPassword = await bcrypt.hash(password, 10);

  // Enregistrement en base de données
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      specialite: role === "MEDECIN" ? specialite : null,
      age: role === "PATIENT" ? age : null,
      maladie: role === "PATIENT" ? maladie : null,
    }
  });

  // Rafraîchit les données du dashboard Admin côté frontend
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteUser(userId) {
  await verifyAdmin();
  
  await prisma.user.delete({
    where: { id: userId }
  });
  
  revalidatePath("/admin");
  return { success: true };
}
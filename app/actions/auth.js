"use server";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role") || "PATIENT"; // Récupère le rôle du formulaire
  const adminCode = formData.get("adminCode"); // Récupère le code secret si présent

  try {
    // 1. Validation de sécurité pour le rôle ADMIN
    if (role === "ADMIN") {
      const SYSTEM_ADMIN_CODE = process.env.ADMIN_SECRET_KEY || "MON_CODE_SUPER_SECRET_123";
      if (adminCode !== SYSTEM_ADMIN_CODE) {
        return { error: "Code d'invitation Admin invalide. Accès refusé." };
      }
    }

    // 2. Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "Cet email est déjà utilisé." };
    }

    // 3. Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Créer l'utilisateur avec le rôle choisi
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role, // Utilise la valeur dynamique (PATIENT, MEDECIN ou ADMIN)
      }
    });

    return { success: true };

  } catch (error) {
    console.error("Erreur d'inscription:", error);
    return { error: "Une erreur est survenue lors de la création du compte." };
  }
}
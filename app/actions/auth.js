"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  // 1. Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "Cet email est déjà utilisé." };
  }

  // 2. Hacher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Créer l'utilisateur (Par défaut, un nouvel inscrit est un PATIENT)
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "PATIENT", 
    }
  });

  return { success: true };
}
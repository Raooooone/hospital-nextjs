"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Action non autorisée. Réservé aux administrateurs.");
  }
  return session;
}

export async function createUser(formData) {
  await verifyAdmin();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role");
  
  const specialite = formData.get("specialite");
  const age = formData.get("age") ? parseInt(formData.get("age")) : null;
  const maladie = formData.get("maladie");

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name, email, password: hashedPassword, role,
      specialite: role === "MEDECIN" ? specialite : null,
      age: role === "PATIENT" ? age : null,
      maladie: role === "PATIENT" ? maladie : null,
    }
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function deleteUser(userId) {
  await verifyAdmin();
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin");
  return { success: true };
}

// L'admin se déconnecte et nettoie ses sessions en DB
export async function logoutAdmin() {
  const session = await verifyAdmin();
  await prisma.session.deleteMany({
    where: { userId: session.user.id }
  });
  return { success: true };
}
// /app/actions/medecin.js
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Fonction utilitaire de sécurité
async function verifyMedecin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "MEDECIN") {
    throw new Error("Action non autorisée. Réservé aux médecins.");
  }
  return session;
}

export async function updateAppointmentStatus(appointmentId, status) {
  const session = await verifyMedecin();

  // On vérifie d'abord que le RDV appartient bien à ce médecin
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId }
  });

  if (!appointment || appointment.doctorId !== session.user.id) {
    throw new Error("Ce rendez-vous ne vous est pas assigné.");
  }

  // Mise à jour du statut (CONFIRMED ou CANCELLED)
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: status }
  });

  // Rafraîchit instantanément le dashboard médecin
  revalidatePath("/medecin");
  return { success: true };
}
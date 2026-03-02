"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function verifyMedecin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "MEDECIN") {
    throw new Error("Action non autorisée. Réservé aux médecins.");
  }
  return session;
}

export async function updateAppointmentStatus(appointmentId, status) {
  const session = await verifyMedecin();

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId }
  });

  if (!appointment || appointment.doctorId !== session.user.id) {
    throw new Error("Ce rendez-vous ne vous est pas assigné.");
  }

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: status }
  });

  // Revalidate force la Navbar et le Dashboard à se mettre à jour
  revalidatePath("/medecin");
  revalidatePath("/", "layout"); 
  return { success: true };
}
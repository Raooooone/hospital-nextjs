// /app/actions/patient.js
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function verifyPatient() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "PATIENT") {
    throw new Error("Action non autorisée. Réservé aux patients.");
  }
  return session;
}

export async function bookAppointment(doctorId, dateStr) {
  const session = await verifyPatient();

  // Création du rendez-vous
  await prisma.appointment.create({
    data: {
      patientId: session.user.id, // L'ID vient de la session sécurisée, on ne fait pas confiance au client
      doctorId: doctorId,
      date: new Date(dateStr), // Conversion de la chaîne de date du formulaire en objet Date
      status: "PENDING"        // En attente de validation par le médecin par défaut
    }
  });

  // Met à jour la page du patient pour afficher le nouveau RDV dans l'historique
  revalidatePath("/patient");
  return { success: true };
}

export async function updatePatientProfile(formData) {
  const session = await verifyPatient();
  
  const contact = formData.get("contact");
  const maladie = formData.get("maladie");

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      contact: contact,
      maladie: maladie
    }
  });

  revalidatePath("/patient");
  return { success: true };
}
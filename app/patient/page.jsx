import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import BookingForm from "./BookingForm";

export const dynamic = 'force-dynamic';

export default async function PatientPage() {
  const session = await getServerSession(authOptions);

  // Historique des rendez-vous du patient
  const myAppointments = await prisma.appointment.findMany({
    where: { patientId: session.user.id },
    include: { doctor: true },
    orderBy: { date: 'asc' }
  });

  // Liste des médecins disponibles pour la prise de RDV
  const availableDoctors = await prisma.user.findMany({
    where: { role: "MEDECIN" },
    select: { id: true, name: true, specialite: true }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* Colonne de gauche : Historique */}
      <div>
        <h1 className="text-3xl font-bold mb-6">Mon Historique Médical</h1>
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          {myAppointments.length === 0 ? (
            <p className="text-gray-500">Vous n'avez aucun rendez-vous.</p>
          ) : (
            myAppointments.map(appt => (
              <div key={appt.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="font-bold">Dr. {appt.doctor.name} <span className="text-sm font-normal text-gray-500">({appt.doctor.specialite})</span></p>
                <p className="text-gray-700">{new Date(appt.date).toLocaleString('fr-FR')}</p>
                <p className="text-sm mt-1">
                  Statut : <span className="font-semibold">{appt.status}</span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Colonne de droite : Prise de rendez-vous */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Prendre un rendez-vous</h2>
        <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
          <BookingForm doctors={availableDoctors} />
        </div>
      </div>

    </div>
  );
}
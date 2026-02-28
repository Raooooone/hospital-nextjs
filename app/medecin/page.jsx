import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AppointmentActions from "./AppointmentActions";

export const dynamic = 'force-dynamic';

export default async function MedecinPage() {
  const session = await getServerSession(authOptions);

  // Fetch : Uniquement les RDV de ce médecin
  const appointments = await prisma.appointment.findMany({
    where: { doctorId: session.user.id },
    include: { patient: true },
    orderBy: { date: 'asc' }
  });

  const pendingCount = appointments.filter(a => a.status === "PENDING").length;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Bonjour, Dr. {session.user.name}</h1>
      <p className="text-gray-600 mb-8">Vous avez {pendingCount} demande(s) de rendez-vous en attente.</p>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Vos Rendez-vous</h2>
        
        {appointments.length === 0 ? (
          <p className="text-gray-500">Aucun rendez-vous planifié.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <div key={appt.id} className="flex justify-between items-center p-4 border rounded hover:bg-gray-50">
                <div>
                  <p className="font-bold text-lg">{appt.patient.name}</p>
                  <p className="text-sm text-gray-500">
                    Âge: {appt.patient.age || 'N/A'} ans | Maladie: {appt.patient.maladie || 'Aucune renseignée'}
                  </p>
                  <p className="text-blue-600 font-medium mt-1">
                    📅 {new Date(appt.date).toLocaleString('fr-FR')}
                  </p>
                </div>
                
                {/* Composant Client pour l'interactivité (Boutons Valider/Annuler) */}
                <AppointmentActions appointmentId={appt.id} currentStatus={appt.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
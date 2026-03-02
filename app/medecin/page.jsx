import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation"; // Import pour la redirection
import AppointmentActions from "./AppointmentActions";

export const dynamic = 'force-dynamic';

export default async function MedecinPage() {
  const session = await getServerSession(authOptions);

  // SÉCURITÉ : Si pas de session ou pas le bon rôle, redirection immédiate
  if (!session || session.user.role !== "MEDECIN") {
    redirect("/auth/login");
  }

  const appointments = await prisma.appointment.findMany({
    where: { doctorId: session.user.id },
    include: { patient: true },
    orderBy: { date: 'asc' }
  });

  const pendingCount = appointments.filter(a => a.status === "PENDING").length;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Bonjour, Dr. {session.user.name}</h1>
          <p className="text-gray-600">
             {pendingCount > 0 
               ? `Vous avez ${pendingCount} demande(s) en attente.` 
               : "Aucune demande en attente."}
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Gestion des Rendez-vous</h2>
        
        {appointments.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-400 italic">Aucun rendez-vous dans votre base de données.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <div key={appt.id} className="flex justify-between items-center p-4 border rounded-xl hover:shadow-md transition-shadow bg-gray-50/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-gray-800">{appt.patient.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      appt.status === 'PENDING' ? 'bg-orange-100 text-orange-600' : 
                      appt.status === 'CONFIRMED' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Âge: <span className="text-gray-700">{appt.patient.age || 'N/A'} ans</span> | 
                    Maladie: <span className="text-gray-700">{appt.patient.maladie || 'Non renseignée'}</span>
                  </p>
                  <p className="text-blue-600 font-semibold flex items-center gap-1">
                    📅 {new Date(appt.date).toLocaleString('fr-FR', { 
                        dateStyle: 'long', 
                        timeStyle: 'short' 
                    })}
                  </p>
                </div>
                
                <AppointmentActions appointmentId={appt.id} currentStatus={appt.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
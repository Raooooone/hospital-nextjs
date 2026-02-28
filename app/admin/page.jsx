import { prisma } from "@/lib/prisma";
import UserForm from "./UserForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic'; // Désactive la mise en cache (données toujours fraîches)

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") redirect("/unauthorized");

  // Fetching côté serveur
  const patients = await prisma.user.findMany({ where: { role: "PATIENT" } });
  const medecins = await prisma.user.findMany({ where: { role: "MEDECIN" } });
  const appointments = await prisma.appointment.findMany({
    include: { doctor: true, patient: true },
    orderBy: { date: 'desc' }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Administrateur</h1>

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border-t-4 border-blue-500">
          <p className="text-gray-500">Patients inscrits</p>
          <p className="text-3xl font-bold">{patients.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-t-4 border-green-500">
          <p className="text-gray-500">Médecins actifs</p>
          <p className="text-3xl font-bold">{medecins.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-t-4 border-purple-500">
          <p className="text-gray-500">Total Rendez-vous</p>
          <p className="text-3xl font-bold">{appointments.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gestion des comptes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Ajouter un utilisateur</h2>
          <UserForm />
        </div>

        {/* Liste globale des RDV */}
        <div className="bg-white p-6 rounded-lg shadow overflow-auto max-h-96">
          <h2 className="text-xl font-bold mb-4">Tous les rendez-vous</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2">Date</th>
                <th>Patient</th>
                <th>Médecin</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((rdv) => (
                <tr key={rdv.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{new Date(rdv.date).toLocaleString('fr-FR')}</td>
                  <td>{rdv.patient.name}</td>
                  <td>Dr. {rdv.doctor.name}</td>
                  <td>
                    <span className={`px-2 py-1 rounded text-xs text-white ${rdv.status === 'CONFIRMED' ? 'bg-green-500' : rdv.status === 'PENDING' ? 'bg-orange-500' : 'bg-red-500'}`}>
                      {rdv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
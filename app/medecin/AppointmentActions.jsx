"use client";
import { updateAppointmentStatus } from "@/app/actions/medecin";

export default function AppointmentActions({ appointmentId, currentStatus }) {
  
  const handleStatusChange = async (status) => {
    await updateAppointmentStatus(appointmentId, status);
  };

  if (currentStatus === "CONFIRMED") {
    return <span className="text-green-600 font-bold bg-green-100 px-3 py-1 rounded">Confirmé</span>;
  }
  if (currentStatus === "CANCELLED") {
    return <span className="text-red-600 font-bold bg-red-100 px-3 py-1 rounded">Annulé</span>;
  }

  // Si le statut est "PENDING"
  return (
    <div className="flex gap-2">
      <button 
        onClick={() => handleStatusChange("CONFIRMED")}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm transition"
      >
        Confirmer
      </button>
      <button 
        onClick={() => handleStatusChange("CANCELLED")}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition"
      >
        Annuler
      </button>
    </div>
  );
}
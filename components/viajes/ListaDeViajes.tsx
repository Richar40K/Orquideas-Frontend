"use client";

import { useRouter } from "next/navigation";
import { ArrowRightCircle } from "lucide-react";

// Demo: Esta lista debería venir de tu backend
const viajes = [
  {
    id: "1",
    tipo: "Evolution",
    asiento: "160°/140°",
    horaSalida: "06:55",
    horaLlegada: "00:25",
    origen: "Lima (Javier Prado)",
    destino: "Arequipa",
    duracion: "17 hrs 30 mins",
    escalas: 5,
    precio: 132,
    asientosDisponibles: 10,
  },
];

export default function ListaDeViajes() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-900 text-center">Elige tu Viaje</h2>
      <div className="space-y-5">
        {viajes.map((viaje) => (
          <div
            key={viaje.id}
            className="flex flex-col sm:flex-row items-center sm:items-stretch justify-between gap-4 p-5 rounded-2xl bg-white shadow-xl hover:shadow-2xl border-l-4 border-blue-600 hover:bg-blue-50 cursor-pointer transition"
            onClick={() => router.push(`/viajes/${viaje.id}`)}
          >
            <div className="flex flex-1 flex-col sm:flex-row items-center gap-4">
              <div className="flex flex-col items-center sm:items-start">
                <span className="text-xs text-blue-600 font-bold uppercase tracking-wide">{viaje.tipo}</span>
                <span className="text-gray-500 text-sm">{viaje.asiento}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xl text-blue-900">{viaje.horaSalida}</span>
                <span className="text-gray-400">→</span>
                <span className="font-semibold text-xl text-green-700">{viaje.horaLlegada}</span>
              </div>
              <div className="hidden sm:flex flex-col items-center mx-6">
                <span className="text-xs text-gray-500">{viaje.escalas} escalas</span>
                <span className="text-sm text-gray-700">{viaje.duracion}</span>
              </div>
              <div className="flex flex-col items-center sm:items-end">
                <span className="text-gray-500 text-sm">{viaje.origen}</span>
                <span className="text-gray-800 text-sm">→</span>
                <span className="text-gray-500 text-sm">{viaje.destino}</span>
              </div>
            </div>
            <div className="flex flex-col items-end justify-between min-w-[130px]">
              <span className="font-bold text-blue-700 mb-1">
                Desde: <span className="text-lg text-green-600">S/. {viaje.precio}</span>
              </span>
              {viaje.asientosDisponibles < 10 && (
                <span className="text-xs text-orange-500 mb-1">{viaje.asientosDisponibles} asientos disponibles</span>
              )}
              <button
                className="flex items-center gap-2 bg-yellow-400 text-blue-900 font-bold px-4 py-2 rounded-xl hover:bg-yellow-300 shadow transition"
                onClick={e => {
                  e.stopPropagation();
                  router.push(`/cliente/viajes/${viaje.id}`);
                }}
              >
                Ver detalles <ArrowRightCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, User } from "lucide-react";
import { useState } from "react";


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
    totalAsientos: 40,
    asientosOcupados: [1, 5, 10, 13, 22, 34, 39],
  },
];

export default function DetalleViajePage() {
  const params = useParams();
  const router = useRouter();
  const viaje = viajes.find((v) => v.id === params.id?.toString());

  const [asientoSeleccionado, setAsientoSeleccionado] = useState<number | null>(null);

  if (!viaje) {
    return (
      <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-xl text-center">
        <h2 className="text-xl font-bold mb-4 text-red-600">Viaje no encontrado</h2>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:underline mt-4"
        >
          <ArrowLeft className="w-5 h-5" /> Volver
        </button>
      </div>
    );
  }


  const columnas = 4;
  const asientos = Array.from({ length: viaje.totalAsientos }, (_, i) => i + 1);

  return (
    <div className="max-w-5xl mx-auto mt-8 bg-white p-4 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row gap-8">

      <div className="flex-1">
        <h2 className="text-xl font-bold text-blue-700 mb-4">Elige tu asiento</h2>
        <div className="grid grid-cols-4 gap-4 bg-blue-50 p-4 rounded-xl">
          {asientos.map((n) => {
            const ocupado = viaje.asientosOcupados.includes(n);
            const seleccionado = asientoSeleccionado === n;
            return (
              <button
                key={n}
                disabled={ocupado}
                onClick={() => setAsientoSeleccionado(n)}
                className={`
                  w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg border-2 font-bold text-lg
                  transition
                  ${ocupado
                    ? "bg-gray-300 text-gray-400 border-gray-400 cursor-not-allowed"
                    : seleccionado
                    ? "bg-yellow-400 border-yellow-500 text-blue-900 shadow-lg scale-105"
                    : "bg-white border-blue-200 hover:bg-blue-100 hover:border-blue-500 text-blue-700"}
                `}
                aria-label={`Asiento ${n} ${ocupado ? "ocupado" : seleccionado ? "seleccionado" : "disponible"}`}
              >
                {ocupado ? <User className="w-6 h-6" /> : seleccionado ? <Check className="w-6 h-6" /> : n}
              </button>
            );
          })}
        </div>
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-yellow-400 inline-block border border-yellow-500" /> Seleccionado
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-blue-100 inline-block border border-blue-400" /> Disponible
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-gray-300 inline-block border border-gray-400" /> Ocupado
          </div>
        </div>
      </div>


      <div className="flex-1 flex flex-col items-center md:items-start justify-start bg-gray-50 p-6 rounded-xl min-w-[270px] shadow-inner">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Resumen de tu reserva</h3>
          <div className="space-y-2 text-gray-800 text-base">
            <div>
              <span className="font-semibold text-blue-700">Asiento: </span>
              {asientoSeleccionado ? (
                <span className="text-lg">{asientoSeleccionado}</span>
              ) : (
                <span className="text-gray-400">Selecciona un asiento</span>
              )}
            </div>
            <div>
              <span className="font-semibold text-blue-700">Precio: </span>
              <span className="text-green-700 font-bold text-lg">S/. {viaje.precio}</span>
            </div>
            <div>
              <span className="font-semibold text-blue-700">Origen: </span>
              {viaje.origen}
            </div>
            <div>
              <span className="font-semibold text-blue-700">Destino: </span>
              {viaje.destino}
            </div>
            <div>
              <span className="font-semibold text-blue-700">Salida: </span>
              {viaje.horaSalida}
            </div>
            <div>
              <span className="font-semibold text-blue-700">Llegada: </span>
              {viaje.horaLlegada}
            </div>
            <div>
              <span className="font-semibold text-blue-700">Duración: </span>
              {viaje.duracion}
            </div>
          </div>
          <button
            disabled={!asientoSeleccionado}
            className="w-full mt-8 bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition disabled:bg-gray-300"
            onClick={() => {
              if (asientoSeleccionado) {
                // Aquí llamas a tu API para crear la orden en Mercado Pago y redirigir
                // Por ahora: solo simula
                window.location.href = "https://www.mercadopago.com.pe"; // reemplaza por tu URL real
              }
            }}
          >
            {asientoSeleccionado ? "Pagar y reservar" : "Selecciona un asiento"}
          </button>
        </div>
      </div>
    </div>
  );
}

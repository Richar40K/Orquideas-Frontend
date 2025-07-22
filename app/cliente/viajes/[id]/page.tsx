"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, User, UserCheck, Navigation, Users, User2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { getUserFromToken } from "@/utils/getUserFromToken";

interface Asiento {
  numero: number;
  estado: string;
}

interface Viaje {
  id: string;
  origen: string;
  destino: string;
  fechaSalida: string;
  horaSalida: string;
  fechaLlegada: string;
  horaLLegada: string;
  precio: number;
  totalAsientos: number;
}

export default function DetalleViajePage() {
  const params = useParams();
  const router = useRouter();
  const [viaje, setViaje] = useState<Viaje | null>(null);
  const [asientos, setAsientos] = useState<Asiento[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [asientoSeleccionado, setAsientoSeleccionado] = useState<number | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const apiUrl = process.env.NEXT_PUBLIC_API;

        const viajeResponse = await fetch(`${apiUrl}/viajes/${params.id}`);
        if (!viajeResponse.ok) {
          throw new Error(`Error al obtener datos del viaje: ${viajeResponse.status}`);
        }
        const viajeData = await viajeResponse.json();

        const asientosResponse = await fetch(`${apiUrl}/viajes/${params.id}/asientos`);
        if (!asientosResponse.ok) {
          throw new Error(`Error al obtener asientos: ${asientosResponse.status}`);
        }
        const asientosData = await asientosResponse.json();

        setViaje(viajeData);
        setAsientos(asientosData);
      } catch (e: any) {
        setError(e.message || "Error al cargar los datos del viaje");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handlePayment = async () => {
    if (!asientoSeleccionado || !viaje) {
      setPaymentError("Por favor, selecciona un asiento.");
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API;
      const username = getUserFromToken();
      if (!username) {
        setPaymentError("No se encontró el usuario.");
        return;
      }

      const userResponse = await axios.get(`${apiUrl}/users/username/${username}`);
      const userId = userResponse.data.id;

      const paymentData = {
        userId: userId,
        viajeId: parseInt(viaje.id),
        asiento: asientoSeleccionado
      };

      const paymentResponse = await axios.post(`${apiUrl}/pagos/viaje`, paymentData);

      if (paymentResponse.data.mpInitPoint) {
        const mpWindow = window.open(paymentResponse.data.mpInitPoint, '_blank');
        window.location.href = '/cliente/viajes';
        if (mpWindow) {
          mpWindow.focus();
        } else {
          alert("Por favor habilite popups y haga clic en este enlace para pagar: " + paymentResponse.data.mpInitPoint);
        }
      } else {
        alert("Pago procesado correctamente. Redirigiendo a mis viajes...");
        window.location.href = '/mis-viajes';
      }

    } catch (e: any) {
      setPaymentError(e.message || "Ocurrió un error al intentar procesar el pago.");
    }
  };

  const renderBusLayout = () => {
    // Organizar asientos por filas (asumiendo 4 asientos por fila: 2-2)
    const asientosPorFila = 4;
    const filas = [];
    const totalFilas = Math.ceil(asientos.length / asientosPorFila);
    
    for (let i = 0; i < totalFilas; i++) {
      const asientosFila = asientos.slice(i * asientosPorFila, (i + 1) * asientosPorFila);
      filas.push(asientosFila);
    }

    return (
      <div className="bg-gradient-to-b from-blue-50 to-blue-100 p-6 rounded-2xl shadow-inner border-2 border-blue-200">
        {/* Área del conductor */}
        <div className="mb-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-400 p-3 rounded-full shadow-lg">
                <Navigation className="w-6 h-6 text-gray-800" />
              </div>
              <span className="text-white font-semibold">Conductor</span>
            </div>
            <div className="text-white text-sm opacity-75">Frente del bus</div>
          </div>
        </div>

        {/* Escaleras de entrada */}
        <div className="mb-4 flex justify-center">
          <div className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md text-sm font-medium">
            🚪 Entrada
          </div>
        </div>

        {/* Asientos */}
        <div className="space-y-3">
          {filas.map((fila, filaIndex) => (
            <div key={filaIndex} className="flex justify-between items-center gap-4">
              {/* Lado izquierdo (ventana) */}
              <div className="flex gap-2">
                {fila.slice(0, 2).map((asiento) => {
                  if (!asiento) return <div key="empty-left" className="w-14 h-14"></div>;
                  const ocupado = asiento.estado !== "DISPONIBLE";
                  const seleccionado = asientoSeleccionado === asiento.numero;
                  
                  return (
                    <button
                      key={asiento.numero}
                      disabled={ocupado}
                      onClick={() => setAsientoSeleccionado(asiento.numero)}
                      className={`
                        w-14 h-14 flex items-center justify-center rounded-xl border-2 font-bold text-sm
                        transition-all duration-200 transform hover:scale-105 shadow-md
                        ${ocupado
                          ? "bg-gradient-to-b from-red-400 to-red-500 text-white border-red-600 cursor-not-allowed shadow-red-200"
                          : seleccionado
                            ? "bg-gradient-to-b from-green-400 to-green-500 text-white border-green-600 shadow-green-200 scale-105"
                            : "bg-gradient-to-b from-blue-200 to-blue-300 border-blue-400 hover:from-blue-300 hover:to-blue-400 text-blue-900"}
                      `}
                      aria-label={`Asiento ${asiento.numero} ${ocupado ? "ocupado" : seleccionado ? "seleccionado" : "disponible"}`}
                    >
                      {ocupado ? <User className="w-5 h-5" /> : seleccionado ? <Check className="w-5 h-5" /> : asiento.numero}
                    </button>
                  );
                })}
              </div>

              {/* Pasillo central */}
              <div className="w-8 h-1 bg-gray-300 rounded-full opacity-50"></div>

              {/* Lado derecho (pasillo) */}
              <div className="flex gap-2">
                {fila.slice(2, 4).map((asiento) => {
                  if (!asiento) return <div key="empty-right" className="w-14 h-14"></div>;
                  const ocupado = asiento.estado !== "DISPONIBLE";
                  const seleccionado = asientoSeleccionado === asiento.numero;
                  
                  return (
                    <button
                      key={asiento.numero}
                      disabled={ocupado}
                      onClick={() => setAsientoSeleccionado(asiento.numero)}
                      className={`
                        w-14 h-14 flex items-center justify-center rounded-xl border-2 font-bold text-sm
                        transition-all duration-200 transform hover:scale-105 shadow-md
                        ${ocupado
                          ? "bg-gradient-to-b from-red-400 to-red-500 text-white border-red-600 cursor-not-allowed shadow-red-200"
                          : seleccionado
                            ? "bg-gradient-to-b from-green-400 to-green-500 text-white border-green-600 shadow-green-200 scale-105"
                            : "bg-gradient-to-b from-blue-200 to-blue-300 border-blue-400 hover:from-blue-300 hover:to-blue-400 text-blue-900"}
                      `}
                      aria-label={`Asiento ${asiento.numero} ${ocupado ? "ocupado" : seleccionado ? "seleccionado" : "disponible"}`}
                    >
                      {ocupado ? <User className="w-5 h-5" /> : seleccionado ? <Check className="w-5 h-5" /> : asiento.numero}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Área de baños */}
        <div className="mt-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 shadow-lg border-2 border-purple-200">
          <div className="flex justify-around items-center">
            <div className="flex flex-col items-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-lg shadow-md">
              <User2 className="w-6 h-6" />
              <span className="text-xs font-medium">Hombres</span>
            </div>
            <div className="text-purple-600 font-semibold">Baños</div>
            <div className="flex flex-col items-center gap-2 bg-pink-500 text-white px-4 py-3 rounded-lg shadow-md">
              <Users className="w-6 h-6" />
              <span className="text-xs font-medium">Mujeres</span>
            </div>
          </div>
        </div>

        {/* Escaleras traseras */}
        <div className="mt-4 flex justify-center">
          <div className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md text-sm font-medium">
            🚪 Salida de Emergencia
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-xl text-center">
        <h2 className="text-xl font-bold mb-4 text-blue-600">Cargando detalles del viaje...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-xl text-center">
        <h2 className="text-xl font-bold mb-4 text-red-600">Error: {error}</h2>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:underline mt-4"
        >
          <ArrowLeft className="w-5 h-5" /> Volver
        </button>
      </div>
    );
  }

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

  const fechaSalida = new Date(`${viaje.fechaSalida}T${viaje.horaSalida}`);
  const fechaLlegada = new Date(`${viaje.fechaLlegada}T${viaje.horaLLegada}`);
  const duracionMs = fechaLlegada.getTime() - fechaSalida.getTime();
  const duracionHoras = Math.floor(duracionMs / (1000 * 60 * 60));
  const duracionMinutos = Math.floor((duracionMs % (1000 * 60 * 60)) / (1000 * 60));
  const duracion = `${duracionHoras} hrs ${duracionMinutos} mins`;

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white p-4 sm:p-8 rounded-2xl shadow-2xl flex flex-col xl:flex-row gap-8">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">🚌 Selecciona tu Asiento</h2>
        
        {renderBusLayout()}

        {/* Leyenda modernizada */}
        <div className="flex flex-wrap justify-center gap-6 mt-6 p-4 bg-gray-50 rounded-xl shadow-inner">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-b from-green-400 to-green-500 border-2 border-green-600 shadow-md" />
            <span className="text-sm font-medium text-gray-700">Seleccionado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-b from-blue-200 to-blue-300 border-2 border-blue-400 shadow-md" />
            <span className="text-sm font-medium text-gray-700">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-b from-red-400 to-red-500 border-2 border-red-600 shadow-md" />
            <span className="text-sm font-medium text-gray-700">Ocupado</span>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-md flex flex-col items-center md:items-start justify-start bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl min-w-[320px] shadow-2xl border border-blue-200">
        <div className="w-full">
          <h3 className="text-xl font-bold text-blue-900 mb-4 text-center">📋 Resumen de Reserva</h3>
          <div className="space-y-4 text-gray-800">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <span className="font-semibold text-blue-700">🪑 Asiento: </span>
              {asientoSeleccionado ? (
                <span className="text-lg font-bold text-green-600">#{asientoSeleccionado}</span>
              ) : (
                <span className="text-gray-400 italic">Selecciona un asiento</span>
              )}
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <span className="font-semibold text-blue-700">💰 Precio: </span>
              <span className="text-green-700 font-bold text-xl">S/. {viaje.precio}</span>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <span className="font-semibold text-blue-700">🏁 Origen: </span>
              <span className="font-medium">{viaje.origen}</span>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <span className="font-semibold text-blue-700">🎯 Destino: </span>
              <span className="font-medium">{viaje.destino}</span>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <span className="font-semibold text-blue-700">🕒 Salida: </span>
              <span className="font-medium">{viaje.horaSalida}</span>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <span className="font-semibold text-blue-700">🏁 Llegada: </span>
              <span className="font-medium">{viaje.horaLLegada}</span>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <span className="font-semibold text-blue-700">⏱️ Duración: </span>
              <span className="font-medium">{duracion}</span>
            </div>
          </div>
          {paymentError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4">
              {paymentError}
            </div>
          )}
          <button
            disabled={!asientoSeleccionado}
            className="w-full mt-6 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 disabled:from-gray-400 disabled:to-gray-500 disabled:transform-none shadow-lg"
            onClick={handlePayment}
          >
            {asientoSeleccionado ? "💳 Pagar y Reservar" : "Selecciona un asiento"}
          </button>
        </div>
      </div>
    </div>
  );
}
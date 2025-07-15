"use client";

import { useState } from "react";
import { Search, MapPin, Clock, Truck, CheckCircle, CheckSquare, Loader2 } from "lucide-react";

type EstadoEncomienda = "PENDIENTE" | "CONFIRMADO" | "PAGADO" | "ENVIADO" | "ENTREGADO";
const API_BASE_URL = process.env.NEXT_PUBLIC_API;
interface Encomienda {
  id: number;
  user: {
    id: number;
    name: string;
    lastName: string;
    email: string;
    cellPhone: string;
  };
  tipo: string;
  origen: string;
  destino: string;
  dniDestino: string;
  nombreDestino: string;
  apellidoDestino: string;
  estado: EstadoEncomienda;
  codigo: string;
  precio: number;
  clave: string;
}

export default function SeguimientoEncomienda() {
  const [codigo, setCodigo] = useState("");
  const [encomienda, setEncomienda] = useState<Encomienda | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const estadosInfo = {
    PENDIENTE: { label: "Pendiente", color: "bg-gray-500", icon: <CheckSquare className="w-4 h-4" /> },
    CONFIRMADO: { label: "Confirmado", color: "bg-blue-500", icon: <CheckSquare className="w-4 h-4" /> },
    PAGADO: { label: "Pagado", color: "bg-indigo-500", icon: <CheckSquare className="w-4 h-4" /> },
    ENVIADO: { label: "Enviado", color: "bg-yellow-500", icon: <Truck className="w-4 h-4" /> },
    ENTREGADO: { label: "Entregado", color: "bg-green-500", icon: <CheckCircle className="w-4 h-4" /> },
  };

  const handleBuscar = async () => {
    if (!codigo) {
      setError("Por favor, ingrese un código de encomienda.");
      setEncomienda(null);
      return;
    }

    setLoading(true);
    setError(null);
    setEncomienda(null);

    try {
      // Realizar la búsqueda usando el código directamente
      const response = await fetch(`${API_BASE_URL}/encomiendas/code/${codigo}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Encomienda no encontrada.");
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al buscar la encomienda.");
      }

      const data: Encomienda = await response.json();
      setEncomienda(data);

    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado al buscar la encomienda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full mb-4">
          <Search className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Seguimiento de Encomienda</h2>
        <p className="text-gray-600 mt-2">Ingrese el código para rastrear su paquete</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Ingrese el código de encomienda (ej: ORQ-2025-001)"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
            />
          </div>
          <button
            onClick={handleBuscar}
            disabled={loading || !codigo}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
              ${loading || !codigo
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl"}
            `}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
      </div>

      {encomienda && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="border-b pb-4 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Encomienda #{encomienda.codigo}</h3>
                <p className="text-gray-600">Registrada por: {encomienda.user.name || "Nombre no disponible"} {encomienda.user.lastName || "Apellido no disponible"}</p>
              </div>
              <div className={`px-4 py-2 rounded-full text-white font-medium flex items-center gap-2 ${estadosInfo[encomienda.estado].color}`}>
                {estadosInfo[encomienda.estado].icon}
                {estadosInfo[encomienda.estado].label}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Remitente</h4>
                <p className="text-sm text-gray-600">ID: {encomienda.user.id}</p>
                <p className="text-sm text-gray-600">Email: {encomienda.user.email}</p>
                <p className="text-sm text-gray-600">Teléfono: {encomienda.user.cellPhone || "Teléfono no disponible"}</p>
                <p className="text-sm text-gray-600">Origen: {encomienda.origen}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Destinatario</h4>
                <p className="text-sm text-gray-600">{encomienda.nombreDestino} {encomienda.apellidoDestino}</p>
                <p className="text-sm text-gray-600">DNI: {encomienda.dniDestino}</p>
                <p className="text-sm text-gray-600">Destino: {encomienda.destino}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Detalles</h4>
                <p className="text-sm text-gray-600">Tipo: {encomienda.tipo}</p>
                <p className="text-sm text-gray-600">Precio: S/ {encomienda.precio}</p>
                <p className="text-sm text-gray-600">Clave: {encomienda.clave}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Historial de Seguimiento (Simulado)
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${estadosInfo[encomienda.estado].color}`}></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">Estado Actual: {estadosInfo[encomienda.estado].label}</p>
                  <p className="text-sm text-gray-600">Última actualización: {new Date().toLocaleString()}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-white text-sm ${estadosInfo[encomienda.estado].color}`}>
                  {estadosInfo[encomienda.estado].label}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

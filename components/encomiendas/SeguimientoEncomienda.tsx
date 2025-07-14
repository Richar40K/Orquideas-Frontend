"use client";

import { useState } from "react";
import { Search, MapPin, Clock, Truck, CheckCircle, CheckSquare } from "lucide-react";

type EstadoEncomienda = "REGISTRADA" | "EN_TRANSITO" | "EN_DESTINO" | "ENTREGADA";

interface Encomienda {
  codigo: string;
  remitente: string;
  destinatario: string;
  origen: string;
  destino: string;
  estado: EstadoEncomienda;
  fechaRegistro: string;
  fechaEstimada: string;
  tipo: string;
  precio: number;
  tracking: {
    fecha: string;
    ubicacion: string;
    estado: EstadoEncomienda;
  }[];
}

export default function SeguimientoEncomienda() {
  const [codigo, setCodigo] = useState("");
  const [encomienda, setEncomienda] = useState<Encomienda | null>(null);
  const [loading, setLoading] = useState(false);

  const estadosInfo = {
    REGISTRADA: { label: "Registrada", color: "bg-blue-500", icon: <CheckSquare className="w-4 h-4" /> },
    EN_TRANSITO: { label: "En Tránsito", color: "bg-yellow-500", icon: <Truck className="w-4 h-4" /> },
    EN_DESTINO: { label: "En Destino", color: "bg-orange-500", icon: <MapPin className="w-4 h-4" /> },
    ENTREGADA: { label: "Entregada", color: "bg-green-500", icon: <CheckCircle className="w-4 h-4" /> },
  };

  const handleBuscar = async () => {
    if (!codigo) return;
    
    setLoading(true);
    // Simular llamada a API
    setTimeout(() => {
      setEncomienda({
        codigo: codigo,
        remitente: "Juan Pérez",
        destinatario: "María González",
        origen: "Lima",
        destino: "Arequipa",
        estado: "EN_TRANSITO",
        fechaRegistro: "2025-07-10",
        fechaEstimada: "2025-07-15",
        tipo: "CAJA_M",
        precio: 20,
        tracking: [
          { fecha: "2025-07-10 09:00", ubicacion: "Lima - Oficina Central", estado: "REGISTRADA" },
          { fecha: "2025-07-10 14:30", ubicacion: "Lima - En ruta", estado: "EN_TRANSITO" },
          { fecha: "2025-07-11 08:00", ubicacion: "Huancayo - Centro de distribución", estado: "EN_TRANSITO" },
          { fecha: "2025-07-12 10:30", ubicacion: "Arequipa - En ruta de entrega", estado: "EN_DESTINO" },
        ]
      });
      setLoading(false);
    }, 1000);
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
              placeholder="Ingrese el código de encomienda (ej: ENC-2025-001)"
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
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Search className="w-5 h-5" />
            )}
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </div>

      {encomienda && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="border-b pb-4 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Encomienda #{encomienda.codigo}</h3>
                <p className="text-gray-600">Registrada el {encomienda.fechaRegistro}</p>
              </div>
              <div className={`px-4 py-2 rounded-full text-white font-medium flex items-center gap-2 ${estadosInfo[encomienda.estado].color}`}>
                {estadosInfo[encomienda.estado].icon}
                {estadosInfo[encomienda.estado].label}
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Remitente</h4>
                <p className="text-sm text-gray-600">{encomienda.remitente}</p>
                <p className="text-sm text-gray-600">{encomienda.origen}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Destinatario</h4>
                <p className="text-sm text-gray-600">{encomienda.destinatario}</p>
                <p className="text-sm text-gray-600">{encomienda.destino}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Detalles</h4>
                <p className="text-sm text-gray-600">Tipo: {encomienda.tipo}</p>
                <p className="text-sm text-gray-600">Precio: S/ {encomienda.precio}</p>
                <p className="text-sm text-gray-600">Est. entrega: {encomienda.fechaEstimada}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Historial de Seguimiento
            </h4>
            <div className="space-y-4">
              {encomienda.tracking.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${estadosInfo[item.estado as EstadoEncomienda].color}`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.ubicacion}</p>
                    <p className="text-sm text-gray-600">{item.fecha}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-white text-sm ${estadosInfo[item.estado as EstadoEncomienda].color}`}>
                    {estadosInfo[item.estado as EstadoEncomienda].label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
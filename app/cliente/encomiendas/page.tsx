"use client";

import { useState } from "react";
import { Package, Search } from "lucide-react";
import RegistrarEncomienda from "@/components/encomiendas/RegistrarEncomienda";
import SeguimientoEncomienda from "@/components/encomiendas/SeguimientoEncomienda";

export default function EncomiendasPage() {
  const [view, setView] = useState<"registro" | "seguimiento">("registro");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full mb-4 shadow-lg">
            <Package className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Gestión de Encomiendas</h1>
          <p className="text-xl text-gray-600">Sistema integral para envío y seguimiento de paquetes</p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setView("registro")}
            className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg
              ${view === "registro"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-200"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow-gray-200"}`}
          >
            <Package className="w-5 h-5" />
            Registrar Encomienda
          </button>
          <button
            onClick={() => setView("seguimiento")}
            className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg
              ${view === "seguimiento"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-green-200"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow-gray-200"}`}
          >
            <Search className="w-5 h-5" />
            Hacer Seguimiento
          </button>
        </div>

        <div className="transition-all duration-500">
          {view === "registro" && <RegistrarEncomienda />}
          {view === "seguimiento" && <SeguimientoEncomienda />}
        </div>
      </div>
    </div>
  );
}
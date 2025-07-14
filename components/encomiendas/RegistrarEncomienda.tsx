"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, CreditCard, CheckCircle } from "lucide-react";

type PaqueteTipo = "SOBRE_A4" | "CAJA_S" | "CAJA_M" | "CAJA_XX" | "CAJA_XXL";

const pasos = ["Datos", "Paquete", "Pagar"];

export default function RegistrarEncomienda() {
  const [paso, setPaso] = useState(1);
  const [form, setForm] = useState({
    nombres: "",
    dni: "",
    direccion: "",
    tipo: "SOBRE_A4" as PaqueteTipo,
    precio: 0,
  });

  const precios: Record<PaqueteTipo, number> = {
    SOBRE_A4: 10,
    CAJA_S: 15,
    CAJA_M: 20,
    CAJA_XX: 25,
    CAJA_XXL: 30,
  };

  const handleNext = () => {
    if (paso === 2) {
      setForm((f) => ({ ...f, precio: precios[f.tipo] }));
    }
    setPaso((prev) => prev + 1);
  };

  const handleBack = () => setPaso((prev) => prev - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="mt-8 bg-white shadow-xl rounded-xl p-6">
      {/* Barra de pasos */}
      <div className="flex justify-between items-center mb-8">
        {pasos.map((label, index) => {
          const stepNumber = index + 1;
          const active = paso === stepNumber;
          const completed = paso > stepNumber;

          return (
            <div key={index} className="flex-1 flex flex-col items-center relative">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2
                  ${active ? "bg-blue-600 text-white border-blue-600 shadow-lg animate-pulse"
                         : completed ? "bg-green-500 text-white border-green-500"
                         : "bg-white text-gray-400 border-gray-300"}
                `}
              >
                {completed ? <CheckCircle className="w-5 h-5" /> : stepNumber}
              </div>
              <span className="mt-2 text-sm text-center text-gray-700">{label}</span>

              {/* Línea conectora */}
              {index < pasos.length - 1 && (
                <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-300 z-[-1] sm:left-full sm:w-[100%]" />
              )}
            </div>
          );
        })}
      </div>

      {/* Contenido del paso actual */}
      {paso === 1 && (
        <div className="space-y-4">
          <Input label="Nombres del remitente" name="nombres" value={form.nombres} onChange={handleChange} />
          <Input label="DNI del remitente" name="dni" value={form.dni} onChange={handleChange} />
          <Input label="Dirección del remitente" name="direccion" value={form.direccion} onChange={handleChange} />
        </div>
      )}

      {paso === 2 && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Tipo de paquete</label>
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="SOBRE_A4">Sobre A4</option>
            <option value="CAJA_S">Caja S</option>
            <option value="CAJA_M">Caja M</option>
            <option value="CAJA_XX">Caja XX</option>
            <option value="CAJA_XXL">Caja XXL</option>
          </select>
          <p className="text-gray-600 mt-2 text-sm">Precio estimado: <strong>S/ {precios[form.tipo]}</strong></p>
        </div>
      )}

      {paso === 3 && (
        <div className="space-y-4 bg-gray-100 p-4 rounded-xl">
          <p><strong>Remitente:</strong> {form.nombres} (DNI: {form.dni})</p>
          <p><strong>Dirección:</strong> {form.direccion}</p>
          <p><strong>Tipo de paquete:</strong> {form.tipo}</p>
          <p><strong>Precio:</strong> S/ {form.precio}</p>
          <button
            onClick={() => {
              window.location.href = "https://www.mercadopago.com.pe";
            }}
            className="w-full flex justify-center items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
          >
            <CreditCard className="w-5 h-5" /> Pagar con Mercado Pago
          </button>
        </div>
      )}

      {/* Botones navegación */}
      <div className="mt-6 flex justify-between">
        {paso > 1 && (
          <button onClick={handleBack} className="flex items-center gap-1 text-blue-700 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
        )}
        {paso < 3 && (
          <button
            onClick={handleNext}
            className="flex items-center gap-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Continuar <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
    </div>
  );
}

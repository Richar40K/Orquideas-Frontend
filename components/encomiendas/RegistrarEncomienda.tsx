"use client";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, CreditCard, Package, User, MapPin, Truck } from "lucide-react";
import axios from "axios"; // Importar axios
import { getUserFromToken } from "@/utils/getUserFromToken"; // Asegúrate de que esta ruta sea correcta



type DynamicCity = string;

type PaqueteTipo = "SOBRE_A4" | "CAJA_S" | "CAJA_M" | "CAJA_XX" | "CAJA_XXL";

const pasos = ["Remitente", "Paquete", "Destino", "Confirmación"];

// URL base de tu API Gateway
const API_BASE_URL = process.env.NEXT_PUBLIC_API;

export default function RegistrarEncomienda() {
  const router = useRouter();
  const [paso, setPaso] = useState(1);
  const [form, setForm] = useState({
    nombres: "",
    dni: "",
    direccion: "",
    tipo: "SOBRE_A4" as PaqueteTipo,
    precio: 0,
    origen: "" as DynamicCity, // Inicializamos vacío, se llenará dinámicamente
    destino: "" as DynamicCity, // Inicializamos vacío, se llenará dinámicamente
    dniDestino: "",
    nombreDestino: "",
    apellidoDestino: ""
  });
  const [rutasDisponibles, setRutasDisponibles] = useState<DynamicCity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  // Estado para almacenar el ID de la encomienda después de su creación
  const [encomiendaId, setEncomiendaId] = useState<number | null>(null);

  const precios: Record<PaqueteTipo, number> = {
    SOBRE_A4: 10,
    CAJA_S: 15,
    CAJA_M: 20,
    CAJA_XX: 25,
    CAJA_XXL: 30,
  };

  // rutasValidasMap ahora será de tipo Record<DynamicCity, DynamicCity[]>
  const [rutasValidasMap, setRutasValidasMap] = useState<Record<DynamicCity, DynamicCity[]>>({});

  // Efecto para cargar datos del usuario logueado y rutas al inicio
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);

      // 1. Cargar datos del usuario logueado
      const username = getUserFromToken();
      if (username) {
        try {
          const userRes = await axios.get(`${API_BASE_URL}/users/username/${username}`);
          const fetchedUserData = userRes.data;
          setUserData(fetchedUserData);
          setForm(prevForm => ({
            ...prevForm,
            nombres: `${fetchedUserData.name || ''} ${fetchedUserData.lastName || ''}`,
            dni: fetchedUserData.dni || '',
            direccion: fetchedUserData.direccion || '',
          }));
        } catch (err) {
          console.error("Error al obtener datos del usuario logueado:", err);
          setError("No se pudieron cargar los datos del remitente automáticamente.");
        }
      } else {
        setError("No se encontró un usuario logueado. Por favor, ingrese los datos del remitente manualmente.");
      }

      // 2. Cargar rutas disponibles
      try {
        const rutasResponse = await axios.get(`${API_BASE_URL}/rutas`);
        const rutasData = rutasResponse.data;

        // Extraer orígenes únicos y construir el mapa de rutas
        const uniqueOrigins: DynamicCity[] = Array.from(new Set(rutasData.map((r: any) => r.origen)));
        const newRutasMap: Record<DynamicCity, DynamicCity[]> = {};

        uniqueOrigins.forEach((origin: DynamicCity) => {
          newRutasMap[origin] = rutasData
            .filter((r: any) => r.origen === origin)
            .map((r: any) => r.destino);
        });

        setRutasValidasMap(newRutasMap);
        setRutasDisponibles(uniqueOrigins);

        // Establecer origen y destino por defecto si no están ya definidos
        if (uniqueOrigins.length > 0) {
          setForm(prevForm => {
            const defaultOrigin = uniqueOrigins[0];
            const defaultDestino = newRutasMap[defaultOrigin]?.[0] || defaultOrigin;
            return {
              ...prevForm,
              origen: defaultOrigin,
              destino: defaultDestino
            };
          });
        }
      } catch (err) {
        console.error("Error al cargar rutas:", err);
        setError(prev => prev ? prev + " Y error al cargar las rutas disponibles." : "Error al cargar las rutas disponibles.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Función para manejar el avance al siguiente paso
  const handleNext = async () => {
    setLoading(true); // Iniciar carga al intentar avanzar
    setError(null); // Limpiar errores previos

    // Validaciones antes de avanzar
    if (paso === 1 && (!form.nombres || !form.dni || !form.direccion)) {
      setError("Por favor, complete todos los campos del remitente.");
      setLoading(false);
      return;
    }
    if (paso === 3 && (!form.nombreDestino || !form.apellidoDestino || !form.dniDestino)) {
      setError("Por favor, complete todos los campos del destinatario.");
      setLoading(false);
      return;
    }

    // Lógica específica para el paso 3 (antes de pasar al 4)
    if (paso === 3) {
      if (!userData?.id) {
        setError("Error: No se pudo obtener el ID del usuario logueado. Por favor, intente de nuevo o inicie sesión.");
        setLoading(false);
        return;
      }

      const payloadEncomienda = {
        userId: userData.id,
        tipo: form.tipo,
        origen: form.origen,
        destino: form.destino,
        dniDestino: form.dniDestino,
        nombreDestino: form.nombreDestino,
        apellidoDestino: form.apellidoDestino
      };

      try {
        // Realizar el POST de la encomienda
        const encomiendaResponse = await axios.post(`${API_BASE_URL}/encomiendas`, payloadEncomienda);
        const encomiendaData = encomiendaResponse.data;
        console.log("Encomienda registrada:", encomiendaData);
        setEncomiendaId(encomiendaData.id); // Guardar el ID de la encomienda para el pago
        setForm(prevForm => ({ ...prevForm, precio: precios[prevForm.tipo] })); // Asegurar que el precio esté actualizado
        setPaso((prev) => prev + 1); // Avanzar al paso 4
      } catch (err) {
        console.error("Error al registrar la encomienda:", err);
        if (axios.isAxiosError(err) && err.response) {
          setError(`Error al registrar la encomienda: ${err.response.data.message || err.response.statusText}`);
        } else {
          setError("Ocurrió un error inesperado al registrar la encomienda.");
        }
      } finally {
        setLoading(false); // Finalizar carga
      }
    } else {
      // Para otros pasos, simplemente avanzar
      if (paso === 2) {
        setForm((f) => ({ ...f, precio: precios[f.tipo] }));
      }
      setPaso((prev) => prev + 1);
      setLoading(false); // Finalizar carga
    }
  };

  const handleBack = () => setPaso((prev) => prev - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "origen") {
      const newOrigen = value as DynamicCity;
      setForm({
        ...form,
        origen: newOrigen,
        destino: rutasValidasMap[newOrigen]?.[0] || newOrigen
      });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, dni: e.target.value });
  };

  // Función para manejar la confirmación y el pago (solo en el paso 4)
const handleConfirmAndPay = async () => {
    // Validación mejorada
    if (!userData?.id || encomiendaId === null) {
      setError("No se pudo obtener el ID del usuario o de la encomienda. Por favor, recargue la página e intente nuevamente.");
      return;
    }

    setLoading(true);
    setError(null);

    const paymentPayload = {
      userId: userData.id,
      parcelsId: encomiendaId,
      detalles: `Pago de encomienda ${form.tipo}`,
      // Considera añadir más detalles relevantes para el pago
    };

    try {
      const paymentResponse = await axios.post(`${API_BASE_URL}/pagos/encomienda`, paymentPayload, {
        timeout: 10000, // 10 segundos de timeout
      });

      const paymentData = paymentResponse.data;
      console.log("Pago iniciado:", paymentData);

      if (paymentData.mpInitPoint) {
        // Abrir nueva pestaña con MercadoPago
        const mpWindow = window.open(paymentData.mpInitPoint, '_blank');
        
        // Recargar la página de encomiendas
        window.location.href = '/cliente/encomiendas';
        
        if (mpWindow) {
          mpWindow.focus();
        } else {
          setError("Por favor habilite popups y haga clic en el siguiente enlace:");
        }
      } else {
        throw new Error("No se recibió URL de pago de Mercado Pago");
      }

    } catch (err) {
      console.error("Error en el pago:", err);

      let errorMessage = "Ocurrió un error inesperado al procesar el pago";

      if (axios.isAxiosError(err)) {
        if (err.response) {
          errorMessage = err.response.data?.message ||
            `Error ${err.response.status}: ${err.response.statusText}`;
        } else if (err.request) {
          errorMessage = "No se recibió respuesta del servidor. Verifique su conexión.";
        } else {
          errorMessage = `Error al configurar la solicitud: ${err.message}`;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <Truck className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Registro de Encomienda</h1>
      </div>

      {/* Barra de pasos */}
      <div className="flex mb-8">
        {pasos.map((label, index) => {
          const stepNumber = index + 1;
          const active = paso === stepNumber;
          const completed = paso > stepNumber;

          return (
            <div key={index} className="flex-1 flex flex-col items-center relative">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 mb-2
                  ${active ? "bg-blue-600 text-white border-blue-600"
                    : completed ? "bg-green-500 text-white border-green-500"
                      : "bg-gray-100 text-gray-400 border-gray-300"}
                `}
              >
                {stepNumber}
              </div>
              <span className={`text-xs text-center ${active ? "font-medium text-blue-600" : "text-gray-500"}`}>
                {label}
              </span>
              {index < pasos.length - 1 && (
                <div className={`absolute top-4 left-1/2 w-full h-0.5 ${completed ? "bg-green-500" : "bg-gray-200"} z-[-1]`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Contenido del formulario */}
      <div className="space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {paso === 1 && (
          <>
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> Datos del Remitente
            </h2>
            <div className="space-y-4">
              <InputStandard
                label="DNI"
                name="dni"
                value={form.dni}
                onChange={handleDniChange}
                type="number"
                required
                disabled={loading || !!userData?.dni}
              />
              <InputStandard
                label="Nombres completos"
                name="nombres"
                value={form.nombres}
                onChange={handleChange}
                required
                disabled={loading || !!userData?.name}
              />
              <InputStandard
                label="Dirección"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                required
                disabled={loading || !!userData?.direccion}
              />
            </div>
          </>
        )}

        {paso === 2 && (
          <>
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" /> Tipo de Paquete
            </h2>
            <div className="space-y-4">
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {Object.keys(precios).map((key) => (
                  <option key={key} value={key}>
                    {key.replace("_", " ")} - S/ {precios[key as PaqueteTipo]}
                  </option>
                ))}
              </select>
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Precio:</span> S/ {precios[form.tipo]}
                </p>
              </div>
            </div>
          </>
        )}

        {paso === 3 && (
          <>
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" /> Datos del Destino
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Origen</label>
                  <select
                    name="origen"
                    value={form.origen}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {rutasDisponibles.map((ciudad) => (
                      <option key={ciudad} value={ciudad}>{ciudad}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destino</label>
                  <select
                    name="destino"
                    value={form.destino}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {rutasValidasMap[form.origen]?.map((ciudad) => (
                      <option key={ciudad} value={ciudad}>{ciudad}</option>
                    ))}
                  </select>
                </div>
              </div>

              <InputStandard
                label="Nombre del destinatario"
                name="nombreDestino"
                value={form.nombreDestino}
                onChange={handleChange}
                required
              />
              <InputStandard
                label="Apellido del destinatario"
                name="apellidoDestino"
                value={form.apellidoDestino}
                onChange={handleChange}
                required
              />
              <InputStandard
                label="DNI del destinatario"
                name="dniDestino"
                value={form.dniDestino}
                onChange={handleChange}
                type="number"
                required
              />
            </div>
          </>
        )}

        {paso === 4 && (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Resumen de Encomienda</h2>

            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Remitente</h3>
                  <p className="text-sm"><span className="text-gray-600">Nombre:</span> {form.nombres}</p>
                  <p className="text-sm"><span className="text-gray-600">DNI:</span> {form.dni}</p>
                  <p className="text-sm"><span className="text-gray-600">Dirección:</span> {form.direccion}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Destinatario</h3>
                  <p className="text-sm"><span className="text-gray-600">Nombre:</span> {form.nombreDestino} {form.apellidoDestino}</p>
                  <p className="text-sm"><span className="text-gray-600">DNI:</span> {form.dniDestino}</p>
                  <p className="text-sm"><span className="text-gray-600">Ruta:</span> {form.origen} → {form.destino}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo de paquete:</span>
                  <span className="font-medium">{form.tipo.replace("_", " ")}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-600">Precio:</span>
                  <span className="font-medium">S/ {form.precio}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirmAndPay}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Confirmar y Pagar
                </>
              )}
            </button>
          </>
        )}
      </div>

      {/* Navegación */}
      <div className="mt-8 flex justify-between border-t pt-4">
        {paso > 1 && (
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            disabled={loading}
          >
            <ArrowLeft className="w-4 h-4" /> Anterior
          </button>
        )}

        {paso < 4 && (
          <button
            onClick={handleNext}
            disabled={
              loading ||
              (paso === 1 && (!form.nombres || !form.dni || !form.direccion)) ||
              (paso === 3 && (!form.nombreDestino || !form.apellidoDestino || !form.dniDestino))
            }
            className={`ml-auto flex items-center gap-1 px-4 py-2 rounded-md ${(
              loading ||
              (paso === 1 && (!form.nombres || !form.dni || !form.direccion)) ||
              (paso === 3 && (!form.nombreDestino || !form.apellidoDestino || !form.dniDestino))
            ) ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >
            Siguiente <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function InputStandard({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  disabled = false
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        required={required}
        disabled={disabled}
      />
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { User, Bus, Package, Settings, Bell, Shield, CreditCard, HelpCircle, LogOut, ChevronRight, Calendar, MapPin, Clock, Star } from "lucide-react";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { AxiosError } from 'axios';
import axios from "axios";
import Link from "next/link";

const menu = [
  { key: "viajes", label: "Mis Viajes", icon: Bus, color: "bg-blue-500", },
  { key: "encomiendas", label: "Mis Encomiendas", icon: Package, color: "bg-green-500",  },
  { key: "configuracion", label: "Configuración", icon: Settings, color: "bg-purple-500" },
];

export default function PerfilConfigPage() {
  const [active, setActive] = useState("viajes");
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const username = getUserFromToken();
      if (!username) return;

      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API}/users/username/${username}`);
        setUserData(res.data);
      } catch (error) {
        console.error("Error al obtener datos del usuario", error);
      }
    };

    fetchUser();
  }, []);
  const userId = userData?.id;
  const fullName = userData ? `${userData.name} ${userData.lastName}` : "Cargando...";
  const email = userData?.email || "";
  const cellPhone = userData?.cellPhone || "";

  const handleLogout = () => {

    document.cookie = "token=; path=/; max-age=0";
    window.location.href = "/autenticacion/login";
  };

  return (
    <div className="w-full max-w-7xl mx-4 bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden backdrop-blur-sm min-h-[80vh]">
      {/* Sidebar azul */}
      <div className="w-full md:w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6 flex flex-col">
        {/* Perfil de usuario */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">{fullName}</div>
            <div className="text-xs text-blue-200 flex items-center justify-center gap-1 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Cliente Premium
            </div>
          </div>
        </div>

        {/* Menú vertical */}
        <nav className="flex-1 space-y-2">
          {menu.map(({ key, label, icon: Icon, color,  }) => (
            <button
              key={key}
              className={`w-full group flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative
                ${active === key
                  ? "bg-white text-blue-800 shadow-md"
                  : "hover:bg-white/10 hover:text-white"}
              `}
              onClick={() => setActive(key)}
            >
              <div className={`w-8 h-8 ${active === key ? color : 'bg-white/20'} rounded-lg flex items-center justify-center transition-colors`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span>{label}</span>
              
            </button>
          ))}
        </nav>

        {/* Footer del sidebar */}
        <div className="mt-auto pt-6 border-t border-white/20">
          <button onClick={handleLogout}  className="w-full flex items-center gap-3 px-4 py-3 text-red-200 hover:text-red-100 transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-6 md:p-8 bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
        {/* Header móvil */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-900">Mi Cuenta</h1>
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Bell className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-green-200/20 to-yellow-200/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {active === "viajes" && <MisViajes />}
          {active === "encomiendas" && <MisEncomiendas />}
          {active === "configuracion" && <ConfigForm nombre={fullName} email={email} cellPhone={cellPhone} userId={userId} />}
        </div>
      </div>
    </div>
  );
}

function MisViajes() {
  const [viajes, setViajes] = useState([]);

  useEffect(() => {
    const fetchViajes = async () => {
      const username = getUserFromToken();
      if (!username) return;

      try {
           
        const userRes = await axios.get(`${process.env.NEXT_PUBLIC_API}/users/username/${username}`);
        const userId = userRes.data.id;

           
        const pagosRes = await axios.get(`${process.env.NEXT_PUBLIC_API}/pagos/viaje/aprobados/${userId}`);
        setViajes(pagosRes.data);
      } catch (err) {
        console.error("Error al obtener viajes pagados:", err);
      }
    };

    fetchViajes();
  }, []);

   return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Mis Viajes</h2>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4" />
          <span className="hidden sm:inline">Última actualización:</span> hace 2 min
        </div>
      </div>

      <div className="grid gap-4 md:gap-6">
        {viajes.map((viaje: any) => (
          <div key={viaje.pagoId} className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow hover:shadow-md transition-all duration-300 p-4 md:p-6 border border-white/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                  <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <span className="text-sm sm:text-base">{viaje.viaje.ruta?.origen || 'Origen'} → {viaje.viaje.ruta?.destino || 'Destino'}</span>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {viaje.estado}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    {viaje.viaje.fechaSalida}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    {viaje.viaje.horaSalida}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    Asiento {viaje.asiento}
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-green-600">
                    <span>S/ {viaje.monto}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
interface EncomiendaPago {
  pagoId: number;
  monto: number;
  estado: string;
  fecha: string;
  detalles?: string;
  parcels: {
    id: number;
    tipo: string;
    destino: string;
    precio: number;
  };
}
function MisEncomiendas() {
  const [encomiendas, setEncomiendas] = useState<EncomiendaPago[]>([]);

  useEffect(() => {
    const fetchEncomiendas = async () => {
      const username = getUserFromToken();
      if (!username) return;

      try {
        const userRes = await axios.get(`${process.env.NEXT_PUBLIC_API}/users/username/${username}`);
        const userId = userRes.data.id;

        const pagosRes = await axios.get(`${process.env.NEXT_PUBLIC_API}/pagos/encomienda/aprobadas/${userId}`);
        setEncomiendas(pagosRes.data);
      } catch (error) {
        console.error("Error al obtener encomiendas pagadas:", error);
      }
    };

    fetchEncomiendas();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Mis Encomiendas</h2>
      </div>

      <div className="grid gap-4 md:gap-6">
        {encomiendas.map((e) => (
          <div key={e.pagoId} className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow hover:shadow-md transition-all duration-300 p-4 md:p-6 border border-white/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                  <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <Package className="w-5 h-5 text-green-500" />
                    <span className="text-sm sm:text-base">ENCOM-{e.parcels.id}</span>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {e.estado}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    Destino: {e.parcels.destino}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    {new Date(e.fecha).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                    Tipo: {e.parcels.tipo}
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-green-600">
                    <span>S/ {e.monto.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end md:justify-start">
                <Link href="/cliente/encomienda" className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-sm font-medium">
                  Rastrear
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfigForm({ nombre, email, cellPhone, userId }: {
  nombre: string,
  email: string,
  cellPhone: string,
  userId: number 
}) {
  const [formData, setFormData] = useState({
    nombre,
    email,
    cellPhone: cellPhone || "", 
    password: "",
    confirmPassword: "",
    notificaciones: true,
    newsletter: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);

      const [name, ...lastNameParts] = formData.nombre.split(' ');
      const updateData = {
        name,
        lastName: lastNameParts.join(' ') || "", 
        email: formData.email,
        cellPhone: formData.cellPhone,
        ...(formData.password && { password: formData.password }) 
      };

      await axios.put(`${process.env.NEXT_PUBLIC_API}/users/${userId}`, updateData);

      setSuccess("Datos actualizados correctamente");
      setFormData(prev => ({
        ...prev,
        password: "",
        confirmPassword: ""
      }));
    } catch (err: unknown) {
      console.error("Error al actualizar usuario", err);
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Error al actualizar los datos");
      } else {
        setError("Error al actualizar los datos");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}> 
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Configuración de Cuenta</h2>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Shield className="w-4 h-4" />
          <span className="hidden sm:inline">Datos protegidos</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow p-4 md:p-6 border border-white/50">
          <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-4 md:mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            Información Personal
          </h3>

          <div className="space-y-3 md:space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-slate-700 mb-1 md:mb-2 text-sm md:text-base font-medium">
                Nombre Completo
              </label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 md:px-4 md:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-slate-700 mb-1 md:mb-2 text-sm md:text-base font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 md:px-4 md:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
                required
              />
            </div>

            <div>
              <label htmlFor="cellPhone" className="block text-slate-700 mb-1 md:mb-2 text-sm md:text-base font-medium">
                Teléfono
              </label>
              <input
                id="cellPhone"
                type="tel" 
                name="cellPhone"
                value={formData.cellPhone}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 md:px-4 md:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
                pattern="[0-9]*" 
              />
            </div>
          </div>
        </div>

        {/* Seguridad */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow p-4 md:p-6 border border-white/50">
          <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-4 md:mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            Seguridad
          </h3>

          <div className="space-y-3 md:space-y-4">
            <div>
              <label htmlFor="password" className="block text-slate-700 mb-1 md:mb-2 text-sm md:text-base font-medium">
                Nueva Contraseña
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 md:px-4 md:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm md:text-base"
                placeholder="Ingresa tu nueva contraseña"
                minLength={8}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-slate-700 mb-1 md:mb-2 text-sm md:text-base font-medium">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 md:px-4 md:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm md:text-base"
                placeholder="Confirma tu nueva contraseña"
                minLength={8}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 md:gap-4 mt-6 md:mt-8">
        <button
          type="button" 
          className="px-4 py-2 md:px-6 md:py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm md:text-base font-medium"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
"use client";
import { useState } from "react";
import { User, Bus, Package, Settings, Bell, Shield, CreditCard, HelpCircle, LogOut, ChevronRight, Calendar, MapPin, Clock, Star } from "lucide-react";
import Link from "next/link";

const menu = [
  { key: "viajes", label: "Mis Viajes", icon: Bus, color: "bg-blue-500", count: 3 },
  { key: "encomiendas", label: "Mis Encomiendas", icon: Package, color: "bg-green-500", count: 2 },
  { key: "configuracion", label: "Configuración", icon: Settings, color: "bg-purple-500" },
];

export default function PerfilConfigPage() {
  const [active, setActive] = useState("viajes");
  
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
            <div className="font-bold text-lg">Ricardo Palomino</div>
            <div className="text-xs text-blue-200 flex items-center justify-center gap-1 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Cliente Premium
            </div>
          </div>
        </div>
        
        {/* Menú vertical */}
        <nav className="flex-1 space-y-2">
          {menu.map(({ key, label, icon: Icon, color, count }) => (
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
              {count && (
                <span className="absolute right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {count}
                </span>
              )}
            </button>
          ))}
        </nav>
        
        {/* Footer del sidebar */}
        <div className="mt-auto pt-6 border-t border-white/20">
          <Link href={"/cliente/viajes"} className="w-full flex items-center gap-3 px-4 py-3 text-red-200 hover:text-red-100 transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Cerrar sesión</span>
          </Link>
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
          {active === "configuracion" && <ConfigForm />}
        </div>
      </div>
    </div>
  );
}

function MisViajes() {
  const viajes = [
    {
      id: 1,
      origen: "Lima",
      destino: "Arequipa",
      fecha: "2024-07-15",
      hora: "08:00",
      estado: "Confirmado",
      precio: "S/ 45.00",
      asiento: "A12"
    },
    {
      id: 2,
      origen: "Arequipa",
      destino: "Cusco",
      fecha: "2024-07-20",
      hora: "14:30",
      estado: "Pendiente",
      precio: "S/ 35.00",
      asiento: "B08"
    },
    {
      id: 3,
      origen: "Cusco",
      destino: "Lima",
      fecha: "2024-07-25",
      hora: "19:00",
      estado: "Completado",
      precio: "S/ 50.00",
      asiento: "C15"
    }
  ];

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
        {viajes.map((viaje) => (
          <div key={viaje.id} className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow hover:shadow-md transition-all duration-300 p-4 md:p-6 border border-white/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                  <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <span className="text-sm sm:text-base">{viaje.origen} → {viaje.destino}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    viaje.estado === 'Confirmado' ? 'bg-green-100 text-green-800' :
                    viaje.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {viaje.estado}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    {viaje.fecha}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    {viaje.hora}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    Asiento {viaje.asiento}
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-green-600">
                    <span>{viaje.precio}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end md:justify-start">
                <button className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-sm font-medium">
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MisEncomiendas() {
  const encomiendas = [
    {
      id: 1,
      codigo: "ENC001",
      origen: "Lima",
      destino: "Arequipa",
      fecha: "2024-07-12",
      peso: "2.5 kg",
      estado: "En tránsito",
      precio: "S/ 15.00"
    },
    {
      id: 2,
      codigo: "ENC002",
      origen: "Arequipa",
      destino: "Cusco",
      fecha: "2024-07-10",
      peso: "1.8 kg",
      estado: "Entregado",
      precio: "S/ 12.00"
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Mis Encomiendas</h2>
      </div>
      
      <div className="grid gap-4 md:gap-6">
        {encomiendas.map((encomienda) => (
          <div key={encomienda.id} className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow hover:shadow-md transition-all duration-300 p-4 md:p-6 border border-white/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                  <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <Package className="w-5 h-5 text-green-500" />
                    <span className="text-sm sm:text-base">{encomienda.codigo}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    encomienda.estado === 'En tránsito' ? 'bg-blue-100 text-blue-800' :
                    encomienda.estado === 'Entregado' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {encomienda.estado}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    {encomienda.origen} → {encomienda.destino}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    {encomienda.fecha}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                    {encomienda.peso}
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-green-600">
                    <span>{encomienda.precio}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end md:justify-start">
                <button className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-sm font-medium">
                  Rastrear
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfigForm() {
  const [formData, setFormData] = useState({
    nombre: "Ricardo Palomino",
    email: "ricardo@email.com",
    telefono: "+51 987 654 321",
    password: "",
    confirmPassword: "",
    notificaciones: true,
    newsletter: false
  });

  const handleChange = (e:any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Configuración de Cuenta</h2>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Shield className="w-4 h-4" />
          <span className="hidden sm:inline">Datos protegidos</span>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Información Personal */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow p-4 md:p-6 border border-white/50">
          <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-4 md:mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            Información Personal
          </h3>
          
          <div className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-slate-700 mb-1 md:mb-2 text-sm md:text-base font-medium">Nombre Completo</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 md:px-4 md:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
              />
            </div>
            
            <div>
              <label className="block text-slate-700 mb-1 md:mb-2 text-sm md:text-base font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 md:px-4 md:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
              />
            </div>
            
            <div>
              <label className="block text-slate-700 mb-1 md:mb-2 text-sm md:text-base font-medium">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 md:px-4 md:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
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
              <label className="block text-slate-700 mb-1 md:mb-2 text-sm md:text-base font-medium">Nueva Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 md:px-4 md:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm md:text-base"
                placeholder="Ingresa tu nueva contraseña"
              />
            </div>
            
            <div>
              <label className="block text-slate-700 mb-1 md:mb-2 text-sm md:text-base font-medium">Confirmar Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 md:px-4 md:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm md:text-base"
                placeholder="Confirma tu nueva contraseña"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 md:gap-4 mt-6 md:mt-8">
        <button className="px-4 py-2 md:px-6 md:py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm md:text-base font-medium">
          Cancelar
        </button>
        <button className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium shadow">
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}
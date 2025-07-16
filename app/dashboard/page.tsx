"use client"
import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  UserCheck,
  Package,
  Bus,
} from 'lucide-react';

const StatsCard = ({ 
  label, 
  value, 
  change, 
  icon: Icon, 
  color 
}: {
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
}) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 hover:shadow-lg transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
        <p className="text-green-600 text-sm font-medium mt-2 flex items-center">
          <TrendingUp className="w-4 h-4 mr-1" />
          {change}
        </p>
      </div>
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);


export default function DashboardPage() {
  const [ventasHoy, setVentasHoy] = useState<string>("Cargando...");
  const [pasajeros, setPasajeros] = useState<string>("Cargando...");
  const [encomiendas, setEncomiendas] = useState<string>("Cargando...")
  const [buses, setBuses] = useState<string>("Cargando...")
  const [totalAprobados, setTotalAprobados] = useState<string>("Cargando...");
  interface PopularRoute {
  route: string;
  trips: number;
  percentage: number;
}

  const [popularRoutes, setPopularRoutes] = useState<PopularRoute[]>([]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API;

    // Ventas hoy
    fetch(`${apiUrl}/pagos/total-aprobados-hoy`)
      .then(res => res.json())
      .then(data => setVentasHoy("S/ " + Number(data).toLocaleString("es-PE")))
      .catch(() => setVentasHoy("Error"));

    // Viajes aprobados (pasajeros)
    fetch(`${apiUrl}/pagos/viajes-aprobados`)
      .then(res => res.json())
      .then(data => setPasajeros(String(data)))
      .catch(() => setPasajeros("Error"));

    // Encomiendas aprobadas
    fetch(`${apiUrl}/pagos/encomiendas-aprobadas`)
      .then(res => res.json())
      .then(data => setEncomiendas(String(data)))
      .catch(() => setEncomiendas("Error"));

    // buses estado activo
    fetch(`${apiUrl}/bus/cantidad-activos`)
      .then(res => res.json())
      .then(data => setBuses(String(data)))
      .catch(() => setBuses("Error"));

    fetch(`${apiUrl}/viajes/rutas-populares`)
    .then(res => res.json())
    .then(data => setPopularRoutes(data))
    .catch(() => setPopularRoutes([]));
    

    fetch(`${apiUrl}/pagos/total-aprobados`)
    .then(res => res.json())
    .then(data => setTotalAprobados("S/ " + Number(data).toLocaleString("es-PE")))
    .catch(() => setTotalAprobados("Error"));
    

  }, []);
  const stats = [
    { 
      label: 'Ventas Hoy', 
      value: ventasHoy, 
      change: '+12%', 
      icon: DollarSign, 
      color: 'bg-green-500' 
    },
    { 
      label: 'Pasajeros', 
      value: pasajeros, 
      change: '+2%', 
      icon: UserCheck, 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Encomiendas', 
      value: encomiendas, 
      change: '+100%', 
      icon: Package, 
      color: 'bg-purple-500' 
    },
    { 
      label: 'Buses Activos', 
      value: buses, 
      change: '75%', 
      icon: Bus, 
      color: 'bg-orange-500' 
    },
  ];

  const recentActivity = [
    { 
      type: 'Venta', 
      description: 'Pasaje Omate - Arequipa', 
      time: 'Hace 5 min', 
      amount: 'S/ 85',
      color: 'bg-green-100 text-green-600'
    },
    { 
      type: 'Encomienda', 
      description: 'Paquete registrado', 
      time: 'Hace 12 min', 
      amount: 'S/ 25',
      color: 'bg-purple-100 text-purple-600'
    },
    { 
      type: 'Pago', 
      description: 'Transferencia recibida', 
      time: 'Hace 18 min', 
      amount: 'S/ 340',
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      type: 'Viaje', 
      description: 'Bus partió a Omate', 
      time: 'Hace 25 min', 
      amount: '32 pasajeros',
      color: 'bg-orange-100 text-orange-600'
    },
  ];



  return (
    <div className="space-y-6">
      {/* Título de la página */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Resumen General
        </h1>
        <p className="text-slate-600">
          Vista general de la operación del día
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts y Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Ventas */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Ventas del Mes</h3>
            <select className="text-sm border border-slate-200 rounded-lg px-3 py-1 bg-white">
              <option>Últimos 30 días</option>
            </select>
          </div>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-700 mb-2">{totalAprobados}</div>
              <p className="text-slate-500">Total del mes</p>
            </div>
          </div>
        </div>

        {/* Rutas Populares */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Rutas Populares</h3>
          <div className="space-y-4">
            {popularRoutes.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">{item.route}</span>
                  <span className="text-slate-500 text-sm">{item.trips} viajes</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sección de Actividad Reciente y Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actividad Reciente */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Actividad Reciente</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Ver todo
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activity.color}`}>
                    <span className="text-sm font-semibold">{activity.type[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{activity.description}</p>
                    <p className="text-sm text-slate-500">{activity.time}</p>
                  </div>
                </div>
                <span className="font-semibold text-slate-700">{activity.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas y Notificaciones */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Alertas</h3>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-yellow-800">Mantenimiento</span>
              </div>
              <p className="text-sm text-yellow-700">Bus #1 requiere mantenimiento</p>
            </div>
            
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-red-800">Retraso</span>
              </div>
              <p className="text-sm text-red-700">Viaje Omate-Arequipa retrasado 30 min</p>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">Completado</span>
              </div>
              <p className="text-sm text-green-700">Ruta Arequipa-Omate finalizada</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import {
  BarChart3,
  PieChart,
  Calendar,
  FileText,
  Truck,
  Bus,
  DollarSign,
  User,
  MapPin,
  Clock,
  Download
} from 'lucide-react';

const ReportsDashboard = () => {
  // Datos de ejemplo para los reportes
  const reportData = {
    totalRevenue: 45890,
    encomiendas: 23450,
    viajes: 22440,
    clients: 1243,
    routes: 18,
    shipments: 876,
    trips: 932,
    paymentMethods: {
      cash: 65,
      card: 25,
      transfer: 10
    },
    dailyRevenue: [1200, 1900, 1500, 2100, 1800, 2400, 2200],
    monthlyTrend: [45, 52, 48, 60, 55, 58, 65, 70, 68, 72, 75, 80]
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-500 rounded-xl shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Reportes y Estadísticas</h1>
              <p className="text-gray-500">Análisis detallado del rendimiento de tu flota</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>Mayo 2023</span>
            </button>
            <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-sm flex items-center space-x-2 hover:bg-indigo-600">
              <Download className="w-4 h-4 text-white" />
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Resumen General */}
        <div className="bg-white rounded-2xl p-6 shadow-lg lg:col-span-3">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Resumen General</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ReportCard 
              icon={<DollarSign className="w-5 h-5 text-green-500" />}
              title="Ingresos Totales"
              value={`S/. ${reportData.totalRevenue.toLocaleString()}`}
              change="+12% vs mes anterior"
              positive
            />
            <ReportCard 
              icon={<Truck className="w-5 h-5 text-blue-500" />}
              title="Encomiendas"
              value={reportData.shipments.toLocaleString()}
              change={`S/. ${reportData.encomiendas.toLocaleString()}`}
            />
            <ReportCard 
              icon={<Bus className="w-5 h-5 text-orange-500" />}
              title="Viajes"
              value={reportData.trips.toLocaleString()}
              change={`S/. ${reportData.viajes.toLocaleString()}`}
            />
            <ReportCard 
              icon={<User className="w-5 h-5 text-purple-500" />}
              title="Clientes"
              value={reportData.clients.toLocaleString()}
              change="+8% vs mes anterior"
              positive
            />
          </div>
        </div>

        {/* Gráfico de Ingresos Diarios */}
        <div className="bg-white rounded-2xl p-6 shadow-lg lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Ingresos Diarios (Última Semana)</h2>
            <select className="bg-gray-100 px-3 py-1 rounded-lg text-sm">
              <option>Esta semana</option>
              <option>Semana pasada</option>
              <option>Este mes</option>
            </select>
          </div>
          <div className="h-64">
            {/* Gráfico de barras simplificado */}
            <div className="flex items-end h-full space-x-2">
              {reportData.dailyRevenue.map((amount, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-all"
                    style={{ height: `${(amount / 3000) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">
                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Métodos de Pago */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Métodos de Pago</h2>
          <div className="h-64 flex flex-col justify-between">
            <div className="relative w-40 h-40 mx-auto">
              {/* Gráfico circular simplificado */}
              <div className="absolute inset-0 rounded-full border-8 border-blue-500"></div>
              <div className="absolute inset-0 rounded-full border-8 border-green-500 clip-[0_65%_100%_35%]"></div>
              <div className="absolute inset-0 rounded-full border-8 border-yellow-500 clip-[0_35%_100%_65%]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-bold">100%</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { color: 'bg-blue-500', label: 'Efectivo', value: `${reportData.paymentMethods.cash}%` },
                { color: 'bg-green-500', label: 'Tarjeta', value: `${reportData.paymentMethods.card}%` },
                { color: 'bg-yellow-500', label: 'Transferencia', value: `${reportData.paymentMethods.transfer}%` }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rutas más Populares */}
        <div className="bg-white rounded-2xl p-6 shadow-lg lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Rutas más Populares</h2>
          <div className="space-y-4">
            {[
              { route: 'Lima - Trujillo', trips: 124, revenue: 18600 },
              { route: 'Trujillo - Chiclayo', trips: 98, revenue: 14700 },
              { route: 'Lima - Huancayo', trips: 87, revenue: 13050 },
              { route: 'Arequipa - Cusco', trips: 76, revenue: 11400 },
              { route: 'Chiclayo - Piura', trips: 65, revenue: 9750 }
            ].map((route, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-800">{route.route}</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {route.trips} viajes
                    </p>
                  </div>
                </div>
                <span className="font-medium">S/. {route.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tendencias Mensuales */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Tendencia Anual</h2>
          <div className="h-64">
            {/* Gráfico de líneas simplificado */}
            <div className="relative h-full w-full">
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
              {reportData.monthlyTrend.map((value, index) => (
                <div 
                  key={index} 
                  className="absolute bottom-0 h-full flex flex-col items-center"
                  style={{ left: `${(index / 11) * 100}%` }}
                >
                  <div 
                    className="w-1 bg-gradient-to-t from-indigo-500 to-indigo-300 rounded-t"
                    style={{ height: `${value}%` }}
                  ></div>
                  <div className="absolute top-0 w-2 h-2 bg-indigo-500 rounded-full -mt-1"></div>
                  <p className="text-xs text-gray-500 absolute -bottom-6">
                    {['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Crecimiento anual del 22% en ingresos</p>
          </div>
        </div>
      </div>

      {/* Reportes Detallados */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Reportes Detallados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ReportItem 
            title="Reporte de Encomiendas"
            description="Detalle de todas las encomiendas entregadas"
            icon={<Truck className="w-5 h-5 text-blue-500" />}
          />
          <ReportItem 
            title="Reporte de Viajes"
            description="Listado completo de viajes realizados"
            icon={<Bus className="w-5 h-5 text-orange-500" />}
          />
          <ReportItem 
            title="Reporte Financiero"
            description="Estado de ingresos y egresos"
            icon={<DollarSign className="w-5 h-5 text-green-500" />}
          />
          <ReportItem 
            title="Clientes Frecuentes"
            description="Ranking de clientes con más viajes"
            icon={<User className="w-5 h-5 text-purple-500" />}
          />
          <ReportItem 
            title="Rendimiento de Buses"
            description="Kilometraje y mantenimiento"
            icon={<BarChart3 className="w-5 h-5 text-red-500" />}
          />
          <ReportItem 
            title="Reporte Personalizado"
            description="Crea tu propio reporte"
            icon={<FileText className="w-5 h-5 text-indigo-500" />}
          />
        </div>
      </div>
    </div>
  );
};

// Componente para tarjetas de reporte
const ReportCard = ({ icon, title, value, change, positive }: { icon: React.ReactNode, title: string, value: string, change: string, positive?: boolean }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-white rounded-lg shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="font-bold text-gray-800">{value}</p>
      </div>
    </div>
    <p className={`text-sm mt-2 flex items-center ${positive ? 'text-green-500' : 'text-gray-500'}`}>
      {positive && (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      )}
      {change}
    </p>
  </div>
);

// Componente para ítems de reporte
const ReportItem = ({ title, description, icon }: { title: string, description: string, icon: React.ReactNode }) => (
  <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
    <div className="flex items-start space-x-3">
      <div className="p-2 bg-indigo-50 rounded-lg">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
    </div>
    <button className="mt-3 text-sm text-indigo-500 hover:text-indigo-700 flex items-center">
      <Download className="w-4 h-4 mr-1" />
      Descargar
    </button>
  </div>
);

export default ReportsDashboard;
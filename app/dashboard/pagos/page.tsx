"use client"
import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Package, 
  Bus, 
  ArrowUpRight, 
  ArrowDownLeft,
  TrendingUp,
  PieChart,
  Filter,
  Search,
  Download,
  MoreHorizontal
} from 'lucide-react';

interface Payment {
  id: string;
  type: 'encomienda' | 'viaje';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  client: string;
  reference: string;
}

interface PaymentSummary {
  total: number;
  encomiendas: number;
  viajes: number;
  pending: number;
  completed: number;
}

const PaymentsDashboard = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'encomienda' | 'viaje'>('all');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [searchQuery, setSearchQuery] = useState('');

  // Datos de ejemplo
  const paymentData: Payment[] = [
    { id: '1', type: 'encomienda', amount: 150, date: '2023-05-15', status: 'completed', client: 'Juan Pérez', reference: 'ENC-001' },
    { id: '2', type: 'viaje', amount: 75, date: '2023-05-14', status: 'completed', client: 'María Gómez', reference: 'VIA-045' },
    { id: '3', type: 'encomienda', amount: 200, date: '2023-05-14', status: 'pending', client: 'Carlos Ruiz', reference: 'ENC-002' },
    { id: '4', type: 'viaje', amount: 60, date: '2023-05-13', status: 'completed', client: 'Ana López', reference: 'VIA-046' },
    { id: '5', type: 'encomienda', amount: 180, date: '2023-05-12', status: 'failed', client: 'Pedro Sánchez', reference: 'ENC-003' },
    { id: '6', type: 'viaje', amount: 85, date: '2023-05-11', status: 'completed', client: 'Luisa Fernández', reference: 'VIA-047' },
  ];

  const summaryData: PaymentSummary = {
    total: paymentData.reduce((sum, payment) => sum + (payment.status === 'completed' ? payment.amount : 0), 0),
    encomiendas: paymentData
      .filter(p => p.type === 'encomienda' && p.status === 'completed')
      .reduce((sum, payment) => sum + payment.amount, 0),
    viajes: paymentData
      .filter(p => p.type === 'viaje' && p.status === 'completed')
      .reduce((sum, payment) => sum + payment.amount, 0),
    pending: paymentData
      .filter(p => p.status === 'pending')
      .reduce((sum, payment) => sum + payment.amount, 0),
    completed: paymentData
      .filter(p => p.status === 'completed')
      .reduce((sum, payment) => sum + payment.amount, 0),
  };

  const filteredPayments = paymentData.filter(payment => {
    const matchesTab = activeTab === 'all' || payment.type === activeTab;
    const matchesSearch = payment.client.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         payment.reference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Gestión de Pagos</h1>
              <p className="text-gray-500">Monitorea todos los pagos de encomiendas y viajes</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center space-x-2">
              <Download className="w-4 h-4 text-gray-500" />
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium opacity-80">Total Recaudado</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(summaryData.total)}</h3>
            </div>
            <DollarSign className="w-6 h-6 opacity-80" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>12% vs mes anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Encomiendas</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-800">{formatCurrency(summaryData.encomiendas)}</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <ArrowUpRight className="w-4 h-4 mr-1 text-green-500" />
            <span>8% vs mes anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Viajes</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-800">{formatCurrency(summaryData.viajes)}</h3>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Bus className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <ArrowDownLeft className="w-4 h-4 mr-1 text-red-500" />
            <span>3% vs mes anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Pendientes</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-800">{formatCurrency(summaryData.pending)}</h3>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <span>3 pagos por procesar</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Filters */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveTab('encomienda')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${activeTab === 'encomienda' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <Package className="w-4 h-4" />
              <span>Encomiendas</span>
            </button>
            <button
              onClick={() => setActiveTab('viaje')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${activeTab === 'viaje' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <Bus className="w-4 h-4" />
              <span>Viajes</span>
            </button>
          </div>

          <div className="flex space-x-3">
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="appearance-none pl-4 pr-10 py-2 bg-gray-100 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="week">Esta semana</option>
                <option value="month">Este mes</option>
                <option value="year">Este año</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Filter className="w-4 h-4 text-gray-500" />
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full md:w-64"
              />
            </div>
          </div>
        </div>

        {/* Visualizations */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Types Chart */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-700">Distribución por Tipo</h3>
              <PieChart className="w-5 h-5 text-blue-500" />
            </div>
            <div className="h-64 flex items-center justify-center">
              <div className="relative w-40 h-40">
                {/* Pie chart would be here - using a simplified version */}
                <div className="absolute inset-0 rounded-full border-8 border-blue-500"></div>
                <div className="absolute inset-0 rounded-full border-8 border-green-500 clip-[0_50%_100%_50%]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-bold text-gray-800">{formatCurrency(summaryData.total)}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600">Encomiendas</span>
                </div>
                <span className="text-sm font-medium">{formatCurrency(summaryData.encomiendas)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Viajes</span>
                </div>
                <span className="text-sm font-medium">{formatCurrency(summaryData.viajes)}</span>
              </div>
            </div>
          </div>

          {/* Timeline Chart */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-700">Historial de Pagos</h3>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div className="h-64">
              {/* Timeline chart would be here - using a simplified version */}
              <div className="relative h-full w-full">
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
                {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                  <div key={day} className="absolute bottom-0" style={{ left: `${(day / 6) * 100}%` }}>
                    <div 
                      className="w-2 h-8 bg-blue-500 rounded-t mx-auto" 
                      style={{ height: `${Math.random() * 80 + 20}%` }}
                    ></div>
                    <div 
                      className="w-2 h-12 bg-green-500 rounded-t mx-auto mt-1" 
                      style={{ height: `${Math.random() * 80 + 20}%` }}
                    ></div>
                    <p className="text-xs text-gray-500 text-center mt-1">{['L', 'M', 'M', 'J', 'V', 'S', 'D'][day]}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600">Encomiendas</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Viajes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm border-b border-gray-100">
                  <th className="pb-3 font-medium">Referencia</th>
                  <th className="pb-3 font-medium">Cliente</th>
                  <th className="pb-3 font-medium">Tipo</th>
                  <th className="pb-3 font-medium">Fecha</th>
                  <th className="pb-3 font-medium">Estado</th>
                  <th className="pb-3 font-medium text-right">Monto</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4">
                      <span className="font-medium text-gray-800">{payment.reference}</span>
                    </td>
                    <td className="py-4">
                      <span className="text-gray-700">{payment.client}</span>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.type === 'encomienda' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {payment.type === 'encomienda' ? (
                          <>
                            <Package className="w-3 h-3 mr-1" />
                            Encomienda
                          </>
                        ) : (
                          <>
                            <Bus className="w-3 h-3 mr-1" />
                            Viaje
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-4 text-gray-500">{payment.date}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : payment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {payment.status === 'completed' ? 'Completado' : payment.status === 'pending' ? 'Pendiente' : 'Fallido'}
                      </span>
                    </td>
                    <td className="py-4 text-right font-medium text-gray-800">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="py-4 text-right">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500">No se encontraron pagos con los filtros seleccionados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsDashboard;
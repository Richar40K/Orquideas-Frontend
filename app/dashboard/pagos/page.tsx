"use client"
import React, { useState, useEffect } from 'react';
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
  MoreHorizontal,
  Loader2
} from 'lucide-react';
import axios from 'axios';

interface Payment {
  id: number;
  tipo: 'VIAJE' | 'ENCOMIENDA';
  userId: number;
  viajeId: number | null;
  asiento: number | null;
  monto: number;
  estado: 'APROBADO' | 'PENDIENTE' | 'RECHAZADO';
  mpPaymentId: string | null;
  fecha: string;
  detalles: string;
  mpInitPoint: string | null;
  mpPreferenceId: string | null;
}

interface PaymentSummary {
  total: number;
  encomiendas: number;
  viajes: number;
  pendientes: number;
  aprobados: number;
}

const PaymentsDashboard = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'ENCOMIENDA' | 'VIAJE'>('all');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch payments
        const paymentsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API}/pagos/viaje`);
        setPayments(paymentsResponse.data);

        // Fetch summary data
        const [encomiendas, viajes, pendientes, aprobados] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API}/pagos/totales/encomiendas`),
          axios.get(`${process.env.NEXT_PUBLIC_API}/pagos/totales/viajes`),
          axios.get(`${process.env.NEXT_PUBLIC_API}/pagos/total-pendientes`),
          axios.get(`${process.env.NEXT_PUBLIC_API}/pagos/total-aprobados`)
        ]);

        setSummary({
          total: (encomiendas.data || 0) + (viajes.data || 0),
          encomiendas: encomiendas.data || 0,
          viajes: viajes.data || 0,
          pendientes: pendientes.data || 0,
          aprobados: aprobados.data || 0
        });

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos. Por favor intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPayments = payments.filter(payment => {
    const matchesTab = activeTab === 'all' || payment.tipo === activeTab;
    const matchesSearch = 
      payment.detalles.toLowerCase().includes(searchQuery.toLowerCase()) || 
      payment.id.toString().includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

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
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium opacity-80">Total Recaudado</p>
                <h3 className="text-2xl font-bold mt-1">{formatCurrency(summary.total)}</h3>
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
                <h3 className="text-2xl font-bold mt-1 text-gray-800">{formatCurrency(summary.encomiendas)}</h3>
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
                <h3 className="text-2xl font-bold mt-1 text-gray-800">{formatCurrency(summary.viajes)}</h3>
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
                <h3 className="text-2xl font-bold mt-1 text-gray-800">{formatCurrency(summary.pendientes)}</h3>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <span>{payments.filter(p => p.estado === 'PENDIENTE').length} pagos por procesar</span>
            </div>
          </div>
        </div>
      )}

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
              onClick={() => setActiveTab('ENCOMIENDA')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${activeTab === 'ENCOMIENDA' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <Package className="w-4 h-4" />
              <span>Encomiendas</span>
            </button>
            <button
              onClick={() => setActiveTab('VIAJE')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${activeTab === 'VIAJE' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
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

        {/* Payments Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm border-b border-gray-100">
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">Detalles</th>
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
                      <span className="font-medium text-gray-800">#{payment.id}</span>
                    </td>
                    <td className="py-4">
                      <span className="text-gray-700">{payment.detalles}</span>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.tipo === 'ENCOMIENDA' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {payment.tipo === 'ENCOMIENDA' ? (
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
                    <td className="py-4 text-gray-500">{formatDate(payment.fecha)}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.estado === 'APROBADO' 
                          ? 'bg-green-100 text-green-800' 
                          : payment.estado === 'PENDIENTE'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {payment.estado === 'APROBADO' ? 'Aprobado' : payment.estado === 'PENDIENTE' ? 'Pendiente' : 'Rechazado'}
                      </span>
                    </td>
                    <td className="py-4 text-right font-medium text-gray-800">
                      {formatCurrency(payment.monto)}
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
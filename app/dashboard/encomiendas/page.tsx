'use client';

import { useState, useEffect } from 'react';   
import {
  Search,
  Plus,   
  Eye,
  Edit,
  Trash2,
  Filter,
  Copy,
  X,
  Loader2   
} from 'lucide-react';

  
interface UserDTO {   
  id: number;
  name: string;
  lastName: string;
  email: string;
  cellPhone: string;
}

  
interface EncomiendaFrontend {
  id: string;   
  trackingKey: string;   
  fullname: string;   
  email: string;   
  cellPhone: string;   
  status: 'pending' | 'confirmed' | 'paid' | 'shipped' | 'delivered';   
  origin: string;
  destination: string;
  weight: string;
  price: number;
    
    
  tipo: string;   
  dniDestino: string;
  nombreDestino: string;
  apellidoDestino: string;
  clave: string;   
}

  
interface ResponseEncomiendaDTO {
  id: number;
  user: UserDTO;
  tipo: string;
  origen: string;
  destino: string;
  dniDestino: string;
  nombreDestino: string;
  apellidoDestino: string;
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'PAGADO' | 'ENVIADO' | 'ENTREGADO';
  codigo: string;
  precio: number;
  clave: string;
}
  


const API_URL = process.env.NEXT_PUBLIC_API;   

  
const statusBackendToFrontend = {
  PENDIENTE: 'pending',
  CONFIRMADO: 'confirmed',
  PAGADO: 'paid',
  ENVIADO: 'shipped',
  ENTREGADO: 'delivered',
};

  
const statusFrontendToBackend = {
  pending: 'PENDIENTE',
  confirmed: 'CONFIRMADO',
  paid: 'PAGADO',
  shipped: 'ENVIADO',
  delivered: 'ENTREGADO',
};


const statusConfig = {
  pending: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '⏳'
  },
  confirmed: {
    label: 'Confirmado',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '✅'
  },
  paid: {
    label: 'Pagado',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '💰'
  },
  shipped: {
    label: 'Enviado',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: '🚚'
  },
  delivered: {
    label: 'Entregado',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: '📦'
  }
};

const Encomiendas = () => {
  const [encomiendas, setEncomiendas] = useState<EncomiendaFrontend[]>([]);   
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEncomienda, setSelectedEncomienda] = useState<EncomiendaFrontend | null>(null);
  const [loading, setLoading] = useState(true);   
  const [error, setError] = useState<string | null>(null);   

    
  const mapBackendToFrontend = (backendData: ResponseEncomiendaDTO[]): EncomiendaFrontend[] => {
    return backendData.map(item => ({
      id: `#${item.id}`,   
      trackingKey: item.codigo,
      fullname: `${item.user.name} ${item.user.lastName}`,
      email: item.user.email,
      cellPhone: item.user.cellPhone,
      status: statusBackendToFrontend[item.estado] as EncomiendaFrontend['status'],   
      origin: item.origen,
      destination: item.destino,
      weight: item.tipo,   
      price: item.precio,
      tipo: item.tipo,   
      dniDestino: item.dniDestino,
      nombreDestino: item.nombreDestino,
      apellidoDestino: item.apellidoDestino,
      clave: item.clave,
    }));
  };

    
  const fetchEncomiendas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/encomiendas`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ResponseEncomiendaDTO[] = await response.json();
      setEncomiendas(mapBackendToFrontend(data));   
    } catch (e: any) {
      console.error("Error fetching encomiendas:", e);
      setError(`Error al cargar encomiendas: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

    
  useEffect(() => {
    fetchEncomiendas();
  }, []);

  const filteredEncomiendas = encomiendas.filter(encomienda => {
    const matchesSearch = encomienda.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      encomienda.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      encomienda.cellPhone.includes(searchTerm) ||
      encomienda.trackingKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
      encomienda.dniDestino.toLowerCase().includes(searchTerm.toLowerCase()) ||
      encomienda.nombreDestino.toLowerCase().includes(searchTerm.toLowerCase()) ||
      encomienda.apellidoDestino.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || encomienda.status === statusFilter;

    return matchesSearch && matchesStatus;
  });




  const handleStatusChange = async (encomiendaIdString: string, newStatusFrontend: string) => {
  const id = Number(encomiendaIdString.replace('#', ''));
  const newStatusBackend = statusFrontendToBackend[newStatusFrontend as keyof typeof statusFrontendToBackend];

  if (!newStatusBackend) {
    console.error("Estado no válido");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/encomiendas/${id}/estado`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado: newStatusBackend })
    });

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      
    await fetchEncomiendas();
    
      
    setSelectedEncomienda(null);
    
    alert("Estado cambiado con éxito");

  } catch (error) {
    console.error("Error al actualizar:", error);
    alert("Error al cambiar el estado");
  }
};






  const handleDelete = async (encomiendaIdString: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta encomienda?')) {
      return;
    }
    const id = Number(encomiendaIdString.replace('#', ''));   

    try {
      const response = await fetch(`${API_URL}/encomiendas/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
        
      setEncomiendas(prev => prev.filter(e => e.id !== encomiendaIdString));
      alert('Encomienda eliminada exitosamente.');
    } catch (e: any) {
      console.error("Error deleting encomienda:", e);
      alert(`Error al eliminar encomienda: ${e.message}`);
    }
  };

  const handleViewDetails = (encomienda: EncomiendaFrontend) => {
    setSelectedEncomienda(encomienda);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Encomiendas</h1>
              <p className="text-gray-600 mt-2">Gestiona todas las encomiendas del sistema</p>
            </div>

          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email, teléfono o código de rastreo..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:w-64">
              <div className="relative">
                <Filter className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                <select
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos los estados</option>
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="paid">Pagado</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregado</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Mensajes de carga/error */}
        {loading && (
          <div className="flex items-center justify-center py-8 text-gray-600">
            <Loader2 className="h-6 w-6 animate-spin mr-2" /> Cargando encomiendas...
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {/* Tabla */}
        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código de Rastreo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ruta
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEncomiendas.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                        No se encontraron encomiendas.
                      </td>
                    </tr>
                  ) : (
                    filteredEncomiendas.map((encomienda, index) => (
                      <tr key={encomienda.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{encomienda.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-mono bg-gray-100 px-3 py-1 rounded-lg text-gray-800 border">
                              {encomienda.trackingKey}
                            </div>
                            <button
                              onClick={() => navigator.clipboard.writeText(encomienda.trackingKey)}
                              className="ml-2 text-gray-400 hover:text-indigo-500 transition-colors"
                              title="Copiar código"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{encomienda.fullname}</div>
                          <div className="text-sm text-gray-500">{encomienda.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{encomienda.cellPhone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <span className="text-blue-600">{encomienda.origin}</span>
                            <span className="mx-2 text-gray-400">→</span>
                            <span className="text-purple-600">{encomienda.destination}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{encomienda.tipo || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">S/ {encomienda.price?.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={encomienda.status}
                            onChange={(e) => handleStatusChange(encomienda.id, e.target.value)}   
                            className={`text-xs px-3 py-1 rounded-full border font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${statusConfig[encomienda.status]?.color || 'bg-gray-200'}`}
                          >
                            <option value="pending">🟡 Pendiente</option>
                            <option value="confirmed">🔵 Confirmado</option>
                            <option value="paid">🟢 Pagado</option>
                            <option value="shipped">🟣 Enviado</option>
                            <option value="delivered">✅ Entregado</option>
                          </select>




                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetails(encomienda)}
                              className="text-indigo-600 hover:text-indigo-900 transition-colors"
                              title="Ver detalles"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(encomienda.id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal de detalles */}
        {selectedEncomienda && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Detalles de Encomienda</h2>
                  <button
                    onClick={() => setSelectedEncomienda(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Información General</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">ID</label>
                        <p className="text-sm text-gray-900">{selectedEncomienda.id}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Código de Rastreo</label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded-lg text-gray-800 border">
                            {selectedEncomienda.trackingKey}
                          </span>
                          <button
                            onClick={() => navigator.clipboard.writeText(selectedEncomienda.trackingKey)}
                            className="text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Estado</label>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig[selectedEncomienda.status]?.color || 'bg-gray-200'}`}>
                          {statusConfig[selectedEncomienda.status]?.icon} {statusConfig[selectedEncomienda.status]?.label}
                        </span>

                      </div>

                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                        <p className="text-sm text-gray-900">{selectedEncomienda.fullname}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-sm text-gray-900">{selectedEncomienda.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <p className="text-sm text-gray-900">{selectedEncomienda.cellPhone}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Envío</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Origen</label>
                        <p className="text-sm text-blue-600 font-medium">{selectedEncomienda.origin}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Destino</label>
                        <p className="text-sm text-purple-600 font-medium">{selectedEncomienda.destination}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tipo</label>
                        <p className="text-sm text-gray-900">{selectedEncomienda.tipo || 'N/A'} kg</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Precio</label>
                        <p className="text-sm text-gray-900 font-semibold">S/ {selectedEncomienda.price?.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Encomiendas;

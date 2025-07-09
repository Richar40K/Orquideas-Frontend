'use client';

import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Filter,
  Copy,
  X
} from 'lucide-react';

// Tipos
interface Encomienda {
  id: string;
  trackingKey: string;
  fullname: string;
  email: string;
  phone: string;
  status: 'pending' | 'confirmed' | 'paid' | 'shipped' | 'delivered';
  origin: string;
  destination: string;
  weight: number;
  price: number;
  createdAt: string;
}

// Datos de ejemplo
const encomiendas: Encomienda[] = [
  {
    id: '#1',
    trackingKey: 'ORQ-2024-001',
    fullname: 'Damilare Anjorin',
    email: 'damilareanjorin1@gmail.com',
    phone: '+2348106420637',
    status: 'pending',
    origin: 'Lima',
    destination: 'Arequipa',
    weight: 2.5,
    price: 85,
    createdAt: '2024-07-05'
  },
  {
    id: '#2',
    trackingKey: 'ORQ-2024-002',
    fullname: 'María García',
    email: 'maria.garcia@gmail.com',
    phone: '+51987654321',
    status: 'confirmed',
    origin: 'Arequipa',
    destination: 'Cusco',
    weight: 1.8,
    price: 65,
    createdAt: '2024-07-04'
  },
  {
    id: '#3',
    trackingKey: 'ORQ-2024-003',
    fullname: 'Carlos Mendoza',
    email: 'carlos.mendoza@gmail.com',
    phone: '+51912345678',
    status: 'paid',
    origin: 'Lima',
    destination: 'Trujillo',
    weight: 3.2,
    price: 95,
    createdAt: '2024-07-03'
  },
  {
    id: '#4',
    trackingKey: 'ORQ-2024-004',
    fullname: 'Ana Rodríguez',
    email: 'ana.rodriguez@gmail.com',
    phone: '+51923456789',
    status: 'shipped',
    origin: 'Cusco',
    destination: 'Puno',
    weight: 1.5,
    price: 70,
    createdAt: '2024-07-02'
  },
  {
    id: '#5',
    trackingKey: 'ORQ-2024-005',
    fullname: 'Pedro Sánchez',
    email: 'pedro.sanchez@gmail.com',
    phone: '+51934567890',
    status: 'delivered',
    origin: 'Arequipa',
    destination: 'Lima',
    weight: 2.8,
    price: 80,
    createdAt: '2024-07-01'
  }
];

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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEncomienda, setSelectedEncomienda] = useState<Encomienda | null>(null);

  const filteredEncomiendas = encomiendas.filter(encomienda => {
    const matchesSearch = encomienda.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         encomienda.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         encomienda.phone.includes(searchTerm) ||
                         encomienda.trackingKey.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || encomienda.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (encomiendaId: string, newStatus: string) => {
    // Aquí implementarías la lógica para actualizar el estado
    console.log(`Cambiando estado de ${encomiendaId} a ${newStatus}`);
  };

  const handleEdit = (encomienda: Encomienda) => {
    console.log('Editando encomienda:', encomienda);
    // Aquí implementarías la lógica de edición
  };

  const handleDelete = (encomiendaId: string) => {
    console.log('Eliminando encomienda:', encomiendaId);
    // Aquí implementarías la lógica de eliminación
  };

  const handleViewDetails = (encomienda: Encomienda) => {
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

        {/* Tabla */}
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
                    Peso
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
                {filteredEncomiendas.map((encomienda, index) => (
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
                      <div className="text-sm text-gray-900">{encomienda.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className="text-blue-600">{encomienda.origin}</span>
                        <span className="mx-2 text-gray-400">→</span>
                        <span className="text-purple-600">{encomienda.destination}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{encomienda.weight} kg</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">S/ {encomienda.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={encomienda.status}
                        onChange={(e) => handleStatusChange(encomienda.id, e.target.value)}
                        className={`text-xs px-3 py-1 rounded-full border font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${statusConfig[encomienda.status].color}`}
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
                          onClick={() => handleEdit(encomienda)}
                          className="text-yellow-600 hover:text-yellow-900 transition-colors"
                          title="Editar"
                        >
                          <Edit className="h-5 w-5" />
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

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
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig[selectedEncomienda.status].color}`}>
                          {statusConfig[selectedEncomienda.status].icon} {statusConfig[selectedEncomienda.status].label}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Fecha de Creación</label>
                        <p className="text-sm text-gray-900">{selectedEncomienda.createdAt}</p>
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
                        <p className="text-sm text-gray-900">{selectedEncomienda.phone}</p>
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
                        <label className="block text-sm font-medium text-gray-700">Peso</label>
                        <p className="text-sm text-gray-900">{selectedEncomienda.weight} kg</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Precio</label>
                        <p className="text-sm text-gray-900 font-semibold">S/ {selectedEncomienda.price}</p>
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
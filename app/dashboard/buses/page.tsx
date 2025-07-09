'use client';

import { useState } from 'react';
import { JSX } from 'react/jsx-runtime';

// Tipos/Interfaces
interface Bus {
  id: number;
  plate: string;
  type: string;
  capacity: number;
  state: string;
}

interface FormData {
  plate: string;
  type: string;
  capacity: string;
  state: string;
}

export default function BusAdminDashboard(): JSX.Element {
  const [buses, setBuses] = useState<Bus[]>([
    { id: 1, plate: 'ABC-123', type: 'Urbano', capacity: 45, state: 'Activo' },
    { id: 2, plate: 'DEF-456', type: 'Interprovincial', capacity: 55, state: 'Mantenimiento' },
    { id: 3, plate: 'GHI-789', type: 'Express', capacity: 40, state: 'Activo' },
    { id: 4, plate: 'JKL-012', type: 'Urbano', capacity: 45, state: 'Inactivo' },
    { id: 5, plate: 'MNO-345', type: 'Interprovincial', capacity: 60, state: 'Activo' },
  ]);

  const [formData, setFormData] = useState<FormData>({
    plate: '',
    type: '',
    capacity: '',
    state: 'Activo'
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const busTypes: string[] = ['Urbano', 'Interprovincial', 'Express', 'Turístico'];
  const capacities: number[] = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70];
  const states: string[] = ['Activo', 'Inactivo', 'Mantenimiento', 'Fuera de Servicio'];

  const handleSubmit = (): void => {
    if (!formData.plate || !formData.type || !formData.capacity) return;
    
    if (editingId) {
      setBuses(buses.map(bus => 
        bus.id === editingId ? { 
          ...formData, 
          id: editingId,
          capacity: parseInt(formData.capacity, 10)
        } : bus
      ));
      setEditingId(null);
    } else {
      const newBus: Bus = {
        id: Math.max(...buses.map(b => b.id), 0) + 1,
        ...formData,
        capacity: parseInt(formData.capacity, 10)
      };
      setBuses([...buses, newBus]);
    }
    setFormData({ plate: '', type: '', capacity: '', state: 'Activo' });
  };

  const handleEdit = (bus: Bus): void => {
    setFormData({
      ...bus,
      capacity: bus.capacity.toString()
    });
    setEditingId(bus.id);
  };

  const handleDelete = (id: number): void => {
    setBuses(buses.filter(bus => bus.id !== id));
  };

  const filteredBuses: Bus[] = buses.filter(bus =>
    bus.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStateColor = (state: string): string => {
    switch (state) {
      case 'Activo': return 'bg-green-100 text-green-800 border-green-200';
      case 'Inactivo': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Mantenimiento': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Fuera de Servicio': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600 rounded-lg">
              <span className="text-white text-xl">🚌</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Administración de Buses</h1>
          </div>
          <p className="text-gray-600">Gestiona tu flota de buses de manera eficiente</p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-md border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-blue-600">➕</span>
            {editingId ? 'Editar Bus' : 'Nuevo Bus'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Placa
              </label>
              <input
                type="text"
                value={formData.plate}
                onChange={(e) => setFormData({...formData, plate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ABC-123"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar tipo</option>
                {busTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacidad
              </label>
              <select
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar capacidad</option>
                {capacities.map(capacity => (
                  <option key={capacity} value={capacity.toString()}>{capacity} pasajeros</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                {editingId ? 'Actualizar' : 'Agregar'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ plate: '', type: '', capacity: '', state: 'Activo' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-md border overflow-hidden">
          {/* Search Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Lista de Buses</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>🚌</span>
                {filteredBuses.length} buses
              </div>
            </div>
            <div className="relative max-w-md">
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Buscar por placa o tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>


          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Placa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBuses.map((bus) => (
                  <tr key={bus.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{bus.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-blue-600 text-sm">🚌</span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">{bus.plate}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bus.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <span className="text-gray-400 mr-1">👥</span>
                        {bus.capacity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStateColor(bus.state)}`}>
                        {bus.state}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(bus)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(bus.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBuses.length === 0 && (
            <div className="text-center py-12">
              <span className="text-gray-300 text-4xl mb-4 block">🚌</span>
              <p className="text-gray-500 text-lg">No se encontraron buses</p>
              <p className="text-gray-400 text-sm">Intenta con otros términos de búsqueda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { JSX } from 'react/jsx-runtime';

// Enum que coincide con los valores que envía/recibe el backend
export enum StateEnum {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  MANTENIMIENTO = 'MANTENIMIENTO',
  FUERA_DE_SERVICIO = 'FUERA_DE_SERVICIO'
}

// Etiquetas legibles para UI
const stateLabels: Record<StateEnum, string> = {
  [StateEnum.ACTIVO]: 'Activo',
  [StateEnum.INACTIVO]: 'Inactivo',
  [StateEnum.MANTENIMIENTO]: 'Mantenimiento',
  [StateEnum.FUERA_DE_SERVICIO]: 'Fuera de servicio'
};

interface Bus {
  id: number;
  plate: string;
  type: string;
  capacity: number;
  state: StateEnum;
}

interface FormData {
  plate: string;
  type: string;
  capacity: string;
  state: StateEnum;
}

export default function BusAdminDashboard(): JSX.Element {
  const apiUrl = `${process.env.NEXT_PUBLIC_API}/bus`;
  const [buses, setBuses] = useState<Bus[]>([]);
  const [formData, setFormData] = useState<FormData>({
    plate: '',
    type: '',
    capacity: '',
    state: StateEnum.ACTIVO
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const busTypes = ['Urbano', 'Interprovincial', 'Express', 'Turístico'];
  const capacities = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70];
  const states = Object.values(StateEnum) as StateEnum[];

  const transformBus = (item: any): Bus => ({
    id: item.id,
    plate: item.placa,
    type: item.tipo,
    capacity: item.capacidad,
    state: item.estado as StateEnum
  });

  useEffect(() => {
    setLoading(true);
    setErrorMsg(null);
    fetch(apiUrl)
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then((data: any[]) => setBuses(data.map(transformBus)))
      .catch(err => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  }, [apiUrl]);

  const handleSubmit = async (): Promise<void> => {
    if (!formData.plate || !formData.type || !formData.capacity) return;
    setLoading(true);
    setErrorMsg(null);

    const payload = {
      placa: formData.plate,
      tipo: formData.type,
      capacidad: parseInt(formData.capacity, 10),
      estado: formData.state
    };

    try {
      const method = editingId !== null ? 'PUT' : 'POST';
      const url = editingId !== null ? `${apiUrl}/${editingId}` : apiUrl;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      const busItem = transformBus(data);
      setBuses(prev => editingId !== null
        ? prev.map(b => b.id === busItem.id ? busItem : b)
        : [...prev, busItem]
      );
      setEditingId(null);
      setFormData({ plate: '', type: '', capacity: '', state: StateEnum.ACTIVO });
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bus: Bus): void => {
    setFormData({
      plate: bus.plate,
      type: bus.type,
      capacity: bus.capacity.toString(),
      state: bus.state
    });
    setEditingId(bus.id);
  };

  const handleDelete = async (id: number): Promise<void> => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Delete failed ${res.status}`);
      setBuses(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const filteredBuses = buses.filter(bus =>
    bus.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStateColor = (state: StateEnum): string => {
    switch (state) {
      case StateEnum.ACTIVO: return 'bg-green-100 text-green-800 border-green-200';
      case StateEnum.INACTIVO: return 'bg-gray-100 text-gray-800 border-gray-200';
      case StateEnum.MANTENIMIENTO: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case StateEnum.FUERA_DE_SERVICIO: return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600 rounded-lg">
              <span className="text-white text-xl">🚌</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Administración de Buses</h1>
          </div>
          <p className="text-gray-600">Gestiona tu flota de buses de manera eficiente</p>
        </div>

        <div className="bg-white rounded-lg shadow-md border-transparent p-6 mb-6">
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
                onChange={(e) => setFormData({...formData, state: e.target.value as StateEnum})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {states.map(state => (
                  <option key={state} value={state}>{stateLabels[state]}</option>
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
                    setFormData({ plate: '', type: '', capacity: '', state: StateEnum.ACTIVO });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border-0 overflow-hidden">
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
                        {stateLabels[bus.state]}
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
import { Search, Filter } from 'lucide-react';
import { Department, Status } from './types';

interface EmpleadosFiltersProps {
  searchTerm: string;
  departmentFilter: string;
  statusFilter: string;
  onSearchChange: (term: string) => void;
  onDepartmentChange: (department: string) => void;
  onStatusChange: (status: string) => void;
}

export const EmpleadosFilters = ({
  searchTerm,
  departmentFilter,
  statusFilter,
  onSearchChange,
  onDepartmentChange,
  onStatusChange
}: EmpleadosFiltersProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email, teléfono, código o puesto..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        <div className="lg:w-56">
          <div className="relative">
            <Filter className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none bg-white"
              value={departmentFilter}
              onChange={(e) => onDepartmentChange(e.target.value)}
            >
              <option value="all">Todos los departamentos</option>
              <option value="administracion">Administración</option>
              <option value="ventas">Ventas</option>
              <option value="almacen">Almacén</option>
              <option value="transporte">Transporte</option>
              <option value="atencion_cliente">Atención al Cliente</option>
            </select>
          </div>
        </div>
        <div className="lg:w-48">
          <div className="relative">
            <Filter className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none bg-white"
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="vacaciones">Vacaciones</option>
              <option value="licencia">Licencia</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
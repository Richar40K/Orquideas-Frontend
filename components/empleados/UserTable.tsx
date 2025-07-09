import { Eye, Edit, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import { Empleado, Department, Status } from './types';
import { departmentConfig, statusConfig } from './constants';

interface EmpleadosTableProps {
  empleados: Empleado[];
  onViewDetails: (empleado: Empleado) => void;
  onEdit: (empleado: Empleado) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: Status) => void;
}

export const EmpleadosTable = ({
  empleados,
  onViewDetails,
  onEdit,
  onDelete,
  onStatusChange
}: EmpleadosTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empleado
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Puesto
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Departamento
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salario
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
            {empleados.map((empleado, index) => (
              <tr key={empleado.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                      {empleado.fullname.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{empleado.fullname}</div>
                      <div className="text-sm text-gray-500">DNI: {empleado.dni}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono bg-gray-100 px-3 py-1 rounded-lg text-gray-800 border inline-block">
                    {empleado.employeeCode}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900 mb-1">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {empleado.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {empleado.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{empleado.position}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${departmentConfig[empleado.department].color}`}>
                    {departmentConfig[empleado.department].icon} {departmentConfig[empleado.department].label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">S/ {empleado.salary.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={empleado.status}
                    onChange={(e) => onStatusChange(empleado.id, e.target.value as Status)}
                    className={`text-xs px-3 py-1 rounded-full border font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${statusConfig[empleado.status].color}`}
                  >
                    <option value="activo">✅ Activo</option>
                    <option value="inactivo">❌ Inactivo</option>
                    <option value="vacaciones">🏖️ Vacaciones</option>
                    <option value="licencia">📄 Licencia</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewDetails(empleado)}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onEdit(empleado)}
                      className="text-yellow-600 hover:text-yellow-900 transition-colors"
                      title="Editar"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(empleado.id)}
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
  );
};
 
import { Eye, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { Empleado, Department, Status, Position } from './types';
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
   
   
   

   
   

   
   
  const handleStatusChangeLocal = async (id: string, newStatus: Status) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/users/empleados/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: newStatus }),  
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el estado');
      }

       
      onStatusChange(id, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
       
    }
  };

  const handleDeleteLocal = async (id: string) => {  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el empleado');
      }

       
      onDelete(id);
    } catch (error) {
      console.error('Error deleting employee:', error);
       
    }
  };

   
   

   
  const displayEmpleados = empleados;

  return (
    <>
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
              {displayEmpleados.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No se encontraron empleados.
                  </td>
                </tr>
              ) : (
                displayEmpleados.map((empleado, index) => (
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
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${departmentConfig[empleado.department.toLowerCase() as keyof typeof departmentConfig].color}`}>
                        {departmentConfig[empleado.department.toLowerCase() as keyof typeof departmentConfig].icon}
                        {departmentConfig[empleado.department.toLowerCase() as keyof typeof departmentConfig].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">S/ {empleado.salary.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Cambia el span por un select para permitir la actualización de estado */}
                      <select
                        value={empleado.status}
                        onChange={(e) => handleStatusChangeLocal(empleado.id, e.target.value as Status)}
                        className={`text-xs px-3 py-1 rounded-full border font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${statusConfig[empleado.status.toLowerCase() as keyof typeof statusConfig].color}`}
                      >
                        <option value="ACTIVO">✅ Activo</option>
                        <option value="INACTIVO">❌ Inactivo</option>
                        <option value="VACACIONES">🏖️ Vacaciones</option>
                        <option value="LICENCIA">📄 Licencia</option>
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
                          onClick={() => {
                            if (confirm('¿Estás seguro de eliminar este empleado?')) {
                              handleDeleteLocal(empleado.id);
                            }
                          }}
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
    </>
  );
};

import { X, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { Empleado } from './types';
import { departmentConfig, statusConfig } from './constants';

interface EmpleadoDetailsModalProps {
  empleado: Empleado | null;
  onClose: () => void;
}

export const EmpleadoDetailsModal = ({ empleado, onClose }: EmpleadoDetailsModalProps) => {
  if (!empleado) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Información del Empleado</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Información Personal */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-16 w-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {empleado.fullname.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-semibold text-gray-900">{empleado.fullname}</h4>
                    <p className="text-gray-600">{empleado.position}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Código de Empleado</label>
                    <p className="text-sm font-mono bg-gray-100 px-3 py-1 rounded-lg text-gray-800 border inline-block">
                      {empleado.employeeCode}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">DNI</label>
                    <p className="text-sm text-gray-900">{empleado.dni}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <p className="text-sm text-gray-900">{empleado.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <p className="text-sm text-gray-900">{empleado.phone}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dirección</label>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <p className="text-sm text-gray-900">{empleado.address}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Información Laboral */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Laboral</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Departamento</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${departmentConfig[empleado.department].color}`}>
                      {departmentConfig[empleado.department].icon} {departmentConfig[empleado.department].label}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[empleado.status].color}`}>
                      {statusConfig[empleado.status].icon} {statusConfig[empleado.status].label}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Contratación</label>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <p className="text-sm text-gray-900">{empleado.hireDate}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Salario</label>
                    <p className="text-sm font-semibold text-gray-900">S/ {empleado.salary.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contacto de Emergencia */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contacto de Emergencia</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <p className="text-sm text-gray-900">{empleado.emergencyContact}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <p className="text-sm text-gray-900">{empleado.emergencyPhone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
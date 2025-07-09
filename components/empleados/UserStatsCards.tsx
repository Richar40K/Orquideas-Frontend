import { User, Shield, Clock, MapPin } from 'lucide-react';
import { Empleado } from './types';

interface EmpleadoStatsCardsProps {
  empleados: Empleado[];
}

export const EmpleadoStatsCards = ({ empleados }: EmpleadoStatsCardsProps) => {
  const getTotalSalary = () => {
    return empleados.reduce((total, empleado) => total + empleado.salary, 0);
  };

  const getActiveEmployees = () => {
    return empleados.filter(emp => emp.status === 'activo').length;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Empleados</p>
            <p className="text-3xl font-bold text-gray-900">{empleados.length}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <User className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Empleados Activos</p>
            <p className="text-3xl font-bold text-green-600">{getActiveEmployees()}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Nómina Total</p>
            <p className="text-3xl font-bold text-purple-600">S/ {getTotalSalary().toLocaleString()}</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg">
            <Clock className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Departamentos</p>
            <p className="text-3xl font-bold text-orange-600">5</p>
          </div>
          <div className="bg-orange-100 p-3 rounded-lg">
            <MapPin className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
};
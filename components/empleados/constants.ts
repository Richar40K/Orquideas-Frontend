import { Department, Empleado, Status } from './types';

export const departmentConfig = {
  administracion: {
    label: 'Administración',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '🏢'
  },
  ventas: {
    label: 'Ventas',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '💼'
  },
  almacen: {
    label: 'Almacén',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: '📦'
  },
  transporte: {
    label: 'Transporte',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: '🚛'
  },
  atencion_cliente: {
    label: 'Atención al Cliente',
    color: 'bg-pink-100 text-pink-800 border-pink-200',
    icon: '👥'
  }
} as const;

export const statusConfig = {
  activo: {
    label: 'Activo',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '✅'
  },
  inactivo: {
    label: 'Inactivo',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: '❌'
  },
  vacaciones: {
    label: 'Vacaciones',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '🏖️'
  },
  licencia: {
    label: 'Licencia',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: '📄'
  }
} as const;

export const sampleEmpleados: Empleado[] = [
  // ... tus datos de ejemplo aquí
];
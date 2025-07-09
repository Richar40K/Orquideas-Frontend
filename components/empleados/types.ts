export interface Empleado {
  id: string;
  employeeCode: string;
  fullname: string;
  email: string;
  phone: string;
  position: string;
  department: 'administracion' | 'ventas' | 'almacen' | 'transporte' | 'atencion_cliente';
  salary: number;
  hireDate: string;
  status: 'activo' | 'inactivo' | 'vacaciones' | 'licencia';
  address: string;
  dni: string;
  emergencyContact: string;
  emergencyPhone: string;
}

export type Department = Empleado['department'];
export type Status = Empleado['status'];
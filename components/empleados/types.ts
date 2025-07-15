export interface Empleado {
  id: string;
  employeeCode: string;
  fullname: string;
  email: string;
  phone: string;
  position: 'GERENTE_GENERAL' | 'EJECUTIVA_VENTAS' | 'SUPERVISOR_ALMACEN' | 'CHOFER' | 'ATENCION_CLIENTE'| 'ASISTENTE_ADMINISTRATIVO'| 'CLIENTE';
  department: 'ADMINISTRACION' | 'VENTAS' | 'ALMACEN' | 'TRANSPORTE' | 'ATENCION_CLIENTE';
  salary: number;
  hireDate: string;
  status: 'ACTIVO' | 'INACTIVO' | 'LICENCIA' | 'VACACIONES';
  address: string;
  dni: string;
  nameEmergency: string;
  phoneEmergency: string;
}

export type Department = Empleado['department'];
export type Status = Empleado['status'];
export type Position=Empleado['position'];

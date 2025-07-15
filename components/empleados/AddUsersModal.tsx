import { X, User, Mail, Phone, Home, Briefcase, DollarSign, HeartHandshake } from 'lucide-react';
import { useState } from 'react';
import { Empleado } from './types'; 

interface EmpleadoForm {
  name: string;
  secondName: string;
  lastName: string;
  dni: string;
  direccion: string;
  email: string;
  cellPhone: string; 
  puesto: string;
  departamento: string; 
  salario: number; 
  nameEmergency: string;
  phoneEmergency: string;
}


interface BackendUserResponse {
  id: number; 
  name: string;
  secondName?: string;
  lastName: string;
  dni: string;
  codigo: string; 
  direccion?: string;
  nameEmergency?: string;
  phoneEmergency?: string;
  email: string;
  cellPhone: string; 
  puesto: string; 
  departamento: string; 
  salario: number; 
  estado: string; 
  username: string;
  enabled: boolean;
  admin: boolean;
  roles: any[];
}


interface AddEmpleadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (empleado: Empleado) => void;
}

export const AddEmpleadoModal = ({ isOpen, onClose, onSave }: AddEmpleadoModalProps) => {
  const [formData, setFormData] = useState<EmpleadoForm>({
    name: '',
    secondName: '',
    lastName: '',
    dni: '',
    direccion: '',
    email: '',
    cellPhone: '',
    puesto: 'GERENTE_GENERAL', 
    departamento: 'ADMINISTRACION',
    salario: 0,
    nameEmergency: '',
    phoneEmergency: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'salario') ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const userToSave = {
        name: formData.name,
        secondName: formData.secondName,
        lastName: formData.lastName,
        dni: formData.dni,
        direccion: formData.direccion,
        email: formData.email,
        cellPhone: formData.cellPhone,
        puesto: formData.puesto,
        departamento: formData.departamento,
        salario: formData.salario,
        nameEmergency: formData.nameEmergency,
        phoneEmergency: formData.phoneEmergency
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userToSave),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar el usuario');
      }

      const backendData: BackendUserResponse = await response.json(); 

      const mappedEmpleado: Empleado = {
        id: String(backendData.id), 
        employeeCode: backendData.codigo,
        fullname: `${backendData.name || ''} ${backendData.secondName || ''} ${backendData.lastName || ''}`.trim(),
        email: backendData.email,
        phone: backendData.cellPhone,  
        position: backendData.puesto as Empleado['position'],  
        department: backendData.departamento as Empleado['department'],  
        salary: backendData.salario,  
         
        hireDate: new Date().toISOString().split('T')[0],  
        status: backendData.estado as Empleado['status'],  
        address: backendData.direccion || '',  
        dni: backendData.dni,
        nameEmergency: backendData.nameEmergency || '',
        phoneEmergency: backendData.phoneEmergency || '',
      };

      onSave(mappedEmpleado);  
      onClose();  
       
      setFormData({
        name: '', secondName: '', lastName: '', dni: '', direccion: '',
        email: '', cellPhone: '', puesto: 'GERENTE_GENERAL', departamento: 'ADMINISTRACION',
        salario: 0, nameEmergency: '', phoneEmergency: ''
      });
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al guardar el usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Agregar Nuevo Empleado</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información Personal */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Información Personal</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primer Nombre</label>
                  <div className="relative">
                    <User className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Nombre (Opcional)</label>
                  <div className="relative">
                    <User className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="secondName"
                      value={formData.secondName}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                  <div className="relative">
                    <User className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                  <input
                    type="text"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <div className="relative">
                    <Home className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono Celular</label>
                  <div className="relative">
                    <Phone className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="tel"
                      name="cellPhone"
                      value={formData.cellPhone}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Información Laboral y Contacto de Emergencia */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Información Laboral</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Puesto</label>
                  <div className="relative">
                    <Briefcase className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    <select
                      name="puesto"
                      value={formData.puesto}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={isSubmitting}
                    >
                      {/* Opciones de Puesto */}
                      <option value="GERENTE_GENERAL">Gerente General</option>
                      <option value="EJECUTIVA_VENTAS">Ejecutiva de Ventas</option>
                      <option value="SUPERVISOR_ALMACEN">Supervisor de Almacén</option>
                      <option value="CHOFER">Chofer</option>
                      <option value="ATENCION_CLIENTE">Atención al Cliente</option>
                      <option value="ASISTENTE_ADMINISTRATIVO">Asistente Administrativo</option>
                      <option value="CLIENTE">Cliente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                  <div className="relative">
                    <Briefcase className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    <select
                      name="departamento"
                      value={formData.departamento}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={isSubmitting}
                    >
                      {/* Opciones de Departamento */}
                      <option value="ADMINISTRACION">Administración</option>
                      <option value="VENTAS">Ventas</option>
                      <option value="ALMACEN">Almacén</option>
                      <option value="TRANSPORTE">Transporte</option>
                      <option value="ATENCION_CLIENTE">Atención al Cliente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salario (S/)</label>
                  <div className="relative">
                    <DollarSign className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="number"
                      name="salario"
                      value={formData.salario}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      min="0"
                      step="0.01"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-6">Contacto de Emergencia</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Contacto Emergencia</label>
                  <div className="relative">
                    <HeartHandshake className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="nameEmergency"
                      value={formData.nameEmergency}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono Contacto Emergencia</label>
                  <div className="relative">
                    <Phone className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="tel"
                      name="phoneEmergency"
                      value={formData.phoneEmergency}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Empleado'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

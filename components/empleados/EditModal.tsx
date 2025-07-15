import { X, User, Mail, Phone, Briefcase, DollarSign, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Empleado } from './types';

interface EmpleadoForm {
    name: string;
    secondName: string;
    lastName: string;
    email: string;
    cellPhone: string;
    departamento: string;
    salario: number;
    puesto: string;
    estado: string;
}

interface EditEmpleadoModalProps {
    isOpen: boolean;
    onClose: () => void;
    empleado: Empleado | null;
    onSave: (empleado: Empleado) => void;
}

export const EditEmpleadoModal = ({ isOpen, onClose, empleado, onSave }: EditEmpleadoModalProps) => {
    const [formData, setFormData] = useState<EmpleadoForm>({
        name: '',
        secondName: '',
        lastName: '',
        email: '',
        cellPhone: '',
        departamento: 'ADMINISTRACION',
        salario: 0,
        puesto: 'GERENTE_GENERAL',
        estado: 'ACTIVO'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

     
    useEffect(() => {
        if (empleado) {
             
            const nameParts = empleado.fullname.split(' ');

            setFormData({
                name: nameParts[0] || '',
                secondName: nameParts.length > 2 ? nameParts[1] : '',
                lastName: nameParts.length > 2 ? nameParts[2] : nameParts[1] || '',
                email: empleado.email,
                cellPhone: empleado.phone,
                departamento: empleado.department,
                salario: empleado.salary,
                puesto: empleado.position,
                estado: empleado.status
            });
        }
    }, [empleado]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'salario') ? Number(value) : value
        }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!empleado) return;
        setIsSubmitting(true);
        setError(null);

        try {
            const userToUpdate = {
                name: formData.name,
                secondName: formData.secondName,
                lastName: formData.lastName,
                email: formData.email,
                cellPhone: formData.cellPhone,
                departamento: formData.departamento,
                salario: formData.salario,
                puesto: formData.puesto,
                estado: formData.estado
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/users/${empleado.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userToUpdate),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar el usuario');
            }

            const updatedEmpleado: Empleado = {
                ...empleado,
                fullname: `${formData.name || ''} ${formData.secondName || ''} ${formData.lastName || ''}`.trim(),
                email: formData.email,
                phone: formData.cellPhone,
                position: formData.puesto as Empleado['position'],
                department: formData.departamento as Empleado['department'],
                salary: formData.salario,
                status: formData.estado as Empleado['status']
            };

            onSave(updatedEmpleado);
            onClose();

             
            window.location.reload();
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error al actualizar el usuario');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !empleado) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Editar Empleado</h2>
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

                            {/* Información Laboral */}
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                    <div className="relative">
                                        <Activity className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                                        <select
                                            name="estado"
                                            value={formData.estado}
                                            onChange={handleChange}
                                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            disabled={isSubmitting}
                                        >
                                            <option value="ACTIVO">Activo</option>
                                            <option value="INACTIVO">Inactivo</option>
                                            <option value="VACACIONES">Vacaciones</option>
                                            <option value="LICENCIA">Licencia</option>
                                        </select>
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
                                {isSubmitting ? 'Actualizando...' : 'Actualizar Empleado'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
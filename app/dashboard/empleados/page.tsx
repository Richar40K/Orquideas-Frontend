"use client"
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Empleado, Status } from '@/components/empleados/types';
import { sampleEmpleados } from '@/components/empleados/constants';
import { EmpleadoStatsCards } from '@/components/empleados/UserStatsCards';
import { EmpleadosFilters } from '@/components/empleados/UserFilters';
import { EmpleadosTable } from '@/components/empleados/UserTable';
import { EmpleadoDetailsModal } from '@/components/empleados/UsersDetailsModal';
import { AddEmpleadoModal } from '@/components/empleados/AddUsersModal';


const EmpleadosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [empleados, setEmpleados] = useState<Empleado[]>(sampleEmpleados);

  const filteredEmpleados = empleados.filter(empleado => {
    const matchesSearch = empleado.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empleado.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empleado.phone.includes(searchTerm) ||
                         empleado.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empleado.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || empleado.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || empleado.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleStatusChange = (empleadoId: string, newStatus: string) => {
    setEmpleados(prev => prev.map(emp => 
      emp.id === empleadoId ? { ...emp, status: newStatus as Status } : emp
    ));
  };

  const handleEdit = (empleado: Empleado) => {
    console.log('Editando empleado:', empleado);
    // Aquí implementarías la lógica de edición
  };

  const handleDelete = (empleadoId: string) => {
    setEmpleados(prev => prev.filter(emp => emp.id !== empleadoId));
  };

  const handleViewDetails = (empleado: Empleado) => {
    setSelectedEmpleado(empleado);
  };

  const handleAddEmpleado = (newEmpleado: Omit<Empleado, 'id'>) => {
    const newId = `#${empleados.length + 1}`;
    const newEmployeeCode = `EMP-${String(empleados.length + 1).padStart(3, '0')}`;
    
    setEmpleados(prev => [
      ...prev,
      {
        ...newEmpleado,
        id: newId,
        employeeCode: newEmployeeCode
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Empleados</h1>
              <p className="text-gray-600 mt-2">Gestiona todo el personal de la empresa</p>
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5" />
              Nuevo Empleado
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <EmpleadoStatsCards empleados={filteredEmpleados} />

        {/* Filtros */}
        <EmpleadosFilters
          searchTerm={searchTerm}
          departmentFilter={departmentFilter}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onDepartmentChange={setDepartmentFilter}
          onStatusChange={setStatusFilter}
        />

        {/* Tabla */}
        <EmpleadosTable
          empleados={filteredEmpleados}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />

        {/* Modal de detalles */}
        <EmpleadoDetailsModal
          empleado={selectedEmpleado}
          onClose={() => setSelectedEmpleado(null)}
        />

        {/* Modal para agregar nuevo empleado */}
        <AddEmpleadoModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddEmpleado}
        />
      </div>
    </div>
  );
};

export default EmpleadosPage;
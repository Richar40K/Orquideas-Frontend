"use client"
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Empleado, Status } from '@/components/empleados/types';
import { EmpleadoStatsCards } from '@/components/empleados/UserStatsCards';
import { EmpleadosFilters } from '@/components/empleados/UserFilters';
import { EmpleadosTable } from '@/components/empleados/UserTable';
import { EmpleadoDetailsModal } from '@/components/empleados/UsersDetailsModal';
import { AddEmpleadoModal } from '@/components/empleados/AddUsersModal';
import { EditEmpleadoModal } from '@/components/empleados/EditModal';

const EmpleadosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [empleadoToEdit, setEmpleadoToEdit] = useState<Empleado | null>(null);
  const [empleados, setEmpleados] = useState<Empleado[]>([]); 
  const [isLoading, setIsLoading] = useState(true); 


  useEffect(() => {
    const fetchEmpleados = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/users/empleados`);
        if (!response.ok) {
          throw new Error('Error al obtener los empleados');
        }
        const data = await response.json();
        const transformedData: Empleado[] = data.map((user: any) => ({
          id: user.id.toString(),
          employeeCode: user.codigo,
          fullname: `${user.name || ''} ${user.secondName || ''} ${user.lastName || ''}`.trim(), 
          dni: user.dni,
          address: user.direccion || '',
          email: user.email,
          phone: user.cellPhone,
          position: user.puesto,
          department: user.departamento,
          salary: user.salario,
          hireDate: new Date().toISOString().split('T')[0], 
          status: user.estado,
          nameEmergency: user.nameEmergency || '',
          phoneEmergency: user.phoneEmergency || ''
        }));
        setEmpleados(transformedData);
      } catch (error) {
        console.error('Error fetching empleados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmpleados();
  }, []); 

  const filteredEmpleados = empleados.filter(empleado => {
    const fullname = empleado.fullname || '';
    const email = empleado.email || '';
    const phone = empleado.phone || '';
    const employeeCode = empleado.employeeCode || '';
    const position = empleado.position || '';
    const department = empleado.department || '';
    const status = empleado.status || '';

    const matchesSearch =
      fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm) ||
      employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      departmentFilter === 'all' ||
      department.toLowerCase() === departmentFilter.toLowerCase();

    const matchesStatus =
      statusFilter === 'all' ||
      status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesDepartment && matchesStatus;
  });



  const handleStatusChange = (empleadoId: string, newStatus: Status) => {    
    setEmpleados(prev => prev.map(emp =>
      emp.id === empleadoId ? { ...emp, status: newStatus } : emp
    ));
  };

  const handleEdit = (empleado: Empleado) => {
    setEmpleadoToEdit(empleado);
    setIsEditModalOpen(true);
  };

  const handleUpdateEmpleado = (updatedEmpleado: Empleado) => {
    setEmpleados(prev => prev.map(emp =>
      emp.id === updatedEmpleado.id ? updatedEmpleado : emp
    ));
    setIsEditModalOpen(false);
  };

  const handleDelete = (empleadoId: string) => {
    setEmpleados(prev => prev.filter(emp => emp.id !== empleadoId));
  };

  const handleViewDetails = (empleado: Empleado) => {
    setSelectedEmpleado(empleado);
  };

  const handleAddEmpleado = (newEmpleado: Empleado) => { 
    setEmpleados(prev => [
      ...prev,
      newEmpleado 
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
        <EmpleadoStatsCards />

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
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="animate-pulse flex justify-center">
              <div className="h-8 w-8 bg-indigo-200 rounded-full"></div>
            </div>
            <p className="mt-4 text-gray-600">Cargando empleados...</p>
          </div>
        ) : (
          <EmpleadosTable
            empleados={filteredEmpleados}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        )}


        {/* Modal de detalles */}
        <EmpleadoDetailsModal
          empleado={selectedEmpleado}
          onClose={() => setSelectedEmpleado(null)}
        />

        {/* Modal para editar empleado */}
        <EditEmpleadoModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          empleado={empleadoToEdit}
          onSave={handleUpdateEmpleado}
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

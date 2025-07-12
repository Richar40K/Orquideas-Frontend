import React from 'react';
import { 
  User, 
  LayoutDashboard, 
  LogOut,
  ArrowRight
} from 'lucide-react';
import { NextPage } from 'next';

const RoleSelectionScreen: NextPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6">
      {/* Encabezado */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido a Transportes Orquídea</h1>
        <p className="text-gray-600 max-w-md">
          Selecciona el modo que deseas utilizar en esta sesión
        </p>
      </div>

      {/* Selector de Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-12">
        {/* Opción Cliente */}
        <div 
          className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer group border-2 border-transparent hover:border-blue-500 flex flex-col items-center"
        >
          <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
            <User className="w-16 h-16 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Modo Cliente</h2>
          <p className="text-gray-600 text-center mb-4">
            Accede a tus encomiendas, viajes y gestiona tus pagos
          </p>
          <div className="flex items-center text-blue-500 font-medium">
            <span>Ingresar como cliente</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </div>
        </div>

        {/* Opción Dashboard */}
        <div 
          className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer group border-2 border-transparent hover:border-purple-500 flex flex-col items-center"
        >
          <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
            <LayoutDashboard className="w-16 h-16 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Modo Administrador</h2>
          <p className="text-gray-600 text-center mb-4">
            Gestiona toda la operación de transporte y encomiendas
          </p>
          <div className="flex items-center text-purple-500 font-medium">
            <span>Acceder al dashboard</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </div>
        </div>
      </div>

      {/* Botón Cerrar Sesión */}
      <button 
        className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Cerrar sesión</span>
      </button>
    </div>
  );
};

export default RoleSelectionScreen;
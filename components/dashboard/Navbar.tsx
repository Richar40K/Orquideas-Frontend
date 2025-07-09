
import React from 'react';
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
} from 'lucide-react';


interface NavbarProps {
  onMenuClick: () => void;
  activeSection: string;
}


const MENU_ITEMS = [
  { id: 'overview', label: 'Dashboard' },
  { id: 'encomiendas', label: 'Encomiendas' },
  { id: 'viajes', label: 'Viajes' },
  { id: 'empleados', label: 'Empleados' },
  { id: 'buses', label: 'Buses' },
  { id: 'pagos', label: 'Pagos' },
  { id: 'reportes', label: 'Reportes' },
  { id: 'configuracion', label: 'Configuración' },
];


const Navbar: React.FC<NavbarProps> = ({ onMenuClick, activeSection }) => {
  const getCurrentSectionLabel = () => {
    return MENU_ITEMS.find(item => item.id === activeSection)?.label || 'Dashboard';
  };

  return (
    <header className="bg-white/70 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {getCurrentSectionLabel()}
            </h2>
            <p className="text-slate-500">Bienvenido de vuelta, Admin</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 w-64 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <button className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <Search className="w-5 h-5 text-slate-600" />
          </button>
          <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-slate-800">Admin User</p>
              <p className="text-xs text-slate-500">Administrador</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
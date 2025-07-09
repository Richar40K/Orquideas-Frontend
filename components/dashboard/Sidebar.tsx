import { 
  Package, 
  MapPin, 
  Users, 
  Bus, 
  CreditCard, 
  BarChart3, 
  Settings,
  X,
} from 'lucide-react';


interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

interface NavbarProps {
  onMenuClick: () => void;
  activeSection: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

// Menu Items Configuration
const MENU_ITEMS: MenuItem[] = [
  { id: 'overview', label: 'Dashboard', icon: BarChart3, color: 'text-blue-500' },
  { id: 'encomiendas', label: 'Encomiendas', icon: Package, color: 'text-green-500' },
  { id: 'viajes', label: 'Viajes', icon: MapPin, color: 'text-purple-500' },
  { id: 'empleados', label: 'Empleados', icon: Users, color: 'text-orange-500' },
  { id: 'buses', label: 'Buses', icon: Bus, color: 'text-red-500' },
  { id: 'pagos', label: 'Pagos', icon: CreditCard, color: 'text-yellow-500' },
  { id: 'reportes', label: 'Reportes', icon: BarChart3, color: 'text-indigo-500' },
  { id: 'configuracion', label: 'Configuración', icon: Settings, color: 'text-gray-500' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeSection, onSectionChange }) => {
  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-lg border-r border-slate-200/60 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

      <div className="flex items-center justify-between p-6 border-b border-slate-200/60">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Bus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Orquideas
            </h1>
            <p className="text-xs text-slate-500">Sistema de Gestión</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="p-4 space-y-2">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeSection === item.id 
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 shadow-sm' 
                  : 'hover:bg-slate-50 hover:shadow-sm'
              }`}
            >
              <Icon className={`w-5 h-5 ${activeSection === item.id ? item.color : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span className={`font-medium ${
                activeSection === item.id ? 'text-slate-800' : 'text-slate-600 group-hover:text-slate-800'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
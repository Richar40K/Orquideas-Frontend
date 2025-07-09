'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Navbar from '@/components/dashboard/Navbar';
import { Sidebar } from '@/components/dashboard/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Mapeo de secciones a rutas
const ROUTE_MAP = {
  overview: '/dashboard',
  encomiendas: '/dashboard/encomiendas',
  viajes: '/dashboard/viajes',
  empleados: '/dashboard/empleados',
  buses: '/dashboard/buses',
  pagos: '/dashboard/pagos',
  reportes: '/dashboard/reportes',
  configuracion: '/dashboard/configuracion',
} as const;

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  
  // Extraer la sección activa de la URL
  const getActiveSectionFromPath = () => {
    const segments = pathname.split('/');
    // Assuming URLs like /dashboard, /dashboard/encomiendas, etc.
    return segments[2] || 'overview';
  };

  const activeSection = getActiveSectionFromPath();

  const handleSectionChange = (section: string) => {
    // Navegación programática usando el mapeo de rutas
    const newPath = ROUTE_MAP[section as keyof typeof ROUTE_MAP] || '/dashboard';
    router.push(newPath);
    
    // Cerrar sidebar en mobile después de navegar
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Navbar */}
        <Navbar 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          activeSection={activeSection}
        />

        {/* Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
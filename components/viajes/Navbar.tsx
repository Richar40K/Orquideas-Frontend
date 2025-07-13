"use client";

import { useState } from "react";
import Link from "next/link";
import { User, ChevronDown, Settings } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const fullName = "Ricardo Palomino";

  return (
    <nav className="bg-blue-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0" />
          <div className="flex-1 flex justify-center space-x-8">
            <Link
              href="/viajes"
              className="text-lg font-medium hover:text-yellow-300 transition"
            >
              Viajes
            </Link>
            <Link
              href="/encomiendas"
              className="text-lg font-medium hover:text-yellow-300 transition"
            >
              Encomiendas
            </Link>
          </div>
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 hover:text-yellow-300 transition"
            >
              <User className="w-5 h-5" />
              <ChevronDown className="w-4 h-4" />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in">
                <div className="px-4 py-3 border-b font-medium">
                  {fullName}
                </div>
                <Link
                  href="/configuracion"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                >
                  <Settings className="w-4 h-4" />
                  Configuración
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

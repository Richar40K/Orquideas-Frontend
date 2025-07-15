"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, ChevronDown, Settings } from "lucide-react";
import { getUserFromToken } from "@/utils/getUserFromToken";


export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; lastName: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const username = getUserFromToken();
      if (!username) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/users/username/${username}`);
        if (!res.ok) throw new Error("Error al obtener usuario");

        const data = await res.json();
        setUser({ name: data.name, lastName: data.lastName });
      } catch (err) {
        console.error("No se pudo cargar el usuario", err);
      }
    };

    fetchUser();
  }, []);
  return (
    <nav className="bg-blue-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0" />
          <div className="flex-1 flex justify-center space-x-8">
            <Link
              href="/cliente/viajes"
              className="text-lg font-medium hover:text-yellow-300 transition"
            >
              Viajes
            </Link>
            <Link
              href="/cliente/encomiendas"
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
                  {user ? `${user.name} ${user.lastName}` : "Cargando..."}
                </div>
                <Link
                  href="/cliente/configuracion"
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

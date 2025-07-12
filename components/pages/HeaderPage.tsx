"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { name: 'Inicio', path: '/inicio' },
  { name: 'Viajes', path: '/viajes' },
  { name: 'Seguimientos', path: '/seguimiento' },
  { name: 'Paquetería', path: '/encomiendas' },
  { name: 'Centro de Ayuda', path: '/CentroAyuda' },
];

export const HeaderPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(prev => !prev);

  // Close menu when clicking outside or on escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Add scroll effect to header
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        if (window.scrollY > 10) {
          headerRef.current.classList.add('bg-opacity-90', 'backdrop-blur-sm');
          headerRef.current.classList.remove('bg-transparent');
        } else {
          headerRef.current.classList.add('bg-transparent');
          headerRef.current.classList.remove('bg-opacity-90', 'backdrop-blur-sm');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      ref={headerRef}
      className="fixed top-0 left-0 w-full z-50 bg-transparent text-white transition-all duration-300 ease-in-out"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 md:justify-start md:space-x-10">
          {/* Logo and mobile menu button */}
          <div className="flex justify-between items-center w-full md:w-auto">
            <Link
              href="/"
              className="relative flex items-center h-10"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              aria-label="Orquídeas Tour Home"
            >
              <span className={`font-bold text-white text-2xl md:text-3xl transition-all duration-300 ${isHovering ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                OT
              </span>
              <span className={`absolute left-0 font-bold text-[#F8D440] text-2xl md:text-3xl transition-all duration-300 ${isHovering ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                Orquídeas Tour
              </span>
            </Link>

            <button
              onClick={toggleMenu}
              className="md:hidden text-2xl text-[#79808a] focus:outline-none focus:ring-2 focus:ring-[#F8D440] rounded-md p-1"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <ul className="flex space-x-8">
              {NAV_ITEMS.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="text-lg font-medium text-white hover:text-[#F8D440] transition-colors duration-200 relative group"
                  >
                    {item.name}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#F8D440] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>


        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`md:hidden fixed inset-0 top-16 bg-white dark:bg-gray-800 transition-all duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} z-40`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#F8D440] hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-3">
            <Link
              href="./auth/login"
              onClick={() => setIsOpen(false)}
              className="w-full py-2 text-center text-lg rounded-lg border-2 border-[#F8D440] text-[#F8D440] transition-colors duration-300 hover:bg-[#F8D440] hover:text-white"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="./auth/new-account"
              onClick={() => setIsOpen(false)}
              className="w-full py-2 text-center text-lg rounded-lg bg-[#F8D440] text-white hover:bg-[#e6c53a] transition-colors duration-300"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
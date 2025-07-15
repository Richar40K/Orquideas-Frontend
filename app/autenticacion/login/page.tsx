'use client';
import React, { useState } from 'react';
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation';
import { User, Lock, Bus, Package, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/seguridad/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Credenciales incorrectas');
      }

      const data = await response.json();

      // 💾 Guardar token en cookie
      Cookies.set('token', data.access_token, {
        path: '/',
        expires: 1, // 1 día
        secure: process.env.NODE_ENV === 'production', // solo HTTPS en producción
        sameSite: 'lax',
      });
      const decoded: any = jwtDecode(data.access_token);
      const roles: string[] = decoded.roles || [];

      // 🔁 Redirección según roles
      const hasUser = roles.includes('ROLE_USER');
      const hasAdmin = roles.includes('ROLE_ADMIN');

      if (hasUser && hasAdmin) {
        router.push('/autenticacion/roles');
      } else if (hasUser) {
        router.push('/cliente/viajes');
      } else {
        alert('No tienes permisos válidos');
      }

    } catch (err: any) {
      alert(`Error al iniciar sesión: ${err.message}`);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
              <Bus className="w-8 h-8 text-white" />
            </div>
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            OrquideasTour
          </h1>
          <p className="text-gray-600 mt-2">Viajes terrestres y encomiendas</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-gray-600">
              Accede a tu cuenta para gestionar tus viajes
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="username"
                placeholder="Usuario"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Link href={"/autenticacion/roles"}
              type="button"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Iniciar Sesión
            </Link>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta?
              <Link
                href="/autenticacion/registro"
                className="ml-2 text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors"
              >
                Regístrate
              </Link>
            </p>
          </div>

        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
            <Bus className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800">Viajes Seguros</h3>
            <p className="text-sm text-gray-600">Rutas nacionales confiables</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
            <Package className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800">Encomiendas</h3>
            <p className="text-sm text-gray-600">Envíos rápidos y seguros</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

function jwt_decode(access_token: any): any {
  throw new Error('Function not implemented.');
}

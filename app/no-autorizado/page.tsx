'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NoAutorizadoPage() {
  const router = useRouter();

  useEffect(() => {
    alert('❌ No tienes permisos para ingresar a este sitio.');
    router.push('/cliente/viajes');
  }, []);

  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold text-red-600">Acceso denegado</h1>
      <p className="mt-4 text-gray-600">No tienes permisos para entrar a esta sección.</p>
    </div>
  );
}

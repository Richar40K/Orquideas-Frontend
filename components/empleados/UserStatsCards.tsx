import { User, Shield, Clock, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';

interface StatsData {
  totalEmpleados: number;
  empleadosActivos: number;
  nominaTotal: number;
  totalDepartamentos?: number;
}

export const EmpleadoStatsCards = () => {
  const [stats, setStats] = useState<StatsData>({
    totalEmpleados: 0,
    empleadosActivos: 0,
    nominaTotal: 0,
    totalDepartamentos: 5
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [empleadosRes, activosRes, nominaRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API}/users/empleados`),
          fetch(`${process.env.NEXT_PUBLIC_API}/users/count/active`),
          fetch(`${process.env.NEXT_PUBLIC_API}/users/salary/total`)
        ]);
        if (!empleadosRes.ok || !activosRes.ok || !nominaRes.ok) {
          throw new Error('Error al obtener datos estadísticos');
        }

        const [empleados, activos, nomina] = await Promise.all([
          empleadosRes.json(),
          activosRes.json(),
          nominaRes.json()
        ]);

        setStats({
          totalEmpleados: empleados.length,
          empleadosActivos: activos,
          nominaTotal: nomina.total,
          totalDepartamentos: 5
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Tarjeta Total Empleados */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Empleados</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalEmpleados}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <User className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Tarjeta Empleados Activos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Empleados Activos</p>
            <p className="text-3xl font-bold text-green-600">{stats.empleadosActivos}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Tarjeta Nómina Total */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Nómina Total</p>
            <p className="text-3xl font-bold text-purple-600">S/ {stats.nominaTotal.toLocaleString()}</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg">
            <Clock className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tarjeta Departamentos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Departamentos</p>
            <p className="text-3xl font-bold text-orange-600">
              {stats.totalDepartamentos ?? 'N/A'}
            </p>
          </div>
          <div className="bg-orange-100 p-3 rounded-lg">
            <MapPin className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
};
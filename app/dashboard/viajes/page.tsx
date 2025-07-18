"use client"
import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Bus,
  User,
  Plus,
  Edit3,
  Eye,
  Trash2,
  Search,
  Filter,
  Download
} from 'lucide-react';


const API_BASE_URL = process.env.NEXT_PUBLIC_API;


interface Ruta {
  id: string;
  origen: string;
  destino: string;
  duracion: string;
  distance: number;
}

interface Conductor {
  id: string;
  name: string;
  lastName: string;

}

interface Bus {
  id: string;
  placa: string;
  modelo: string;
  capacidad: number;
  estado: string;
}


interface CrearViajeDTO {
  busId: string;
  userId: string;
  rutaId: string;
  fechaSalida: string;
  horaSalida: string;
  fechaLlegada: string;
  horaLLegada: string;
  precio: number;
}


interface ViajeRespuestaDTO {
  id: string;
  origen: string;
  destino: string;
  fechaSalida: string;
  horaSalida: string;
  fechaLlegada: string;
  horaLLegada: string;
  busId: string;
  userId: string;
  nombreChofer: string;
  apellidoChofer: string;
  estado: 'PROGRAMADO' | 'EN_CURSO' | 'COMPLETADO';
  precio: number;
}


interface Viaje {
  id: string;
  salida: string;
  llegada: string;
  horaSalida: string;
  horaLlegada: string;
  placa: string;
  origen: string;
  destino: string;
  conductor: string;
  pasajeros: number;
  capacidad: number;
  estado: 'programado' | 'en_curso' | 'completado';
}


const ViajesAdministration = () => {
  const [fechaSalida, setFechaSalida] = useState('');
  const [fechaLlegada, setFechaLlegada] = useState('');
  const [horaSalida, setHoraSalida] = useState('');
  const [horaLlegada, setHoraLlegada] = useState('');
  const [precio, setPrecio] = useState<number | ''>('');
  const [rutaSeleccionada, setRutaSeleccionada] = useState('');
  const [conductorSeleccionado, setConductorSeleccionado] = useState('');
  const [busSeleccionado, setBusSeleccionado] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este viaje?')) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/viajes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el viaje');
      }
      alert('Viaje eliminado exitosamente!');
      await fetchViajes();
    } catch (error: any) {
      console.error('Error al eliminar el viaje:', error);
      alert(`Error al eliminar el viaje: ${error.message || 'Ocurrió un error inesperado.'}`);
    }
  };

  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'programado': return 'bg-blue-100 text-blue-800';
      case 'en_curso': return 'bg-green-100 text-green-800';
      case 'completado': return 'bg-gray-100 text-gray-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {

        const busesRes = await fetch(`${API_BASE_URL}/bus`);
        if (!busesRes.ok) throw new Error('Error al cargar buses');
        const busesData: Bus[] = await busesRes.json();
        setBuses(busesData);


        await fetchViajes();


        const [rutasRes, choferesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/rutas`),
          fetch(`${API_BASE_URL}/users/choferes`)
        ]);

        if (!rutasRes.ok) throw new Error('Error al cargar rutas');
        if (!choferesRes.ok) throw new Error('Error al cargar choferes');

        const rutasData: Ruta[] = await rutasRes.json();
        const choferesData: Conductor[] = await choferesRes.json();

        setRutas(rutasData);
        setConductores(choferesData);

      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        alert('Hubo un error al cargar los datos iniciales. Por favor, inténtalo de nuevo.');
      }
    };

    fetchData();
  }, []);

  const mapBackendStateToFrontend = (backendState: string) => {
    switch (backendState) {
      case 'PROGRAMADO': return 'programado';
      case 'EN_CURSO': return 'en_curso';
      case 'COMPLETADO': return 'completado';
      default: return 'programado';
    }
  };
  const fetchViajes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/viajes`);
      if (!response.ok) throw new Error('Error al cargar viajes');
      const data: ViajeRespuestaDTO[] = await response.json();


      if (buses.length === 0) {
        const busesRes = await fetch(`${API_BASE_URL}/bus`);
        if (!busesRes.ok) throw new Error('Error al cargar buses');
        const busesData: Bus[] = await busesRes.json();
        setBuses(busesData);
      }

      const transformedViajes: Viaje[] = data.map(v => {

        const busInfo = buses.find(b => b.id === v.busId) ||
          (buses.length > 0 ? buses.find(b => b.id === v.busId) : null);

        const placa = busInfo ? busInfo.placa : 'N/A';
        const capacidad = busInfo ? busInfo.capacidad : 0;

        return {
          id: v.id,
          salida: v.fechaSalida,
          llegada: v.fechaLlegada,
          horaSalida: v.horaSalida,
          horaLlegada: v.horaLLegada,
          placa: placa,
          origen: v.origen,
          destino: v.destino,
          conductor: `${v.nombreChofer || ''} ${v.apellidoChofer || ''}`.trim(),
          pasajeros: 0,
          capacidad: capacidad,
          estado: mapBackendStateToFrontend(v.estado),
        };
      });
      setViajes(transformedViajes);
    } catch (error) {
      console.error('Error al cargar los viajes:', error);
      alert('Hubo un error al cargar los viajes.');
    }
  };

  const handleSubmit = async () => {

    if (!fechaSalida || !horaSalida || !fechaLlegada || !horaLlegada || !rutaSeleccionada || !conductorSeleccionado || !busSeleccionado || precio === '') {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const newViaje: CrearViajeDTO = {
      busId: busSeleccionado,
      userId: conductorSeleccionado,
      rutaId: rutaSeleccionada,
      fechaSalida: fechaSalida,
      horaSalida: `${horaSalida}:00`,
      fechaLlegada: fechaLlegada,
      horaLLegada: `${horaLlegada}:00`,
      precio: Number(precio),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/viajes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',



        },
        body: JSON.stringify(newViaje),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el viaje');
      }

      const createdViaje: ViajeRespuestaDTO = await response.json();
      alert('Viaje creado exitosamente!');
      console.log('Viaje creado:', createdViaje);


      await fetchViajes();


      setFechaSalida('');
      setFechaLlegada('');
      setHoraSalida('');
      setHoraLlegada('');
      setPrecio('');
      setRutaSeleccionada('');
      setConductorSeleccionado('');
      setBusSeleccionado('');

    } catch (error: any) {
      console.error('Error al crear el viaje:', error);
      alert(`Error al crear el viaje: ${error.message || 'Ocurrió un error inesperado.'}`);
    }
  };




  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Administración de Viajes</h1>
          <p className="text-slate-600 mt-1">Gestiona y programa todos los viajes de tu flota</p>
        </div>
        
      </div>

      {/* Form Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Programar Nuevo Viaje</h2>
        </div>

        <div className="space-y-6">
          {/* Fechas y Horarios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha de Salida
              </label>
              <input
                type="date"
                value={fechaSalida}
                onChange={(e) => setFechaSalida(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Hora de Salida
              </label>
              <input
                type="time"
                value={horaSalida}
                onChange={(e) => setHoraSalida(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha de Llegada
              </label>
              <input
                type="date"
                value={fechaLlegada}
                onChange={(e) => setFechaLlegada(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Hora de Llegada
              </label>
              <input
                type="time"
                value={horaLlegada}
                onChange={(e) => setHoraLlegada(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              />
            </div>
          </div>


          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Precio
            </label>
            <input
              type="number"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              required
            />
          </div>

          {/* Selecciones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Ruta
              </label>
              <select
                value={rutaSeleccionada}
                onChange={(e) => setRutaSeleccionada(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              >
                <option value="">Selecciona una ruta</option>
                {rutas.map(ruta => (
                  <option key={ruta.id} value={ruta.id}>
                    {ruta.origen} - {ruta.destino} ({ruta.duracion ? ruta.duracion.substring(0, 5) : 'N/A'}) {/* Formatear duración si es necesario */}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Conductor
              </label>
              <select
                value={conductorSeleccionado}
                onChange={(e) => setConductorSeleccionado(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              >
                <option value="">Selecciona un conductor</option>
                {conductores.map(conductor => (
                  <option key={conductor.id} value={conductor.id}>
                    {conductor.name} {conductor.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Bus className="w-4 h-4 inline mr-1" />
                Bus
              </label>
              <select
                value={busSeleccionado}
                onChange={(e) => setBusSeleccionado(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              >
                <option value="">Selecciona un bus</option>
                {buses.map(bus => (
                  <option key={bus.id} value={bus.id}>
                    {bus.placa} - {bus.modelo} ({bus.capacidad} asientos)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Crear Viaje
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/60 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar viajes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Viajes Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/80 border-b border-slate-200/60">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">SALIDA</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">LLEGADA</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">HORARIOS</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">RUTA</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">CONDUCTOR</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">PASAJEROS</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">ESTADO</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">ACCIONES</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/60">
              {viajes.map((viaje) => (
                <tr key={viaje.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{viaje.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{viaje.salida}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{viaje.llegada}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {viaje.horaSalida}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3" />
                        {viaje.horaLlegada}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-700">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{viaje.origen}</span>
                      <span className="text-slate-500">→ {viaje.destino}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-700">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{viaje.conductor}</span>
                      <span className="text-slate-500">{viaje.placa}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">{viaje.pasajeros}/{viaje.capacidad}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(viaje.estado)}`}>
                      {viaje.estado.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      
                      <button
                        onClick={() => handleDelete(viaje.id)} // <--- Aquí se añade el onClick
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViajesAdministration;
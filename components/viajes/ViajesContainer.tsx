"use client";

import { useState, useEffect } from "react";
import TripSearchBar from "./TripSearchBar";
import ListaDeViajes from "./ListaDeViajes";
import { ViajeFrontend, ViajeBackend, Ruta } from "./interfaces";

export default function ViajesContainer() {
    const [filteredViajes, setFilteredViajes] = useState<ViajeFrontend[]>([]);
    const [hasSearched, setHasSearched] = useState<boolean>(false);
    const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    // Estado para las rutas disponibles (para TripSearchBar)
    const [rutas, setRutas] = useState<Ruta[]>([]);
    const [isLoadingRutas, setIsLoadingRutas] = useState<boolean>(true);
    const [rutasError, setRutasError] = useState<string | null>(null);

    // Cargar rutas al inicio (para los selects de origen/destino)
    useEffect(() => {
        const fetchRutas = async () => {
            try {
                setIsLoadingRutas(true);
                const apiUrl = process.env.NEXT_PUBLIC_API;
                const response = await fetch(`${apiUrl}/rutas`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data: Ruta[] = await response.json();
                setRutas(data);
            } catch (error: any) {
                console.error("Error fetching routes:", error);
                setRutasError(error.message || "No se pudieron cargar las rutas disponibles.");
            } finally {
                setIsLoadingRutas(false);
            }
        };
        fetchRutas();
    }, []);

    // Función para mapear datos del backend a la interfaz de frontend
    const mapBackendToFrontendViajes = (data: ViajeBackend[]): ViajeFrontend[] => {
        return data.map((viaje) => {
            const horaSalidaFormatted = viaje.horaSalida ? viaje.horaSalida.substring(0, 5) : "N/A";
            const horaLlegadaFormatted = viaje.horaLLegada ? viaje.horaLLegada.substring(0, 5) : "N/A";

            let duracion = "N/A";
            try {
                const fechaSalida = new Date(`${viaje.fechaSalida}T${viaje.horaSalida}`);
                const fechaLlegada = new Date(`${viaje.fechaLlegada}T${viaje.horaLLegada}`);

                if (fechaLlegada > fechaSalida) {
                    const diffMs = fechaLlegada.getTime() - fechaSalida.getTime();
                    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                    duracion = `${diffHrs} hrs ${diffMins} mins`;
                } else if (fechaLlegada.toDateString() === fechaSalida.toDateString()) {
                    const horaSalidaMs = new Date(`2000-01-01T${viaje.horaSalida}`).getTime();
                    const horaLlegadaMs = new Date(`2000-01-01T${viaje.horaLLegada}`).getTime();
                    if (horaLlegadaMs > horaSalidaMs) {
                        const diffMs = horaLlegadaMs - horaSalidaMs;
                        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                        duracion = `${diffHrs} hrs ${diffMins} mins`;
                    }
                }
            } catch (e) {
                console.warn("Could not calculate duration for trip", viaje.id, e);
                duracion = "N/A";
            }

            return {
                id: viaje.id,
                tipo: "Estándar",
                asiento: "Asiento Estándar",
                horaSalida: horaSalidaFormatted,
                horaLlegada: horaLlegadaFormatted,
                origen: viaje.origen,
                destino: viaje.destino,
                duracion: duracion,
                precio: viaje.precio,
                asientosDisponibles: 0, // Esto aún necesita ser obtenido del backend
            };
        });
    };

    // Función que TripSearchBar llamará al hacer la búsqueda
    const handleSearch = async (origen: string, destino: string, fecha: string) => {
        try {
            setIsLoadingSearch(true);
            setSearchError(null);
            const apiUrl = process.env.NEXT_PUBLIC_API;

            // Construir la URL con los parámetros de búsqueda
            // NOTA: El backend actual solo filtra por estado y fecha.
            // Para que origen y destino funcionen, el backend necesitaría una modificación.
            // Si no se puede modificar el backend, el filtrado por origen/destino
            // tendría que hacerse aquí en el frontend después de obtener todos los viajes programados.
            const queryParams = new URLSearchParams();
            if (origen) queryParams.append('origen', origen);
            if (destino) queryParams.append('destino', destino);
            if (fecha) queryParams.append('fecha', fecha);

            const response = await fetch(`${apiUrl}/viajes?${queryParams.toString()}`);
            const data: ViajeBackend[] = await response.json();

            console.log("Parámetros enviados:", { origen, destino, fecha });
            console.log("Datos recibidos:", data); // <-- Añade esto

            // Filtrado manual en frontend como plan B
            const filteredData = data.filter(viaje =>
                (!origen || viaje.origen === origen) &&
                (!destino || viaje.destino === destino) &&
                (!fecha || viaje.fechaSalida.includes(fecha)) // <-- Filtro manual por fecha
            );


            setFilteredViajes(mapBackendToFrontendViajes(filteredData));
            setHasSearched(true);
        } catch (e: any) {
            console.error("Error searching trips:", e);
            setSearchError(e.message || "No se pudieron cargar los viajes. Inténtalo de nuevo más tarde.");
            setFilteredViajes([]); // Limpiar resultados en caso de error
        } finally {
            setIsLoadingSearch(false);
        }
    };

    // Cargar viajes programados iniciales al montar el contenedor
    useEffect(() => {
        const fetchInitialViajes = async () => {
            try {
                setIsLoadingSearch(true); // Usamos el mismo loading para la carga inicial
                const apiUrl = process.env.NEXT_PUBLIC_API;
                const response = await fetch(`${apiUrl}/viajes/programados`); // Sin filtros iniciales
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: ViajeBackend[] = await response.json();
                setFilteredViajes(mapBackendToFrontendViajes(data));
            } catch (e: any) {
                console.error("Error fetching initial trips:", e);
                setSearchError(e.message || "No se pudieron cargar los viajes iniciales.");
            } finally {
                setIsLoadingSearch(false);
            }
        };
        fetchInitialViajes();
    }, []); // Se ejecuta solo una vez al montar el componente

    if (isLoadingRutas) {
        return <div className="text-center p-6 text-blue-700">Cargando rutas disponibles...</div>;
    }

    if (rutasError) {
        return <div className="text-center p-6 text-red-600">{rutasError}</div>;
    }

    if (rutas.length === 0 && !isLoadingRutas) {
        return <div className="text-center p-6 text-gray-600">No hay rutas disponibles actualmente.</div>;
    }

    return (
        <>
            <TripSearchBar
                onSearch={handleSearch}
                rutas={rutas} // Pasa las rutas al TripSearchBar
                isLoading={isLoadingSearch} // Pasa el estado de carga de la búsqueda
            />
            <ListaDeViajes
                viajesToShow={filteredViajes}
                hasSearched={hasSearched}
                isLoading={isLoadingSearch} // Pasa el estado de carga a ListaDeViajes
                error={searchError} // Pasa el error de búsqueda a ListaDeViajes
            />
        </>
    );
}

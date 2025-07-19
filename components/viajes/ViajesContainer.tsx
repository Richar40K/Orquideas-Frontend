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

     
    const [rutas, setRutas] = useState<Ruta[]>([]);
    const [isLoadingRutas, setIsLoadingRutas] = useState<boolean>(true);
    const [rutasError, setRutasError] = useState<string | null>(null);

     
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
                asientosDisponibles: 0, 
            };
        });
    };

     
    const handleSearch = async (origen: string, destino: string, fecha: string) => {
    try {
        setIsLoadingSearch(true);
        setSearchError(null);
        const apiUrl = process.env.NEXT_PUBLIC_API;

        // Construye la URL para /viajes/programados
        let url = `${apiUrl}/viajes/programados`;
        if (fecha) {
            // Si hay fecha seleccionada, agrega el query param
            url += `?fecha=${fecha}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: ViajeBackend[] = await response.json();

        // Filtra por origen y destino en el front
        const filteredData = data.filter(viaje =>
            (!origen || viaje.origen === origen) &&
            (!destino || viaje.destino === destino)
        );

        setFilteredViajes(mapBackendToFrontendViajes(filteredData));
        setHasSearched(true);
    } catch (e: any) {
        console.error("Error searching trips:", e);
        setSearchError(e.message || "No se pudieron cargar los viajes. Inténtalo de nuevo más tarde.");
        setFilteredViajes([]);
    } finally {
        setIsLoadingSearch(false);
    }
};

     
    useEffect(() => {
        const fetchInitialViajes = async () => {
            try {
                setIsLoadingSearch(true);  
                const apiUrl = process.env.NEXT_PUBLIC_API;
                const response = await fetch(`${apiUrl}/viajes/programados`);  
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
    }, []);  

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
                rutas={rutas}  
                isLoading={isLoadingSearch}  
            />
            <ListaDeViajes
                viajesToShow={filteredViajes}
                hasSearched={hasSearched}
                isLoading={isLoadingSearch}  
                error={searchError}  
            />
        </>
    );
}

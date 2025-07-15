 
"use client";

import { useState, useEffect } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Ruta } from "./interfaces";  

const inputStyle = "appearance-none bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition w-full sm:w-40";

interface TripSearchBarProps {
  onSearch: (origen: string, destino: string, fecha: string) => void;
  rutas: Ruta[];  
  isLoading: boolean;  
}

export default function TripSearchBar({ onSearch, rutas, isLoading }: TripSearchBarProps) {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [minDate, setMinDate] = useState<string>("");
  const [maxDate, setMaxDate] = useState<string>("");

   
  useEffect(() => {
    if (rutas.length > 0) {
      const origins = Array.from(new Set(rutas.map(ruta => ruta.origen)));
      if (origins.length > 0 && !origin) {  
        setOrigin(origins[0]);
      }

       
      if (origin) {
        const firstOriginDests = rutas
          .filter(r => r.origen === origin)
          .map(r => r.destino);
        if (firstOriginDests.length > 0 && !destination) {  
          setDestination(firstOriginDests[0]);
        }
      } else if (origins.length > 0) {  
        const firstOriginDests = rutas
          .filter(r => r.origen === origins[0])
          .map(r => r.destino);
        if (firstOriginDests.length > 0) {
          setDestination(firstOriginDests[0]);
        }
      }

       
      const today = new Date();
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      setMinDate(today.toISOString().split('T')[0]);
      setMaxDate(lastDayOfMonth.toISOString().split('T')[0]);
      if (!date) {  
        setDate(today.toISOString().split('T')[0]);
      }
    }
  }, [rutas, origin, destination, date]);  

   
  const getDestinationsForOrigin = (selectedOrigin: string): string[] => {
    return Array.from(
      new Set(
        rutas
          .filter(ruta => ruta.origen === selectedOrigin)
          .map(ruta => ruta.destino)
      )
    );
  };

  const handleOriginChange = (value: string) => {
    setOrigin(value);
    const newDestinations = getDestinationsForOrigin(value);
    setDestination(newDestinations[0] || "");  
  };

  const swapLocations = () => {
    const reverseExists = rutas.some(r => 
      r.origen === destination && r.destino === origin
    );
    
    if (reverseExists) {
      const temp = origin;
      setOrigin(destination);
      setDestination(temp);
    } else {
      alert("No existe ruta directa en sentido inverso");
    }
  };

  const handleSearchClick = () => {
    if (origin && destination && date) {
      onSearch(origin, destination, date);  
    }
  };

  return (
    <div className="bg-blue-900 p-6 rounded-2xl max-w-4xl mx-auto shadow-lg">
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-center items-center">
        {/* Origen */}
        <div className="w-full sm:w-auto">
          <select
            value={origin}
            onChange={(e) => handleOriginChange(e.target.value)}
            className={inputStyle}
            disabled={isLoading}
          >
            {Array.from(new Set(rutas.map(r => r.origen))).map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Botón de intercambio */}
        <button
          onClick={swapLocations}
          className="bg-yellow-400 hover:bg-yellow-300 text-black rounded-full p-2 shadow-md transition"
          title="Intercambiar"
          disabled={isLoading}
        >
          <ArrowLeftRight className="w-5 h-5" />
        </button>

        {/* Destino */}
        <div className="w-full sm:w-auto">
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className={inputStyle}
            disabled={!origin || isLoading}
          >
            {getDestinationsForOrigin(origin).map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Fecha */}
        <div className="w-full sm:w-auto">
          <input
            type="date"
            value={date}
            min={minDate}
            max={maxDate}
            onChange={(e) => setDate(e.target.value)}
            className={`${inputStyle} text-black`}
            disabled={isLoading}
          />
        </div>

        {/* Botón de búsqueda */}
        <button
          onClick={handleSearchClick}
          disabled={!origin || !destination || !date || isLoading}
          className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-semibold px-6 py-2 rounded-xl shadow-md transition w-full sm:w-auto"
        >
          {isLoading ? "Buscando..." : "🔍 Buscar"}
        </button>
      </div>
    </div>
  );
}


/*
"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";

const routes: Record<string, string[]> = {
  Arequipa: ["Omate", "Quinstiquillas"],
  Omate: ["Arequipa", "Quinstiquillas"],
  Quinstiquillas: ["Arequipa", "Omate"],
};

const inputStyle =
  "appearance-none bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition w-full sm:w-40";

export default function TripSearchBar() {
  const [origin, setOrigin] = useState("Arequipa");
  const [destination, setDestination] = useState(routes["Arequipa"][0]);
  const [date, setDate] = useState("");

  const handleOriginChange = (value: string) => {
    setOrigin(value);
    const newDestinations = routes[value];
    setDestination(newDestinations[0]);
  };

  const swapLocations = () => {
    const canSwap = routes[destination]?.includes(origin);
    if (canSwap) {
      setOrigin(destination);
      setDestination(origin);
    } else {
      alert("No hay ruta directa en ese sentido.");
    }
  };

  const handleSearch = () => {
    console.log({ origin, destination, date });
  };

  return (
    <div className="bg-blue-900 p-6 rounded-2xl max-w-4xl mx-auto shadow-lg">
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-center items-center">
        <div className="w-full sm:w-auto">
          <select
            value={origin}
            onChange={(e) => handleOriginChange(e.target.value)}
            className={inputStyle}
          >
            {Object.keys(routes).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={swapLocations}
          className="bg-yellow-400 hover:bg-yellow-300 text-black rounded-full p-2 shadow-md transition"
          title="Intercambiar"
        >
          <ArrowLeftRight className="w-5 h-5" />
        </button>

        <div className="w-full sm:w-auto">
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className={inputStyle}
          >
            {routes[origin].map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-auto">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`${inputStyle} text-black`}
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-semibold px-6 py-2 rounded-xl shadow-md transition w-full sm:w-auto"
        >
          🔍 Buscar
        </button>
      </div>
    </div>
  );
}
*/
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

        {/* Destino */}
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

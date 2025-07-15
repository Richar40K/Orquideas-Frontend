// viajes/page.tsx
import ViajesContainer from "@/components/viajes/ViajesContainer"; // Importa el nuevo contenedor

export default function ViajesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ViajesContainer /> {/* Renderiza el contenedor */}
    </div>
  );
}


export interface Ruta {
  id: number;
  origen: string;
  destino: string;
  duracion: string;
  distancia: number;
}

export interface ViajeBackend {
  id: number;
  origen: string;
  destino: string;
  fechaSalida: string;
  horaSalida: string;
  fechaLlegada: string;
  horaLLegada: string;
  precio: number;
  estado: string;
}

export interface ViajeFrontend {
  id: number;
  tipo: string;
  asiento: string;
  horaSalida: string;
  horaLlegada: string;
  origen: string;
  destino: string;
  duracion: string;
  precio: number;
  asientosDisponibles: number;
}

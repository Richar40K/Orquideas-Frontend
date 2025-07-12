"use client"
import { Bus, Package, PackageCheck, Search, Ticket, User, Calendar, ArrowRight, ChevronDown, Clock, MapPin, CreditCard, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ClientePage() {
  const [activeTab, setActiveTab] = useState<'pasajes' | 'encomiendas' | 'seguimiento'>('pasajes');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [roundTrip, setRoundTrip] = useState(false);

  // Datos de ejemplo
  const routes = [
    { id: 1, origin: 'Lima', destination: 'Arequipa', departure: '22:00', arrival: '05:00', price: 143 },
    { id: 2, origin: 'Lima', destination: 'Arequipa', departure: '23:00', arrival: '06:00', price: 150 },
  ];

  const seats = [
    { id: 1, floor: 1, number: '1A', available: false },
    { id: 2, floor: 1, number: '1B', available: true },
    { id: 3, floor: 1, number: '1C', available: true },
    { id: 4, floor: 2, number: '2A', available: true },
    { id: 5, floor: 2, number: '2B', available: false },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Bus className="h-8 w-8 text-amber-600" />
            <span className="ml-2 text-xl font-bold">Orquídeas Tour</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <button 
              className={`font-medium ${activeTab === 'pasajes' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('pasajes')}
            >
              Pasajes
            </button>
            <button 
              className={`font-medium ${activeTab === 'encomiendas' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('encomiendas')}
            >
              Encomiendas
            </button>
            <button 
              className={`font-medium ${activeTab === 'seguimiento' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('seguimiento')}
            >
              Seguimiento
            </button>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-gray-600">
              <User className="h-5 w-5 mr-1" />
              <span>Mi cuenta</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'pasajes' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Paso 1: Selección de ruta y fecha */}
            {step === 1 && (
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Buscar pasaje de bus</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Origen</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Ciudad de origen" 
                        className="w-full p-3 border border-gray-300 rounded-lg pl-10"
                      />
                      <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destino</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Ciudad de destino" 
                        className="w-full p-3 border border-gray-300 rounded-lg pl-10"
                      />
                      <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de viaje</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        className="w-full p-3 border border-gray-300 rounded-lg pl-10"
                      />
                      <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center mb-6">
                  <input 
                    type="checkbox" 
                    id="roundtrip" 
                    className="h-4 w-4 text-amber-600 rounded"
                    checked={roundTrip}
                    onChange={() => setRoundTrip(!roundTrip)}
                  />
                  <label htmlFor="roundtrip" className="ml-2 text-gray-700">¿Viaje redondo?</label>
                </div>
                
                {roundTrip && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de regreso</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        className="w-full p-3 border border-gray-300 rounded-lg pl-10"
                      />
                      <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                )}
                
                <button 
                  className="w-full md:w-auto px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
                  onClick={() => setStep(2)}
                >
                  Buscar viajes
                </button>
              </div>
            )}
            
            {/* Paso 2: Selección de horario y asientos */}
            {step === 2 && (
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">Asientos de Ida</h2>
                    <div className="flex items-center text-sm text-gray-600 mt-2">
                      <span className="font-medium">Pasajeros</span>
                      <span className="mx-2">•</span>
                      <span className="text-amber-600 font-medium">Paso 2 de 3</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">10 Libres</span>
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm">{selectedSeats.length} Elegido</span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">40 Ocupados</span>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Tus asientos</h3>
                  <p className="text-gray-600 mb-6">
                    Elige los asientos que necesites, en seguida te solicitaremos los datos de los pasajeros
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-medium mb-2">Piso 1 - 160°</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {seats.filter(s => s.floor === 1).map(seat => (
                          <button
                            key={seat.id}
                            className={`p-3 rounded-md text-center ${seat.available 
                              ? selectedSeats.includes(seat.id) 
                                ? 'bg-amber-600 text-white' 
                                : 'bg-gray-200 hover:bg-gray-300' 
                              : 'bg-gray-400 cursor-not-allowed'}`}
                            disabled={!seat.available}
                            onClick={() => {
                              if (selectedSeats.includes(seat.id)) {
                                setSelectedSeats(selectedSeats.filter(id => id !== seat.id));
                              } else {
                                setSelectedSeats([...selectedSeats, seat.id]);
                              }
                            }}
                          >
                            {seat.number}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Piso 2 - 140°</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {seats.filter(s => s.floor === 2).map(seat => (
                          <button
                            key={seat.id}
                            className={`p-3 rounded-md text-center ${seat.available 
                              ? selectedSeats.includes(seat.id) 
                                ? 'bg-amber-600 text-white' 
                                : 'bg-gray-200 hover:bg-gray-300' 
                              : 'bg-gray-400 cursor-not-allowed'}`}
                            disabled={!seat.available}
                            onClick={() => {
                              if (selectedSeats.includes(seat.id)) {
                                setSelectedSeats(selectedSeats.filter(id => id !== seat.id));
                              } else {
                                setSelectedSeats([...selectedSeats, seat.id]);
                              }
                            }}
                          >
                            {seat.number}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Detalles del pago</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Precio Regular</span>
                        <span className="font-medium">S/ 143.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">IGV</span>
                        <span className="font-medium">S/ 0.00</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 flex justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-lg">S/ 143.00</span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Pasajero 1</h4>
                      <p className="text-gray-600">Piso: 2</p>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Detalles del viaje</h4>
                      <p className="text-gray-600">Lima - Arequipa</p>
                      <p className="text-gray-600">17 Jul 2025 06:00</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <h3 className="font-semibold mb-2">Atención a cliente:</h3>
                      <p className="text-gray-700">311-5050</p>
                      <p className="text-gray-700">(+51) 993-555-276</p>
                      <p className="text-gray-700">serviciocliente@orquideastour.com.pe</p>
                    </div>
                    
                    <button 
                      className="w-full flex justify-between items-center px-6 py-4 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
                      onClick={() => setStep(3)}
                    >
                      <span>Continuar con {selectedSeats.length} asiento{selectedSeats.length !== 1 ? 's' : ''}</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Paso 3: Datos del pasajero y pago */}
            {step === 3 && (
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">Datos del pasajero</h2>
                    <div className="flex items-center text-sm text-gray-600 mt-2">
                      <span className="font-medium">Pago</span>
                      <span className="mx-2">•</span>
                      <span className="text-amber-600 font-medium">Paso 3 de 3</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">¿Quiénes viajan?</h3>
                    
                    <div className="bg-gray-50 p-6 rounded-lg mb-6">
                      <h4 className="font-medium mb-4">Pasajero 1</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de documento</label>
                          <select className="w-full p-3 border border-gray-300 rounded-lg">
                            <option>DNI</option>
                            <option>Carnet de extranjería</option>
                            <option>Pasaporte</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Número de documento</label>
                          <input type="text" className="w-full p-3 border border-gray-300 rounded-lg" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
                          <input type="text" className="w-full p-3 border border-gray-300 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Apellido paterno</label>
                          <input type="text" className="w-full p-3 border border-gray-300 rounded-lg" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Apellido materno</label>
                          <input type="text" className="w-full p-3 border border-gray-300 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
                          <input type="date" className="w-full p-3 border border-gray-300 rounded-lg" />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                        <input type="email" className="w-full p-3 border border-gray-300 rounded-lg" />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input type="tel" className="w-full p-3 border border-gray-300 rounded-lg" />
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                        <p className="text-sm text-gray-700">
                          Recuerda que deberás presentar una identificación oficial para abordar el autobús y verifica que tus datos de pasajeros estén correctos.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="bg-gray-50 p-6 rounded-lg mb-6">
                      <h3 className="text-lg font-semibold mb-4">Detalles del pago</h3>
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Precio Regular</span>
                          <span className="font-medium">S/ 143.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">IGV</span>
                          <span className="font-medium">S/ 0.00</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 flex justify-between">
                          <span className="font-semibold">Total</span>
                          <span className="font-bold text-lg">S/ 143.00</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-4">Método de pago</h3>
                      <div className="space-y-3">
                        <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                          <input type="radio" id="credit-card" name="payment" className="h-4 w-4 text-amber-600" />
                          <label htmlFor="credit-card" className="ml-2 flex items-center">
                            <CreditCard className="h-5 w-5 mr-2" />
                            Tarjeta de crédito/débito
                          </label>
                        </div>
                        <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                          <input type="radio" id="transfer" name="payment" className="h-4 w-4 text-amber-600" />
                          <label htmlFor="transfer" className="ml-2">Transferencia bancaria</label>
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full px-6 py-4 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors">
                      Pagar ahora
                    </button>
                    
                    <div className="mt-4 text-center text-sm text-gray-500">
                      <p>Al completar la compra aceptas nuestros <a href="#" className="text-amber-600 hover:underline">Términos y condiciones</a></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'encomiendas' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
            <h2 className="text-2xl font-bold mb-6">Registrar encomienda</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Origen</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Ciudad de origen" 
                      className="w-full p-3 border border-gray-300 rounded-lg pl-10"
                    />
                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destino</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Ciudad de destino" 
                      className="w-full p-3 border border-gray-300 rounded-lg pl-10"
                    />
                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de envío</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      className="w-full p-3 border border-gray-300 rounded-lg pl-10"
                    />
                    <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del paquete</label>
                  <textarea 
                    className="w-full p-3 border border-gray-300 rounded-lg" 
                    rows={3}
                    placeholder="Descripción detallada del contenido"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                    <input type="number" className="w-full p-3 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor declarado</label>
                    <input type="number" className="w-full p-3 border border-gray-300 rounded-lg" />
                  </div>
                </div>
                
                <button className="w-full px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors">
                  Calcular costo y registrar
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'seguimiento' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
            <h2 className="text-2xl font-bold mb-6">Seguimiento de encomienda</h2>
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de guía</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Ingresa tu número de guía" 
                    className="w-full p-3 border border-gray-300 rounded-lg pl-10"
                  />
                  <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <button className="w-full px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors">
                Buscar encomienda
              </button>
              
              <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Estado de tu encomienda</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-amber-100 p-2 rounded-full mr-3">
                      <PackageCheck className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium">En tránsito</p>
                      <p className="text-sm text-gray-600">Tu paquete está en camino a su destino</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-gray-200 p-2 rounded-full mr-3">
                      <Clock className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Última actualización</p>
                      <p className="text-sm text-gray-600">Hoy, 10:30 AM - En la terminal de Arequipa</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-gray-200 p-2 rounded-full mr-3">
                      <MapPin className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Destino</p>
                      <p className="text-sm text-gray-600">Lima - Terminal principal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Orquídeas Tour</h3>
              <p className="text-gray-400">Transporte terrestre y encomiendas seguras en el sur del Perú.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Rutas</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-amber-400 transition-colors">Lima - Arequipa</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Arequipa - Cusco</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Lima - Tacna</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Servicios</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-amber-400 transition-colors">Pasajes</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Encomiendas</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Paquetes turísticos</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>servicio@orquideastour.com.pe</li>
                <li>+51 987 654 321</li>
                <li>Av. Principal 123, Arequipa</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Orquídeas Tour. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
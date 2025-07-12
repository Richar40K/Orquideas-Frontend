import { CardItem } from '@/components/pages/CardItem'
import { Bus, Clock, Headset, MapPin, PackageCheck, PhoneCall, ShieldCheck, Ticket } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function Page() {
  return (
    <>
      <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Bus className="h-8 w-8 text-amber-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Orquídeas Tour</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#rutas" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">Rutas</Link>
              <Link href="#servicios" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">Servicios</Link>
              <Link href="#encomiendas" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">Encomiendas</Link>
              <Link href="#contacto" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">Contacto</Link>
              <Link href="#comprar" className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors font-medium flex items-center">
                <Ticket className="mr-2 h-4 w-4" /> Comprar Pasaje
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <section
        className="relative z-40 overflow-x-hidden h-screen flex items-center bg-cover bg-center bg-no-repeat pt-16"
        style={{ backgroundImage: "url('/images/arequipamod.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40 z-0" />
        <div className="relative z-10 px-4 mx-auto max-w-7xl w-full overflow-x-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white pb-3">
                Viaja con seguridad <br />
                <span className="text-amber-300">Orquídeas Tour</span>
              </h1>
              <p className="text-lg text-gray-200 max-w-lg">
                Transporte terrestre confiable y encomiendas seguras a los principales destinos del sur del Perú.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="#comprar"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md transition-colors font-medium flex items-center justify-center"
                >
                  <Ticket className="mr-2 h-5 w-5" /> Comprar Pasaje
                </Link>
                <Link
                  href="#encomiendas"
                  className="bg-white/90 hover:bg-white text-gray-900 px-6 py-3 rounded-md transition-colors font-medium flex items-center justify-center"
                >
                  <PackageCheck className="mr-2 h-5 w-5" /> Enviar Encomienda
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative h-screen w-full flex items-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/arequipamod.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Nuestros Servicios
            </h1>
            <p className="text-xl text-amber-100 mb-8">
              Soluciones de transporte integradas para todas tus necesidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
              <ShieldCheck className="h-12 w-12 text-amber-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white text-center mb-2">Seguridad Garantizada</h3>
              <p className="text-amber-50 text-center">Flota moderna con protocolos de seguridad para tu tranquilidad</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
              <Bus className="h-12 w-12 text-amber-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white text-center mb-2">Comodidad en Viaje</h3>
              <p className="text-amber-50 text-center">Asientos reclinables, aire acondicionado y entretenimiento</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
              <PackageCheck className="h-12 w-12 text-amber-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white text-center mb-2">Encomiendas Seguras</h3>
              <p className="text-amber-50 text-center">Sistema de rastreo y entrega puntual de paquetes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
              <Clock className="h-12 w-12 text-amber-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white text-center mb-2">Puntualidad</h3>
              <p className="text-amber-50 text-center">Salidas y llegadas a tiempo con horarios optimizados</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
              <Headset className="h-12 w-12 text-amber-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white text-center mb-2">Atención 24/7</h3>
              <p className="text-amber-50 text-center">Asistencia personalizada disponible todo el día</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
              <MapPin className="h-12 w-12 text-amber-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white text-center mb-2">Cobertura Nacional</h3>
              <p className="text-amber-50 text-center">Llegamos a múltiples destinos en todo el país</p>
            </div>
          </div>

        </div>
      </section>

      {/* Rutas Section */}
      <section id="rutas" className="py-16 bg-gray-50">
        <CardItem />
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">¿Listo para tu próximo viaje?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">Comienza hoy mismo. Reserva tus pasajes o envía tus encomiendas con nosotros.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#comprar"
              className="bg-white hover:bg-gray-100 text-amber-600 px-6 py-3 rounded-md transition-colors font-medium flex items-center justify-center"
            >
              <Ticket className="mr-2 h-5 w-5" /> Comprar Pasaje
            </Link>
            <Link
              href="#contacto"
              className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-md transition-colors font-medium flex items-center justify-center"
            >
              <PhoneCall className="mr-2 h-5 w-5" /> Contactar Ahora
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Bus className="h-8 w-8 text-amber-600" />
                <span className="ml-2 text-xl font-bold">Orquídeas Tour</span>
              </div>
              <p className="text-gray-400">Transporte terrestre y encomiendas seguras en el sur del Perú.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Rutas</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-amber-500 transition-colors">Arequipa</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-amber-500 transition-colors">Omate</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-amber-500 transition-colors">Quinistaquillas</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Servicios</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-amber-500 transition-colors">Transporte de pasajeros</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-amber-500 transition-colors">Encomiendas</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-amber-500 transition-colors">Paquetes turísticos</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">info@orquideastour.com</li>
                <li className="text-gray-400">+51 987 654 321</li>
                <li className="text-gray-400">Av. Principal 123, Arequipa</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Orquídeas Tour. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
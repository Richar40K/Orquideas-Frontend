"use client"
import { useState } from 'react';
import { User, MapPin, Package, Edit3, Eye, Calendar, CreditCard, Phone, Mail, Save, X } from 'lucide-react';

interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

interface Trip {
  id: string;
  destination: string;
  date: string;
  price: number;
  status: 'completed' | 'upcoming' | 'cancelled';
  type: string;
}

interface Package {
  id: string;
  recipient: string;
  destination: string;
  date: string;
  weight: string;
  price: number;
  status: 'delivered' | 'in-transit' | 'pending';
}

export default function InformationPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'trips' | 'packages'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  const [userData, setUserData] = useState<UserData>({
    name: 'Juan Carlos Mendoza',
    email: 'juan.mendoza@email.com',
    phone: '+51 987 654 321',
    address: 'Av. Ejercito 123',
    city: 'Arequipa',
    country: 'Perú'
  });

  const [editData, setEditData] = useState<UserData>(userData);

  const trips: Trip[] = [
    {
      id: '1',
      destination: 'Lima - Arequipa',
      date: '2024-12-15',
      price: 85.00,
      status: 'completed',
      type: 'Bus Ejecutivo'
    },
    {
      id: '2',
      destination: 'Arequipa - Cusco',
      date: '2024-12-28',
      price: 120.00,
      status: 'upcoming',
      type: 'Bus Premium'
    },
    {
      id: '3',
      destination: 'Cusco - Puno',
      date: '2024-11-20',
      price: 95.00,
      status: 'completed',
      type: 'Bus Turístico'
    }
  ];

  const packages: Package[] = [
    {
      id: '1',
      recipient: 'María González',
      destination: 'Lima',
      date: '2024-12-10',
      weight: '2.5 kg',
      price: 25.00,
      status: 'delivered'
    },
    {
      id: '2',
      recipient: 'Carlos Ramírez',
      destination: 'Tacna',
      date: '2024-12-14',
      weight: '1.8 kg',
      price: 18.00,
      status: 'in-transit'
    },
    {
      id: '3',
      recipient: 'Ana Flores',
      destination: 'Cusco',
      date: '2024-12-16',
      weight: '3.2 kg',
      price: 32.00,
      status: 'pending'
    }
  ];

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'upcoming': return 'Próximo';
      case 'cancelled': return 'Cancelado';
      case 'delivered': return 'Entregado';
      case 'in-transit': return 'En Tránsito';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {userData.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Mi Cuenta</h1>
              <p className="text-gray-600">Gestiona tu información personal y revisa tu historial</p>
            </div>
          </div>
        </div>

        {/* Main Content - Side by Side Layout */}
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-80 bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Navegación</h3>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Perfil</span>
              </button>
              <button
                onClick={() => setActiveTab('trips')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'trips'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <MapPin className="w-5 h-5" />
                <span className="font-medium">Mis Viajes</span>
              </button>
              <button
                onClick={() => setActiveTab('packages')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'packages'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <Package className="w-5 h-5" />
                <span className="font-medium">Encomiendas</span>
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-8">
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Información Personal</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                        {userData.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                        {userData.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Teléfono
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                        {userData.phone}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.address}
                        onChange={(e) => setEditData({...editData, address: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                        {userData.address}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.city}
                        onChange={(e) => setEditData({...editData, city: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                        {userData.city}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      País
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.country}
                        onChange={(e) => setEditData({...editData, country: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                        {userData.country}
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancelar</span>
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Guardar</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'trips' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Historial de Viajes</h2>
                <div className="space-y-4">
                  {trips.map((trip) => (
                    <div key={trip.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{trip.destination}</h3>
                            <p className="text-sm text-gray-600">{trip.type}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trip.status)}`}>
                          {getStatusText(trip.status)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>{new Date(trip.date).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-gray-500" />
                          <span>S/ {trip.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'packages' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Historial de Encomiendas</h2>
                <div className="space-y-4">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">Para: {pkg.recipient}</h3>
                            <p className="text-sm text-gray-600">Destino: {pkg.destination}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pkg.status)}`}>
                          {getStatusText(pkg.status)}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>{new Date(pkg.date).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4 text-gray-500" />
                          <span>{pkg.weight}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-gray-500" />
                          <span>S/ {pkg.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
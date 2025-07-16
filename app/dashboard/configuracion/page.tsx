"use client";
import React, { useState, useEffect } from 'react';
import {
  Settings,
  User,
  Bell,
  Lock,
  Palette,
  Monitor,
  Globe,
  Shield,
  Database,
  Mail,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  CheckCircle,
  AlertCircle,
  Moon,
  Sun,
  Smartphone,
  Laptop,
  Tablet,
  Volume2,
  VolumeX,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Building,
  CreditCard,
  Key,
  Users,
  Bus,
  Package,
  BarChart3
} from 'lucide-react';
import axios, { AxiosError } from 'axios';
// Asume que esta utilidad existe y devuelve el username del token
import { getUserFromToken } from '@/utils/getUserFromToken';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  desktop: boolean;
}

interface Module {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}

interface Device {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}

const ConfigurationDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>('perfil');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    desktop: true
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [autoBackup, setAutoBackup] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [language, setLanguage] = useState<string>('es');
  const [timezone, setTimezone] = useState<string>('America/Lima');

  // --- Nuevos estados para Perfil y Seguridad ---
  const [userData, setUserData] = useState<any>(null); // Almacena los datos completos del usuario obtenidos del backend
  const [profileForm, setProfileForm] = useState({
    name: '',
    secondName: '', // Añadido para secondName
    lastName: '',
    email: '',
    cellPhone: '',
    username: '', // No editable, pero se muestra
    estado: '', // No editable, pero se muestra
    puesto: '', // Solo para mostrar, no se enviará en el PUT
    dni: '', // Añadido para dni, no editable
    codigo: '', // Añadido para codigo, no editable
    direccion: '', // Añadido para direccion
    nameEmergency: '', // Añadido para nameEmergency
    phoneEmergency: '', // Añadido para phoneEmergency
    departamento: '', // Añadido para departamento
    salario: 0, // Añadido para salario
  });
  const [securityForm, setSecurityForm] = useState({
    currentPasswordDisplay: '••••••••', // Solo para mostrar, no editable
    newPassword: '',
    confirmNewPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // --- Fin Nuevos estados ---

  // --- useEffect para cargar datos del usuario ---
  useEffect(() => {
    const fetchUserData = async () => {
      const usernameFromToken = getUserFromToken(); // Obtener username del token
      if (!usernameFromToken) {
        setError("No se pudo obtener el nombre de usuario del token.");
        return;
      }

      try {
        setLoading(true);
        // Usamos el endpoint /username/{username} para obtener los datos del usuario
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/users/username/${usernameFromToken}`);
        const user = response.data;
        setUserData(user); // Guardamos los datos completos del usuario
        setProfileForm({
          name: user.name || '',
          secondName: user.secondName || '', // Cargar secondName
          lastName: user.lastName || '',
          email: user.email || '',
          cellPhone: user.cellPhone || '',
          username: user.username || '',
          estado: user.estado || '',
          puesto: user.puesto || '',
          dni: user.dni || '', // Cargar dni
          codigo: user.codigo || '', // Cargar codigo
          direccion: user.direccion || '', // Cargar direccion
          nameEmergency: user.nameEmergency || '', // Cargar nameEmergency
          phoneEmergency: user.phoneEmergency || '', // Cargar phoneEmergency
          departamento: user.departamento || '', // Cargar departamento
          salario: user.salario || 0, // Cargar salario
        });
        setLoading(false);
      } catch (err: unknown) {
        setLoading(false);
        console.error("Error al cargar datos del usuario:", err);
        if (err instanceof AxiosError) {
          setError(err.response?.data?.message || "Error al cargar los datos del usuario.");
        } else {
          setError("Error desconocido al cargar los datos del usuario.");
        }
      }
    };

    fetchUserData();
  }, []);
  // --- Fin useEffect ---

  const tabs: Tab[] = [
    { id: 'perfil', label: 'Perfil', icon: User, color: 'text-blue-500' },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell, color: 'text-green-500' },
    { id: 'seguridad', label: 'Seguridad', icon: Shield, color: 'text-red-500' },
    { id: 'apariencia', label: 'Apariencia', icon: Palette, color: 'text-purple-500' },
    { id: 'sistema', label: 'Sistema', icon: Settings, color: 'text-gray-500' },
    { id: 'empresa', label: 'Empresa', icon: Building, color: 'text-orange-500' },
    { id: 'backup', label: 'Respaldo', icon: Database, color: 'text-indigo-500' }
  ];

  // --- Manejadores de cambio para los formularios ---
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecurityForm(prev => ({ ...prev, [name]: value }));
  };
  // --- Fin Manejadores de cambio ---

  // --- Función para guardar cambios ---
  const handleSaveChanges = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!userData?.id) {
      setError("ID de usuario no disponible para actualizar.");
      setLoading(false);
      return;
    }

    // Validar contraseñas si se están cambiando
    if (securityForm.newPassword || securityForm.confirmNewPassword) {
      if (securityForm.newPassword !== securityForm.confirmNewPassword) {
        setError("Las nuevas contraseñas no coinciden.");
        setLoading(false);
        return;
      }
      if (securityForm.newPassword.length < 8) { // Ejemplo de validación de longitud
        setError("La nueva contraseña debe tener al menos 8 caracteres.");
        setLoading(false);
        return;
      }
    }

    try {
      // Construir el objeto updateData con los campos que se pueden modificar
      // y los que deben mantenerse con su valor original si no se modifican.
      // Es crucial enviar todos los campos requeridos por el PUT del backend,
      // incluso si no se modifican en el formulario, para evitar que se sobrescriban a null.
      const updateData: any = {
        id: userData.id, // El ID es necesario para el PUT
        name: profileForm.name,
        secondName: profileForm.secondName, // Incluir secondName
        lastName: profileForm.lastName,
        dni: userData.dni, // DNI no es editable en el formulario, se envía el original
        codigo: userData.codigo, // Código no es editable, se envía el original
        direccion: profileForm.direccion, // Incluir direccion
        nameEmergency: profileForm.nameEmergency, // Incluir nameEmergency
        phoneEmergency: profileForm.phoneEmergency, // Incluir phoneEmergency
        email: profileForm.email,
        cellPhone: profileForm.cellPhone,
        puesto: userData.puesto, // Puesto no es editable, se envía el original
        departamento: userData.departamento, // Departamento no es editable, se envía el original
        salario: userData.salario, // Salario no es editable, se envía el original
        estado: userData.estado, // Estado no es editable, se envía el original
        username: profileForm.username, // Username puede ser editable o no, se envía el valor del formulario
        password: userData.password, // Se envía la contraseña original por defecto
        enabled: userData.enabled, // Se envía el estado enabled original
        admin: userData.admin, // <--- ¡AQUÍ ESTÁ EL CAMBIO CLAVE! Se envía el estado admin original
        roles: userData.roles, // Se envían los roles originales
      };

      // Si se proporcionó una nueva contraseña, sobrescribir la contraseña en updateData
      if (securityForm.newPassword) {
        updateData.password = securityForm.newPassword;
      }

      // Realizar la solicitud PUT al endpoint de actualización de usuarios
      await axios.put(`${process.env.NEXT_PUBLIC_API}/users/${userData.id}`, updateData);
      setSuccess("Cambios guardados exitosamente.");
      // Limpiar campos de contraseña después de un guardado exitoso
      setSecurityForm(prev => ({ ...prev, newPassword: '', confirmNewPassword: '' }));

      // Opcional: Volver a cargar los datos del usuario para reflejar los cambios
      // Esto es útil si el backend devuelve el usuario actualizado o si hay campos calculados
      // const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/users/username/${profileForm.username}`);
      // setUserData(response.data);

    } catch (err: unknown) {
      console.error("Error al guardar cambios:", err);
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Error al guardar los cambios.");
      } else {
        setError("Error desconocido al guardar los cambios.");
      }
    } finally {
      setLoading(false);
    }
  };
  // --- Fin Función para guardar cambios ---

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-slate-200/60">
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors">
              <Upload className="w-4 h-4 text-slate-600" />
            </button>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-800">{profileForm.name} {profileForm.lastName}</h3>
            <p className="text-slate-500">{profileForm.email}</p>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${profileForm.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
              {profileForm.estado || 'Desconocido'}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nombre de Usuario</label>
            <input
              type="text"
              name="username"
              value={profileForm.username}
              onChange={handleProfileChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            // Si el username no debe ser editable, añadir readOnly aquí
            // readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">DNI</label>
            <input
              type="text"
              name="dni"
              value={profileForm.dni}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 cursor-not-allowed"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Código</label>
            <input
              type="text"
              name="codigo"
              value={profileForm.codigo}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 cursor-not-allowed"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nombre</label>
            <input
              type="text"
              name="name"
              value={profileForm.name}
              onChange={handleProfileChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Segundo Nombre</label>
            <input
              type="text"
              name="secondName"
              value={profileForm.secondName}
              onChange={handleProfileChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Apellido</label>
            <input
              type="text"
              name="lastName"
              value={profileForm.lastName}
              onChange={handleProfileChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={profileForm.email}
              onChange={handleProfileChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Teléfono Celular</label>
            <input
              type="tel"
              name="cellPhone"
              value={profileForm.cellPhone}
              onChange={handleProfileChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={profileForm.direccion}
              onChange={handleProfileChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Contacto de Emergencia</label>
            <input
              type="text"
              name="nameEmergency"
              value={profileForm.nameEmergency}
              onChange={handleProfileChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Teléfono de Emergencia</label>
            <input
              type="tel"
              name="phoneEmergency"
              value={profileForm.phoneEmergency}
              onChange={handleProfileChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Cargo</label>
            <input
              type="text"
              name="puesto"
              value={profileForm.puesto}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 cursor-not-allowed"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Departamento</label>
            <input
              type="text"
              name="departamento"
              value={profileForm.departamento}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 cursor-not-allowed"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Salario</label>
            <input
              type="number"
              name="salario"
              value={profileForm.salario}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 cursor-not-allowed"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-slate-200/60">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Preferencias de Notificaciones</h3>

        <div className="space-y-4">
          {[
            { key: 'email', label: 'Notificaciones por Email', icon: Mail, desc: 'Recibir alertas y reportes por correo' },
            { key: 'push', label: 'Notificaciones Push', icon: Bell, desc: 'Alertas en tiempo real en el navegador' },
            { key: 'sms', label: 'Notificaciones SMS', icon: Phone, desc: 'Mensajes de texto para alertas críticas' },
            { key: 'desktop', label: 'Notificaciones de Escritorio', icon: Monitor, desc: 'Alertas del sistema operativo' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">{item.label}</p>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof NotificationSettings] }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications[item.key as keyof NotificationSettings] ? 'bg-blue-500' : 'bg-slate-300'
                  }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications[item.key as keyof NotificationSettings] ? 'translate-x-6' : 'translate-x-1'
                  }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-slate-200/60">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Configuración de Sonido</h3>

        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
              {soundEnabled ? <Volume2 className="w-5 h-5 text-white" /> : <VolumeX className="w-5 h-5 text-white" />}
            </div>
            <div>
              <p className="font-medium text-slate-800">Sonidos del Sistema</p>
              <p className="text-sm text-slate-500">Reproducir sonidos para notificaciones</p>
            </div>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${soundEnabled ? 'bg-green-500' : 'bg-slate-300'
              }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-slate-200/60">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Cambiar Contraseña</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Contraseña Actual</label>
            <div className="relative">
              <input
                type="password" // Siempre tipo password para ocultar
                value={securityForm.currentPasswordDisplay} // Muestra solo los puntos
                className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-slate-100 cursor-not-allowed"
                readOnly // No editable
              />
              {/* El botón de mostrar/ocultar no tiene sentido si el campo es readOnly y siempre muestra puntos */}
              {/* <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button> */}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nueva Contraseña</label>
            <input
              type="password"
              name="newPassword"
              value={securityForm.newPassword}
              onChange={handleSecurityChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="Ingresa tu nueva contraseña"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Confirmar Nueva Contraseña</label>
            <input
              type="password"
              name="confirmNewPassword"
              value={securityForm.confirmNewPassword}
              onChange={handleSecurityChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="Confirma tu nueva contraseña"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-slate-200/60">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Tema de la Aplicación</h3>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setDarkMode(false)}
            className={`p-4 rounded-xl border-2 transition-all ${!darkMode ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
              }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Sun className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-800">Modo Claro</p>
                <p className="text-sm text-slate-500">Interfaz luminosa</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setDarkMode(true)}
            className={`p-4 rounded-xl border-2 transition-all ${darkMode ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
              }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center">
                <Moon className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-800">Modo Oscuro</p>
                <p className="text-sm text-slate-500">Reduce el cansancio visual</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-slate-200/60">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Dispositivos</h3>

        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Laptop, label: 'Escritorio', active: true },
            { icon: Tablet, label: 'Tablet', active: false },
            { icon: Smartphone, label: 'Móvil', active: false }
          ].map((device: Device) => (
            <button
              key={device.label}
              className={`p-4 rounded-xl border-2 transition-all ${device.active ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <device.icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-medium text-slate-800">{device.label}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-slate-200/60">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Configuración Regional</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Idioma</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Zona Horaria</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="America/Lima">Lima (UTC-5)</option>
              <option value="America/Bogota">Bogotá (UTC-5)</option>
              <option value="America/Sao_Paulo">São Paulo (UTC-3)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-slate-200/60">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Información del Sistema</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Versión:</span>
              <span className="font-medium">v2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Última actualización:</span>
              <span className="font-medium">Hace 2 días</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Base de datos:</span>
              <span className="font-medium text-green-600">Conectada</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Usuarios activos:</span>
              <span className="font-medium">15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Espacio usado:</span>
              <span className="font-medium">2.3 GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Rendimiento:</span>
              <span className="font-medium text-green-600">Óptimo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompanyTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-slate-200/60">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Información de la Empresa</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nombre de la Empresa</label>
            <input
              type="text"
              defaultValue="Transportes Orquideas"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">RUC</label>
            <input
              type="text"
              defaultValue="20123456789"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Dirección</label>
            <input
              type="text"
              defaultValue="Av. Principal 123, Lima"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Teléfono</label>
            <input
              type="tel"
              defaultValue="+51 1 234 5678"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-slate-200/60">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Módulos Activos</h3>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: Package, label: 'Encomiendas', active: true },
            { icon: MapPin, label: 'Viajes', active: true },
            { icon: Users, label: 'Empleados', active: true },
            { icon: Bus, label: 'Buses', active: true },
            { icon: CreditCard, label: 'Pagos', active: false },
            { icon: BarChart3, label: 'Reportes', active: true }
          ].map((module: Module) => (
            <div key={module.label} className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <module.icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-slate-800">{module.label}</span>
              </div>
              <button
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${module.active ? 'bg-green-500' : 'bg-slate-300'
                  }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${module.active ? 'translate-x-6' : 'translate-x-1'
                  }`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBackupTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-slate-200/60">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Respaldo de Base de Datos</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-blue-800">Crear Respaldo</p>
                <p className="text-sm text-blue-600">Descargar copia de seguridad completa</p>
              </div>
            </div>

            <button className="w-full flex items-center justify-center space-x-3 p-4 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-white">
              <Download className="w-5 h-5" />
              <span className="font-medium">Descargar Backup (.sql)</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-orange-50 border border-orange-200">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-orange-800">Restaurar Datos</p>
                <p className="text-sm text-orange-600">Cargar archivo de respaldo (.sql)</p>
              </div>
            </div>

            <div className="relative">
              <input
                type="file"
                accept=".sql"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    console.log('Archivo seleccionado:', file.name);
                    // Aquí irías tu lógica para procesar el archivo
                  }
                }}
              />
              <div className="w-full flex items-center justify-center space-x-3 p-4 rounded-xl bg-orange-500 hover:bg-orange-600 transition-colors text-white cursor-pointer">
                <Upload className="w-5 h-5" />
                <span className="font-medium">Subir Archivo SQL</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Importante</p>
              <p className="text-sm text-yellow-700 mt-1">
                • El respaldo incluye todas las tablas y datos del sistema<br />
                • Restaurar reemplazará completamente la base de datos actual<br />
                • Se recomienda hacer un respaldo antes de restaurar
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-slate-200/60">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Información del Sistema</h3>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-slate-50/50">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Database className="w-6 h-6 text-white" />
            </div>
            <p className="font-medium text-slate-800">Base de Datos</p>
            <p className="text-sm text-green-600">Conectada</p>
          </div>

          <div className="text-center p-4 rounded-xl bg-slate-50/50">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <p className="font-medium text-slate-800">Total Registros</p>
            <p className="text-sm text-slate-600">1,247</p>
          </div>

          <div className="text-center p-4 rounded-xl bg-slate-50/50">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <p className="font-medium text-slate-800">Último Backup</p>
            <p className="text-sm text-slate-600">Nunca</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'perfil':
        return renderProfileTab();
      case 'notificaciones':
        return renderNotificationsTab();
      case 'seguridad':
        return renderSecurityTab();
      case 'apariencia':
        return renderAppearanceTab();
      case 'sistema':
        return renderSystemTab();
      case 'empresa':
        return renderCompanyTab();
      case 'backup':
        return renderBackupTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Configuración</h1>
            <p className="text-slate-500">Personaliza tu experiencia en Orquideas</p>
          </div>
        </div>
      </div>

      {/* Mensajes de estado */}
      {loading && (
        <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-lg flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Cargando...</span>
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Horizontal Tabs */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-2 border border-slate-200/60">
          <nav className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 shadow-sm'
                    : 'hover:bg-slate-50 hover:shadow-sm'
                    }`}
                >
                  <Icon className={`w-5 h-5 ${activeTab === tab.id ? tab.color : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span className={`font-medium text-sm ${activeTab === tab.id ? 'text-slate-800' : 'text-slate-600 group-hover:text-slate-800'
                    }`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="w-full">
          {renderTabContent()}

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSaveChanges}
              disabled={loading} // Deshabilita el botón mientras carga
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span className="font-medium">{loading ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Toast (Hidden by default) - Se reemplaza por el mensaje de éxito dinámico */}
      {/* <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg hidden">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Configuración guardada exitosamente</span>
        </div>
      </div> */}
    </div>
  );
};

export default ConfigurationDashboard;

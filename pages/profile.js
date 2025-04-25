// pages/profile.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { usePreferences } from '../contexts/PreferencesContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const { preferences, updatePreferences } = usePreferences();
  const [localPreferences, setLocalPreferences] = useState(preferences);
  
  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);
  
  const handleSavePreferences = () => {
    updatePreferences(localPreferences);
    alert('Preferencias guardadas correctamente');
  };
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="w-8 h-8 border border-gray-900 flex items-center justify-center">
                  <div className="w-6 h-6 border border-gray-900 relative">
                    <div className="absolute top-0 left-0 right-0 bottom-0 border-b border-r border-gray-900 -rotate-45"></div>
                  </div>
                </div>
                <span className="ml-2 text-lg font-medium text-gray-900">TimeBox</span>
              </Link>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Perfil de usuario
            </h3>
            <div className="mt-6 max-w-xl">
              <div className="flex items-center">
                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl text-gray-600">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <div className="ml-5">
                  <h4 className="text-lg font-medium text-gray-900">{user?.name || 'Usuario'}</h4>
                  <p className="text-sm text-gray-500">{user?.email || 'Sin email'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Preferencias
            </h3>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="startHour" className="block text-sm font-medium text-gray-700">
                  Hora de inicio
                </label>
                <select
                  id="startHour"
                  value={localPreferences.startHour}
                  onChange={(e) => setLocalPreferences({ ...localPreferences, startHour: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>{i}:00</option>
                  ))}
                </select>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="endHour" className="block text-sm font-medium text-gray-700">
                  Hora de finalización
                </label>
                <select
                  id="endHour"
                  value={localPreferences.endHour}
                  onChange={(e) => setLocalPreferences({ ...localPreferences, endHour: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>{i}:00</option>
                  ))}
                </select>
              </div>
              
              <div className="sm:col-span-6">
                <div className="flex items-center">
                  <input
                    id="notifications"
                    type="checkbox"
                    checked={localPreferences.notifications}
                    onChange={(e) => setLocalPreferences({ ...localPreferences, notifications: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="notifications" className="ml-2 block text-sm text-gray-900">
                    Recibir notificaciones
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-5">
              <button
                onClick={handleSavePreferences}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Guardar preferencias
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
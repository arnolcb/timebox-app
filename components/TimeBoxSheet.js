import { useState } from 'react';
import { usePreferences } from '../contexts/PreferencesContext';

export default function TimeBoxSheet({ sheet, updateSheet, toggleSidebar, sidebarOpen }) {
  const [view, setView] = useState('desktop');
  const { preferences } = usePreferences();
  
  // Generar horas basadas en las preferencias del usuario
  const generateHours = () => {
    const startHour = parseInt(preferences.startHour);
    const endHour = parseInt(preferences.endHour);
    const hours = [];
    
    for (let hour = startHour; hour <= endHour; hour++) {
      if (hour === 0) {
        hours.push('12 AM');
      } else if (hour < 12) {
        hours.push(`${hour} AM`);
      } else if (hour === 12) {
        hours.push('12 PM');
      } else {
        hours.push(`${hour - 12} PM`);
      }
    }
    
    return hours;
  };
  
  const hours = generateHours();
  
  // Asegurarse de que el array de horas tenga el tamaño correcto
  if (sheet.hours.length !== hours.length * 2) {
    const newHours = Array(hours.length * 2).fill({ task: '', notes: '' });
    updateSheet({ ...sheet, hours: newHours });
  }
  
  const handlePriorityChange = (index, value) => {
    const updatedPriorities = [...sheet.priorities];
    updatedPriorities[index] = value;
    
    updateSheet({
      ...sheet,
      priorities: updatedPriorities
    });
  };
  
  const addPriority = () => {
    if (sheet.priorities.length < 10) {
      updateSheet({
        ...sheet,
        priorities: [...sheet.priorities, '']
      });
    }
  };
  
  const removePriority = (index) => {
    if (sheet.priorities.length > 1) {
      const updatedPriorities = sheet.priorities.filter((_, i) => i !== index);
      updateSheet({
        ...sheet,
        priorities: updatedPriorities
      });
    }
  };
  
  const handleHourChange = (index, field, value) => {
    const updatedHours = [...sheet.hours];
    updatedHours[index] = {
      ...updatedHours[index],
      [field]: value
    };
    
    updateSheet({
      ...sheet,
      hours: updatedHours
    });
  };
  
  const handleBrainDumpChange = (value) => {
    updateSheet({
      ...sheet,
      brainDump: value
    });
  };
  
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          {!sidebarOpen && (
            <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          <div className="flex items-center">
            <div className="w-8 h-8 border border-gray-900 flex items-center justify-center">
              <div className="w-6 h-6 border border-gray-900 relative">
                <div className="absolute top-0 left-0 right-0 bottom-0 border-b border-r border-gray-900 -rotate-45"></div>
              </div>
            </div>
            <h1 className="text-xl font-medium text-gray-900 ml-2">The Time Box</h1>
          </div>
        </div>
        <div>
          <span className="text-gray-600">
            {sheet.formattedDate}
          </span>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="md:col-span-1">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Top Priorities</h2>
                <button
                  onClick={addPriority}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  title="Agregar prioridad"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="space-y-2">
                {sheet.priorities.map((priority, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-1 border-b border-gray-200">
                      <input
                        type="text"
                        value={priority}
                        onChange={(e) => handlePriorityChange(index, e.target.value)}
                        className="w-full p-2 text-gray-800 bg-transparent focus:outline-none focus:border-blue-500"
                        placeholder={`Prioridad ${index + 1}`}
                      />
                    </div>
                    {sheet.priorities.length > 1 && (
                      <button
                        onClick={() => removePriority(index)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Eliminar prioridad"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Brain Dump</h2>
              <textarea
                value={sheet.brainDump || ''}
                onChange={(e) => handleBrainDumpChange(e.target.value)}
                className="w-full h-64 p-3 border border-gray-200 rounded bg-gray-50 text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                style={{ backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)', backgroundSize: '15px 15px' }}
              ></textarea>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Horario</h2>
            <div className="border border-gray-200 rounded">
              <div className="grid grid-cols-3 border-b border-gray-200 bg-gray-50">
                <div className="px-2 py-1 text-center text-sm font-medium text-gray-600">Hora</div>
                <div className="px-2 py-1 text-center text-sm font-medium text-gray-600">:00</div>
                <div className="px-2 py-1 text-center text-sm font-medium text-gray-600">:30</div>
              </div>
              
              {hours.map((hour, index) => (
                <div key={index} className="grid grid-cols-3 border-b border-gray-200">
                  <div className="px-2 py-2 text-center font-medium text-gray-700 border-r border-gray-200">{hour}</div>
                  <div className="px-2 py-2">
                    <input
                      type="text"
                      value={sheet.hours[index * 2]?.task || ''}
                      onChange={(e) => handleHourChange(index * 2, 'task', e.target.value)}
                      className="w-full bg-transparent text-gray-800 focus:outline-none"
                    />
                  </div>
                  <div className="px-2 py-2">
                    <input
                      type="text"
                      value={sheet.hours[index * 2 + 1]?.task || ''}
                      onChange={(e) => handleHourChange(index * 2 + 1, 'task', e.target.value)}
                      className="w-full bg-transparent text-gray-800 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
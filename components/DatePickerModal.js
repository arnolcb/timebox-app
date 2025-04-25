import { useState } from 'react';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isToday, isFuture } from 'date-fns';
import { es } from 'date-fns/locale';

export default function DatePickerModal({ onClose, onSelectDate, existingDates }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const hasExistingTimeBox = (date) => {
    return existingDates.includes(format(date, 'yyyy-MM-dd'));
  };
  
  const getDaysInWeek = (date) => {
    const start = startOfWeek(date, { locale: es });
    const end = endOfWeek(date, { locale: es });
    const days = [];
    let current = start;
    
    while (current <= end) {
      days.push(current);
      current = addDays(current, 1);
    }
    
    return days;
  };
  
  const weekDays = getDaysInWeek(selectedDate);
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Seleccionar fecha</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <button 
              onClick={() => setSelectedDate(addDays(selectedDate, -7))}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <span className="font-medium text-gray-900">
              {format(selectedDate, 'MMMM yyyy', { locale: es })}
            </span>
            <button 
              onClick={() => setSelectedDate(addDays(selectedDate, 7))}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
            
            {weekDays.map(day => {
              const exists = hasExistingTimeBox(day);
              const isCurrentDay = isToday(day);
              
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => !exists && setSelectedDate(day)}
                  disabled={exists}
                  className={`
                    p-2 text-center rounded-md
                    ${exists ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-blue-50'}
                    ${isCurrentDay ? 'ring-2 ring-blue-500' : ''}
                    ${isSameDay(day, selectedDate) && !exists ? 'bg-blue-600 text-white' : 'text-gray-700'}
                  `}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSelectDate(selectedDate)}
            disabled={hasExistingTimeBox(selectedDate)}
            className={`px-4 py-2 rounded-md
              ${hasExistingTimeBox(selectedDate) 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            Crear TimeBox
          </button>
        </div>
      </div>
    </div>
  );
}

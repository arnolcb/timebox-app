// pages/guest.js
import { useState, useEffect } from 'react';
import { format, isToday, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import Sidebar from '../components/Sidebar';
import TimeBoxSheet from '../components/TimeBoxSheet';
import DatePickerModal from '../components/DatePickerModal';
import Toast from '../components/Toast';

export default function GuestPage() {
  const [sheets, setSheets] = useState([]);
  const [activeSheet, setActiveSheet] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [toast, setToast] = useState(null);
  
  useEffect(() => {
    const savedSheets = localStorage.getItem('timeBoxSheets_guest');
    if (savedSheets) {
      setSheets(JSON.parse(savedSheets));
    }
  }, []);
  
  const deleteSheet = (sheetId) => {
    const updatedSheets = sheets.filter(sheet => sheet.id !== sheetId);
    setSheets(updatedSheets);
    localStorage.setItem('timeBoxSheets_guest', JSON.stringify(updatedSheets));
    
    if (activeSheet && activeSheet.id === sheetId) {
      setActiveSheet(null);
    }
    
    setToast({
      type: 'success',
      message: 'TimeBox eliminado correctamente',
    });
  };
  
  const createNewSheet = (selectedDate = new Date()) => {
    const dateAtStartOfDay = startOfDay(selectedDate);
    const formattedDate = format(dateAtStartOfDay, 'yyyy-MM-dd');
    
    const existingSheet = sheets.find(sheet => sheet.date === formattedDate);
    
    if (existingSheet) {
      setActiveSheet(existingSheet);
      setToast({
        type: 'warning',
        message: `Ya existe un TimeBox para ${format(dateAtStartOfDay, 'dd MMMM yyyy', { locale: es })}`,
      });
      return;
    }
    
    const newSheet = {
      id: Date.now(),
      date: formattedDate,
      formattedDate: format(dateAtStartOfDay, 'dd MMMM yyyy', { locale: es }),
      priorities: [''],
      hours: Array(18).fill({
        task: '',
        notes: ''
      }),
      brainDump: '',
      createdAt: new Date().toISOString(),
    };
    
    setActiveSheet(newSheet);
    setSheets(prev => {
      const updated = [...prev, newSheet];
      localStorage.setItem('timeBoxSheets_guest', JSON.stringify(updated));
      return updated;
    });
    
    setToast({
      type: 'success',
      message: `TimeBox creado para ${format(dateAtStartOfDay, 'dd MMMM yyyy', { locale: es })}`,
    });
  };
  
  const handleDateSelect = (date) => {
    createNewSheet(date);
    setShowDatePicker(false);
  };
  
  const updateSheet = (updatedSheet) => {
    setActiveSheet(updatedSheet);
    setSheets(prev => {
      const updated = prev.map(sheet => 
        sheet.id === updatedSheet.id ? updatedSheet : sheet
      );
      localStorage.setItem('timeBoxSheets_guest', JSON.stringify(updated));
      return updated;
    });
  };
  
  return (
    <div className="flex h-screen bg-white">
      <Sidebar 
        sheets={sheets} 
        activeSheet={activeSheet} 
        setActiveSheet={setActiveSheet} 
        onNewSheetClick={() => setShowDatePicker(true)}
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        user={{ name: 'Invitado' }}
        onDeleteSheet={deleteSheet}
      />
      
      <main className="flex-1 overflow-auto">
        {activeSheet ? (
          <TimeBoxSheet 
            sheet={activeSheet} 
            updateSheet={updateSheet} 
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            sidebarOpen={sidebarOpen}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-medium text-gray-800 mb-4">
                Bienvenido a TimeBox
              </h2>
              <p className="text-gray-600 mb-6">
                Organiza tu día con el método TimeBox
              </p>
              <button 
                onClick={() => setShowDatePicker(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Crear TimeBox
              </button>
            </div>
          </div>
        )}
      </main>
      
      {showDatePicker && (
        <DatePickerModal 
          onClose={() => setShowDatePicker(false)}
          onSelectDate={handleDateSelect}
          existingDates={sheets.map(sheet => sheet.date)}
        />
      )}
      
      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
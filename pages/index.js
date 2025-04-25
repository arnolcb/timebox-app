// pages/index.js
import { useState, useEffect } from 'react';
import { format, isToday, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import TimeBoxSheet from '../components/TimeBoxSheet';
import DatePickerModal from '../components/DatePickerModal';
import Toast from '../components/Toast';
import { fetchSheets, createSheet, updateSheet, deleteSheet } from '../lib/api';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sheets, setSheets] = useState([]);
  const [activeSheet, setActiveSheet] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Proteger la ruta - redirigir al login si no hay usuario
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);
  
  // Cargar hojas del servidor
  useEffect(() => {
    if (session) {
      fetchSheets()
        .then(setSheets)
        .catch(error => {
          console.error('Error loading sheets:', error);
          setToast({
            type: 'error',
            message: 'Error al cargar las hojas',
          });
        })
        .finally(() => setLoading(false));
    }
  }, [session]);
  
  const handleDeleteSheet = async (sheetId) => {
    try {
      await deleteSheet(sheetId);
      setSheets(sheets.filter(sheet => sheet.id !== sheetId));
      
      if (activeSheet && activeSheet.id === sheetId) {
        setActiveSheet(null);
      }
      
      setToast({
        type: 'success',
        message: 'TimeBox eliminado correctamente',
      });
    } catch (error) {
      console.error('Error deleting sheet:', error);
      setToast({
        type: 'error',
        message: 'Error al eliminar la hoja',
      });
    }
  };
  
  const createNewSheet = async (selectedDate = new Date()) => {
    const dateAtStartOfDay = startOfDay(selectedDate);
    const formattedDate = format(dateAtStartOfDay, 'yyyy-MM-dd');
    
    const existingSheet = sheets.find(sheet => 
      format(new Date(sheet.date), 'yyyy-MM-dd') === formattedDate
    );
    
    if (existingSheet) {
      setActiveSheet(existingSheet);
      setToast({
        type: 'warning',
        message: `Ya existe un TimeBox para ${format(dateAtStartOfDay, 'dd MMMM yyyy', { locale: es })}`,
      });
      return;
    }
    
    try {
      const newSheet = await createSheet({
        date: dateAtStartOfDay.toISOString(),
        priorities: [''],
        hours: Array(24).fill({ task: '', notes: '' }),
        brainDump: '',
      });
      
      setSheets([...sheets, newSheet]);
      setActiveSheet(newSheet);
      
      setToast({
        type: 'success',
        message: `TimeBox creado para ${format(dateAtStartOfDay, 'dd MMMM yyyy', { locale: es })}`,
      });
    } catch (error) {
      console.error('Error creating sheet:', error);
      setToast({
        type: 'error',
        message: 'Error al crear la hoja',
      });
    }
  };
  
  const handleDateSelect = (date) => {
    createNewSheet(date);
    setShowDatePicker(false);
  };
  
  const handleUpdateSheet = async (updatedSheet) => {
    try {
      const updated = await updateSheet(updatedSheet.id, {
        priorities: updatedSheet.priorities,
        hours: updatedSheet.hours,
        brainDump: updatedSheet.brainDump,
      });
      
      setSheets(sheets.map(sheet => 
        sheet.id === updated.id ? updated : sheet
      ));
      setActiveSheet(updated);
    } catch (error) {
      console.error('Error updating sheet:', error);
      setToast({
        type: 'error',
        message: 'Error al actualizar la hoja',
      });
    }
  };
  
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!session) {
    return null;
  }
  
  return (
    <div className="flex h-screen bg-white">
      <Sidebar 
        sheets={sheets} 
        activeSheet={activeSheet} 
        setActiveSheet={setActiveSheet} 
        onNewSheetClick={() => setShowDatePicker(true)}
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        user={session.user}
        onDeleteSheet={handleDeleteSheet}
      />
      
      <main className="flex-1 overflow-auto">
        {activeSheet ? (
          <TimeBoxSheet 
            sheet={activeSheet} 
            updateSheet={handleUpdateSheet} 
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
          existingDates={sheets.map(sheet => format(new Date(sheet.date), 'yyyy-MM-dd'))}
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
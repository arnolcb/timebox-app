import { format, isToday, startOfDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { useState } from 'react';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default function Sidebar({ 
  sheets, 
  activeSheet, 
  setActiveSheet, 
  onNewSheetClick, 
  isOpen, 
  toggleSidebar, 
  user,
  onDeleteSheet 
}) {
  const [sheetToDelete, setSheetToDelete] = useState(null);
  const sortedSheets = [...sheets].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const handleDeleteClick = (e, sheet) => {
    e.stopPropagation();
    setSheetToDelete(sheet);
  };
  
  const confirmDelete = () => {
    if (sheetToDelete) {
      onDeleteSheet(sheetToDelete.id);
      setSheetToDelete(null);
    }
  };
  
  return (
    <>
      <div className={`fixed md:relative z-20 bg-white border-r border-gray-200 h-full transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-0 md:w-16 overflow-hidden'
      }`}>
        <div className="flex flex-col h-full bg-white">
          <div className="p-4 flex items-center justify-between bg-white">
            {isOpen ? (
              <h1 className="text-lg font-medium text-gray-900">TimeBox</h1>
            ) : (
              <span className="mx-auto text-gray-500 text-xl">TB</span>
            )}
            <button 
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700"
            >
              {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
          
          <div className="px-4 py-2 bg-white">
            <button 
              onClick={onNewSheetClick}
              className={`flex items-center space-x-2 text-gray-800 hover:bg-gray-100 rounded px-2 py-1.5 w-full transition-colors ${
                !isOpen && 'justify-center'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              {isOpen && <span>Nueva hoja</span>}
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto mt-2 bg-white">
            {isOpen && sheets.length > 0 && (
              <div className="px-4 py-1 text-xs font-medium text-gray-400 uppercase">
                Tus hojas
              </div>
            )}
            <ul className="mt-1">
              {sortedSheets.map(sheet => {
                // Asegurarnos de que estamos comparando correctamente las fechas
                const sheetDate = parseISO(sheet.date);
                const isCurrentDaySheet = isToday(sheetDate);
                
                return (
                  <li key={sheet.id} className="group">
                    <div className="flex items-center">
                      <button
                        className={`flex-1 text-left px-4 py-2 text-sm flex items-center justify-between
                          ${activeSheet && activeSheet.id === sheet.id 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'text-gray-600 hover:bg-gray-100'
                          }
                        `}
                        onClick={() => setActiveSheet(sheet)}
                      >
                        {isOpen ? (
                          <>
                            <span>{format(sheetDate, 'dd MMM yyyy', { locale: es })}</span>
                            {isCurrentDaySheet && (
                              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                Hoy
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs">
                            {format(sheetDate, 'dd')}
                          </span>
                        )}
                      </button>
                      {isOpen && (
                        <button
                          onClick={(e) => handleDeleteClick(e, sheet)}
                          className="p-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          
          <div className="p-4 mt-auto bg-white">
            <Link href={user ? '/profile' : '/login'}>
              <div className={`flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors ${!isOpen && 'justify-center'}`}>
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600">
                  {user ? (user.name ? user.name.charAt(0).toUpperCase() : 'U') : 'G'}
                </div>
                {isOpen && (
                  <span className="ml-2 text-sm text-gray-600">
                    {user ? user.name : 'Invitado'}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {sheetToDelete && (
        <DeleteConfirmationModal
          onConfirm={confirmDelete}
          onCancel={() => setSheetToDelete(null)}
          sheetDate={format(parseISO(sheetToDelete.date), 'dd MMMM yyyy', { locale: es })}
        />
      )}
    </>
  );
}
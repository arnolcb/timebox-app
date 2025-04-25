import { createContext, useContext } from 'react';

export const PreferencesContext = createContext({
  preferences: {
    startHour: '8',
    endHour: '18',
    notifications: true,
    theme: 'system'
  },
  updatePreferences: () => {},
});

export const usePreferences = () => {
  return useContext(PreferencesContext);
};
// pages/_app.js (actualizado para usar NextAuth)
import { SessionProvider } from "next-auth/react";
import '../styles/globals.css';
import { AuthContext } from '../contexts/AuthContext';
import { PreferencesContext } from '../contexts/PreferencesContext';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { fetchPreferences } from '../lib/api';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <AuthWrapper>
        <Component {...pageProps} />
      </AuthWrapper>
    </SessionProvider>
  );
}

function AuthWrapper({ children }) {
  const { data: session, status } = useSession();
  const [preferences, setPreferences] = useState({
    startHour: '8',
    endHour: '18',
    notifications: true,
  });
  
  useEffect(() => {
    if (session) {
      fetchPreferences().then(setPreferences).catch(console.error);
    }
  }, [session]);
  
  const updatePreferences = async (newPreferences) => {
    try {
      const updated = await updatePreferences(newPreferences);
      setPreferences(updated);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };
  
  return (
    <AuthContext.Provider value={{ user: session?.user, loading: status === "loading" }}>
      <PreferencesContext.Provider value={{ preferences, updatePreferences }}>
        {children}
      </PreferencesContext.Provider>
    </AuthContext.Provider>
  );
}

export default MyApp;
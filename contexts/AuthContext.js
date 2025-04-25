import { createContext, useContext } from 'react';

export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  loading: false,
});

export const useAuth = () => {
  return useContext(AuthContext);
};
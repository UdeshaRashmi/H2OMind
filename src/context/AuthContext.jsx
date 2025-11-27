import React, { createContext, useState, useContext, useEffect } from 'react';

const USER_STORAGE_KEY = 'h2omind:user';
const THEME_STORAGE_KEY = 'theme';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(user));
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      setIsAuthenticated(true);
      if (user.theme) {
        setTheme(user.theme);
      }
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
      setIsAuthenticated(false);
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setTheme('light');
  };

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    if (user) {
      setUser({ ...user, theme: newTheme });
    }
  };

  const value = {
    user,
    isAuthenticated,
    theme,
    login,
    logout,
    updateTheme,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
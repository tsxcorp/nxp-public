'use client';

import React, { createContext, useContext } from 'react';

interface Theme {
  primary?: string;
  gray?: string;
  borderRadius?: string;
  fonts?: {
    families?: {
      display?: string;
      body?: string;
      code?: string;
    };
  };
}

interface ThemeContextType {
  theme: Theme;
  globals: any;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  theme: Theme;
  globals: any;
}

export function ThemeProvider({ children, theme, globals }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={{ theme, globals }}>
      {children}
    </ThemeContext.Provider>
  );
} 
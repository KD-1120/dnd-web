// src/context/ThemeContext.js
import React, { createContext, useContext, useState } from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

const lightTheme = {
  primary: '#6366F1',
  secondary: '#8B5CF6',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  success: '#10B981',
  danger: '#EF4444',
  shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
};

const darkTheme = {
  primary: '#818CF8',
  secondary: '#A78BFA',
  background: '#0F172A',
  surface: '#1E293B',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  border: '#334155',
  success: '#34D399',
  danger: '#F87171',
  shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.25)',
};

const ThemeContext = createContext();

export const AppThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.textPrimary};
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.primary};
    border-radius: 4px;
  }
`;

export const useTheme = () => useContext(ThemeContext);
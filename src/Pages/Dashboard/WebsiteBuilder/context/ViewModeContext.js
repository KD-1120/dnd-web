// Create this file at: src/Pages/Dashboard/WebsiteBuilder/context/ViewModeContext.jsx
import React, { createContext, useContext, useState } from 'react';

const ViewModeContext = createContext(null);

export const ViewModeProvider = ({ children }) => {
  const [viewMode, setViewMode] = useState('desktop');
  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
};

export const useViewMode = () => {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
};
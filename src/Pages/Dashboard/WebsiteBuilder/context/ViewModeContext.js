// Create this file at: src/Pages/Dashboard/WebsiteBuilder/context/ViewModeContext.jsx
import React, { createContext, useContext, useState } from 'react';

export const ViewModeContext = createContext();

export const ViewModeProvider = ({ children, initialMode = 'view' }) => {
  const [viewMode, setViewMode] = useState(initialMode);

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
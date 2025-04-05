// src/App.js
import React, { useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';
import { BuilderProvider } from './context/BuilderContext';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import PropertiesSidebar from './components/PropertiesSidebar';
import { PageProvider } from './context/PageContext';
import { ViewModeProvider } from './context/ViewModeContext';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background: #f8f9fa;
    height: 100vh;
    overflow: hidden;
  }
`;

const MainContainer = styled.div`
  display: flex;
  height: calc(100vh - 60px);
  transition: all 0.3s ease;
`;

// Animated Sidebar: width animates from 300px to 0 when closed
const AnimatedSidebar = styled.div`
  width: ${({ isOpen }) => (isOpen ? '300px' : '0')};
  transition: width 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  overflow: hidden;
`;

// Animated Properties Sidebar: width animates from 320px to 0 when closed
const AnimatedPropertiesSidebar = styled.div`
  width: ${({ isOpen }) => (isOpen ? '320px' : '0')};
  transition: width 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(100%)')};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  overflow: hidden;
`;

const CanvasContainer = styled.div`
  flex: 1;
  transition: all 0.3s ease;
  overflow-y: auto;
  background: #fff;
`;

function App() {
  // State to control visibility of left sidebar and properties panel
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isPropertiesOpen, setPropertiesOpen] = useState(true);

  const onToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const onToggleProperties = () => {
    setPropertiesOpen((prev) => !prev);
  };

  // Dummy data for page switching
  const currentPage = { id: 'page1', name: 'Home' };
  const pages = [
    { id: 'page1', name: 'Home' },
    { id: 'page2', name: 'About Us' },
    { id: 'page3', name: 'Contact' }
  ];

  return (
    <PageProvider>
      <BuilderProvider>
        <ViewModeProvider>
          <GlobalStyle />
          <TopBar 
            onToggleSidebar={onToggleSidebar}
            onToggleProperties={onToggleProperties}
            pageTitle={currentPage.name}
            pages={pages}
            onCreateNewPage={() => console.log('Create new page')}
            lastModified="2 hours ago"
            projectName="Enterprise Project"
            modifiedDate="2025-03-24"
            visibility="draft"
          />
          <MainContainer>
            <AnimatedSidebar isOpen={isSidebarOpen}>
              <Sidebar />
            </AnimatedSidebar>
            <CanvasContainer>
              <Canvas />
            </CanvasContainer>
            <AnimatedPropertiesSidebar isOpen={isPropertiesOpen}>
              <PropertiesSidebar />
            </AnimatedPropertiesSidebar>
          </MainContainer>
        </ViewModeProvider>
      </BuilderProvider>
    </PageProvider>
  );
}

export default App;

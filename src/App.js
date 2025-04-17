// Create this file at: src/Pages/Dashboard/WebsiteBuilder/SimplifiedWebsiteBuilder.jsx
import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { BuilderProvider } from './Pages/Dashboard/WebsiteBuilder/context/BuilderContext';
import { PageProvider } from './Pages/Dashboard/WebsiteBuilder/context/PageContext';
import { ViewModeProvider } from './Pages/Dashboard/WebsiteBuilder/context/ViewModeContext';
import SimplifiedTopBar from './Pages/Dashboard/WebsiteBuilder/components/SimplifiedTopBar';
import SimplifiedCanvas from './Pages/Dashboard/WebsiteBuilder/components/SimplifiedCanvas';
import SimplifiedPropertiesSidebar from './Pages/Dashboard/WebsiteBuilder/components/SimplifiedPropertiesSidebar';
import TemplateSelector from './Pages/Dashboard/WebsiteBuilder/components/TemplateSelector';
import { TemplateService } from './Pages/Dashboard/WebsiteBuilder/services/TemplateService';

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

const CanvasContainer = styled.div`
  flex: 1;
  transition: all 0.3s ease;
  overflow-y: auto;
  background: #fff;
  position: relative;
`;

const AnimatedPropertiesSidebar = styled.div`
  width: ${({ isOpen }) => (isOpen ? '320px' : '0')};
  transition: width 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(100%)')};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  overflow: hidden;
  height: 100%;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
  margin-bottom: 20px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

function SimplifiedWebsiteBuilder() {
  // State for UI Controls
  const [isPropertiesOpen, setPropertiesOpen] = useState(true);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [currentSiteId, setCurrentSiteId] = useState(null);
  
  // This would come from the route params or app state in a real app
  const eventId = 'event123';
  
  const onToggleProperties = () => {
    setPropertiesOpen((prev) => !prev);
  };
  
  const handleTemplateSelect = async (templateId) => {
    setLoadingTemplate(true);
    
    try {
      // Load template data
      const templateData = await TemplateService.getTemplateById(templateId);
      
      if (templateData) {
        setSelectedTemplate(templateData);
        setCurrentSiteId(`${eventId}_${templateId}`);
        setShowTemplateSelector(false);
      } else {
        console.error('Template data not found');
      }
    } catch (error) {
      console.error('Error loading template:', error);
    } finally {
      setLoadingTemplate(false);
    }
  };
  
  const handleCreateFromScratch = () => {
    setSelectedTemplate({
      id: 'blank',
      name: 'Blank Template',
      data: []
    });
    setCurrentSiteId(`${eventId}_blank`);
    setShowTemplateSelector(false);
  };
  
  const handleBackToTemplates = () => {
    setShowTemplateSelector(true);
    setSelectedTemplate(null);
  };
  
  const handleSave = async (pageData) => {
    if (!currentSiteId) return;
    
    setLoadingTemplate(true);
    
    try {
      await TemplateService.saveUserTemplate(currentSiteId, pageData);
      console.log('Site saved successfully');
      // Could show a success toast here
    } catch (error) {
      console.error('Error saving site:', error);
      // Could show an error toast here
    } finally {
      setLoadingTemplate(false);
    }
  };
  
  // Check if user has a saved version of this template
  useEffect(() => {
    if (!currentSiteId) return;
    
    const loadSavedTemplate = async () => {
      setLoadingTemplate(true);
      
      try {
        const savedTemplate = await TemplateService.loadUserTemplate(currentSiteId);
        
        if (savedTemplate) {
          setSelectedTemplate(prevTemplate => ({
            ...prevTemplate,
            data: savedTemplate
          }));
        }
      } catch (error) {
        console.error('Error loading saved template:', error);
      } finally {
        setLoadingTemplate(false);
      }
    };
    
    loadSavedTemplate();
  }, [currentSiteId]);
  
  return (
    <>
      <GlobalStyle />
      
      {showTemplateSelector ? (
        <TemplateSelector
          onSelectTemplate={handleTemplateSelect}
          onCreateFromScratch={handleCreateFromScratch}
        />
      ) : (
        <PageProvider initialData={selectedTemplate?.data || []}>
          <BuilderProvider>
            <ViewModeProvider>
              <SimplifiedTopBar 
                onToggleProperties={onToggleProperties}
                onSave={handleSave}
                onBackToTemplates={handleBackToTemplates}
                templateName={selectedTemplate?.name || 'Untitled'}
              />
              <MainContainer>
                <CanvasContainer>
                  {loadingTemplate && (
                    <LoadingOverlay>
                      <Spinner />
                      <div>Loading your template...</div>
                    </LoadingOverlay>
                  )}
                  <SimplifiedCanvas />
                </CanvasContainer>
                <AnimatedPropertiesSidebar isOpen={isPropertiesOpen}>
                  <SimplifiedPropertiesSidebar />
                </AnimatedPropertiesSidebar>
              </MainContainer>
            </ViewModeProvider>
          </BuilderProvider>
        </PageProvider>
      )}
    </>
  );
}

export default SimplifiedWebsiteBuilder;
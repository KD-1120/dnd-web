import React, { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { BuilderProvider } from './context/BuilderContext';
import { PageProvider } from './context/PageContext';
import { ViewModeProvider } from './context/ViewModeContext';
import SimplifiedTopBar from './components/SimplifiedTopBar';
import SimplifiedCanvas from './components/SimplifiedCanvas';
import SimplifiedPropertiesSidebar from './components/SimplifiedPropertiesSidebar';
import { TemplateService } from './services/TemplateService';
import { EventService } from './services/EventService';

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
  const [isPropertiesOpen, setPropertiesOpen] = useState(true);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId } = useParams();
  
  const loadTemplate = useCallback(async (templateFromState, forceFresh = false) => {
    console.log("Template loading started, template from state:", templateFromState);
    
    if (!eventId) {
      console.error("No event ID provided");
      navigate('/dashboard/events');
      return;
    }

    setLoadingTemplate(true);
    try {
      // First check if there's already a saved template for this event
      const savedEventTemplate = await EventService.getTemplate(eventId);
      
      if (savedEventTemplate && !forceFresh) {
        console.log("Found saved event template");
        setSelectedTemplate({
          ...templateFromState,
          data: savedEventTemplate
        });
        return;
      }

      if (!templateFromState) {
        console.error("No template provided and no saved template found");
        navigate('/dashboard/events/website-templates', { 
          state: { eventId } 
        });
        return;
      }

      let finalTemplate;
      if (templateFromState.id === 'blank') {
        finalTemplate = {
          id: 'blank',
          name: 'Blank Template',
          data: []
        };
      } else {
        // Load the full template data
        const fullTemplate = await TemplateService.getTemplateById(templateFromState.id);
        
        if (!fullTemplate) {
          throw new Error(`Template not found: ${templateFromState.id}`);
        }
        
        finalTemplate = {
          ...fullTemplate,
          data: fullTemplate.data || []
        };
      }

      console.log("Setting final template:", finalTemplate);
      setSelectedTemplate(finalTemplate);
      
      // Save the initial template for the event
      if (!savedEventTemplate) {
        await EventService.saveTemplate(eventId, finalTemplate.data);
      }
    } catch (error) {
      console.error('Error loading template:', error);
      navigate('/dashboard/events/website-templates', { 
        state: { eventId } 
      });
    } finally {
      setLoadingTemplate(false);
    }
  }, [eventId, navigate]);

  // Initial template load
  useEffect(() => {
    if (location.state?.template) {
      loadTemplate(location.state.template);
    } else {
      // If no template in state, try to load saved event template
      loadTemplate(null);
    }
  }, [location.state, loadTemplate]);
  
  const onToggleProperties = useCallback(() => {
    setPropertiesOpen(prev => !prev);
  }, []);

  const handleBackToTemplates = useCallback(() => {
    navigate('/dashboard/events/website-templates', {
      state: { eventId }
    });
  }, [navigate, eventId]);
  
  const handleSave = async (pageData) => {
    if (!selectedTemplate || !eventId) return;
    
    setLoadingTemplate(true);
    try {
      await EventService.saveTemplate(eventId, pageData);
      console.log('Website saved successfully');
    } catch (error) {
      console.error('Error saving website:', error);
    } finally {
      setLoadingTemplate(false);
    }
  };

  const handleReset = useCallback(() => {
    if (selectedTemplate && location.state?.template) {
      loadTemplate(location.state.template, true);
    }
  }, [selectedTemplate, location.state, loadTemplate]);
  
  return (
    <>
      <GlobalStyle />
      <PageProvider initialData={selectedTemplate?.data || []}>
        <BuilderProvider>
          <ViewModeProvider>
            <SimplifiedTopBar 
              onToggleProperties={onToggleProperties}
              onSave={handleSave}
              onReset={handleReset}
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
                {!loadingTemplate && (!selectedTemplate?.data || selectedTemplate.data.length === 0) && (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    No template data found. This canvas is empty.
                  </div>
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
    </>
  );
}

export default SimplifiedWebsiteBuilder;
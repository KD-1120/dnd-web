import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import SimplifiedCanvas from './components/SimplifiedCanvas';
import SimplifiedPropertiesSidebar from './components/SimplifiedPropertiesSidebar';
import SimplifiedTopBar from './components/SimplifiedTopBar';
import WebsiteSettingsPanel from './components/WebsiteSettingsPanel';
import { EventService } from './services/EventService';
import { TemplateRegistry } from './templates';
import { BuilderProvider } from './context/BuilderContext';
import { ViewModeProvider } from './context/ViewModeContext';
import { PageProvider } from './context/PageContext';
import { Loader } from './components/Loader';

export const SimplifiedWebsiteBuilder = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [template, setTemplate] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const loadEventData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load event data
      const event = await EventService.getEventById(eventId);
      if (!event) {
        throw new Error('Event not found');
      }
      setEventData(event);

      // First try to load saved template from local storage
      let templateData = await EventService.getTemplate(eventId);
      
      // If no saved template, check navigation state
      if (!templateData && location.state?.template) {
        templateData = location.state.template.data;
        // Save the template immediately if it came from state
        await EventService.saveTemplate(eventId, templateData, event);
      }

      if (templateData) {
        setTemplate({
          data: templateData,
          name: location.state?.template?.name || 'Custom Template'
        });
      } else {
        throw new Error('No template found. Please select a template first.');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading event data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [eventId, location.state]);

  useEffect(() => {
    loadEventData();
  }, [loadEventData]);

  const handleTemplateChange = async (templateId) => {
    try {
      setIsLoading(true);
      setError(null);

      // Load new template and inject event data
      const newTemplate = await TemplateRegistry.getTemplateWithEventData(templateId, eventData);
      setTemplate(newTemplate);

      // Save template selection
      await EventService.saveTemplate(eventId, newTemplate, eventData);
    } catch (err) {
      setError(err.message);
      console.error('Error changing template:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await EventService.publishTemplate(eventId);
      // Show success message or redirect
    } catch (err) {
      setError(err.message);
      console.error('Error publishing template:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenSettings = () => {
    setShowSettings(prev => !prev); // Toggle settings panel
  };

  const handleToggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  const handleBackToTemplates = () => {
    navigate('/dashboard/events/website-templates', { 
      state: { eventId, isNewEvent: false }
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <ViewModeProvider>
      <PageProvider initialData={template?.data || []}>
        <BuilderProvider>
          <div className="simplified-builder" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <SimplifiedTopBar 
              onToggleSidebar={handleToggleSidebar}
              onToggleProperties={handleToggleSidebar}
              onBackToTemplates={handleBackToTemplates}
              onPublish={handlePublish}
              onSettings={handleOpenSettings}
              showSettings={showSettings}
              eventData={eventData}
              templateName={template?.name || 'Untitled'}
            />
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <SimplifiedCanvas 
                  template={template}
                  onBlockSelect={setSelectedBlock}
                />
              </div>
              {showSidebar && (
                <div style={{ width: '320px', borderLeft: '1px solid #eee' }}>
                  {showSettings ? (
                    <WebsiteSettingsPanel
                      eventId={eventId}
                      onClose={() => setShowSettings(false)}
                    />
                  ) : (
                    <SimplifiedPropertiesSidebar
                      selectedBlock={selectedBlock}
                      onTemplateChange={handleTemplateChange}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </BuilderProvider>
      </PageProvider>
    </ViewModeProvider>
  );
};

export default SimplifiedWebsiteBuilder;
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { EventService } from '../services/EventService';
import { SubdomainService } from '../services/SubdomainServices';
import { TemplateRegistry } from '../templates';
import { Loader } from './Loader';
import SimplifiedCanvas from './SimplifiedCanvas';

export const WebsiteRouter = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [template, setTemplate] = useState(null);
  const { eventId } = useParams();
  const location = useLocation();
  const isPreview = location.pathname.includes('/preview');

  useEffect(() => {
    loadEventWebsite();
  }, [eventId, isPreview]);

  const loadEventWebsite = async () => {
    try {
      setLoading(true);
      setError(null);

      let targetEventId = eventId;
      
      // If no event ID in params, try to get it from subdomain
      if (!targetEventId) {
        const hostname = window.location.hostname;
        const subdomain = hostname.split('.')[0];
        targetEventId = await SubdomainService.getEventIdFromSubdomain(subdomain);
        
        if (!targetEventId) {
          throw new Error('Event not found');
        }
      }

      // Load event data
      const event = await EventService.getEventById(targetEventId);
      if (!event) {
        throw new Error('Event not found');
      }
      setEventData(event);

      // Load template
      const templateData = isPreview 
        ? await EventService.getTemplate(targetEventId)
        : await EventService.getPublishedTemplate(targetEventId);

      if (!templateData) {
        throw new Error('No template found for this event');
      }

      // Inject event data into template
      const processedTemplate = await TemplateRegistry.injectEventData(templateData, event);
      setTemplate(processedTemplate);

      // Record visit if not in preview mode
      if (!isPreview) {
        await EventService.recordVisit(targetEventId, Date.now().toString());
      }
    } catch (err) {
      console.error('Error loading event website:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Website</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="website-container">
      <SimplifiedCanvas 
        template={template}
        viewMode="view"
        isPreview={isPreview}
      />
      {isPreview && (
        <div className="preview-banner">
          Preview Mode - Changes are not visible to the public
        </div>
      )}
      <style jsx>{`
        .website-container {
          position: relative;
          min-height: 100vh;
        }
        .error-container {
          padding: 2rem;
          text-align: center;
          color: #e53e3e;
        }
        .preview-banner {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #2d3748;
          color: white;
          text-align: center;
          padding: 8px;
          z-index: 1000;
        }
      `}</style>
    </div>
  );
};

export default WebsiteRouter;
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Spinner, Alert, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { BrickRegistry } from '../WebsiteBuilder/bricks/BrickRegistry';
import { EventService } from '../WebsiteBuilder/services/EventService';
import { ViewModeProvider } from '../WebsiteBuilder/context/ViewModeContext';
import { ArrowLeft } from 'lucide-react';

const PreviewBanner = styled.div`
  background-color: #1E293B;
  color: white;
  padding: 8px 16px;
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const WebsiteContainer = styled.div`
  padding-top: ${props => props.preview ? '40px' : '0'};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
`;

const ErrorContainer = styled.div`
  max-width: 800px;
  margin: 100px auto;
  padding: 40px;
  text-align: center;
`;

/**
 * EventWebsiteView - Renders an event website using templates
 * This component is used for both public viewing and previewing
 */
const EventWebsiteView = ({ preview = false }) => {
  const { eventId } = useParams();
  const location = useLocation();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visitorId] = useState(() => `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    const loadEventWebsite = async () => {
      try {
        setLoading(true);
        
        // Load event details
        const eventData = await EventService.getEventById(eventId);
        
        if (!eventData) {
          setError('Event not found');
          setLoading(false);
          return;
        }
        
        // Check if the event is published (unless in preview mode)
        if (!preview) {
          const publishStatus = await EventService.getPublishingStatus(eventId);
          
          if (publishStatus.status !== 'live') {
            setError('This event website is not published yet');
            setLoading(false);
            return;
          }
          
          // Record page view
          await EventService.recordVisit(eventId, visitorId);
          
          // Load published template
          const publishedTemplate = await EventService.getPublishedTemplate(eventId);
          setTemplate(publishedTemplate);
        } else {
          // In preview mode, load the current draft template
          const draftTemplate = await EventService.getTemplate(eventId);
          setTemplate(draftTemplate);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading event website:', error);
        setError('Failed to load event website. Please try again.');
        setLoading(false);
      }
    };
    
    loadEventWebsite();
  }, [eventId, preview, visitorId, location.pathname]);

  const renderBlock = (block) => {
    const BrickComponent = BrickRegistry[block.type]?.component;
    
    if (!BrickComponent) {
      console.warn(`Unknown block type: ${block.type}`);
      return null;
    }
    
    return (
      <BrickComponent 
        key={block.id} 
        brick={block}
        onSelect={() => {}} // No selection in view mode
        isSelected={false}
      />
    );
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner animation="border" role="status" />
        <div className="mt-3">Loading event website...</div>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-center">
            <Button variant="outline-secondary" href="/">
              Return to Homepage
            </Button>
          </div>
        </Alert>
      </ErrorContainer>
    );
  }

  if (!template || !template.length) {
    return (
      <ErrorContainer>
        <Alert variant="warning">
          <Alert.Heading>No Content Available</Alert.Heading>
          <p>This event website doesn't have any content yet.</p>
          <hr />
          <div className="d-flex justify-content-center">
            <Button variant="outline-secondary" href="/">
              Return to Homepage
            </Button>
          </div>
        </Alert>
      </ErrorContainer>
    );
  }

  return (
    <ViewModeProvider initialMode={preview ? 'preview' : 'view'}>
      {preview && (
        <PreviewBanner>
          <div>
            <strong>Preview Mode</strong> - This is how your event website will look when published
          </div>
          <div>
            <Button 
              variant="outline-light" 
              size="sm" 
              href={`/dashboard/events/${eventId}/website`}
            >
              <ArrowLeft size={16} className="me-1" />
              Back to Editor
            </Button>
          </div>
        </PreviewBanner>
      )}
      
      <WebsiteContainer preview={preview}>
        {template.map(block => renderBlock(block))}
      </WebsiteContainer>
    </ViewModeProvider>
  );
};

export default EventWebsiteView;
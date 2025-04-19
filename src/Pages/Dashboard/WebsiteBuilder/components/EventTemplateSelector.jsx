import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TemplateRegistry } from '../templates';
import { Loader } from './Loader';
import { EventService } from '../services/EventService';
import { EventTicketService } from '../../Other pages/services/EventTicketService';

const EventTemplateSelector = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId, isNewEvent } = location.state || {};
  const [eventData, setEventData] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEventData = async () => {
      setLoading(true);
      try {
        // If it's a new event, try to get data from session storage
        if (isNewEvent) {
          const storedEventData = sessionStorage.getItem('newEventData');
          if (storedEventData) {
            setEventData(JSON.parse(storedEventData));
            // Clear the data after loading
            sessionStorage.removeItem('newEventData');
          }
        }
        
        // Regardless of whether it's a new event or not, we should also fetch 
        // the event data from the service to ensure we have the latest data
        if (eventId) {
          const [fetchedEvent, fetchedTickets] = await Promise.all([
            EventTicketService.getEvent(eventId),
            EventTicketService.getTicketTypes(eventId)
          ]);
          
          if (fetchedEvent) {
            setEventData(prev => ({
              ...prev,
              ...fetchedEvent
            }));
          }
          
          if (fetchedTickets) {
            setTicketTypes(fetchedTickets);
          }
        }
      } catch (err) {
        console.error('Error loading event data:', err);
        setError('Failed to load event data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadEventData();
    loadTemplates();
  }, [isNewEvent, eventId]);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const allTemplates = TemplateRegistry.getAllTemplates();
      setTemplates(allTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = async (template) => {
    try {
      if (!eventId) {
        console.error('No event ID provided');
        return;
      }

      // Deep clone the template data
      const customizedTemplate = {
        ...template,
        data: JSON.parse(JSON.stringify(template.data || []))
      };

      if (eventData) {
        // Process template sections to inject event data
        customizedTemplate.data = customizedTemplate.data.map(section => {
          // Check if this is a container with components
          if (section.type === 'container' && section.components) {
            return injectDataIntoContainer(section, eventData, ticketTypes);
          }
          
          // Process standalone components
          return injectDataIntoComponent(section, eventData, ticketTypes);
        });

        // Save the customized template for the event immediately
        await EventService.saveTemplate(eventId, customizedTemplate.data, eventData);
      }

      // Navigate to the website builder
      navigate(`/dashboard/events/${eventId}/website`, {
        state: { 
          template: customizedTemplate,
          eventData
        }
      });
    } catch (error) {
      console.error('Error customizing template:', error);
      setError('Failed to customize template. Please try again.');
    }
  };

  // Helper function to inject data into a container and its nested components
  const injectDataIntoContainer = (container, eventData, ticketTypes) => {
    // Clone the container to avoid modifying the original
    const updatedContainer = { ...container };
    
    // Update container properties if needed
    // For example, set container title based on event data
    
    // Process all components in the container
    if (updatedContainer.components && updatedContainer.components.length > 0) {
      updatedContainer.components = updatedContainer.components.map(component => {
        // Check if this component contains nested components
        if (component.components) {
          return injectDataIntoContainer(component, eventData, ticketTypes);
        }
        
        // Otherwise, process this component
        return injectDataIntoComponent(component, eventData, ticketTypes);
      });
    }
    
    return updatedContainer;
  };

  // Helper function to inject data into a single component
  const injectDataIntoComponent = (component, eventData, ticketTypes) => {
    // Clone the component to avoid modifying the original
    const updatedComponent = { ...component };
    
    // Apply event-specific data based on component type
    switch (component.type) {
      case 'title':
        // Update title text with event title
        if (component.id?.includes('title') && eventData.title) {
          updatedComponent.props = {
            ...updatedComponent.props,
            text: eventData.title.toUpperCase()
          };
        }
        break;
        
      case 'text':
        // Update text content with event description
        if (component.id?.includes('subtitle') && eventData.description) {
          updatedComponent.props = {
            ...updatedComponent.props,
            text: eventData.description
          };
        }
        break;
        
      case 'countdownTimer':
        // Update countdown with event dates
        if (eventData.startDate || eventData.endDate) {
          updatedComponent.props = {
            ...updatedComponent.props,
            eventDate: eventData.startDate || undefined,
            eventEndDate: eventData.endDate || undefined,
            eventLocation: eventData.venue || undefined
          };
        }
        break;
        
      case 'ticketSalesWidget':
        // Update ticket sales widget with actual ticket types
        if (ticketTypes && ticketTypes.length > 0) {
          // Map real ticket data to the format expected by the widget
          const formattedTickets = ticketTypes.map(ticket => ({
            id: ticket.id,
            name: ticket.name,
            price: parseFloat(ticket.price),
            description: ticket.description || 'Standard entry to the event',
            date: `Valid ${ticket.validFrom ? 'from ' + new Date(ticket.validFrom).toLocaleDateString() : ''} ${ticket.validUntil ? 'until ' + new Date(ticket.validUntil).toLocaleDateString() : ''}`,
            remainingTickets: ticket.quantity - (ticket.sold || 0),
            maxPerOrder: Math.min(10, ticket.quantity - (ticket.sold || 0)) // Reasonable max per order
          }));
          
          updatedComponent.props = {
            ...updatedComponent.props,
            tickets: formattedTickets,
            eventId: eventId
          };
        }
        break;
        
      case 'scheduleAgenda':
        // Could update schedule if we had event schedule data
        break;
        
      case 'googleMaps':
        // Update map location with event venue
        if (eventData.venue) {
          updatedComponent.props = {
            ...updatedComponent.props,
            address: eventData.venue,
            locationName: eventData.venue
          };
        }
        break;
        
      case 'button':
        // Update buttons that might link to tickets or other event sections
        break;
        
      case 'image':
        // Could update images if we had event images
        break;
        
      case 'socialMediaSharing':
        // Update social sharing with event title and description
        if (eventData.title || eventData.description) {
          updatedComponent.props = {
            ...updatedComponent.props,
            eventTitle: eventData.title || '',
            eventDescription: eventData.description || '',
            eventUrl: window.location.origin + `/events/${eventId}`
          };
        }
        break;
        
      default:
        // No specific handling for other component types
        break;
    }
    
    return updatedComponent;
  };

  const categories = ['all', ...new Set(templates.map(t => t.category))];

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  // Display loading or error states
  if (loading || isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="template-selector">
      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="templates-grid">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            className={`template-card ${eventData?.templateId === template.id ? 'selected' : ''}`}
            onClick={() => handleTemplateSelect(template)}
          >
            <div className="template-preview">
              <img src={template.thumbnail} alt={template.name} />
            </div>
            <div className="template-info">
              <h3>{template.name}</h3>
              <p>{template.description}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .template-selector {
          padding: 20px;
        }

        .category-filters {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .category-btn {
          padding: 8px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .category-btn:hover {
          background: #f7fafc;
        }

        .category-btn.active {
          background: #3182ce;
          color: white;
          border-color: #3182ce;
        }

        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .template-card {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s;
        }

        .template-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .template-card.selected {
          border-color: #3182ce;
          box-shadow: 0 0 0 2px #3182ce;
        }

        .template-preview {
          aspect-ratio: 16/9;
          overflow: hidden;
        }

        .template-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .template-info {
          padding: 16px;
        }

        .template-info h3 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
        }

        .template-info p {
          margin: 0;
          font-size: 14px;
          color: #64748b;
        }
      `}</style>
    </div>
  );
};

export default EventTemplateSelector;
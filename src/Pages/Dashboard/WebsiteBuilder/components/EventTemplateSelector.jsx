import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TemplateSelector from './TemplateSelector';
import { EventService } from '../services/EventService';

const EventTemplateSelector = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId, isNewEvent } = location.state || {};
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    // Load event data from session storage if it's a new event
    if (isNewEvent) {
      const storedEventData = sessionStorage.getItem('newEventData');
      if (storedEventData) {
        setEventData(JSON.parse(storedEventData));
        // Clear the data after loading
        sessionStorage.removeItem('newEventData');
      }
    }
  }, [isNewEvent]);

  const handleTemplateSelect = async (template) => {
    try {
      // If we have event data, inject it into the template
      if (eventData) {
        // Deep clone the template data
        const customizedTemplate = {
          ...template,
          data: JSON.parse(JSON.stringify(template.data))
        };

        // Update template components with event data
        customizedTemplate.data = customizedTemplate.data.map(section => {
          if (section.type === 'container' && section.id === 'hero-container') {
            return {
              ...section,
              components: section.components.map(component => {
                switch (component.id) {
                  case 'hero-title':
                    return {
                      ...component,
                      props: {
                        ...component.props,
                        text: eventData.title.toUpperCase()
                      }
                    };
                  case 'hero-subtitle':
                    return {
                      ...component,
                      props: {
                        ...component.props,
                        text: eventData.description
                      }
                    };
                  case 'hero-countdown':
                    return {
                      ...component,
                      props: {
                        ...component.props,
                        eventDate: eventData.startDate,
                        eventEndDate: eventData.endDate,
                        eventLocation: eventData.venue
                      }
                    };
                  default:
                    return component;
                }
              })
            };
          }
          return section;
        });

        // Save the customized template for the event
        await EventService.saveTemplate(eventId, customizedTemplate);
      }

      // Navigate to the website builder
      navigate(`/dashboard/events/${eventId}/website`, {
        state: { template }
      });
    } catch (error) {
      console.error('Error customizing template:', error);
      // Navigate anyway, but without customization
      navigate(`/dashboard/events/${eventId}/website`, {
        state: { template }
      });
    }
  };

  return (
    <TemplateSelector onSelectTemplate={handleTemplateSelect} />
  );
};

export default EventTemplateSelector;
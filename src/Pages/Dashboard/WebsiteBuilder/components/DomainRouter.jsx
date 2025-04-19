import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SubdomainService } from '../services/SubdomainServices';
import { EventService } from '../services/EventService';
import { Loader } from './Loader'; // You'll need to create this or import from your UI library

export const DomainRouter = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadEventData = async () => {
      try {
        setIsLoading(true);
        const hostname = window.location.hostname;
        const isSubdomain = hostname.includes('.');

        let eventId;
        if (isSubdomain) {
          // Extract subdomain from hostname
          const subdomain = hostname.split('.')[0];
          eventId = await SubdomainService.getEventIdFromSubdomain(subdomain);
        } else {
          // Extract eventId from URL path for preview mode
          const matches = location.pathname.match(/\/events\/([^/]+)/);
          eventId = matches ? matches[1] : null;
        }

        if (!eventId) {
          navigate('/404');
          return;
        }

        const event = await EventService.getEventById(eventId);
        if (!event) {
          navigate('/404');
          return;
        }

        setEventData(event);
      } catch (error) {
        console.error('Error loading event data:', error);
        navigate('/error');
      } finally {
        setIsLoading(false);
      }
    };

    loadEventData();
  }, [location.pathname, navigate]);

  if (isLoading) {
    return <Loader />;
  }

  if (!eventData) {
    return null;
  }

  // Clone children and inject event data
  return React.Children.map(children, child =>
    React.cloneElement(child, { eventData })
  );
};

export default DomainRouter;
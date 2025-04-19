import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { SubdomainService } from '../../WebsiteBuilder/services/SubdomainServices';

/**
 * SubdomainRouter component that handles routing based on subdomains
 * It detects if the user is accessing the site via a custom subdomain
 * and redirects to the appropriate event page
 */
const SubdomainRouter = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [eventId, setEventId] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const detectSubdomain = async () => {
      try {
        // Extract hostname from window.location
        const hostname = window.location.hostname;
        
        // Check if we're on a local development environment
        const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
        
        if (isLocalhost) {
          // For local development, we can use a query parameter to simulate a subdomain
          const urlParams = new URLSearchParams(window.location.search);
          const subdomainParam = urlParams.get('subdomain');
          
          if (subdomainParam) {
            // Get the event ID for this subdomain
            const id = await SubdomainService.getEventIdFromSubdomain(subdomainParam);
            if (id) {
              setEventId(id);
            } else {
              setError('Event not found');
            }
          } else {
            // No subdomain parameter, just render the children
            setEventId(null);
          }
        } else {
          // Production environment
          // Split the hostname by dots
          const parts = hostname.split('.');
          
          // Check if we have a subdomain (e.g., "event.eventhorizon.com")
          if (parts.length > 2) {
            const subdomain = parts[0];
            const domain = parts.slice(1).join('.');
            
            // Make sure we're on our domain
            if (domain === SubdomainService.baseDomain) {
              // Get the event ID for this subdomain
              const id = await SubdomainService.getEventIdFromSubdomain(subdomain);
              
              if (id) {
                setEventId(id);
              } else {
                setError('Event not found');
              }
            } else {
              // Not on our domain, just render the children
              setEventId(null);
            }
          } else {
            // No subdomain, just render the children
            setEventId(null);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error detecting subdomain:', err);
        setError('Failed to detect subdomain');
        setLoading(false);
      }
    };
    
    detectSubdomain();
  }, [location]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-5">
        <h2>Error</h2>
        <p>{error}</p>
        <p>
          <a href="/">Return to Homepage</a>
        </p>
      </div>
    );
  }

  if (eventId) {
    // Redirect to the event page, but preserve the path
    const targetPath = `/events/${eventId}${location.pathname}`;
    return <Navigate to={targetPath} replace />;
  }

  // No subdomain or not on our domain, just render the children
  return children;
};

export default SubdomainRouter;
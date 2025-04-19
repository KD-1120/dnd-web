// src/Pages/Dashboard/WebsiteBuilder/services/EventService.js
/**
 * Event Service
 * 
 * Handles operations related to events and their associated website templates
 */
export class EventService {
    // Keep track of template changes for each event
    static templateCache = new Map();
    static publishedTemplates = new Map();

    /**
     * Get an event by its ID
     * @param {string} eventId The event identifier
     * @returns {Promise<Object>} Event data
     */
    static async getEventById(eventId) {
      try {
        // First check templateCache
        const cachedData = this.templateCache.get(eventId)?.eventData;
        if (cachedData) {
          return cachedData;
        }

        // If not in cache, check localStorage
        const storedEvent = localStorage.getItem(`event_${eventId}`);
        if (!storedEvent) {
          return null;
        }

        const eventData = JSON.parse(storedEvent);
        
        // Update cache with the found data
        this.templateCache.set(eventId, { eventData });
        
        return eventData;
      } catch (error) {
        console.error('Error getting event:', error);
        throw error;
      }
    }
    
    /**
     * Get a template associated with an event
     * @param {string} eventId The event identifier
     * @returns {Promise<Array>} Template data
     */
    static async getTemplate(eventId) {
      try {
        const data = JSON.parse(localStorage.getItem(`event_template_${eventId}`));
        return data?.templateData || null;
      } catch (error) {
        console.error('Error getting template:', error);
        throw error;
      }
    }
    
    /**
     * Save a template associated with an event
     * @param {string} eventId The event identifier
     * @param {Array} templateData The template data
     * @param {Object} eventData The event data
     * @returns {Promise<boolean>} Success status
     */
    static async saveTemplate(eventId, templateData, eventData) {
      try {
        localStorage.setItem(`event_template_${eventId}`, JSON.stringify({
          templateData,
          eventData,
          lastModified: new Date().toISOString()
        }));
        return true;
      } catch (error) {
        console.error('Error saving template:', error);
        throw error;
      }
    }
    
    /**
     * Publish an event (change its status to 'live')
     * @param {string} eventId The event identifier
     * @returns {Promise<boolean>} Success status
     */
    static async publishTemplate(eventId) {
      try {
        const template = await this.getTemplate(eventId);
        if (!template) {
          throw new Error('No template found to publish');
        }

        localStorage.setItem(`event_published_template_${eventId}`, JSON.stringify({
          templateData: template,
          publishedAt: new Date().toISOString()
        }));
        return true;
      } catch (error) {
        console.error('Error publishing template:', error);
        throw error;
      }
    }
    
    /**
     * Get the published template for an event
     * @param {string} eventId The event identifier
     * @returns {Promise<Array>} Published template data
     */
    static async getPublishedTemplate(eventId) {
      try {
        const data = JSON.parse(localStorage.getItem(`event_published_template_${eventId}`));
        return data?.templateData || null;
      } catch (error) {
        console.error('Error getting published template:', error);
        throw error;
      }
    }
    
    /**
     * Unpublish an event (change its status back to 'draft')
     * @param {string} eventId The event identifier
     * @returns {Promise<boolean>} Success status
     */
    static async unpublishEvent(eventId) {
      try {
        const event = await this.getEventById(eventId);
        
        event.status = 'draft';
        event.unpublishedAt = new Date().toISOString();
        
        if (!event.publishHistory) {
          event.publishHistory = [];
        }
        
        event.publishHistory.push({
          timestamp: new Date().toISOString(),
          status: 'draft'
        });
        
        localStorage.setItem(`event_${eventId}`, JSON.stringify(event));
        
        return true;
      } catch (error) {
        console.error(`Error unpublishing event ${eventId}:`, error);
        throw error;
      }
    }
    
    /**
     * Get the publishing status of an event
     * @param {string} eventId The event identifier
     * @returns {Promise<Object>} Publishing status
     */
    static async getPublishingStatus(eventId) {
      try {
        const published = JSON.parse(localStorage.getItem(`event_published_template_${eventId}`));
        const current = JSON.parse(localStorage.getItem(`event_template_${eventId}`));

        return {
          status: published ? 'published' : 'draft',
          publishedAt: published?.publishedAt || null,
          lastModified: current?.lastModified || null,
          hasUnpublishedChanges: published && current && 
            new Date(current.lastModified) > new Date(published.publishedAt)
        };
      } catch (error) {
        console.error('Error getting publishing status:', error);
        throw error;
      }
    }
    
    /**
     * Create a new event
     * @param {Object} eventData The event data
     * @returns {Promise<string>} The new event ID
     */
    static async createEvent(eventData) {
      try {
        const eventId = `event_${Date.now()}`;
        const newEvent = {
          id: eventId,
          ...eventData,
          createdAt: new Date().toISOString(),
          status: 'draft'
        };
        
        localStorage.setItem(`event_${eventId}`, JSON.stringify(newEvent));
        
        // Add the event to the list of all events for easier retrieval
        const allEvents = await this.getAllEvents();
        allEvents.push({
          id: eventId,
          title: eventData.title || 'New Event',
          createdAt: newEvent.createdAt,
          status: 'draft'
        });
        
        localStorage.setItem('all_events', JSON.stringify(allEvents));
        
        return eventId;
      } catch (error) {
        console.error('Error creating event:', error);
        throw error;
      }
    }
    
    /**
     * Get all events (for listing in dashboards)
     * @param {Object} filters Optional filters for the events
     * @returns {Promise<Array>} List of events
     */
    static async getAllEvents(filters = {}) {
      try {
        let allEvents = JSON.parse(localStorage.getItem('all_events') || '[]');
        
        // Apply filters if any
        if (Object.keys(filters).length > 0) {
          allEvents = allEvents.filter(event => {
            for (const [key, value] of Object.entries(filters)) {
              if (event[key] !== value) {
                return false;
              }
            }
            return true;
          });
        }
        
        // Sort by created date descending
        allEvents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        return allEvents;
      } catch (error) {
        console.error('Error getting all events:', error);
        throw error;
      }
    }
    
    /**
     * Update an existing event
     * @param {string} eventId The event identifier
     * @param {Object} eventData The updated event data
     * @returns {Promise<boolean>} Success status
     */
    static async updateEvent(eventId, eventData) {
      try {
        const existingEvent = await this.getEventById(eventId);
        
        const updatedEvent = {
          ...existingEvent,
          ...eventData,
          lastModified: new Date().toISOString()
        };
        
        localStorage.setItem(`event_${eventId}`, JSON.stringify(updatedEvent));
        
        // Update the event in the list of all events
        const allEvents = await this.getAllEvents();
        const eventIndex = allEvents.findIndex(e => e.id === eventId);
        
        if (eventIndex !== -1) {
          allEvents[eventIndex] = {
            ...allEvents[eventIndex],
            title: eventData.title || allEvents[eventIndex].title,
            status: eventData.status || allEvents[eventIndex].status,
            lastModified: updatedEvent.lastModified
          };
          
          localStorage.setItem('all_events', JSON.stringify(allEvents));
        }
        
        return true;
      } catch (error) {
        console.error(`Error updating event ${eventId}:`, error);
        throw error;
      }
    }
    
    /**
     * Delete an event
     * @param {string} eventId The event identifier
     * @returns {Promise<boolean>} Success status
     */
    static async deleteEvent(eventId) {
      try {
        // Remove from local storage
        localStorage.removeItem(`event_${eventId}`);
        localStorage.removeItem(`event_template_${eventId}`);
        localStorage.removeItem(`event_published_template_${eventId}`);
        
        // Remove from the list of all events
        const allEvents = await this.getAllEvents();
        const filteredEvents = allEvents.filter(e => e.id !== eventId);
        localStorage.setItem('all_events', JSON.stringify(filteredEvents));
        
        return true;
      } catch (error) {
        console.error(`Error deleting event ${eventId}:`, error);
        throw error;
      }
    }
    
    /**
     * Generate a preview URL for an event
     * @param {string} eventId The event identifier
     * @returns {string} The preview URL
     */
    static getPreviewUrl(eventId) {
      return `/events/${eventId}/preview`;
    }
    
    /**
     * Generate a public URL for a published event
     * @param {string} eventId The event identifier
     * @param {string} subdomain Optional custom subdomain
     * @returns {string} The public URL
     */
    static getPublishedUrl(eventId, subdomain = null) {
      if (subdomain) {
        // Use custom subdomain if available
        return `https://${subdomain}.eventhorizon.com`;
      }
      // Default to path-based URL
      return `/events/${eventId}`;
    }
    
    /**
     * Check if an event is published
     * @param {string} eventId The event identifier
     * @returns {Promise<boolean>} Whether the event is published
     */
    static async isEventPublished(eventId) {
      try {
        const event = await this.getEventById(eventId);
        return event.status === 'live';
      } catch (error) {
        console.error(`Error checking if event ${eventId} is published:`, error);
        throw error;
      }
    }
    
    /**
     * Generate a website subdomain for an event
     * @param {string} eventId The event identifier
     * @param {string} customSubdomain Optional custom subdomain
     * @returns {Promise<string>} The event subdomain
     */
    static async getEventSubdomain(eventId, customSubdomain = null) {
      try {
        // First, check if the event already has a subdomain assigned
        const event = await this.getEventById(eventId);
        if (event.subdomain) {
          return event.subdomain;
        }
        
        // If a custom subdomain is provided and not already in use, use it
        if (customSubdomain) {
          // Use the SubdomainService for validation and availability check
          const { SubdomainService } = await import('./SubdomainService');
          
          const isValid = SubdomainService.isValidSubdomain(customSubdomain);
          if (!isValid) {
            throw new Error('Invalid subdomain format');
          }
          
          const isAvailable = await SubdomainService.isSubdomainAvailable(customSubdomain);
          if (!isAvailable) {
            throw new Error('Subdomain is already taken');
          }
          
          // Register the subdomain
          await SubdomainService.registerSubdomain(eventId, customSubdomain);
          return customSubdomain;
        }
        
        // Generate a subdomain based on the event title
        const { SubdomainService } = await import('./SubdomainService');
        const suggestedSubdomain = await SubdomainService.suggestSubdomain(event.title);
        
        // Register the suggested subdomain automatically
        await SubdomainService.registerSubdomain(eventId, suggestedSubdomain);
        
        return suggestedSubdomain;
      } catch (error) {
        console.error(`Error generating subdomain for event ${eventId}:`, error);
        throw error;
      }
    }
    
    /**
     * Set a custom subdomain for an event
     * @param {string} eventId The event identifier
     * @param {string} customSubdomain The custom subdomain
     * @returns {Promise<boolean>} Success status
     */
    static async setCustomSubdomain(eventId, customSubdomain) {
      try {
        // Use the SubdomainService to register the subdomain
        const { SubdomainService } = await import('./SubdomainService');
        
        // Check if valid and available
        const isValid = SubdomainService.isValidSubdomain(customSubdomain);
        if (!isValid) {
          throw new Error('Invalid subdomain format');
        }
        
        const isAvailable = await SubdomainService.isSubdomainAvailable(customSubdomain);
        if (!isAvailable) {
          throw new Error('Subdomain is already taken');
        }
        
        // Register the subdomain
        await SubdomainService.registerSubdomain(eventId, customSubdomain);
        
        return true;
      } catch (error) {
        console.error(`Error setting custom subdomain for event ${eventId}:`, error);
        throw error;
      }
    }
    
    /**
     * Record a visit to the event website
     * @param {string} eventId The event identifier
     * @param {string} visitorId Unique identifier for the visitor
     * @returns {Promise<boolean>} Success status
     */
    static async recordVisit(eventId, visitorId) {
      try {
        const visits = JSON.parse(localStorage.getItem(`event_visits_${eventId}`) || '[]');
        const visit = {
          visitorId,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer
        };
        visits.push(visit);
        localStorage.setItem(`event_visits_${eventId}`, JSON.stringify(visits));
        return true;
      } catch (error) {
        console.error('Error recording visit:', error);
        throw error;
      }
    }

    /**
     * Get visit statistics for an event
     * @param {string} eventId The event identifier
     * @param {string} period The period for which to get stats (e.g., '7d' for 7 days)
     * @returns {Promise<Object>} Visit statistics
     */
    static async getVisitStats(eventId, period = '7d') {
      try {
        const visits = JSON.parse(localStorage.getItem(`event_visits_${eventId}`) || '[]');
        const now = new Date();
        const periodDays = parseInt(period);
        const startDate = new Date(now.setDate(now.getDate() - periodDays));

        const filteredVisits = visits.filter(visit => 
          new Date(visit.timestamp) >= startDate
        );

        // Group visits by date
        const visitsByDate = filteredVisits.reduce((acc, visit) => {
          const date = visit.timestamp.split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        // Fill in missing dates with zero visits
        const stats = [];
        for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
          const date = d.toISOString().split('T')[0];
          stats.push({
            date,
            visits: visitsByDate[date] || 0
          });
        }

        return {
          totalVisits: filteredVisits.length,
          uniqueVisitors: new Set(filteredVisits.map(v => v.visitorId)).size,
          dailyStats: stats,
          referrers: this.getReferrerStats(filteredVisits),
          devices: this.getDeviceStats(filteredVisits)
        };
      } catch (error) {
        console.error('Error getting visit stats:', error);
        throw error;
      }
    }

    /**
     * Get referrer statistics from visits
     * @param {Array} visits The list of visits
     * @returns {Array} Referrer statistics
     */
    static getReferrerStats(visits) {
      const referrers = visits.reduce((acc, visit) => {
        const referrer = visit.referrer || 'direct';
        acc[referrer] = (acc[referrer] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(referrers)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count);
    }

    /**
     * Get device statistics from visits
     * @param {Array} visits The list of visits
     * @returns {Array} Device statistics
     */
    static getDeviceStats(visits) {
      const devices = visits.reduce((acc, visit) => {
        const ua = visit.userAgent.toLowerCase();
        let device = 'desktop';
        
        if (ua.includes('mobile')) {
          device = 'mobile';
        } else if (ua.includes('tablet')) {
          device = 'tablet';
        }
        
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(devices)
        .map(([device, count]) => ({ device, count }))
        .sort((a, b) => b.count - a.count);
    }
}
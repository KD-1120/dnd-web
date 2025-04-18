// src/Pages/Dashboard/WebsiteBuilder/services/EventService.js
/**
 * Event Service
 * 
 * Handles operations related to events and their associated website templates
 */
export class EventService {
    /**
     * Get an event by its ID
     * @param {string} eventId The event identifier
     * @returns {Promise<Object>} Event data
     */
    static async getEventById(eventId) {
      try {
        // In production, this would be an API call
        // For now, we retrieve from localStorage as a mock
        const eventData = localStorage.getItem(`event_${eventId}`);
        
        if (eventData) {
          return JSON.parse(eventData);
        }
        
        // Return a default event if not found
        return {
          id: eventId,
          title: 'New Event',
          description: '',
          date: new Date().toISOString(),
          status: 'draft'
        };
      } catch (error) {
        console.error(`Error getting event ${eventId}:`, error);
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
        const templateData = localStorage.getItem(`event_template_${eventId}`);
        
        if (templateData) {
          return JSON.parse(templateData);
        }
        
        return null;
      } catch (error) {
        console.error(`Error getting template for event ${eventId}:`, error);
        throw error;
      }
    }
    
    /**
     * Save a template associated with an event
     * @param {string} eventId The event identifier
     * @param {Array} templateData The template data
     * @returns {Promise<boolean>} Success status
     */
    static async saveTemplate(eventId, templateData) {
      try {
        localStorage.setItem(`event_template_${eventId}`, JSON.stringify(templateData));
        
        // Update the event's last modified timestamp
        const event = await this.getEventById(eventId);
        event.lastModified = new Date().toISOString();
        localStorage.setItem(`event_${eventId}`, JSON.stringify(event));
        
        return true;
      } catch (error) {
        console.error(`Error saving template for event ${eventId}:`, error);
        throw error;
      }
    }
    
    /**
     * Publish an event (change its status to 'live')
     * @param {string} eventId The event identifier
     * @returns {Promise<boolean>} Success status
     */
    static async publishEvent(eventId) {
      try {
        const event = await this.getEventById(eventId);
        
        event.status = 'live';
        event.publishedAt = new Date().toISOString();
        
        localStorage.setItem(`event_${eventId}`, JSON.stringify(event));
        
        return true;
      } catch (error) {
        console.error(`Error publishing event ${eventId}:`, error);
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
        
        return eventId;
      } catch (error) {
        console.error('Error creating event:', error);
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
        
        return true;
      } catch (error) {
        console.error(`Error updating event ${eventId}:`, error);
        throw error;
      }
    }
  }
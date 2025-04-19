// src/Pages/Dashboard/WebsiteBuilder/services/SubdomainService.js
/**
 * SubdomainService
 * 
 * Service for managing custom subdomains for event websites
 */
export class SubdomainService {
    /**
     * Base domain for all event websites
     * @type {string}
     */
    static baseDomain = 'eventhorizon.com';
  
    /**
     * Check if a subdomain is available
     * @param {string} subdomain The subdomain to check
     * @returns {Promise<boolean>} Whether the subdomain is available
     */
    static async isSubdomainAvailable(subdomain) {
      try {
        // In a production environment, this would make an API call to check
        // For now, we'll check against our local storage registry of subdomains
        const registeredSubdomains = JSON.parse(localStorage.getItem('registered_subdomains') || '[]');
        return !registeredSubdomains.includes(subdomain);
      } catch (error) {
        console.error(`Error checking subdomain availability: ${error}`);
        throw error;
      }
    }
  
    /**
     * Register a subdomain for an event
     * @param {string} eventId The event ID
     * @param {string} subdomain The desired subdomain
     * @returns {Promise<boolean>} Success status
     */
    static async registerSubdomain(eventId, subdomain) {
      try {
        // Validate subdomain format
        if (!this.isValidSubdomain(subdomain)) {
          throw new Error('Invalid subdomain format. Use only letters, numbers, and hyphens.');
        }
  
        // Check if subdomain is available
        const isAvailable = await this.isSubdomainAvailable(subdomain);
        if (!isAvailable) {
          throw new Error(`Subdomain '${subdomain}' is already taken.`);
        }
  
        // In a production environment, this would call an API to register the subdomain
        // For now, we'll update our local storage registry
        
        // Get current subdomain registry
        const subdomainRegistry = JSON.parse(localStorage.getItem('subdomain_registry') || '{}');
        
        // Remove any existing subdomain for this event
        const existingSubdomain = Object.keys(subdomainRegistry).find(
          key => subdomainRegistry[key] === eventId
        );
        
        if (existingSubdomain) {
          delete subdomainRegistry[existingSubdomain];
          
          // Also remove from the registered_subdomains list
          const registeredSubdomains = JSON.parse(localStorage.getItem('registered_subdomains') || '[]');
          const updatedRegisteredSubdomains = registeredSubdomains.filter(s => s !== existingSubdomain);
          localStorage.setItem('registered_subdomains', JSON.stringify(updatedRegisteredSubdomains));
        }
        
        // Register the new subdomain
        subdomainRegistry[subdomain] = eventId;
        localStorage.setItem('subdomain_registry', JSON.stringify(subdomainRegistry));
        
        // Add to registered_subdomains list
        const registeredSubdomains = JSON.parse(localStorage.getItem('registered_subdomains') || '[]');
        registeredSubdomains.push(subdomain);
        localStorage.setItem('registered_subdomains', JSON.stringify(registeredSubdomains));
        
        // Update the event with the new subdomain
        const eventData = JSON.parse(localStorage.getItem(`event_${eventId}`) || '{}');
        eventData.subdomain = subdomain;
        localStorage.setItem(`event_${eventId}`, JSON.stringify(eventData));
        
        return true;
      } catch (error) {
        console.error(`Error registering subdomain: ${error}`);
        throw error;
      }
    }
  
    /**
     * Get the subdomain for an event
     * @param {string} eventId The event ID
     * @returns {Promise<string|null>} The subdomain or null if not found
     */
    static async getSubdomainForEvent(eventId) {
      try {
        // Check if event has a subdomain stored directly
        const eventData = JSON.parse(localStorage.getItem(`event_${eventId}`) || '{}');
        if (eventData.subdomain) {
          return eventData.subdomain;
        }
        
        // Otherwise check the registry
        const subdomainRegistry = JSON.parse(localStorage.getItem('subdomain_registry') || '{}');
        const subdomain = Object.keys(subdomainRegistry).find(
          key => subdomainRegistry[key] === eventId
        );
        
        return subdomain || null;
      } catch (error) {
        console.error(`Error getting subdomain for event: ${error}`);
        throw error;
      }
    }
  
    /**
     * Get the event ID associated with a subdomain
     * @param {string} subdomain The subdomain
     * @returns {Promise<string|null>} The event ID or null if not found
     */
    static async getEventIdFromSubdomain(subdomain) {
      try {
        const subdomainRegistry = JSON.parse(localStorage.getItem('subdomain_registry') || '{}');
        return subdomainRegistry[subdomain] || null;
      } catch (error) {
        console.error(`Error getting event ID from subdomain: ${error}`);
        throw error;
      }
    }
  
    /**
     * Release a subdomain (make it available again)
     * @param {string} eventId The event ID
     * @returns {Promise<boolean>} Success status
     */
    static async releaseSubdomain(eventId) {
      try {
        // Get the subdomain for this event
        const subdomain = await this.getSubdomainForEvent(eventId);
        if (!subdomain) {
          return true; // No subdomain to release
        }
        
        // Remove from subdomain registry
        const subdomainRegistry = JSON.parse(localStorage.getItem('subdomain_registry') || '{}');
        delete subdomainRegistry[subdomain];
        localStorage.setItem('subdomain_registry', JSON.stringify(subdomainRegistry));
        
        // Remove from registered_subdomains list
        const registeredSubdomains = JSON.parse(localStorage.getItem('registered_subdomains') || '[]');
        const updatedRegisteredSubdomains = registeredSubdomains.filter(s => s !== subdomain);
        localStorage.setItem('registered_subdomains', JSON.stringify(updatedRegisteredSubdomains));
        
        // Update the event
        const eventData = JSON.parse(localStorage.getItem(`event_${eventId}`) || '{}');
        delete eventData.subdomain;
        localStorage.setItem(`event_${eventId}`, JSON.stringify(eventData));
        
        return true;
      } catch (error) {
        console.error(`Error releasing subdomain: ${error}`);
        throw error;
      }
    }
  
    /**
     * Generate a full URL for an event website
     * @param {string} subdomain The subdomain
     * @param {boolean} useHttps Whether to use HTTPS (default: true)
     * @returns {string} The full URL
     */
    static getFullUrl(subdomain, useHttps = true) {
      const protocol = useHttps ? 'https' : 'http';
      return `${protocol}://${subdomain}.${this.baseDomain}`;
    }
  
    /**
     * Generate a URL for the event website based on the event ID
     * @param {string} eventId The event ID
     * @returns {Promise<string>} The event website URL
     */
    static async getEventUrl(eventId) {
      try {
        const subdomain = await this.getSubdomainForEvent(eventId);
        if (subdomain) {
          return this.getFullUrl(subdomain);
        }
        
        // Fallback to default URL structure
        return `/events/${eventId}`;
      } catch (error) {
        console.error(`Error getting event URL: ${error}`);
        throw error;
      }
    }
  
    /**
     * Validate subdomain format
     * @param {string} subdomain The subdomain to validate
     * @returns {boolean} Whether the subdomain is valid
     */
    static isValidSubdomain(subdomain) {
      // Subdomains should be 3-63 characters, containing only lowercase letters, numbers, and hyphens
      // They cannot start or end with a hyphen
      const regex = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;
      return regex.test(subdomain);
    }
  
    /**
     * Generate a suggested subdomain based on event title
     * @param {string} eventTitle The event title
     * @returns {Promise<string>} A suggested subdomain
     */
    static async suggestSubdomain(eventTitle) {
      try {
        // Convert title to lowercase, remove special characters, replace spaces with hyphens
        let suggestion = eventTitle
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        // Ensure valid length
        if (suggestion.length < 3) {
          suggestion += `-event`;
        }
        if (suggestion.length > 63) {
          suggestion = suggestion.substring(0, 63);
        }
        
        // Check if suggestion is available
        if (await this.isSubdomainAvailable(suggestion)) {
          return suggestion;
        }
        
        // If not available, add a random number
        let counter = 1;
        let newSuggestion;
        
        do {
          newSuggestion = `${suggestion.substring(0, 59)}-${counter}`;
          counter++;
        } while (!(await this.isSubdomainAvailable(newSuggestion)));
        
        return newSuggestion;
      } catch (error) {
        console.error(`Error suggesting subdomain: ${error}`);
        throw error;
      }
    }
  }
export class TemplateRegistry {
  static templates = new Map();
  
  static registerTemplate(template) {
    if (!template.id || !template.data) {
      throw new Error('Template must have an id and data property');
    }
    this.templates.set(template.id, template);
  }

  static getTemplate(templateId) {
    return this.templates.get(templateId);
  }

  static getAllTemplates() {
    return Array.from(this.templates.values());
  }

  static injectEventData(template, eventData) {
    // Deep clone the template to avoid mutations
    const templateCopy = JSON.parse(JSON.stringify(template));

    // Helper function to inject data into components
    const injectData = (component) => {
      switch (component.type) {
        case 'countdownTimer':
          component.props.eventDate = eventData.startDate;
          break;
        case 'title':
          if (component.id === 'event-title') {
            component.props.text = eventData.title;
          }
          break;
        case 'text':
          if (component.id === 'event-description') {
            component.props.text = eventData.description;
          }
          break;
        case 'googleMaps':
          if (component.id === 'venue-map' || component.id === 'details-map') {
            component.props.address = eventData.venue?.address;
          }
          break;
        case 'ticketSalesWidget':
          component.props.tickets = eventData.tickets;
          break;
        case 'scheduleAgenda':
          component.props.dates = [eventData.startDate, eventData.endDate];
          component.props.agenda = eventData.agenda;
          break;
        case 'socialMediaSharing':
          component.props.shareText = `Join us at ${eventData.title}! ${eventData.description}`;
          break;
        case 'image':
          if (component.id === 'gallery' && eventData.gallery) {
            component.props.images = eventData.gallery;
          }
          break;
        default:
          // Handle unknown component types
          console.warn(`Unknown component type: ${component.type}`);
          break;
      }

      // Recursively process nested components
      if (component.components) {
        component.components.forEach(injectData);
      }
    };

    // Process all components in the template
    templateCopy.data.forEach(injectData);

    return templateCopy;
  }

  static async getTemplateWithEventData(templateId, eventData) {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template with id ${templateId} not found`);
    }
    return this.injectEventData(template, eventData);
  }
}
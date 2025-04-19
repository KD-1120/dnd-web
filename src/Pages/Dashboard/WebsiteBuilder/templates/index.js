import { TemplateRegistry } from './TemplateRegistry';
import { eventTemplate } from './event-template';
import { workshopTemplate } from './workshop-template';
import { conferenceTemplate } from './conference-template';
import { concertTemplate } from './Concert/index';

// Register all templates
TemplateRegistry.registerTemplate(eventTemplate);
TemplateRegistry.registerTemplate(workshopTemplate);
TemplateRegistry.registerTemplate(conferenceTemplate);

export { TemplateRegistry };
export * from './event-template';
export * from './workshop-template';
export * from './conference-template';

export const templates = {
  conference: conferenceTemplate,
  event: eventTemplate,
  concert: concertTemplate,
  // Add other templates
};

export const templateList = [
  {
    ...conferenceTemplate,
    id: 'conference',
    name: 'Professional Conference',
    description: 'Perfect for tech conferences, summits, and professional gatherings',
    thumbnail: '/api/placeholder/400/250',
    category: 'Conferences'
  },
  concertTemplate,
  eventTemplate,
  // Add other templates to the list
  {
    id: 'workshop',
    name: 'Workshop & Training',
    description: 'Designed for workshops, training sessions, and educational events',
    thumbnail: '/api/placeholder/400/250',
    category: 'Education'
  },
  {
    id: 'wedding',
    name: 'Wedding Celebration',
    description: 'Elegant layout for weddings and formal ceremonies',
    thumbnail: '/api/placeholder/400/250',
    category: 'Special Occasions'
  },
  {
    id: 'fundraiser',
    name: 'Charity Fundraiser',
    description: 'Compelling design for charity events and fundraisers',
    thumbnail: '/api/placeholder/400/250',
    category: 'Nonprofit'
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    description: 'Sleek template for product launches and corporate announcements',
    thumbnail: '/api/placeholder/400/250',
    category: 'Business'
  }
];
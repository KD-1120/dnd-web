// src/Pages/Dashboard/WebsiteBuilder/bricks/BrickRegistry.js
import { Layout, Type, FileText, Image, Square } from 'lucide-react';
import { Calendar, Clock, Share, Map, Ticket, Users } from 'lucide-react';

import { ContainerBrickComponent, ContainerBrickInspector } from './ContainerBrick';
import { TextBrickComponent, TextBrickInspector } from './TextBrick';
import { TitleBrickComponent, TitleBrickInspector } from './TitleBrick';
import { ImageBrickComponent, ImageBrickInspector } from './ImageBrick';
import { ButtonBrickComponent, ButtonBrickInspector } from './ButtonBrick';
import { ScheduleAgendaBrickComponent, ScheduleAgendaBrickInspector } from './ScheduleAgendaBrick';
import { TicketSalesWidgetBrickComponent, TicketSalesWidgetBrickInspector } from './TicketSalesWidgetBrick';
import { GoogleMapsBrickComponent, GoogleMapsBrickInspector } from './GoogleMapsBrick';
import { SocialMediaSharingBrickComponent, SocialMediaSharingBrickInspector } from './SocialMediaSharingBrick';
import { CountdownTimerBrickComponent, CountdownTimerBrickInspector } from './CountdownTimerBrick';

// Brick metadata map
export const brickMeta = {
  title: { icon: Type, category: 'Text', displayName: 'Title' },
  text: { icon: FileText, category: 'Text', displayName: 'Text' },
  button: { icon: Square, category: 'Components', displayName: 'Button' },
  image: { icon: Image, category: 'Media', displayName: 'Image' },
  container: { icon: Layout, category: 'Layout', displayName: 'Container' },
  socialMediaSharing: { icon: Share, category: 'Social', displayName: 'Social Media' },
  googleMaps: { icon: Map, category: 'Location', displayName: 'Google Maps' },
  ticketSalesWidget: { icon: Ticket, category: 'Events', displayName: 'Ticket Sales' },
  scheduleAgenda: { icon: Calendar, category: 'Events', displayName: 'Schedule' },
  countdownTimer: { icon: Clock, category: 'Events', displayName: 'Countdown Timer' }
};

// BrickRegistry keeps track of all available brick types and their configurations
export const BrickRegistry = {
  text: {
    type: 'text',
    category: brickMeta.text.category,
    label: brickMeta.text.displayName,
    component: TextBrickComponent,
    inspector: TextBrickInspector
  },
  title: {
    type: 'title',
    category: brickMeta.title.category,
    label: brickMeta.title.displayName,
    component: TitleBrickComponent,
    inspector: TitleBrickInspector
  },
  image: {
    type: 'image',
    category: brickMeta.image.category,
    label: brickMeta.image.displayName,
    component: ImageBrickComponent,
    inspector: ImageBrickInspector
  },
  container: {
    type: 'container',
    category: brickMeta.container.category,
    label: brickMeta.container.displayName,
    component: ContainerBrickComponent,
    inspector: ContainerBrickInspector
  },
  button: {
    type: 'button',
    category: brickMeta.button.category,
    label: brickMeta.button.displayName,
    component: ButtonBrickComponent,
    inspector: ButtonBrickInspector
  },
  scheduleAgenda: {
    type: 'scheduleAgenda',
    category: brickMeta.scheduleAgenda.category,
    label: brickMeta.scheduleAgenda.displayName,
    component: ScheduleAgendaBrickComponent,
    inspector: ScheduleAgendaBrickInspector
  },
  ticketSalesWidget: {
    type: 'ticketSalesWidget',
    category: brickMeta.ticketSalesWidget.category,
    label: brickMeta.ticketSalesWidget.displayName,
    component: TicketSalesWidgetBrickComponent,
    inspector: TicketSalesWidgetBrickInspector
  },
  googleMaps: {
    type: 'googleMaps',
    category: brickMeta.googleMaps.category,
    label: brickMeta.googleMaps.displayName,
    component: GoogleMapsBrickComponent,
    inspector: GoogleMapsBrickInspector
  },
  socialMediaSharing: {
    type: 'socialMediaSharing',
    category: brickMeta.socialMediaSharing.category,
    label: brickMeta.socialMediaSharing.displayName,
    component: SocialMediaSharingBrickComponent,
    inspector: SocialMediaSharingBrickInspector
  },
  countdownTimer: {
    type: 'countdownTimer',
    category: brickMeta.countdownTimer.category,
    label: brickMeta.countdownTimer.displayName,
    component: CountdownTimerBrickComponent,
    inspector: CountdownTimerBrickInspector
  }
};

export const getBrickById = (pageData, brickId) => {
  if (!brickId || !pageData) return null;
  
  const searchBricks = (bricks) => {
    for (const brick of bricks) {
      if (brick.id === brickId) return brick;
      if (brick.components) {
        const found = searchBricks(brick.components);
        if (found) return found;
      }
    }
    return null;
  };
  
  return searchBricks(pageData);
};

export const getAllBrickTypes = () => {
  return Object.keys(BrickRegistry);
};

export const getComponentsByCategory = () => {
  const categories = {};
  
  Object.entries(BrickRegistry).forEach(([key, value]) => {
    const category = value.category || 'Other';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push({
      type: key,
      ...value
    });
  });
  
  return categories;
};

export default BrickRegistry;
// src/Pages/Dashboard/WebsiteBuilder/bricks/BrickRegistry.js
import React from 'react';
import { Layout, Type, FileText, Image, Square, Box, Grid } from 'lucide-react';
import { TitleBrickComponent, TitleBrickInspector } from './TitleBrick';
import { TextBrickComponent, TextBrickInspector } from './TextBrick';
import { ButtonBrickComponent, ButtonBrickInspector } from './ButtonBrick';
import { ImageBrickComponent, ImageBrickInspector } from './ImageBrick';
import { ContainerBrickComponent, ContainerBrickInspector } from './ContainerBrick';
import { SocialMediaSharingBrickComponent, SocialMediaSharingBrickInspector } from './SocialMediaSharingBrick';
import { GoogleMapsBrickComponent, GoogleMapsBrickInspector } from './GoogleMapsBrick';
import { TicketSalesWidgetBrickComponent, TicketSalesWidgetBrickInspector } from './TicketSalesWidgetBrick';
import { ScheduleAgendaBrickComponent, ScheduleAgendaBrickInspector } from './ScheduleAgendaBrick';
import { CountdownTimerBrickComponent, CountdownTimerBrickInspector } from './CountdownTimerBrick';


import { Calendar, Clock, Share, Map, Ticket, Users } from 'lucide-react';

// This object maps brick types to their icons and categories
// Could be enhanced to be part of each brick's metadata
const brickMeta = {
  title: { icon: Type, category: 'Text', displayName: 'Title' },
  text: { icon: FileText, category: 'Text', displayName: 'Text' },
  button: { icon: Square, category: 'Components', displayName: 'Button' },
  image: { icon: Image, category: 'Media', displayName: 'Image' },
  container: { icon: Layout, category: 'Layout', displayName: 'Container' },
  socialMediaSharing: { icon: Share, category: 'Social', displayName: 'Social Media' },
  googleMaps: { icon: Map, category: 'Location', displayName: 'Google Maps' },
  ticketSalesWidget: { icon: Ticket, category: 'Events', displayName: 'Ticket Sales' },
  scheduleAgenda: { icon: Calendar, category: 'Events', displayName: 'Schedule' },
  countdownTimer: { icon: Clock, category: 'Events', displayName: 'Countdown Timer' },
  speakerGallery: { icon: Users, category: 'People', displayName: 'Speaker Gallery' }
};

// Dynamically generate the brick registry
export const BrickRegistry = {
  title: {
    component: TitleBrickComponent,
    inspector: TitleBrickInspector,
    label: brickMeta.title.displayName,
    icon: brickMeta.title.icon,
    category: brickMeta.title.category
  },
  text: {
    component: TextBrickComponent,
    inspector: TextBrickInspector,
    label: brickMeta.text.displayName,
    icon: brickMeta.text.icon,
    category: brickMeta.text.category
  },
  button: {
    component: ButtonBrickComponent,
    inspector: ButtonBrickInspector,
    label: brickMeta.button.displayName,
    icon: brickMeta.button.icon,
    category: brickMeta.button.category
  },
  image: {
    component: ImageBrickComponent,
    inspector: ImageBrickInspector,
    label: brickMeta.image.displayName,
    icon: brickMeta.image.icon,
    category: brickMeta.image.category
  },
  container: {
    component: ContainerBrickComponent,
    inspector: ContainerBrickInspector,
    label: brickMeta.container.displayName,
    icon: brickMeta.container.icon,
    category: brickMeta.container.category
  },
  socialMediaSharing: {
    component: SocialMediaSharingBrickComponent,
    inspector: SocialMediaSharingBrickInspector,
    label: brickMeta.socialMediaSharing.displayName,
    icon: brickMeta.socialMediaSharing.icon,
    category: brickMeta.socialMediaSharing.category
  },
  googleMaps: {
    component: GoogleMapsBrickComponent,
    inspector: GoogleMapsBrickInspector,
    label: brickMeta.googleMaps.displayName,
    icon: brickMeta.googleMaps.icon,
    category: brickMeta.googleMaps.category
  },
  ticketSalesWidget: {
    component: TicketSalesWidgetBrickComponent,
    inspector: TicketSalesWidgetBrickInspector,
    label: brickMeta.ticketSalesWidget.displayName,
    icon: brickMeta.ticketSalesWidget.icon,
    category: brickMeta.ticketSalesWidget.category
  },
  scheduleAgenda: {
    component: ScheduleAgendaBrickComponent,
    inspector: ScheduleAgendaBrickInspector,
    label: brickMeta.scheduleAgenda.displayName,
    icon: brickMeta.scheduleAgenda.icon,
    category: brickMeta.scheduleAgenda.category
  },
  countdownTimer: {
    component: CountdownTimerBrickComponent,
    inspector: CountdownTimerBrickInspector,
    label: brickMeta.countdownTimer.displayName,
    icon: brickMeta.countdownTimer.icon,
    category: brickMeta.countdownTimer.category
  }
};

// Helper function to get components by category
export const getComponentsByCategory = () => {
  const categories = {};
  
  Object.entries(BrickRegistry).forEach(([type, definition]) => {
    const category = definition.category || 'Other';
    
    if (!categories[category]) {
      categories[category] = [];
    }
    
    categories[category].push({
      type,
      label: definition.label || type,
      icon: definition.icon
    });
  });
  
  return categories;
};

// Get all available brick types
export const getAllBrickTypes = () => {
  return Object.keys(BrickRegistry).map(type => ({
    type,
    label: BrickRegistry[type].label || type,
    icon: BrickRegistry[type].icon,
    category: BrickRegistry[type].category || 'Other'
  }));
};
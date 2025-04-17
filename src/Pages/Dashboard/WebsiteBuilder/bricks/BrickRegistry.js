// src/Pages/Dashboard/WebsiteBuilder/bricks/BrickRegistry.jsx
import { TitleBrickComponent, TitleBrickInspector } from './TitleBrick';
import { TextBrickComponent, TextBrickInspector } from './TextBrick';
import { ButtonBrickComponent, ButtonBrickInspector } from './ButtonBrick';
import { ImageBrickComponent, ImageBrickInspector } from './ImageBrick';
import { ContainerBrickComponent, ContainerBrickInspector } from './ContainerBrick';
import { Layout, Type, FileText, Image, Square, Box, Grid } from 'lucide-react';

export const BrickRegistry = {
  title: {
    component: TitleBrickComponent,
    inspector: TitleBrickInspector,
    label: 'Title',
    icon: Type,
    category: 'Text'
  },
  text: {
    component: TextBrickComponent,
    inspector: TextBrickInspector,
    label: 'Text',
    icon: FileText,
    category: 'Text'
  },
  button: {
    component: ButtonBrickComponent,
    inspector: ButtonBrickInspector,
    label: 'Button',
    icon: Square,
    category: 'Components'
  },
  image: {
    component: ImageBrickComponent,
    inspector: ImageBrickInspector,
    label: 'Image',
    icon: Image,
    category: 'Media'
  },
  container: {
    component: ContainerBrickComponent,
    inspector: ContainerBrickInspector,
    label: 'Container',
    icon: Layout,
    category: 'Layout'
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
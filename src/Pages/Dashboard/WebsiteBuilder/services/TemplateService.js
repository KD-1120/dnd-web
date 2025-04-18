// templates/TemplateService.js
import { templates, templateList } from '../templates/index';

export class TemplateService {
  static async getTemplates() {
    // Return the list without the full data to keep it lightweight
    return templateList.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description,
      category: template.category || 'Uncategorized',
      thumbnail: template.thumbnail
    }));
  }
  
  static async getTemplateById(id) {
    // Get the full template with data from our templates object
    if (id === 'blank') {
      return {
        id: 'blank',
        name: 'Blank Template',
        data: []
      };
    }
    
    // Get the template from our templates object which should have the full data
    const template = templates[id];
    
    if (!template) {
      console.error(`Template not found: ${id}`);
      return null;
    }
    
    // Ensure the template has a data property
    if (!template.data) {
      console.warn(`Template ${id} missing data property`);
      template.data = [];
    }
    
    // Return a deep copy to prevent modification of the original template
    return {
      id: template.id,
      name: template.name,
      description: template.description,
      category: template.category,
      thumbnail: template.thumbnail,
      data: JSON.parse(JSON.stringify(template.data))
    };
  }
  
  static async loadUserTemplate(siteId) {
    try {
      const savedData = localStorage.getItem(`userTemplate_${siteId}`);
      if (savedData) {
        return JSON.parse(savedData);
      }
      return null;
    } catch (error) {
      console.error('Error loading user template:', error);
      return null;
    }
  }
  
  static async saveUserTemplate(siteId, data) {
    try {
      localStorage.setItem(`userTemplate_${siteId}`, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving user template:', error);
      return false;
    }
  }
}
// src/Pages/Dashboard/WebsiteBuilder/services/TemplateService.js
import { templates, templateList } from '../templates';

/**
 * Template Service
 * 
 * Handles loading templates and saving user customizations
 */
export class TemplateService {
  /**
   * Load available templates
   * @returns {Promise<Array>} List of available templates
   */
  static async getTemplates() {
    try {
      // In production, this would be an API call
      return templateList;
    } catch (error) {
      console.error('Error loading templates:', error);
      return [];
    }
  }

  /**
   * Load template data by ID
   * @param {string} templateId The template identifier
   * @returns {Promise<Object>} Template data
   */
  static async getTemplateById(templateId) {
    try {
      // Return from our templates object
      return templates[templateId] || null;
    } catch (error) {
      console.error(`Error loading template ${templateId}:`, error);
      return null;
    }
  }
  
  /**
   * Save a user-customized template
   * @param {string} siteId Site identifier
   * @param {Object} templateData The customized template data
   * @returns {Promise<boolean>} Success status
   */
  static async saveUserTemplate(siteId, templateData) {
    try {
      // In production, this would be an API call
      localStorage.setItem(`site_${siteId}`, JSON.stringify({
        data: templateData,
        lastModified: new Date().toISOString()
      }));
      return true;
    } catch (error) {
      console.error('Error saving template:', error);
      return false;
    }
  }
  
  /**
   * Load a user-customized template
   * @param {string} siteId Site identifier
   * @returns {Promise<Object>} The custom template data
   */
  static async loadUserTemplate(siteId) {
    try {
      const data = localStorage.getItem(`site_${siteId}`);
      if (!data) return null;
      
      return JSON.parse(data).data;
    } catch (error) {
      console.error('Error loading user template:', error);
      return null;
    }
  }
}
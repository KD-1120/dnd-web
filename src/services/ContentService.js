// Mock API endpoint - replace with your actual API endpoint
const API_URL = '/api/pages';

export class ContentService {
  static async savePage(pageId, content) {
    try {
      // In production, this would be a real API call
      console.log('Saving page content:', { pageId, content });
      localStorage.setItem(`page_${pageId}`, JSON.stringify({
        content,
        lastModified: new Date().toISOString()
      }));
      return true;
    } catch (error) {
      console.error('Error saving page:', error);
      return false;
    }
  }

  static async loadPage(pageId) {
    try {
      // In production, this would be a real API call  
      const data = localStorage.getItem(`page_${pageId}`);
      if (!data) return null;
      return JSON.parse(data).content;
    } catch (error) {
      console.error('Error loading page:', error);
      return null;
    }
  }

  static async saveGlobalLayout(layoutName, content) {
    try {
      localStorage.setItem(`global_${layoutName}`, JSON.stringify({
        content,
        lastModified: new Date().toISOString()
      }));
      return true;
    } catch (error) {
      console.error('Error saving global layout:', error);
      return false; 
    }
  }

  static async loadGlobalLayout(layoutName) {
    try {
      const data = localStorage.getItem(`global_${layoutName}`);
      if (!data) return null;
      return JSON.parse(data).content;
    } catch (error) {
      console.error('Error loading global layout:', error);
      return null;
    }
  }
}

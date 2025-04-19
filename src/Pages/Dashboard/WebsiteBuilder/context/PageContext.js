// Create this file at: src/Pages/Dashboard/WebsiteBuilder/context/PageContext.jsx
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const PageContext = createContext(null);

export const PageProvider = ({ children, initialData = [] }) => {
  const [pages, setPages] = useState([
    {
      id: uuidv4(),
      name: 'Home',
      data: initialData, 
      visibility: 'public',
      settings: {
        seoTitle: 'Home Page',
        metaDescription: 'Welcome to our event website!',
        slug: 'home'
      }
    }
  ]);
  
  // Update pages when initialData changes
  useEffect(() => {
    console.log('PageProvider: initialData changed:', initialData);
    setPages(prev => prev.map((page, index) => 
      index === 0 ? { ...page, data: initialData } : page
    ));
  }, [initialData]);

  const [selectedPageId, setSelectedPageId] = useState(pages[0].id);

  const currentPage = useMemo(
    () => pages.find(page => page.id === selectedPageId),
    [pages, selectedPageId]
  );

  // Create a new page and select it
  const createPage = (name = 'New Page', initialData = []) => {
    const newPage = {
      id: uuidv4(),
      name,
      data: initialData,
      visibility: 'draft',
      settings: {}
    };
    setPages(prev => [...prev, newPage]);
    setSelectedPageId(newPage.id);
  };

  // Update the bricks data for the currently selected page
  const updateCurrentPageData = (newData) => {
    setPages(prev =>
      prev.map(page =>
        page.id === selectedPageId ? { ...page, data: newData } : page
      )
    );
  };

  // Rename a page by id
  const renamePage = (pageId, newName) => {
    setPages(prev =>
      prev.map(page => page.id === pageId ? { ...page, name: newName } : page)
    );
  };

  // Delete a page (ensure at least one page remains)
  const deletePage = (pageId) => {
    setPages(prev => {
      if (prev.length === 1) return prev; // Prevent deletion of the last page
      const filtered = prev.filter(page => page.id !== pageId);
      if (selectedPageId === pageId && filtered.length > 0) {
        setSelectedPageId(filtered[0].id);
      }
      return filtered;
    });
  };

  // Duplicate a page (creates a copy with new id and appends " (Copy)" to its name)
  const duplicatePage = (pageId) => {
    setPages(prev => {
      const pageToDuplicate = prev.find(p => p.id === pageId);
      if (!pageToDuplicate) return prev;
      const newPage = {
        ...pageToDuplicate,
        id: uuidv4(),
        name: pageToDuplicate.name + ' (Copy)'
      };
      return [...prev, newPage];
    });
  };

  // Reorder pages: Move a page up in the list
  const movePageUp = (pageId) => {
    setPages(prev => {
      const index = prev.findIndex(p => p.id === pageId);
      if (index > 0) {
        const newPages = [...prev];
        [newPages[index - 1], newPages[index]] = [newPages[index], newPages[index - 1]];
        return newPages;
      }
      return prev;
    });
  };

  // Reorder pages: Move a page down in the list
  const movePageDown = (pageId) => {
    setPages(prev => {
      const index = prev.findIndex(p => p.id === pageId);
      if (index !== -1 && index < prev.length - 1) {
        const newPages = [...prev];
        [newPages[index], newPages[index + 1]] = [newPages[index + 1], newPages[index]];
        return newPages;
      }
      return prev;
    });
  };

  // Set page visibility (e.g., 'public', 'draft', 'private')
  const setPageVisibility = (pageId, visibility) => {
    setPages(prev =>
      prev.map(page =>
        page.id === pageId ? { ...page, visibility } : page
      )
    );
  };

  // Update additional page settings (SEO title, meta description, slug, etc.)
  const updatePageSettings = (pageId, newSettings) => {
    setPages(prev =>
      prev.map(page =>
        page.id === pageId
          ? { ...page, settings: { ...page.settings, ...newSettings } }
          : page
      )
    );
  };

  return (
    <PageContext.Provider value={{
      pages,
      selectedPageId,
      setSelectedPageId,
      currentPage,
      createPage,
      updateCurrentPageData,
      renamePage,
      deletePage,
      duplicatePage,
      movePageUp,
      movePageDown,
      setPageVisibility,
      updatePageSettings
    }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePageContext = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('usePageContext must be used within a PageProvider');
  }
  return context;
};
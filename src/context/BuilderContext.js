// src/context/BuilderContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { usePageContext } from './PageContext';
import { patterns } from '../patterns';  // Add this import
import { ContentService } from '../services/ContentService';

const BuilderContext = createContext({
  pageData: [],
  previewData: [],
  selectedBrickId: null,
  // ...other context properties...
});

// Example initial page data
const initialPageData = [
  {
    type: 'container',
    id: uuidv4(),
    props: {
      bgColor: '#ffffff',
      padding: '2rem'
    },
    components: [
      {
        type: 'column',
        id: uuidv4(),
        props: {
          width: '33%',
          padding: '1rem'
        },
        components: [
          {
            type: 'icon',
            id: uuidv4(),
            props: {
              icon: '⚡',
              size: '2rem',
              color: '#634AFF'
            }
          },
          {
            type: 'heading',
            id: uuidv4(),
            props: {
              text: 'Feature 1',
              fontSize: '1.5rem',
              color: '#333333'
            }
          }
        ]
      }
    ]
  }
];

export const BuilderProvider = ({ children }) => {
  const { currentPage, updateCurrentPageData } = usePageContext();
  const pageData = Array.isArray(currentPage?.data) ? currentPage.data : initialPageData;
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [selectedBrickId, setSelectedBrickId] = useState(null);
  const [activeTab, setActiveTab] = useState('blocks');
  const [globalLayouts, setGlobalLayouts] = useState(null);
  const [selectedGlobalElement, setSelectedGlobalElement] = useState(null);

  // Initialize global layouts with default values from patterns
  useEffect(() => {
    const navigation = patterns.find(p => p.name === 'Site Navigation')?.bricks[0];
    const footer = patterns.find(p => p.name === 'Site Footer')?.bricks[0];
    setGlobalLayouts({ navigation, footer });
  }, []);

  // Add effect to load content when page changes
  useEffect(() => {
    if (currentPage?.id) {
      loadPageContent(currentPage.id);
    }
  }, [currentPage?.id]);

  // Modified setPageData to ensure synchronous updates
  const setPageData = (newDataOrFn) => {
    const newData = typeof newDataOrFn === 'function' ? newDataOrFn(pageData) : newDataOrFn;
    if (!Array.isArray(newData)) {
      console.error('setPageData: newData must be an array, received:', newData);
      return;
    }
    setUndoStack(prev => [...prev, pageData]);
    setRedoStack([]);
    updateCurrentPageData(newData);
  };

  // Add a brick to the root level
  const addBrickToRoot = (brickType) => {
    const newBrick = {
      type: brickType,
      id: uuidv4(),
      props: {},
      components: [] // Always initialize components
    };
    setPageData([...pageData, newBrick]);
  };

  // Add a pattern (an array of bricks) to the root level
  const addPatternToRoot = (patternBricks) => {
    const cloneBrick = (brick) => {
      const newBrick = {
        ...brick,
        id: uuidv4(),
        props: { ...brick.props }
      };
      if (brick.components && brick.components.length > 0) {
        newBrick.components = brick.components.map(child => cloneBrick(child));
      }
      return newBrick;
    };
    const clonedBricks = patternBricks.map(brick => cloneBrick(brick));
    setPageData([...pageData, ...clonedBricks]);
  };

  // Update a brick's props by id
  const updateBrickProps = (brickId, updatedProps) => {
    if (!brickId) return;
    setPageData(
      pageData.map(brick => updateBrickRecursive(brick, brickId, updatedProps))
    );
  };

  const updateBrickRecursive = (brick, targetId, newProps) => {
    if (brick.id === targetId) {
      return {
        ...brick,
        props: { ...brick.props, ...newProps }
      };
    }
    if (brick.components) {
      return {
        ...brick,
        components: brick.components.map(child =>
          updateBrickRecursive(child, targetId, newProps)
        )
      };
    }
    return brick;
  };

  // Update nested brick props (for non-button nested components)
  const updateNestedBrickProps = (parentId, componentId, updatedProps) => {
    const updateRecursive = (brick) => {
      if (brick.id === parentId) {
        return {
          ...brick,
          components: brick.components.map(comp =>
            comp.id === componentId
              ? { ...comp, props: { ...comp.props, ...updatedProps } }
              : comp
          )
        };
      }
      if (brick.components) {
        return {
          ...brick,
          components: brick.components.map(comp => updateRecursive(comp))
        };
      }
      return brick;
    };
    setPageData(pageData.map(brick => updateRecursive(brick)));
  };

  // NEW: Update multiple nested components props at once
  const updateMultipleNestedProps = (parentId, updateFn) => {
    const updateRecursive = (brick) => {
      if (brick.id === parentId) {
        return {
          ...brick,
          components: updateFn(brick.components || [])
        };
      }
      if (brick.components) {
        return {
          ...brick,
          components: brick.components.map(comp => updateRecursive(comp))
        };
      }
      return brick;
    };
    setPageData(pageData.map(brick => updateRecursive(brick)));
  };

  // Remove the async addNestedComponent since we're not using it anymore
  const addNestedComponent = (parentId, componentType, initialProps = {}) => {
    let newComponentId = uuidv4();
    
    setPageData(prevPageData => {
      const newComponent = {
        id: newComponentId,
        type: componentType,
        props: initialProps,
        components: initialProps.components || []
      };

      return prevPageData.map(brick => {
        const updateRecursive = (currentBrick) => {
          if (currentBrick.id === parentId) {
            return {
              ...currentBrick,
              components: [...(currentBrick.components || []), newComponent]
            };
          }
          if (currentBrick.components) {
            return {
              ...currentBrick,
              components: currentBrick.components.map(comp => updateRecursive(comp))
            };
          }
          return currentBrick;
        };
        return updateRecursive(brick);
      });
    });
    
    return newComponentId; // Return the new component's ID for reference
  };

  // Remove a brick by id
  const removeBrick = (brickId) => {
    const removeRecursive = (bricks) =>
      bricks.filter(brick => {
        if (brick.id === brickId) {
          setSelectedBrickId(null);
          return false;
        }
        if (brick.components) {
          brick.components = removeRecursive(brick.components);
        }
        return true;
      });
    setPageData(removeRecursive([...pageData]));
  };

  // Remove a nested component
  const removeNestedComponent = (parentId, componentId) => {
    const updateRecursive = (brick) => {
      if (brick.id === parentId) {
        return {
          ...brick,
          components: brick.components.filter(comp => comp.id !== componentId)
        };
      }
      if (brick.components) {
        return {
          ...brick,
          components: brick.components.map(comp => updateRecursive(comp))
        };
      }
      return brick;
    };

    setPageData(pageData.map(brick => updateRecursive(brick)));
    setSelectedBrickId(null);
  };

  // Duplicate a brick by id (inserts duplicate at the same level)
  const duplicateBrick = (brickId) => {
    const cloneBrick = (brick) => {
      const newBrick = {
        ...brick,
        id: uuidv4(),
        props: { ...brick.props }
      };
      if (brick.components && brick.components.length > 0) {
        newBrick.components = brick.components.map(child => cloneBrick(child));
      }
      return newBrick;
    };

    const duplicateRecursive = (bricks) => {
      const newBricks = [];
      for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i];
        newBricks.push(brick);
        if (brick.id === brickId) {
          newBricks.push(cloneBrick(brick));
        } else if (brick.components) {
          brick.components = duplicateRecursive(brick.components);
        }
      }
      return newBricks;
    };

    setPageData(duplicateRecursive(pageData));
  };

  // Move a brick up within its parent's children (or root level)
  const moveBlockUp = (brickId) => {
    const moveUpRecursive = (bricks) => {
      for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i];
        if (brick.id === brickId) {
          if (i > 0) {
            const newBricks = [...bricks];
            [newBricks[i - 1], newBricks[i]] = [newBricks[i], newBricks[i - 1]];
            return newBricks;
          }
          return bricks;
        }
        if (brick.components) {
          brick.components = moveUpRecursive(brick.components);
        }
      }
      return bricks;
    };

    setPageData(moveUpRecursive(pageData));
  };

  // Move a brick down within its parent's children (or root level)
  const moveBlockDown = (brickId) => {
    const moveDownRecursive = (bricks) => {
      for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i];
        if (brick.id === brickId) {
          if (i < bricks.length - 1) {
            const newBricks = [...bricks];
            [newBricks[i], newBricks[i + 1]] = [newBricks[i + 1], newBricks[i]];
            return newBricks;
          }
          return bricks;
        }
        if (brick.components) {
          brick.components = moveDownRecursive(brick.components);
        }
      }
      return bricks;
    };

    setPageData(moveDownRecursive(pageData));
  };

  // Undo/Redo functions
  const undo = () => {
    setUndoStack(prev => {
      if (prev.length === 0) return prev;
      const newUndo = [...prev];
      const lastState = newUndo.pop();
      setRedoStack(r => [...r, pageData]);
      updateCurrentPageData(lastState);
      return newUndo;
    });
  };

  const redo = () => {
    setRedoStack(prev => {
      if (prev.length === 0) return prev;
      const newRedo = [...prev];
      const nextState = newRedo.pop();
      setUndoStack(u => [...u, pageData]);
      updateCurrentPageData(nextState);
      return newRedo;
    });
  };

  // Find a brick by id (recursive)
  const getBrickById = (brickId) => {
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

  // NEW: Get a button from a composite ID (format: "parentBrickId-index")
  const getButtonByCompositeId = (compositeId) => {
    const [parentId, indexStr] = compositeId.split('-');
    const parentBrick = getBrickById(parentId);
    if (parentBrick && parentBrick.props.buttons) {
      const index = parseInt(indexStr, 10);
      return parentBrick.props.buttons[index];
    }
    return null;
  };

  // Get nested component by a given path (not commonly used)
  const getNestedComponent = (brickId, path) => {
    const brick = getBrickById(brickId);
    if (!brick || !path) return null;
    let current = brick;
    const pathArray = Array.isArray(path) ? path : path.split('.');
    for (const key of pathArray) {
      current = current[key];
      if (!current) return null;
    }
    return current;
  };

  const selectGlobalElement = (elementName) => {
    const element = elementName === 'Site Navigation' ? 
      globalLayouts?.navigation : globalLayouts?.footer;
    setSelectedBrickId(element?.id);
  };

  // Update a global layout element
  const updateGlobalLayout = (elementName, updatedProps) => {
    setGlobalLayouts(prev => {
      const key = elementName === 'Site Navigation' ? 'navigation' : 'footer';
      return {
        ...prev,
        [key]: {
          ...prev[key],
          props: { ...prev[key].props, ...updatedProps }
        }
      };
    });
  };

  // Update a global layout element's props
  const updateGlobalLayoutProps = (elementName, updatedProps) => {
    setGlobalLayouts(prev => {
      const key = elementName === 'Site Navigation' ? 'navigation' : 'footer';
      const updatedElement = {
        ...prev[key],
        props: { ...prev[key].props, ...updatedProps }
      };
      return { ...prev, [key]: updatedElement };
    });
  };

  // Get the currently edited brick based on active tab
  const getActiveBrick = (brickId) => {
    if (activeTab === 'global') {
      // Search in global layouts
      if (globalLayouts?.navigation?.id === brickId) return globalLayouts.navigation;
      if (globalLayouts?.footer?.id === brickId) return globalLayouts.footer;
      return null;
    }
    // Search in page content
    return getBrickById(brickId);
  };

  // Add global layout elements to preview
  const addGlobalLayoutToPreview = (content) => {
    try {
      const navigation = patterns.find(p => p.name === 'Site Navigation')?.bricks[0];
      const footer = patterns.find(p => p.name === 'Site Footer')?.bricks[0];
      
      return [
        navigation,
        ...content,
        footer
      ].filter(Boolean);
    } catch (error) {
      console.error('Error adding global layout:', error);
      return content;
    }
  };

  // Update preview data preparation
  const getPreviewData = () => {
    if (!globalLayouts) return pageData;

    if (activeTab === 'blocks' || activeTab === 'media') {
      // In building mode, show only page content
      return pageData;
    } else if (activeTab === 'global') {
      // In global tab, show only global elements
      return [globalLayouts.navigation, globalLayouts.footer].filter(Boolean);
    }
    
    // In preview mode, show everything
    return [
      globalLayouts.navigation,
      ...pageData,
      globalLayouts.footer
    ].filter(Boolean);
  };

  const saveCurrentState = async () => {
    if (activeTab === 'global') {
      // Save global layouts
      await Promise.all([
        ContentService.saveGlobalLayout('navigation', globalLayouts.navigation),
        ContentService.saveGlobalLayout('footer', globalLayouts.footer)
      ]);
    } else {
      // Save current page content
      if (currentPage) {
        await ContentService.savePage(currentPage.id, pageData);
      }
    }
  };

  const loadPageContent = async (pageId) => {
    try {
      const content = await ContentService.loadPage(pageId);
      if (content) {
        updateCurrentPageData(content);
      }
    } catch (error) {
      console.error('Error loading page content:', error);
    }
  };

  const loadGlobalLayouts = async () => {
    const navigation = await ContentService.loadGlobalLayout('navigation');
    const footer = await ContentService.loadGlobalLayout('footer');
    if (navigation || footer) {
      setGlobalLayouts(prev => ({
        navigation: navigation || prev.navigation,
        footer: footer || prev.footer
      }));
    }
  };

  return (
    <BuilderContext.Provider
      value={{
        pageData,
        setPageData,
        addBrickToRoot,
        addPatternToRoot,
        updateBrickProps,
        updateNestedBrickProps,
        updateMultipleNestedProps, // Added new function
        addNestedComponent,
        removeBrick,
        duplicateBrick,
        moveBlockUp,
        moveBlockDown,
        undo,
        redo,
        selectedBrickId,
        setSelectedBrickId,
        getBrickById,
        getNestedComponent,
        removeNestedComponent,
        // New helper for button groups
        getButtonByCompositeId,
        // Preview data
        getPreviewData,
        activeTab,
        setActiveTab,
        selectGlobalElement,
        selectedGlobalElement,
        updateGlobalLayout,
        updateGlobalLayoutProps,
        getActiveBrick,
        globalLayouts,
        saveCurrentState,
        loadPageContent, // Add this if you need to expose it
        loadGlobalLayouts
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilderContext = () => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilderContext must be used within a BuilderProvider');
  }
  return context;
};
// Create this file at: src/Pages/Dashboard/WebsiteBuilder/context/BuilderContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { usePageContext } from './PageContext';
import { getBrickById as registryGetBrickById } from '../bricks/BrickRegistry';

export const BuilderContext = createContext({});

export const BuilderProvider = ({ children }) => {
  const { currentPage, updateCurrentPageData } = usePageContext();
  
  const pageData = useMemo(() => 
    Array.isArray(currentPage?.data) ? currentPage.data : [],
    [currentPage?.data]
  );
  
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [selectedBrickId, setSelectedBrickId] = useState(null);
  const [globalLayouts, setGlobalLayouts] = useState({
    navigation: null,
    footer: null
  });

  // Debug logging for page data changes
  useEffect(() => {
    console.log('BuilderContext: Current page data changed:', {
      pageId: currentPage?.id,
      dataLength: pageData.length,
      data: pageData
    });
  }, [currentPage, pageData]);

  // Add effect to load content when page changes
  useEffect(() => {
    if (currentPage?.id) {
      // In a real app, this would load content from an API
      console.log('Page changed, loading content for:', currentPage.id);
    }
  }, [currentPage?.id]);

  // Modified setPageData to ensure synchronous updates and proper data validation
  const setPageData = (newDataOrFn) => {
    const newData = typeof newDataOrFn === 'function' ? newDataOrFn(pageData) : newDataOrFn;
    
    if (!Array.isArray(newData)) {
      console.error('setPageData: newData must be an array, received:', newData);
      return;
    }

    console.log('BuilderContext: Setting new page data:', newData);
    
    setUndoStack(prev => [...prev, pageData]);
    setRedoStack([]);
    updateCurrentPageData(newData);
  };

  // Add a brick to the root level
  const addBrickToRoot = (brickType, initialProps = {}) => {
    const newBrick = {
      type: brickType,
      id: uuidv4(),
      props: initialProps || {},
      components: [] // Always initialize components
    };
    setPageData([...pageData, newBrick]);
    return newBrick.id;
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

  // Update nested brick props
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

  // Add a nested component to a parent brick
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
    
    return newComponentId;
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

  // Duplicate a brick by id
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

  // Move a brick up
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

  // Move a brick down
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
    if (undoStack.length === 0) return;
    
    setUndoStack(prev => {
      const newUndo = [...prev];
      const lastState = newUndo.pop();
      setRedoStack(r => [...r, pageData]);
      updateCurrentPageData(lastState);
      return newUndo;
    });
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    
    setRedoStack(prev => {
      const newRedo = [...prev];
      const nextState = newRedo.pop();
      setUndoStack(u => [...u, pageData]);
      updateCurrentPageData(nextState);
      return newRedo;
    });
  };

  // Get brick by ID using the imported helper function
  const getBrickById = useCallback((id) => {
    if (!id) return null;
    return registryGetBrickById(pageData, id);
  }, [pageData]);

  // Get preview data 
  const getPreviewData = () => pageData;

  // Save current state (mock implementation)
  const saveCurrentState = async () => {
    console.log('Saving current state...');
    return true;
  };

  return (
    <BuilderContext.Provider
      value={{
        pageData,
        setPageData,
        addBrickToRoot,
        updateBrickProps,
        updateNestedBrickProps,
        addNestedComponent,
        removeBrick,
        duplicateBrick,
        moveBlockUp,
        moveBlockDown,
        getBrickById,
        undo,
        redo,
        selectedBrickId,
        setSelectedBrickId,
        getPreviewData,
        saveCurrentState,
        globalLayouts,
        setGlobalLayouts
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
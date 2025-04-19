// Create this file at: src/Pages/Dashboard/WebsiteBuilder/components/SimplifiedCanvas.jsx
import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useBuilderContext } from '../context/BuilderContext';
import { useViewMode } from '../context/ViewModeContext';
import { BrickRegistry } from '../bricks/BrickRegistry';
import BlockSelectorModal from './BlockSelectorModal';
import { Plus, Copy, Trash2 } from 'lucide-react';

// Styled components
const CanvasWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0;
  background: #f8f9fa;
  position: relative;
  height: 100%;
  
  ${({ viewMode }) => {
    switch (viewMode) {
      case 'mobile':
        return `
          max-width: 375px;
          margin: 0 auto;
          border: 1px solid #ddd;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        `;
      case 'preview':
        return `
          background: white;
          margin: 0 auto;
          border: none;
        `;
      default:
        return `width: 100%;`;
    }
  }}
`;

const BlockWrapper = styled.div`
  position: relative;
  transition: all 0.2s;
  
  &:hover {
    ${props => props.isPreview ? '' : 'outline: 1px dashed #aaa;'}
  }
`;

const SelectedBlockOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid #2563eb;
  pointer-events: none;
  z-index: 1;
`;

const BlockControls = styled.div`
  position: absolute;
  top: -30px;
  right: 0;
  height: 30px;
  display: flex;
  background: #2563eb;
  border-radius: 4px 4px 0 0;
  z-index: 2;
`;

const BlockButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const BlockLabel = styled.div`
  position: absolute;
  top: -30px;
  left: 0;
  height: 30px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  background: #2563eb;
  color: white;
  font-size: 12px;
  border-radius: 4px 0 0 0;
  z-index: 2;
`;

const InsertBlockButton = styled.button`
  display: ${props => props.isPreview ? 'none' : 'flex'};
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border: 2px dashed #ddd;
  background: #f8f9fa;
  color: #666;
  margin: 8px 0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  gap: 8px;
  
  &:hover {
    border-color: #2563eb;
    color: #2563eb;
  }
`;

export const SimplifiedCanvas = ({ 
  template,
  viewMode = 'edit',
  isPreview = false,
  onBlockSelect = () => {}
}) => {
  const { 
    pageData = template?.data || [], 
    setPageData, 
    selectedBrickId, 
    setSelectedBrickId,
    addBrickToRoot,
    duplicateBrick,
    removeBrick,
    getPreviewData
  } = useBuilderContext();
  
  const { viewMode: contextViewMode } = useViewMode();
  const [showBlockSelector, setShowBlockSelector] = useState(false);
  const [insertPosition, setInsertPosition] = useState(null);
  
  const isPreviewMode = viewMode === 'preview';
  const displayData = useMemo(() => 
    isPreviewMode ? getPreviewData() : (pageData || []),
    [isPreviewMode, getPreviewData, pageData]
  );
  
  const handleBlockSelect = useCallback((blockId) => {
    if (!isPreviewMode) {
      setSelectedBrickId(blockId);
      onBlockSelect?.(blockId);
    }
  }, [isPreviewMode, setSelectedBrickId, onBlockSelect]);
  
  const handleAddBlockAtIndex = useCallback((index) => {
    setInsertPosition(index);
    setShowBlockSelector(true);
  }, []);
  
  const handleBlockTypeSelect = useCallback((blockType) => {
    if (insertPosition === 'end') {
      addBrickToRoot(blockType);
    } else if (typeof insertPosition === 'number') {
      const newBrick = {
        type: blockType,
        id: Math.random().toString(36).substr(2, 9),
        props: {}
      };
      
      const newPageData = [...displayData];
      newPageData.splice(insertPosition, 0, newBrick);
      setPageData(newPageData);
    }
    
    setShowBlockSelector(false);
    setInsertPosition(null);
  }, [insertPosition, displayData, addBrickToRoot, setPageData]);
  
  const renderBlock = useCallback((block, index) => {
    const BrickComponent = BrickRegistry[block.type]?.component;
    
    if (!BrickComponent) {
      console.warn(`No brick component found for type: ${block.type}`);
      return null;
    }

    return (
      <BlockWrapper 
        key={block.id || index}
        isPreview={isPreviewMode}
      >
        <BrickComponent
          brick={block}
          onSelect={handleBlockSelect}
          isSelected={selectedBrickId === block.id}
        />
        
        {!isPreviewMode && selectedBrickId === block.id && (
          <>
            <SelectedBlockOverlay />
            <BlockControls>
              <BlockLabel>
                {BrickRegistry[block.type]?.label || block.type}
              </BlockLabel>
              <BlockButton onClick={() => duplicateBrick(block.id)} title="Duplicate">
                <Copy size={14} />
              </BlockButton>
              <BlockButton onClick={() => removeBrick(block.id)} title="Delete">
                <Trash2 size={14} />
              </BlockButton>
            </BlockControls>
          </>
        )}
      </BlockWrapper>
    );
  }, [selectedBrickId, isPreviewMode, handleBlockSelect, duplicateBrick, removeBrick]);

  return (
    <>
      <CanvasWrapper viewMode={contextViewMode}>
        {displayData.map((block, index) => renderBlock(block, index))}
        
        {!isPreviewMode && (
          <InsertBlockButton 
            isPreview={isPreviewMode}
            onClick={() => handleAddBlockAtIndex(displayData.length)}
          >
            <Plus size={16} />
            Add Block Here
          </InsertBlockButton>
        )}
      </CanvasWrapper>
      
      <BlockSelectorModal 
        isOpen={showBlockSelector}
        onClose={() => setShowBlockSelector(false)}
        onBlockSelect={handleBlockTypeSelect}
      />
      
      <style jsx>{`
        .canvas-container {
          width: 100%;
          min-height: 100vh;
          background: #ffffff;
        }

        .canvas-container.mobile {
          max-width: 425px;
          margin: 0 auto;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }

        .block-wrapper {
          position: relative;
        }

        .block-wrapper.editable {
          cursor: pointer;
        }

        .block-wrapper.editable:hover {
          outline: 2px solid #3182ce;
        }

        .empty-canvas {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          color: #718096;
        }
      `}</style>
    </>
  );
};

export default SimplifiedCanvas;
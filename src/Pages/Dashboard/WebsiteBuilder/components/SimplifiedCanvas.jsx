// Create this file at: src/Pages/Dashboard/WebsiteBuilder/components/SimplifiedCanvas.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useBuilderContext } from '../context/BuilderContext';
import { useViewMode } from '../context/ViewModeContext';
import { BrickRegistry } from '../bricks/BrickRegistry';

// Import icons - assuming you have lucide-react installed
import { Plus, Settings, Copy, Trash2, Menu, Grid, Layout } from 'lucide-react';

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

const AddBlockButton = styled.button`
  display: ${props => props.isPreview ? 'none' : 'flex'};
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 12px;
  background: white;
  border: 2px dashed #ddd;
  border-radius: 4px;
  padding: 8px 16px;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  
  &:hover {
    border-color: #2563eb;
    color: #2563eb;
  }
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

// Add a modal component for block selection
const BlockSelectorModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 600px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  padding: 24px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const BlockGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

const BlockCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const BlockIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 8px;
  color: #2563eb;
`;

const BlockName = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const SimplifiedCanvas = () => {
  const { 
    pageData, 
    setPageData, 
    selectedBrickId, 
    setSelectedBrickId,
    addBrickToRoot,
    duplicateBrick,
    removeBrick,
    getPreviewData
  } = useBuilderContext();
  const { viewMode } = useViewMode();
  const [showBlockSelector, setShowBlockSelector] = useState(false);
  const [insertPosition, setInsertPosition] = useState(null);
  
  const isPreview = viewMode === 'preview';
  const data = isPreview ? getPreviewData() : pageData;
  
  const handleBlockSelect = (blockId) => {
    if (!isPreview) {
      setSelectedBrickId(blockId);
    }
  };
  
  const handleAddBlock = (position = 'end') => {
    setInsertPosition(position);
    setShowBlockSelector(true);
  };
  
  const handleAddBlockAtIndex = (index) => {
    setInsertPosition(index);
    setShowBlockSelector(true);
  };
  
  const handleBlockTypeSelect = (blockType) => {
    if (insertPosition === 'end') {
      addBrickToRoot(blockType);
    } else if (typeof insertPosition === 'number') {
      const newBrick = {
        type: blockType,
        id: Math.random().toString(36).substr(2, 9),
        props: {}
      };
      
      const newPageData = [...pageData];
      newPageData.splice(insertPosition, 0, newBrick);
      setPageData(newPageData);
    }
    
    setShowBlockSelector(false);
    setInsertPosition(null);
  };
  
  const blockTypes = [
    { type: 'hero', name: 'Hero', icon: <Layout /> },
    { type: 'featuresSection', name: 'Features', icon: <Grid /> },
    { type: 'navigation', name: 'Navigation', icon: <Menu /> },
    { type: 'title', name: 'Title', icon: <Settings /> },
    { type: 'text', name: 'Text', icon: <Settings /> },
    { type: 'image', name: 'Image', icon: <Settings /> }
  ];
  
  const renderBlock = (block, index) => {
    const isSelected = selectedBrickId === block.id;
    const BrickComponent = BrickRegistry[block.type]?.component;
    
    if (!BrickComponent) return null;
    
    return (
      <React.Fragment key={block.id}>
        {!isPreview && (
          <InsertBlockButton 
            isPreview={isPreview}
            onClick={() => handleAddBlockAtIndex(index)}
          >
            <Plus size={16} />
            Add Block Here
          </InsertBlockButton>
        )}
        
        <BlockWrapper
          isPreview={isPreview}
          onClick={() => handleBlockSelect(block.id)}
        >
          {isSelected && !isPreview && (
            <>
              <SelectedBlockOverlay />
              <BlockLabel>
                {BrickRegistry[block.type]?.label || block.type}
              </BlockLabel>
              <BlockControls>
                <BlockButton onClick={() => duplicateBrick(block.id)} title="Duplicate">
                  <Copy size={16} />
                </BlockButton>
                <BlockButton onClick={() => removeBrick(block.id)} title="Delete">
                  <Trash2 size={16} />
                </BlockButton>
              </BlockControls>
            </>
          )}
          <BrickComponent
            brick={block}
            onSelect={handleBlockSelect}
          />
        </BlockWrapper>
      </React.Fragment>
    );
  };
  
  return (
    <>
      <CanvasWrapper viewMode={viewMode}>
        {data.map((block, index) => renderBlock(block, index))}
        
        {!isPreview && (
          <>
            <InsertBlockButton 
              isPreview={isPreview}
              onClick={() => handleAddBlockAtIndex(data.length)}
            >
              <Plus size={16} />
              Add Block Here
            </InsertBlockButton>
            
            <AddBlockButton
              isPreview={isPreview}
              onClick={() => handleAddBlock('end')}
            >
              <Plus size={16} />
              Add New Block
            </AddBlockButton>
          </>
        )}
      </CanvasWrapper>
      
      <BlockSelectorModal isOpen={showBlockSelector}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Select Block Type</ModalTitle>
            <CloseButton onClick={() => setShowBlockSelector(false)}>&times;</CloseButton>
          </ModalHeader>
          
          <BlockGrid>
            {blockTypes.map(block => (
              <BlockCard 
                key={block.type}
                onClick={() => handleBlockTypeSelect(block.type)}
              >
                <BlockIcon>
                  {block.icon}
                </BlockIcon>
                <BlockName>{block.name}</BlockName>
              </BlockCard>
            ))}
          </BlockGrid>
        </ModalContent>
      </BlockSelectorModal>
    </>
  );
};

export default SimplifiedCanvas;
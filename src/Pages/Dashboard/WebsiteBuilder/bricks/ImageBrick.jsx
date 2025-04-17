import React, { useState } from 'react';
import styled from 'styled-components';
import { useBuilderContext } from '../context/BuilderContext';
import { useViewMode } from '../context/ViewModeContext';
import { Image, Edit } from 'lucide-react';
import ImageGallery from '../components/ImageGallery';

const ImageContainer = styled.div`
  text-align: ${props => props.alignment || 'left'};
  margin-top: ${props => props.marginTop || '0'};
  margin-bottom: ${props => props.marginBottom || '16px'};
  margin-left: ${props => props.marginLeft || '0'};
  margin-right: ${props => props.marginRight || '0'};
`;

const StyledImage = styled.img`
  max-width: 100%;
  width: ${props => props.width || 'auto'};
  height: ${props => props.height || 'auto'};
  border-radius: ${props => props.borderRadius || '0'};
  border: ${props => props.border || 'none'};
  box-shadow: ${props => props.boxShadow || 'none'};
  object-fit: ${props => props.objectFit || 'cover'};
`;

const ImageActions = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.2s;
`;

const ImageAction = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: #f5f7fa;
  }
`;

export function ImageBrickComponent({ brick, onSelect, isSelected }) {
  const { id, props = {} } = brick;
  const { updateBrickProps } = useBuilderContext();
  const { viewMode } = useViewMode();
  const [showGallery, setShowGallery] = useState(false);
  
  const isPreview = viewMode === 'preview';
  
  const handleClick = (e) => {
    e.stopPropagation();
    onSelect?.(id);
  };
  
  const handleImageSelect = (imageSrc) => {
    updateBrickProps(id, { src: imageSrc });
  };
  
  const handleEditClick = (e) => {
    e.stopPropagation();
    setShowGallery(true);
  };
  
  return (
    <div 
      style={{ 
        position: 'relative',
        padding: '4px',
        border: isSelected ? '1px dashed #2563eb' : 'none',
        borderRadius: '4px',
        overflow: 'visible'
      }}
      onClick={handleClick}
    >
      <div style={{ position: 'relative' }}>
        <ImageContainer
          alignment={props.alignment}
          marginTop={props.marginTop}
          marginBottom={props.marginBottom}
          marginLeft={props.marginLeft}
          marginRight={props.marginRight}
        >
          <StyledImage
            src={props.src || '/api/placeholder/800/500'}
            alt={props.alt || 'Image description'}
            width={props.width}
            height={props.height}
            borderRadius={props.borderRadius}
            border={props.border}
            boxShadow={props.boxShadow}
            objectFit={props.objectFit}
          />
        </ImageContainer>
        
        {isSelected && !isPreview && (
          <ImageActions style={{ opacity: 1 }}>
            <ImageAction onClick={handleEditClick} title="Change image">
              <Edit size={16} />
            </ImageAction>
          </ImageActions>
        )}
      </div>
      
      {showGallery && (
        <ImageGallery
          isOpen={true}
          onClose={() => setShowGallery(false)}
          onSelect={handleImageSelect}
        />
      )}
    </div>
  );
}

export const ImageBrickInspector = {
  displayName: 'Image',
  props: {
    src: { type: 'text', label: 'Image URL', defaultValue: '/api/placeholder/800/500' },
    alt: { type: 'text', label: 'Alt Text', defaultValue: 'Image description' },
    width: { type: 'text', label: 'Width', defaultValue: 'auto' },
    height: { type: 'text', label: 'Height', defaultValue: 'auto' },
    alignment: { type: 'select', label: 'Alignment', options: ['left', 'center', 'right'], defaultValue: 'left' },
    borderRadius: { type: 'number', label: 'Border Radius', defaultValue: 0, unit: 'px' },
    border: { type: 'text', label: 'Border', defaultValue: 'none' },
    boxShadow: { type: 'text', label: 'Box Shadow', defaultValue: 'none' },
    objectFit: { type: 'select', label: 'Object Fit', options: ['cover', 'contain', 'fill', 'none', 'scale-down'], defaultValue: 'cover' },
    marginTop: { type: 'number', label: 'Margin Top', defaultValue: 0, unit: 'px' },
    marginBottom: { type: 'number', label: 'Margin Bottom', defaultValue: 16, unit: 'px' },
    marginLeft: { type: 'number', label: 'Margin Left', defaultValue: 0, unit: 'px' },
    marginRight: { type: 'number', label: 'Margin Right', defaultValue: 0, unit: 'px' },
  }
};
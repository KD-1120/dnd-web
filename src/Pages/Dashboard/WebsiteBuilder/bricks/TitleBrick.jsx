// src/Pages/Dashboard/WebsiteBuilder/bricks/TitleBrick.jsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useBuilderContext } from '../context/BuilderContext';
import { useViewMode } from '../context/ViewModeContext';

const StyledHeading = styled.h2`
  font-family: ${props => props.fontFamily || 'Inter, sans-serif'};
  font-size: ${props => props.fontSize || '32px'};
  font-weight: ${props => props.fontWeight || '700'};
  color: ${props => props.color || '#1a202c'};
  text-align: ${props => props.alignment || 'left'};
  margin-top: ${props => props.marginTop || '0'};
  margin-bottom: ${props => props.marginBottom || '24px'};
  letter-spacing: ${props => props.letterSpacing || 'normal'};
  line-height: ${props => props.lineHeight || '1.2'};
  max-width: ${props => props.maxWidth || 'none'};
  transition: all 0.3s ease;
  outline: none;
`;

export function TitleBrickComponent({ brick, onSelect, isSelected }) {
  const { id, props = {} } = brick;
  const { updateBrickProps } = useBuilderContext();
  const { viewMode } = useViewMode();
  const [isEditing, setIsEditing] = useState(false);
  const headingRef = useRef(null);
  
  const isPreview = viewMode === 'preview';
  
  const handleTextChange = () => {
    if (headingRef.current) {
      updateBrickProps(id, { text: headingRef.current.textContent });
    }
  };
  
  const handleClick = (e) => {
    e.stopPropagation();
    onSelect?.(id);
    
    if (!isPreview && isSelected) {
      setIsEditing(true);
    }
  };
  
  const handleBlur = () => {
    setIsEditing(false);
    handleTextChange();
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      headingRef.current.blur();
    }
  };
  
  useEffect(() => {
    if (isEditing && headingRef.current) {
      headingRef.current.focus();
      // Set cursor at end of text
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(headingRef.current);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [isEditing]);
  
  return (
    <div 
      style={{ 
        position: 'relative',
        padding: '4px',
        border: isSelected ? '1px dashed #2563eb' : 'none',
        borderRadius: '4px'
      }}
      onClick={handleClick}
    >
      <StyledHeading 
        ref={headingRef}
        contentEditable={isEditing && !isPreview}
        suppressContentEditableWarning={true}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        fontFamily={props.fontFamily}
        fontSize={props.fontSize}
        fontWeight={props.fontWeight}
        color={props.color}
        alignment={props.alignment}
        marginTop={props.marginTop}
        marginBottom={props.marginBottom}
        letterSpacing={props.letterSpacing}
        lineHeight={props.lineHeight}
        maxWidth={props.maxWidth}
      >
        {props.text || 'Add your title here'}
      </StyledHeading>
    </div>
  );
}

export const TitleBrickInspector = {
  displayName: 'Title',
  props: {
    text: { type: 'text', label: 'Title Text', defaultValue: 'Add your title here' },
    fontSize: { type: 'number', label: 'Font Size', defaultValue: 32, unit: 'px' },
    fontWeight: { type: 'select', label: 'Font Weight', options: ['400', '500', '600', '700', '800', '900'], defaultValue: '700' },
    color: { type: 'colorpicker', label: 'Color', defaultValue: '#1a202c' },
    alignment: { type: 'select', label: 'Alignment', options: ['left', 'center', 'right'], defaultValue: 'left' },
    fontFamily: { type: 'select', label: 'Font Family', options: ['Inter, sans-serif', 'Georgia, serif', 'Montserrat, sans-serif', 'Roboto, sans-serif', 'Open Sans, sans-serif'], defaultValue: 'Inter, sans-serif' },
    marginTop: { type: 'number', label: 'Margin Top', defaultValue: 0, unit: 'px' },
    marginBottom: { type: 'number', label: 'Margin Bottom', defaultValue: 24, unit: 'px' },
    letterSpacing: { type: 'text', label: 'Letter Spacing', defaultValue: 'normal' },
    lineHeight: { type: 'number', label: 'Line Height', defaultValue: 1.2 },
    maxWidth: { type: 'text', label: 'Max Width', defaultValue: 'none' },
  }
};
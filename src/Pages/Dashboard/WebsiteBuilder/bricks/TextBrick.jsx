// src/Pages/Dashboard/WebsiteBuilder/bricks/TextBrick.jsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useBuilderContext } from '../context/BuilderContext';
import { useViewMode } from '../context/ViewModeContext';

const StyledParagraph = styled.p`
  font-family: ${props => props.fontFamily || 'Inter, sans-serif'};
  font-size: ${props => props.fontSize || '16px'};
  font-weight: ${props => props.fontWeight || '400'};
  color: ${props => props.color || '#4a5568'};
  text-align: ${props => props.alignment || 'left'};
  margin-top: ${props => props.marginTop || '0'};
  margin-bottom: ${props => props.marginBottom || '16px'};
  line-height: ${props => props.lineHeight || '1.6'};
  max-width: ${props => props.maxWidth || 'none'};
  transition: all 0.3s ease;
  outline: none;
`;

export function TextBrickComponent({ brick, onSelect, isSelected }) {
  const { id, props = {} } = brick;
  const { updateBrickProps } = useBuilderContext();
  const { viewMode } = useViewMode();
  const [isEditing, setIsEditing] = useState(false);
  const textRef = useRef(null);
  
  const isPreview = viewMode === 'preview';
  
  const handleTextChange = () => {
    if (textRef.current) {
      updateBrickProps(id, { text: textRef.current.textContent });
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
  
  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
      // Set cursor at end of text
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(textRef.current);
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
      <StyledParagraph 
        ref={textRef}
        contentEditable={isEditing && !isPreview}
        suppressContentEditableWarning={true}
        onBlur={handleBlur}
        fontFamily={props.fontFamily}
        fontSize={props.fontSize}
        fontWeight={props.fontWeight}
        color={props.color}
        alignment={props.alignment}
        marginTop={props.marginTop}
        marginBottom={props.marginBottom}
        lineHeight={props.lineHeight}
        maxWidth={props.maxWidth}
      >
        {props.text || 'Add your text here. This can be a paragraph, description, or any other content that helps describe your event.'}
      </StyledParagraph>
    </div>
  );
}


export const TextBrickInspector = {
  displayName: 'Text',
  props: {
    text: { type: 'textarea', label: 'Content', defaultValue: 'Add your text here. This can be a paragraph, description, or any other content that helps describe your event.' },
    fontSize: { type: 'number', label: 'Font Size', defaultValue: 16, unit: 'px' },
    fontWeight: { type: 'select', label: 'Font Weight', options: ['300', '400', '500', '600', '700'], defaultValue: '400' },
    color: { type: 'colorpicker', label: 'Color', defaultValue: '#4a5568' },
    alignment: { type: 'select', label: 'Alignment', options: ['left', 'center', 'right', 'justify'], defaultValue: 'left' },
    fontFamily: { type: 'select', label: 'Font Family', options: ['Inter, sans-serif', 'Georgia, serif', 'Montserrat, sans-serif', 'Roboto, sans-serif', 'Open Sans, sans-serif'], defaultValue: 'Inter, sans-serif' },
    marginTop: { type: 'number', label: 'Margin Top', defaultValue: 0, unit: 'px' },
    marginBottom: { type: 'number', label: 'Margin Bottom', defaultValue: 16, unit: 'px' },
    lineHeight: { type: 'number', label: 'Line Height', defaultValue: 1.6 },
    maxWidth: { type: 'text', label: 'Max Width', defaultValue: 'none' },
  }
};
// src/Pages/Dashboard/WebsiteBuilder/bricks/ButtonBrick.jsx
import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  font-family: ${props => props.fontFamily || 'Inter, sans-serif'};
  font-size: ${props => props.fontSize || '16px'};
  font-weight: ${props => props.fontWeight || '600'};
  color: ${props => props.color || '#ffffff'};
  background-color: ${props => props.bgColor || '#3182ce'};
  border: ${props => `${props.borderWidth || '1px'} solid ${props.borderColor || props.bgColor || '#3182ce'}`};
  border-radius: ${props => props.borderRadius || '4px'};
  padding: ${props => props.padding || '12px 24px'};
  display: inline-block;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  margin-top: ${props => props.marginTop || '0'};
  margin-bottom: ${props => props.marginBottom || '0'};
  margin-left: ${props => props.marginLeft || '0'};
  margin-right: ${props => props.marginRight || '0'};
  box-shadow: ${props => props.boxShadow || 'none'};
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const ButtonContainer = styled.div`
  display: ${props => props.display || 'inline-block'};
  text-align: ${props => props.alignment || 'left'};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

export function ButtonBrickComponent({ brick, onSelect, isSelected }) {
  const { id, props = {} } = brick;
  
  return (
    <div 
      style={{ 
        position: 'relative',
        padding: '4px',
        border: isSelected ? '1px dashed #2563eb' : 'none',
        borderRadius: '4px'
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(id);
      }}
    >
      <ButtonContainer
        display={props.display}
        alignment={props.alignment}
        fullWidth={props.fullWidth}
      >
        <StyledButton
          as={props.link ? 'a' : 'button'}
          href={props.link}
          target={props.openInNewTab ? '_blank' : undefined}
          fontFamily={props.fontFamily}
          fontSize={props.fontSize}
          fontWeight={props.fontWeight}
          color={props.color}
          bgColor={props.bgColor}
          borderWidth={props.borderWidth}
          borderColor={props.borderColor}
          borderRadius={props.borderRadius}
          padding={props.padding}
          marginTop={props.marginTop}
          marginBottom={props.marginBottom}
          marginLeft={props.marginLeft}
          marginRight={props.marginRight}
          boxShadow={props.boxShadow}
        >
          {props.label || 'Button'}
        </StyledButton>
      </ButtonContainer>
    </div>
  );
}

export const ButtonBrickInspector = {
  displayName: 'Button',
  props: {
    label: { type: 'text', label: 'Button Text', defaultValue: 'Button' },
    link: { type: 'text', label: 'Link URL', defaultValue: '#' },
    openInNewTab: { type: 'boolean', label: 'Open in New Tab', defaultValue: false },
    fontSize: { type: 'number', label: 'Font Size', defaultValue: 16, unit: 'px' },
    fontWeight: { type: 'select', label: 'Font Weight', options: ['400', '500', '600', '700'], defaultValue: '600' },
    color: { type: 'colorpicker', label: 'Text Color', defaultValue: '#ffffff' },
    bgColor: { type: 'colorpicker', label: 'Background Color', defaultValue: '#3182ce' },
    borderWidth: { type: 'number', label: 'Border Width', defaultValue: 1, unit: 'px' },
    borderColor: { type: 'colorpicker', label: 'Border Color', defaultValue: '#3182ce' },
    borderRadius: { type: 'number', label: 'Border Radius', defaultValue: 4, unit: 'px' },
    padding: { type: 'text', label: 'Padding', defaultValue: '12px 24px' },
    fontFamily: { type: 'select', label: 'Font Family', options: ['Inter, sans-serif', 'Georgia, serif', 'Montserrat, sans-serif', 'Roboto, sans-serif', 'Open Sans, sans-serif'], defaultValue: 'Inter, sans-serif' },
    alignment: { type: 'select', label: 'Alignment', options: ['left', 'center', 'right'], defaultValue: 'left' },
    fullWidth: { type: 'boolean', label: 'Full Width', defaultValue: false },
    display: { type: 'select', label: 'Display', options: ['inline-block', 'block'], defaultValue: 'inline-block' },
    marginTop: { type: 'number', label: 'Margin Top', defaultValue: 0, unit: 'px' },
    marginBottom: { type: 'number', label: 'Margin Bottom', defaultValue: 0, unit: 'px' },
    marginLeft: { type: 'number', label: 'Margin Left', defaultValue: 0, unit: 'px' },
    marginRight: { type: 'number', label: 'Margin Right', defaultValue: 0, unit: 'px' },
    boxShadow: { type: 'text', label: 'Box Shadow', defaultValue: 'none' },
  }
};
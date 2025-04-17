// src/Pages/Dashboard/WebsiteBuilder/bricks/ContainerBrick.jsx
import React from 'react';
import styled from 'styled-components';
import { useBuilderContext } from '../context/BuilderContext';
import { BrickRegistry } from './BrickRegistry';

const StyledContainer = styled.div`
  width: ${props => props.width || '100%'};
  max-width: ${props => props.maxWidth || 'none'};
  padding-top: ${props => props.paddingTop || '0'};
  padding-bottom: ${props => props.paddingBottom || '0'};
  padding-left: ${props => props.paddingLeft || '0'};
  padding-right: ${props => props.paddingRight || '0'};
  margin-top: ${props => props.marginTop || '0'};
  margin-bottom: ${props => props.marginBottom || '0'};
  margin-left: ${props => props.marginLeft || '0'};
  margin-right: ${props => props.marginRight || '0'};
  background-color: ${props => props.bgColor || 'transparent'};
  background-image: ${props => props.bgImage ? `url(${props.bgImage})` : 'none'};
  background-size: cover;
  background-position: center;
  border-radius: ${props => props.borderRadius || '0'};
  border: ${props => props.border || 'none'};
  box-shadow: ${props => props.boxShadow || 'none'};
  display: ${props => props.display || 'block'};
  flex-direction: ${props => props.flexDirection || 'row'};
  justify-content: ${props => props.justifyContent || 'flex-start'};
  align-items: ${props => props.alignItems || 'stretch'};
  text-align: ${props => props.textAlign || 'left'};
  overflow: ${props => props.overflow || 'visible'};
`;

export function ContainerBrickComponent({ brick, onSelect, isSelected }) {
  const { id, props = {}, components = [] } = brick;
  const { selectedBrickId } = useBuilderContext();
  
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
      <StyledContainer
        width={props.width}
        maxWidth={props.maxWidth}
        paddingTop={props.paddingTop}
        paddingBottom={props.paddingBottom}
        paddingLeft={props.paddingLeft}
        paddingRight={props.paddingRight}
        marginTop={props.marginTop}
        marginBottom={props.marginBottom}
        marginLeft={props.marginLeft}
        marginRight={props.marginRight}
        bgColor={props.bgColor}
        bgImage={props.bgImage}
        borderRadius={props.borderRadius}
        border={props.border}
        boxShadow={props.boxShadow}
        display={props.display}
        flexDirection={props.flexDirection}
        justifyContent={props.justifyContent}
        alignItems={props.alignItems}
        textAlign={props.textAlign}
        overflow={props.overflow}
      >
        {components.map(component => {
          const ComponentType = BrickRegistry[component.type]?.component;
          return ComponentType ? (
            <ComponentType
              key={component.id}
              brick={component}
              onSelect={onSelect}
              isSelected={selectedBrickId === component.id}
            />
          ) : null;
        })}
      </StyledContainer>
    </div>
  );
}

export const ContainerBrickInspector = {
  displayName: 'Container',
  props: {
    width: { type: 'text', label: 'Width', defaultValue: '100%' },
    maxWidth: { type: 'text', label: 'Max Width', defaultValue: 'none' },
    paddingTop: { type: 'number', label: 'Padding Top', defaultValue: 0, unit: 'px' },
    paddingBottom: { type: 'number', label: 'Padding Bottom', defaultValue: 0, unit: 'px' },
    paddingLeft: { type: 'number', label: 'Padding Left', defaultValue: 0, unit: 'px' },
    paddingRight: { type: 'number', label: 'Padding Right', defaultValue: 0, unit: 'px' },
    marginTop: { type: 'number', label: 'Margin Top', defaultValue: 0, unit: 'px' },
    marginBottom: { type: 'number', label: 'Margin Bottom', defaultValue: 0, unit: 'px' },
    marginLeft: { type: 'text', label: 'Margin Left', defaultValue: '0' },
    marginRight: { type: 'text', label: 'Margin Right', defaultValue: '0' },
    bgColor: { type: 'colorpicker', label: 'Background Color', defaultValue: 'transparent' },
    bgImage: { type: 'text', label: 'Background Image URL', defaultValue: '' },
    borderRadius: { type: 'number', label: 'Border Radius', defaultValue: 0, unit: 'px' },
    border: { type: 'text', label: 'Border', defaultValue: 'none' },
    boxShadow: { type: 'text', label: 'Box Shadow', defaultValue: 'none' },
    display: { type: 'select', label: 'Display', options: ['block', 'flex', 'grid', 'inline-block'], defaultValue: 'block' },
    flexDirection: { type: 'select', label: 'Flex Direction', options: ['row', 'column', 'row-reverse', 'column-reverse'], defaultValue: 'row' },
    justifyContent: { type: 'select', label: 'Justify Content', options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'], defaultValue: 'flex-start' },
    alignItems: { type: 'select', label: 'Align Items', options: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'], defaultValue: 'stretch' },
    textAlign: { type: 'select', label: 'Text Align', options: ['left', 'center', 'right', 'justify'], defaultValue: 'left' },
    overflow: { type: 'select', label: 'Overflow', options: ['visible', 'hidden', 'scroll', 'auto'], defaultValue: 'visible' },
  }
};
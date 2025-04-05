import React, { useState } from 'react';
import styled from 'styled-components';
import { useBuilderContext } from '../context/BuilderContext';
import { BrickRegistry } from './BrickRegistry';
import { Plus } from 'lucide-react';
import ColumnBrickComponent from './ColumnBrick'; 
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.h2`
  margin: 0 0 15px;
  font-size: 1.25rem;
  color: #333;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const BrickCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  border: 1px solid #d5dadf;
  border-radius: 5px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  &:hover {
    background: #e6e9ec;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  svg {
    margin-bottom: 0.5rem;
    color: #0073aa;
  }
  span {
    font-size: 14px;
    color: #444;
  }
`;

const ContainerStyled = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${(props) => `${props.gap || 20}px`};
  padding: ${(props) => props.padding || '20px'};
  width: 100%;
  box-sizing: border-box;
  position: relative;
`;

const AddButton = styled.button`
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 10;
  
  ${ContainerStyled}:hover & {
    opacity: 1;
  }

  &:hover {
    background: #0073aa;
    border-color: #0073aa;
    color: white;
  }
`;

// ContainerBrick Component
export function ContainerBrickComponent({ brick, onSelect }) {
  const { id, components = [], props } = brick;
  const { 
    selectedBrickId, 
    addNestedComponent, 
    updateMultipleNestedProps 
  } = useBuilderContext();
  const isSelected = selectedBrickId === id;

  const redistributeColumnWidths = (columnComponents) => {
    const count = columnComponents.length;
    const width = `${100 / count}%`;
    
    return columnComponents.map(column => ({
      ...column,
      props: {
        ...column.props,
        width: width
      }
    }));
  };

  const handleAddColumn = () => {
    // First update existing columns
    updateMultipleNestedProps(id, components => redistributeColumnWidths([
      ...components,
      { props: {} } // Placeholder for width calculation
    ]));
    
    // Then add new column
    addNestedComponent(id, 'column', {
      width: `${100 / (components.length + 1)}%`,
      bgColor: '#ffffff',
      padding: '1rem',
      height: '200px'
    });
  };

  return (
    <ContainerStyled
      {...props}
      style={{ boxShadow: isSelected ? '0 0 0 2px #0073aa' : 'none' }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(id);
      }}
    >
      {components.map((columnBrick) => (
        <ColumnBrickComponent
          key={columnBrick.id}
          brick={columnBrick}
          onSelect={onSelect}
        />
      ))}
      <AddButton onClick={handleAddColumn}>
        <Plus size={14} />
      </AddButton>
    </ContainerStyled>
  );
}

export const ContainerInspector = {
  displayName: 'Container',
  getInspectorProps: (brick) => ({
    id: brick.id,
    displayName: 'Container',
    props: {
      bgColor: { type: 'colorpicker', label: 'Background Color', defaultValue: '#ffffff' },
      bgImage: { type: 'text', label: 'Background Image URL', defaultValue: '' },
      textColor: { type: 'colorpicker', label: 'Text Color', defaultValue: '#000000' },
      paddingTop: { type: 'number', label: 'Padding Top', defaultValue: 1, unit: 'px' },
      paddingRight: { type: 'number', label: 'Padding Right', defaultValue: 1, unit: 'px' },
      paddingBottom: { type: 'number', label: 'Padding Bottom', defaultValue: 1, unit: 'px' },
      paddingLeft: { type: 'number', label: 'Padding Left', defaultValue: 1, unit: 'px' },
      marginTop: { type: 'number', label: 'Margin Top', defaultValue: 1, unit: 'px' },
      marginRight: { type: 'number', label: 'Margin Right', defaultValue: 1, unit: 'px' },
      marginBottom: { type: 'number', label: 'Margin Bottom', defaultValue: 1, unit: 'px' },
      marginLeft: { type: 'number', label: 'Margin Left', defaultValue: 1, unit: 'px' },
      gap: { type: 'number', label: 'Gap', defaultValue: 0, unit: 'rem' },
      borderRadiusTop: { type: 'number', label: 'Border Radius Top', defaultValue: 0, unit: 'px' },
      borderRadiusRight: { type: 'number', label: 'Border Radius Right', defaultValue: 0, unit: 'px' },
      borderRadiusBottom: { type: 'number', label: 'Border Radius Bottom', defaultValue: 0, unit: 'px' },
      borderRadiusLeft: { type: 'number', label: 'Border Radius Left', defaultValue: 0, unit: 'px' },
      className: { type: 'text', label: 'Custom CSS Class', defaultValue: '' },
    },
  }),
};


export default ContainerBrickComponent;
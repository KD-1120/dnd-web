import React from 'react';
import styled from 'styled-components';
import { useBuilderContext } from '../context/BuilderContext';
import ButtonBrickComponent from './ButtonBrick';

const ButtonGroupWrapper = styled.div`
  position: relative;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  display: flex;
  align-items: center;
`;

const PlusButton = styled.button`
  display: inline-block;
  font-size: 16px;
  padding: 8px 12px;
  border: 1px dashed #007bff;
  background: transparent;
  color: #007bff;
  border-radius: 4px;
  cursor: pointer;
`;

export function ButtonGroupBrickComponent({ brick, onSelect }) {
  const { id, props = {}, components = [] } = brick;
  const { 
    selectedBrickId, 
    setSelectedBrickId, 
    addNestedComponent, 
    removeNestedComponent,
    updateNestedBrickProps 
  } = useBuilderContext();
  const isSelected = selectedBrickId === id;

  const handleAddButton = () => {
    addNestedComponent(id, 'button', {
      label: 'New Button',
      bgColor: 'red',
      color: 'white',
      fontSize: '14px',
      link: '#'
    });
  };

  const handleButtonSelect = (buttonId) => {
    setSelectedBrickId(buttonId);
  };

  return (
    <ButtonGroupWrapper
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      style={{
        boxShadow: isSelected ? '0 0 0 2px #007bff' : 'none',
        justifyContent: props.alignment || 'left'
      }}
    >
      {components.map((buttonBrick) => (
        <ButtonBrickComponent
          key={buttonBrick.id}
          brick={buttonBrick}
          onSelect={() => handleButtonSelect(buttonBrick.id)}
          onRemove={() => removeNestedComponent(id, buttonBrick.id)}
        />
      ))}
      <PlusButton
        onClick={(e) => {
          e.stopPropagation();
          handleAddButton();
        }}
      >
        +
      </PlusButton>
    </ButtonGroupWrapper>
  );
}

export const ButtonGroupInspector = {
  displayName: 'Button Group',
  getInspectorProps: (brick, selectedBrickId) => {
    const selectedButton = brick.components?.find(comp => comp.id === selectedBrickId);
    
    if (selectedButton) {
      return {
        id: selectedButton.id,
        displayName: 'Button',
        props: selectedButton.props
      };
    }

    return {
      id: brick.id,
      displayName: 'Button Group',
      props: {
        alignment: { 
          type: 'select', 
          label: 'Group Alignment', 
          options: ['left', 'center', 'right'], 
          defaultValue: 'left' 
        }
      }
    };
  }
};

export default ButtonGroupBrickComponent;

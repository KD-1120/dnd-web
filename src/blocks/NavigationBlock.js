import React from 'react';
import styled from 'styled-components';
import { useBuilderContext } from '../context/BuilderContext';
import { useViewMode } from '../context/ViewModeContext';
import { PlusCircle, Trash2 } from 'lucide-react';
import { BrickRegistry } from '../bricks/BrickRegistry';

// Styled components matching WebsiteNavbar's aesthetic
const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: ${props => props.alignment || 'center'};
  padding: ${props => props.padding}rem;
  background-color: ${props => props.backgroundColor || 'white'};
  width: 100%;
  position: ${props => props.position === 'fixed' ? 'fixed' : 'relative'};
  top: ${props => props.position === 'fixed' ? '0' : 'auto'};
  z-index: 1030;
  border-bottom: 1px solid #e5e7eb;
`;

const NavSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.spacing}rem;
  flex-direction: ${props => props.direction || 'row'};
`;

const AddButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 8px;
  color: #007bff;
  &:hover {
    color: #0056b3;
  }
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 4px;
  color: #dc3545;
  &:hover {
    color: #bd2130;
  }
`;

export function NavigationBlockComponent({ brick, onSelect }) {
  const { id, props, components = [] } = brick;
  const { selectedBrickId, addNestedComponent, removeNestedComponent } = useBuilderContext();
  const { viewMode } = useViewMode();

  const isSelected = selectedBrickId === id;
  const isPreview = viewMode === 'preview';

  // Split components into left and right sections
  const leftComponents = components.filter(c => c.props?.section === 'left' || !c.props?.section);
  const rightComponents = components.filter(c => c.props?.section === 'right');

  // Function to add components based on section
  const handleAdd = (section) => {
    if (section === 'left') {
      addNestedComponent(id, 'links', {
        label: 'New Link',
        link: '#',
        section: section,
        color: '#4b5563',
        padding: '0',
        margin: '0',
      });
    } else {
      addNestedComponent(id, 'button', {
        label: 'New Button',
        section: section,
        variant: 'primary',
        size: 'medium',
      });
    }
  };

  // Function to delete components
  const handleDelete = (componentId) => {
    removeNestedComponent(id, componentId);
  };

  return (
    <NavContainer
      alignment={props.alignment || 'center'}
      padding={props.padding || 1} // 16px ≈ 1rem
      backgroundColor={props.backgroundColor || 'white'}
      position={props.position || 'default'}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      style={{ border: isSelected ? '2px solid #007bff' : 'none' }}
    >
      {/* Left Section */}
      <NavSection spacing={props.spacing || 1.5} direction={props.direction || 'row'}>
        {leftComponents.map((component) => {
          const BrickComponent = BrickRegistry[component.type]?.component;
          return BrickComponent ? (
            <BrickComponent
              key={component.id}
              brick={component}
              onSelect={() => onSelect?.(component.id)}
              onDelete={() => handleDelete(component.id)}
            />
          ) : null;
        })}
        {!isPreview && isSelected && (
          <AddButton
            onClick={(e) => {
              e.stopPropagation();
              handleAdd('left');
            }}
            title="Add Link"
          >
            <PlusCircle size={16} />
          </AddButton>
        )}
      </NavSection>

      {/* Right Section */}
      <NavSection spacing={props.spacing || 1.5} direction={props.direction || 'row'}>
        {rightComponents.map((component) => {
          const BrickComponent = BrickRegistry[component.type]?.component;
          return BrickComponent ? (
            <BrickComponent
              key={component.id}
              brick={component}
              onSelect={() => onSelect?.(component.id)}
              onDelete={() => handleDelete(component.id)}
            />
          ) : null;
        })}
        {!isPreview && isSelected && (
          <AddButton
            onClick={(e) => {
              e.stopPropagation();
              handleAdd('right');
            }}
            title="Add Button"
          >
            <PlusCircle size={16} />
          </AddButton>
        )}
      </NavSection>
    </NavContainer>
  );
}

export const NavigationInspector = {
  displayName: 'Navigation',
  getInspectorProps: (brick, selectedBrickId) => {
    const selectedComponent = brick.components?.find(comp => comp.id === selectedBrickId);
    if (selectedComponent) {
      const componentInspector = BrickRegistry[selectedComponent.type]?.inspector;
      return componentInspector?.getInspectorProps?.(selectedComponent, selectedBrickId) || {
        id: selectedComponent.id,
        displayName: BrickRegistry[selectedComponent.type]?.label || 'Component',
        props: selectedComponent.props,
      };
    }

    return {
      id: brick.id,
      displayName: 'Navigation',
      props: {
        direction: {
          type: 'select',
          label: 'Layout Direction',
          options: ['row', 'column'],
          defaultValue: 'row',
          section: 'Layout',
        },
        alignment: {
          type: 'select',
          label: 'Alignment',
          options: ['flex-start', 'center', 'flex-end'],
          defaultValue: 'center',
          section: 'Layout',
        },
        spacing: {
          type: 'number',
          label: 'Spacing',
          defaultValue: 1.5, // 24px ≈ 1.5rem
          unit: 'rem',
          section: 'Layout',
        },
        padding: {
          type: 'number',
          label: 'Padding',
          defaultValue: 1,
          unit: 'rem',
          section: 'Layout',
        },
        position: {
          type: 'select',
          label: 'Position',
          options: ['default', 'fixed'],
          defaultValue: 'default',
          section: 'Layout',
        },
        backgroundColor: {
          type: 'colorpicker',
          label: 'Background Color',
          defaultValue: 'white',
          section: 'Style',
        },
      },
    };
  },
};

export default NavigationBlockComponent;
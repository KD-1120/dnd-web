import React, { useState } from 'react';
import styled from 'styled-components';
import { useBuilderContext } from '../context/BuilderContext';
import { BrickRegistry } from './BrickRegistry';
import { Plus, Folder, Trash2 } from 'lucide-react';
import { Modal } from '../components/common/Modals';
import { useViewMode } from '../context/ViewModeContext';
import { PreviewWrapper } from '../components/PreviewWrapper';

// Styled Components
const ColumnStyled = styled.div`
  display: flex;
  flex-direction: ${(props) => props.direction || 'column'};
  background-color: ${(props) => props.bgColor || '#ffffff'};
  width: ${(props) => props.width || '100%'};
  min-height: ${(props) => props.height || '150px'};
  padding: ${(props) => props.padding || '1rem'};
  border-radius: ${(props) => `${props.borderRadius || 0}px`};
  border: 1px solid #eee;
  box-sizing: border-box;
  gap: ${(props) => `${props.gap || 0}px`};
`;

const PlaceholderUI = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
  color: #999;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  justify-content: center;
`;

const ActionButton = styled.button`
  background: ${(props) => props.color || '#0073aa'};
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
  
  &:hover {
    background: ${(props) => props.hoverColor || '#005f8d'};
    transform: scale(1.1);
  }
`;

// Simple Modal implementation for adding bricks
const PlusModal = ({ isOpen, onClose, onAdd }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [columnCount, setColumnCount] = useState(1);
  const allowedBricks = ['column', 'container', 'heading', 'image', 'title', 'icon', 'text'];

  const handleAdd = () => {
    if (selectedType) {
      onAdd(selectedType, selectedType === 'column' ? columnCount : 1);
      setSelectedType(null);
      setColumnCount(1);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Add Basic Brick</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {allowedBricks.map((type) => {
          const def = BrickRegistry[type];
          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: '#ffffff',
                border: selectedType === type ? '2px solid #0073aa' : '1px solid #d5dadf',
                borderRadius: '5px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {def.icon && <def.icon size={24} />}
              <span style={{ fontSize: '14px', color: '#444' }}>{def.label}</span>
            </button>
          );
        })}
      </div>
      {selectedType === 'column' && (
        <div style={{ marginTop: '10px' }}>
          <label>
            Number of columns:
            <input
              type="number"
              min="1"
              max="4"
              value={columnCount}
              onChange={(e) => setColumnCount(Math.max(1, Number(e.target.value)))}
              style={{ marginLeft: '5px', width: '50px' }}
            />
          </label>
        </div>
      )}
      <button onClick={handleAdd} disabled={!selectedType} style={{ marginTop: '10px', padding: '5px 10px' }}>
        Add
      </button>
    </Modal>
  );
};

const FolderModal = ({ isOpen, onClose, onAddBrick }) => {
  const allowedBricks = ['column', 'container', 'heading', 'image', 'title', 'icon', 'text'];
  const prebuiltBricks = Object.keys(BrickRegistry).filter((type) => !allowedBricks.includes(type));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Add Prebuilt Brick</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {prebuiltBricks.map((type) => {
          const def = BrickRegistry[type];
          return (
            <button
              key={type}
              onClick={() => onAddBrick(type)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: '#ffffff',
                border: '1px solid #d5dadf',
                borderRadius: '5px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {def.icon && <def.icon size={24} />}
              <span style={{ fontSize: '14px', color: '#444' }}>{def.label}</span>
            </button>
          );
        })}
      </div>
    </Modal>
  );
};

export function ColumnBrickComponent({ brick, onSelect }) {
  const { components = [], props } = brick;
  const {
    width,
    height,
    bgColor,
    padding,
    gap,
    borderRadius,
    direction
  } = props;
  const { selectedBrickId, addNestedComponent, removeNestedComponent, showDeleteDialog } = useBuilderContext();
  const { viewMode } = useViewMode();
  const isPreview = viewMode === 'preview';
  const isSelected = selectedBrickId === brick.id;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showPrebuiltModal, setShowPrebuiltModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddBrick = (type, count = 1) => {
    if (isAdding) return;
    setIsAdding(true);
    
    // Simply add the new component, Container will handle column widths
    addNestedComponent(brick.id, type);
    
    setIsAdding(false);
    setShowAddModal(false);
  };

  const handleAddPrebuiltBrick = (type) => {
    if (isAdding) return;
    setIsAdding(true);
    addNestedComponent(brick.id, type);
    setIsAdding(false);
    setShowPrebuiltModal(false);
  };

  const renderComponents = () => (
    <>
      {components.map((childBrick, index) => {
        const ChildComponent = BrickRegistry[childBrick.type]?.component;
        if (!ChildComponent) return null;
        return (
          <div key={childBrick.id} 
               style={{ 
                 position: 'relative',
                 marginBottom: index < components.length - 1 ? gap : 0
               }}>
            <ChildComponent 
              brick={childBrick}
              onSelect={onSelect}
              isPreview={isPreview}
            />
            {!isPreview && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  showDeleteDialog(brick.id, childBrick.id);
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  cursor: 'pointer',
                  border: 'none',
                  background: 'transparent',
                  zIndex: 100,
                  padding: '4px'
                }}
                title="Remove Brick"
              >
                <Trash2 size={14} style={{color: 'red'}} />
              </button>
            )}
          </div>
        );
      })}
    </>
  );

  const handleColumnClick = (e) => {
    if (!isPreview && e.target === e.currentTarget) {
      e.stopPropagation();
      onSelect(brick.id);
    }
  };

  return (
    <PreviewWrapper isSelected={isSelected}>
      <ColumnStyled
        width={width}
        height={height}
        bgColor={bgColor}
        padding={padding}
        gap={gap}
        borderRadius={borderRadius}
        direction={direction}
        onClick={handleColumnClick}
      >
        <div style={{ position: 'relative', height: '100%' }}>
          {renderComponents()}
          {!isPreview && components.length === 0 && (
            <PlaceholderUI>
              <ActionButtons>
                <ActionButton onClick={(e) => {
                  e.stopPropagation();
                  setShowAddModal(true);
                }} color="#0073aa" hoverColor="#005f8d">
                  <Plus size={20} />
                </ActionButton>
                <ActionButton onClick={(e) => {
                  e.stopPropagation();
                  setShowPrebuiltModal(true);
                }} color="#6c757d" hoverColor="#565e64">
                  <Folder size={20} />
                </ActionButton>
              </ActionButtons>
              <div>Add widget here</div>
            </PlaceholderUI>
          )}
        </div>
      </ColumnStyled>

      {!isPreview && (
        <>
          <PlusModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddBrick} />
          <FolderModal isOpen={showPrebuiltModal} onClose={() => setShowPrebuiltModal(false)} onAddBrick={handleAddPrebuiltBrick} />
        </>
      )}
    </PreviewWrapper>
  );
}

export const ColumnInspector = {
  displayName: 'Column',
  getInspectorProps: (brick) => ({
    id: brick.id,
    displayName: 'Column',
    props: {
      direction: { 
        type: 'select', 
        label: 'Layout Direction', 
        options: ['row', 'column'], 
        defaultValue: 'column',
        section: 'Layout',
        icon: true 
      },
      width: { type: 'number', label: 'Width', defaultValue: 100, unit: '%' },
      height: { type: 'number', label: 'Height', defaultValue: 150, unit: 'px' },
      bgColor: { type: 'colorpicker', label: 'Background Color', defaultValue: '#ffffff' },
      bgImage: { type: 'text', label: 'Background Image URL', defaultValue: '' },
      paddingTop: { type: 'number', label: 'Padding Top', defaultValue: 10, unit: 'px' },
      paddingRight: { type: 'number', label: 'Padding Right', defaultValue: 10, unit: 'px' },
      paddingBottom: { type: 'number', label: 'Padding Bottom', defaultValue: 10, unit: 'px' },
      paddingLeft: { type: 'number', label: 'Padding Left', defaultValue: 10, unit: 'px' },
      marginTop: { type: 'number', label: 'Margin Top', defaultValue: 10, unit: 'px' },
      marginRight: { type: 'number', label: 'Margin Right', defaultValue: 10, unit: 'px' },
      marginBottom: { type: 'number', label: 'Margin Bottom', defaultValue: 10, unit: 'px' },
      marginLeft: { type: 'number', label: 'Margin Left', defaultValue: 10, unit: 'px' },
      gap: { type: 'number', label: 'Gap', defaultValue: 0, unit: 'px' },
      borderRadius: { type: 'number', label: 'Border Radius', defaultValue: 0, unit: 'px' },
      columnCount: { type: 'number', label: 'Number of Columns', defaultValue: 1, min: 1, max: 4 },
      columnWidth: { type: 'text', label: 'Column Width', defaultValue: '100%' },
    },
  }),
};

export default ColumnBrickComponent;

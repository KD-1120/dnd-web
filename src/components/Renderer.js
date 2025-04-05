// src/components/Renderer.js
import React from 'react';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';
import { BrickRegistry } from '../bricks/BrickRegistry';
import { useBuilderContext } from '../context/BuilderContext';
import {
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Copy,
  GripVertical,
} from 'lucide-react';

export function Renderer() {
  const {
    pageData,
    selectedBrickId,
    setSelectedBrickId,
    removeBrick,
    duplicateBrick,
    moveBlockUp,
    moveBlockDown,
    setPageData,
    showMargin,    // Added from context
    showPadding,   // Added from context
  } = useBuilderContext();

  const handleSelectBrick = (brickId) => {
    setSelectedBrickId(brickId);
  };

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    const findBrickById = (bricks, id) => {
      for (let brick of bricks) {
        if (brick.id === id) return brick;
        if (brick.children) {
          const childResult = findBrickById(brick.children, id);
          if (childResult) return childResult;
        }
        if (brick.components) {
          const componentResult = findBrickById(brick.components, id);
          if (componentResult) return componentResult;
        }
      }
      return null;
    };

    const sourceBrick = findBrickById(pageData, draggableId);
    if (!sourceBrick) return;

    const newPageData = [...pageData];

    const removeBrickFromLocation = (bricks) => {
      for (let i = 0; i < bricks.length; i++) {
        if (bricks[i].id === draggableId) {
          return bricks.splice(i, 1)[0];
        }
        if (bricks[i].children) {
          const childResult = removeBrickFromLocation(bricks[i].children);
          if (childResult) return childResult;
        }
        if (bricks[i].components) {
          const componentResult = removeBrickFromLocation(bricks[i].components);
          if (componentResult) return componentResult;
        }
      }
      return null;
    };

    const movedBrick = removeBrickFromLocation(newPageData);

    const insertBrickAtLocation = (bricks) => {
      if (destination.droppableId === 'page-droppable') {
        bricks.splice(destination.index, 0, movedBrick);
        return true;
      }
      for (let i = 0; i < bricks.length; i++) {
        if (bricks[i].id === destination.droppableId) {
          const targetArray = bricks[i].children || bricks[i].components;
          if (targetArray) {
            targetArray.splice(destination.index, 0, movedBrick);
            return true;
          }
        }
        if (bricks[i].children) {
          if (insertBrickAtLocation(bricks[i].children)) return true;
        }
        if (bricks[i].components) {
          if (insertBrickAtLocation(bricks[i].components)) return true;
        }
      }
      return false;
    };

    insertBrickAtLocation(newPageData);
    setPageData(newPageData);
  };

  const renderBrick = (brick, index) => {
    const BrickComponent = BrickRegistry[brick.type]?.component;
    if (!BrickComponent) return null;

    // Remove parentId check since we want to render all top-level bricks
    // Components within FeatureBrick will handle their own rendering
    const isSelected = selectedBrickId === brick.id;

    const combinedStyle = {
      position: 'relative',
      marginBottom: '1rem',
      border: isSelected ? '2px solid #634AFF' : 'none',
      padding: '4px',
    };

    return (
      <Draggable key={brick.id} draggableId={brick.id} index={parseInt(index, 10)}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={{
              ...combinedStyle,
              ...provided.draggableProps.style,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectBrick(brick.id);
            }}
          >
            {/* Drag Handle */}
            <div
              {...provided.dragHandleProps}
              style={{
                position: 'absolute',
                left: '-24px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'grab',
                padding: '4px',
              }}
            >
              <GripVertical size={16} />
            </div>

            {isSelected && (
              <>
                {/* Navigation Buttons */}
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '4px',
                  }}
                >
                  <ArrowUp
                    size={24}
                    style={{
                      background: '#634AFF',
                      color: '#fff',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      padding: '2px',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveBlockUp(brick.id);
                    }}
                  />
                  <ArrowDown
                    size={24}
                    style={{
                      background: '#634AFF',
                      color: '#fff',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      padding: '2px',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveBlockDown(brick.id);
                    }}
                  />
                </div>

                {/* Delete Button */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    zIndex: 10,
                  }}
                >
                  <Trash2
                    size={24}
                    style={{
                      background: '#634AFF',
                      color: '#fff',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      padding: '2px',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeBrick(brick.id);
                    }}
                  />
                </div>

                {/* Duplicate Button */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-18px',
                    right: '-10px',
                    zIndex: 10,
                  }}
                >
                  <Copy
                    size={24}
                    style={{
                      background: '#634AFF',
                      color: '#fff',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      padding: '2px',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateBrick(brick.id);
                    }}
                  />
                </div>
              </>
            )}

            <BrickComponent 
              brick={brick}
              onSelect={handleSelectBrick}
            />
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="page-droppable" type="BRICK">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {pageData.map((brick, index) => renderBrick(brick, index))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

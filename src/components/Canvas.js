// src/components/Canvas.js
import React from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useBuilderContext } from '../context/BuilderContext';
import { useViewMode } from '../context/ViewModeContext';
import { Renderer } from './Renderer';
import { GlobalLayoutCanvas } from './GlobalLayoutCanvas';

const CanvasWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: #fff;
  ${({ viewMode }) => {
    switch (viewMode) {
      case 'mobile':
        return `
          max-width: 375px;
          margin: 0 auto;
          border: 1px solid #ddd;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        `;
      case 'preview':
        return `
          transform: scale(0.9);
          transform-origin: top center;
          margin: 0 auto;
          border: none;
        `;
      default:
        return `width: 100%;`;
    }
  }}
`;

export function Canvas() {
  const { pageData, setPageData, activeTab, getPreviewData } = useBuilderContext();
  const { viewMode } = useViewMode();

  if (activeTab === 'global') {
    return <GlobalLayoutCanvas />;
  }

  // Use getPreviewData instead of pageData directly for rendering
  const renderData = viewMode === 'preview' ? getPreviewData() : pageData;

  // onDragEnd: reorder the root-level bricks
  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    // For now, we reorder the root-level bricks
    const updated = Array.from(pageData);
    const [removed] = updated.splice(source.index, 1);
    updated.splice(destination.index, 0, removed);
    setPageData(updated);
  };

  return (
    <CanvasWrapper viewMode={viewMode}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="root-droppable">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <Renderer bricks={renderData} droppableProvided={provided} />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </CanvasWrapper>
  );
}

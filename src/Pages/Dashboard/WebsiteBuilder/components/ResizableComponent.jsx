// src/Pages/Dashboard/WebsiteBuilder/components/ResizableComponent.jsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const ResizableContainer = styled.div`
  position: relative;
  box-sizing: border-box;
  width: ${props => props.width || '100%'};
  height: ${props => props.height || 'auto'};
  min-width: ${props => props.minWidth || '50px'};
  min-height: ${props => props.minHeight || '50px'};
  padding: 4px;
  margin: ${props => props.margin || '0'};
`;

const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const ResizeHandle = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background: #2563eb;
  border-radius: 50%;
  z-index: 10;
  
  ${props => {
    if (props.position === 'top-left') {
      return `
        top: -5px;
        left: -5px;
        cursor: nwse-resize;
      `;
    } else if (props.position === 'top-right') {
      return `
        top: -5px;
        right: -5px;
        cursor: nesw-resize;
      `;
    } else if (props.position === 'bottom-left') {
      return `
        bottom: -5px;
        left: -5px;
        cursor: nesw-resize;
      `;
    } else if (props.position === 'bottom-right') {
      return `
        bottom: -5px;
        right: -5px;
        cursor: nwse-resize;
      `;
    } else if (props.position === 'top') {
      return `
        top: -5px;
        left: 50%;
        transform: translateX(-50%);
        cursor: ns-resize;
      `;
    } else if (props.position === 'right') {
      return `
        right: -5px;
        top: 50%;
        transform: translateY(-50%);
        cursor: ew-resize;
      `;
    } else if (props.position === 'bottom') {
      return `
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        cursor: ns-resize;
      `;
    } else if (props.position === 'left') {
      return `
        left: -5px;
        top: 50%;
        transform: translateY(-50%);
        cursor: ew-resize;
      `;
    }
  }}
`;

const ResizableComponent = ({
  children,
  width = '100%',
  height = 'auto',
  minWidth = '50px',
  minHeight = '50px',
  maxWidth = '100%',
  maxHeight = '2000px',
  margin = '0',
  onResize,
  isResizable = true,
  resizeHandles = ['bottom-right'], // Which handles to display
}) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width, height });
  const [resizing, setResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startDimensions, setStartDimensions] = useState({ width: 0, height: 0 });
  
  // Register global mouse events for resizing
  useEffect(() => {
    if (resizing) {
      const handleMouseMove = (e) => {
        e.preventDefault();
        
        // Current mouse position
        const currentX = e.clientX;
        const currentY = e.clientY;
        
        // Calculate deltas
        const deltaX = currentX - startPos.x;
        const deltaY = currentY - startPos.y;
        
        let newWidth = startDimensions.width;
        let newHeight = startDimensions.height;
        
        // Apply changes based on which handle is being dragged
        if (resizeDirection.includes('right')) {
          newWidth = startDimensions.width + deltaX;
        } else if (resizeDirection.includes('left')) {
          newWidth = startDimensions.width - deltaX;
        }
        
        if (resizeDirection.includes('bottom')) {
          newHeight = startDimensions.height + deltaY;
        } else if (resizeDirection.includes('top')) {
          newHeight = startDimensions.height - deltaY;
        }
        
        // Enforce min/max constraints
        newWidth = Math.max(parseFloat(minWidth), Math.min(parseFloat(maxWidth), newWidth));
        newHeight = Math.max(parseFloat(minHeight), Math.min(parseFloat(maxHeight), newHeight));
        
        // Update dimensions
        setDimensions({
          width: `${newWidth}px`,
          height: `${newHeight}px`
        });
        
        // Notify parent component
        if (onResize) {
          onResize({
            width: `${newWidth}px`,
            height: `${newHeight}px`
          });
        }
      };
      
      const handleMouseUp = () => {
        setResizing(false);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [resizing, startPos, startDimensions, minWidth, maxWidth, minHeight, maxHeight, onResize, resizeDirection]);
  
  const handleResizeStart = (e, direction) => {
    e.stopPropagation();
    
    // Don't resize if not allowed
    if (!isResizable) return;
    
    setResizing(true);
    setResizeDirection(direction);
    setStartPos({ x: e.clientX, y: e.clientY });
    
    // Get current dimensions
    const rect = containerRef.current.getBoundingClientRect();
    setStartDimensions({
      width: rect.width,
      height: rect.height
    });
  };
  
  return (
    <ResizableContainer
      ref={containerRef}
      width={dimensions.width}
      height={dimensions.height}
      minWidth={minWidth}
      minHeight={minHeight}
      margin={margin}
    >
      <ContentContainer>
        {children}
      </ContentContainer>
      
      {isResizable && resizeHandles.includes('top-left') && (
        <ResizeHandle
          position="top-left"
          onMouseDown={(e) => handleResizeStart(e, 'top-left')}
        />
      )}
      
      {isResizable && resizeHandles.includes('top-right') && (
        <ResizeHandle
          position="top-right"
          onMouseDown={(e) => handleResizeStart(e, 'top-right')}
        />
      )}
      
      {isResizable && resizeHandles.includes('bottom-left') && (
        <ResizeHandle
          position="bottom-left"
          onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
        />
      )}
      
      {isResizable && resizeHandles.includes('bottom-right') && (
        <ResizeHandle
          position="bottom-right"
          onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
        />
      )}
      
      {isResizable && resizeHandles.includes('top') && (
        <ResizeHandle
          position="top"
          onMouseDown={(e) => handleResizeStart(e, 'top')}
        />
      )}
      
      {isResizable && resizeHandles.includes('right') && (
        <ResizeHandle
          position="right"
          onMouseDown={(e) => handleResizeStart(e, 'right')}
        />
      )}
      
      {isResizable && resizeHandles.includes('bottom') && (
        <ResizeHandle
          position="bottom"
          onMouseDown={(e) => handleResizeStart(e, 'bottom')}
        />
      )}
      
      {isResizable && resizeHandles.includes('left') && (
        <ResizeHandle
          position="left"
          onMouseDown={(e) => handleResizeStart(e, 'left')}
        />
      )}
    </ResizableContainer>
  );
};

export default ResizableComponent;
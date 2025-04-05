import React from 'react';
import { useViewMode } from '../context/ViewModeContext';

export const PreviewWrapper = ({ children, isSelected, showControls = true, style = {} }) => {
  const { viewMode } = useViewMode();
  const isPreview = viewMode === 'preview';

  if (isPreview) {
    // In preview mode, render without selection styles or controls
    return <div style={{ 
      ...style,
      cursor: 'default',
      userSelect: 'none'
    }}>{children}</div>;
  }

  // In edit mode, render normally with selection styles
  return <div style={{ 
    position: 'relative',
    border: isSelected ? '2px solid #10a5e0' : 'none',
    ...style
  }}>
    {children}
    {showControls && isSelected && (
      <div className="brick-controls">
        {/* ...existing controls... */}
      </div>
    )}
  </div>;
};

// Add a helper HOC to easily make any content non-editable in preview
export const withPreviewable = (WrappedComponent) => {
  return (props) => {
    const { viewMode } = useViewMode();
    const isPreview = viewMode === 'preview';
    
    return <WrappedComponent 
      {...props} 
      contentEditable={!isPreview && props.contentEditable}
      style={{
        ...props.style,
        cursor: isPreview ? 'default' : props.style?.cursor,
        pointerEvents: isPreview ? 'none' : props.style?.pointerEvents
      }}
    />;
  };
};

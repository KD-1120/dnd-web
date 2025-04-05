// src/bricks/TitleBrick.js
import React from 'react';
import styled from 'styled-components';

const Heading = styled.h3`
  margin: ${props => props.marginBottom ? `0 auto ${props.marginBottom} auto` : '0'};
  font-size: ${props => props.fontSize || '24px'};
  text-align: ${props => props.alignment || 'center'};
  color: ${props => props.color || '#333'};
  width: 100%;
  font-weight: ${props => props.fontWeight || 'normal'};
  letter-spacing: ${props => props.letterSpacing || 'normal'};
  line-height: ${props => props.lineHeight || 'normal'};
`;

/**
 * TitleBrickComponent - A content-editable title brick.
 */
export const TitleBrickComponent = ({ brick, onSelect, onUpdate, isSelected }) => {
  const { id, props } = brick;

  return (
    <Heading
      {...props}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(id);
      }}
      style={{
        border: isSelected ? '1px solid #10a5e0' : 'none',
        padding: '4px',
        cursor: 'pointer',
      }}
    >
      <span
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onUpdate?.({ ...props, text: e.target.innerText })}
        style={{width: '100%', textAlign: props.alignment}}
      >
        {props.text || 'Title'}
      </span>
    </Heading>
  );
};

// Inspector definition for the TitleBrick
export const TitleBrickInspector = {
  displayName: 'Title',
  props: {
    fontSize: { type: 'number', label: 'Font Size', defaultValue: 24, unit: 'px' },
    alignment: { type: 'select', label: 'Alignment', options: ['left', 'center', 'right'], defaultValue: 'center' },
    color: { type: 'colorpicker', label: 'Color', defaultValue: '#333333' },
    text: { type: 'text', label: 'Title Text', defaultValue: 'Feature Title' },
    fontWeight: {
      type: 'text',
      label: 'Font Weight',
      defaultValue: 'normal',
    },
    letterSpacing: {
      type: 'text',
      label: 'Letter Spacing',
      defaultValue: 'normal',
    },
    lineHeight: {
      type: 'text',
      label: 'Line Height',
      defaultValue: 'normal',
    },
    marginBottom: {
      type: 'text',
      label: 'Margin Bottom',
      defaultValue: '0',
    },
  },
};


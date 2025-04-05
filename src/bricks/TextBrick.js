// src/bricks/TextBrick.js
import React from 'react';
import styled from 'styled-components';
import { withPreviewable, PreviewWrapper } from '../components/PreviewWrapper';
import { useViewMode } from '../context/ViewModeContext';

const Paragraph = styled.p`
  margin: ${(props) => (props.marginBottom ? `0 auto ${props.marginBottom} auto` : '0')};
  max-width: ${(props) => props.maxWidth || 'none'};
  font-size: ${(props) => props.fontSize || '16px'};
  text-align: ${(props) => props.alignment || 'center'};
  color: ${(props) => props.color || '#666'};
  font-weight: ${(props) => props.fontWeight || 'normal'};
  letter-spacing: ${(props) => props.letterSpacing || 'normal'};
  line-height: ${(props) => props.lineHeight || 'normal'};
`;

const EditableContent = withPreviewable('span');

/**
 * TextBrickComponent - A content-editable text brick.
 */
export function TextBrickComponent({ brick, onSelect, onUpdate, isSelected }) {
  const { props } = brick;
  const { viewMode } = useViewMode();
  const isPreview = viewMode === 'preview';

  return (
    <PreviewWrapper isSelected={isSelected}>
      <Paragraph
        {...props}
        onClick={(e) => {
          if (!isPreview) {
            e.stopPropagation();
            onSelect?.();
          }
        }}
      >
        <EditableContent
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => !isPreview && onUpdate?.({ ...props, text: e.target.innerText })}
        >
          {props.text || 'Text goes here'}
        </EditableContent>
      </Paragraph>
    </PreviewWrapper>
  );
}

// Inspector definition for the TextBrick (without text)
export const TextBrickInspector = {
  displayName: 'Text',
  props: {
    fontSize: {
      type: 'number',
      label: 'Font Size',
      defaultValue: 16,
      unit: 'px',
    },
    alignment: {
      type: 'select',
      label: 'Alignment',
      options: ['left', 'center', 'right'],
      defaultValue: 'center',
    },
    color: {
      type: 'colorpicker',
      label: 'Color',
      defaultValue: '#666666',
    },
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
    maxWidth: {
      type: 'text',
      label: 'Max Width',
      defaultValue: 'none',
    },
  },
};

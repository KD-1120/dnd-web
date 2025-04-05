import React from 'react';
import styled from 'styled-components';
import { useBuilderContext } from '../context/BuilderContext';
import { Trash2 } from 'lucide-react';
import { withPreviewable } from '../components/PreviewWrapper';
import { useViewMode } from '../context/ViewModeContext';
import { PreviewWrapper } from '../components/PreviewWrapper';

const StyledButtonWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-right: 0.5rem;
`;

const StyledButton = styled.a`
  display: inline-block;
  font-size: ${(props) => props.fontSize || '14px'};
  padding: ${(props) => props.isSelected ? '6px 14px' : '8px 16px'};
  text-decoration: none;
  border-radius: 4px;
  background-color: ${(props) => props.bgColor || "#f8f8f8"};
  color: ${(props) => props.color || "#000000"};
  cursor: pointer;
  border: ${(props) => props.isSelected ? '2px solid #10a5e0' : 'none'};
`;

const DeleteButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  
  ${StyledButtonWrapper}:hover & {
    opacity: 1;
  }

  &:hover {
    background: #ff4d4d;
    border-color: #ff4d4d;
    color: white;
  }
`;

const EditableSpan = withPreviewable(styled.span`
  outline: none;
`);

export function ButtonBrickComponent({ brick, onSelect, onDelete }) {
  const { id, props = { label: 'New Button' } } = brick;
  const { updateBrickProps, selectedBrickId } = useBuilderContext();
  const { viewMode } = useViewMode();
  const isPreview = viewMode === 'preview';
  const isSelected = selectedBrickId === id;

  return (
    <PreviewWrapper isSelected={isSelected}>
      <StyledButtonWrapper>
        <StyledButton
          href={props.link}
          bgColor={props.bgColor}
          color={props.color}
          fontSize={props.fontSize}
          isSelected={isSelected}
          onClick={(e) => {
            if (!isPreview) {
              e.stopPropagation();
              onSelect?.();
            }
          }}
        >
          <EditableSpan
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              if (!isPreview) {
                updateBrickProps(id, { label: e.target.innerText });
              }
            }}
          >
            {props.label || 'New Button'}
          </EditableSpan>
        </StyledButton>
        {!isPreview && <DeleteButton 
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          title="Delete Button"
        >
          <Trash2 size={12} />
        </DeleteButton>}
      </StyledButtonWrapper>
    </PreviewWrapper>
  );
}

export const ButtonInspector = {
  displayName: 'Button',
  props: {
    link: { type: 'text', label: 'Button URL', defaultValue: '#', section: 'Links' },
    bgColor: { type: 'colorpicker', label: 'Background Color', defaultValue: '#007bff', section: 'Style' },
    color: { type: 'colorpicker', label: 'Text Color', defaultValue: '#000', section: 'Style' },
    fontSize: { type: 'number', label: 'Font Size', defaultValue: 14, unit: 'px', section: 'Typography' }
  }
};

export default ButtonBrickComponent;

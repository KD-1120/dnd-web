import React from 'react';
import styled from 'styled-components';
import { useBuilderContext } from '../context/BuilderContext';
import { Trash2 } from 'lucide-react';
import { withPreviewable } from '../components/PreviewWrapper';
import { useViewMode } from '../context/ViewModeContext';
import { PreviewWrapper } from '../components/PreviewWrapper';
import * as LuIcons from 'react-icons/lu';
import * as PhosphorIcons from '@phosphor-icons/react';
import * as IconoirIcons from 'iconoir-react';

const StyledButtonWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-right: 0.5rem;
`;

const StyledButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: ${(props) => props.fontSize || '14px'};
  padding: ${(props) => props.padding || '16px'};
  margin: ${(props) => props.margin || '8px'};
  text-decoration: none;
  border-radius: ${(props) => props.borderRadius || '4px'};
  background-color: ${(props) => props.bgColor || "#007bff"};
  color: ${(props) => props.color || "#ffffff"};
  cursor: pointer;
  border: ${(props) => props.isSelected ? '2px solid #10a5e0' : 'none'};
  flex-direction: ${(props) => {
    switch(props.iconPosition) {
      case 'top': return 'column';
      case 'bottom': return 'column-reverse';
      case 'right': return 'row-reverse';
      default: return 'row';
    }
  }};
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
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

function getIconByName(iconName) {
  if (LuIcons[iconName]) return LuIcons[iconName];
  if (PhosphorIcons[iconName]) return PhosphorIcons[iconName];
  if (IconoirIcons[iconName]) return IconoirIcons[iconName];
  return LuIcons.LuHandshake;
}

export function ButtonWithIconBrickComponent({ brick, onSelect, onRemove }) {
  const { id, props = { label: 'New Button' } } = brick;
  const { updateBrickProps, selectedBrickId } = useBuilderContext();
  const { viewMode } = useViewMode();
  const isPreview = viewMode === 'preview';
  const isSelected = selectedBrickId === id;

  const IconComponent = getIconByName(props.iconName);

  return (
    <PreviewWrapper isSelected={isSelected}>
      <StyledButtonWrapper>
        <StyledButton
          href={props.link}
          bgColor={props.bgColor}
          color={props.color}
          fontSize={props.fontSize}
          padding={props.padding}
          margin={props.margin}
          borderRadius={props.borderRadius}
          isSelected={isSelected}
          iconPosition={props.iconPosition}
          onClick={(e) => {
            if (!isPreview) {
              e.stopPropagation();
              onSelect?.();
            }
          }}
        >
          <IconComponent size={props.iconSize || 16} />
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
            onRemove?.();
          }}
          title="Delete Button"
        >
          <Trash2 size={12} />
        </DeleteButton>}
      </StyledButtonWrapper>
    </PreviewWrapper>
  );
}

export const ButtonWithIconInspector = {
  displayName: 'Button with Icon',
  props: {
    label: { type: 'text', label: 'Button Text', defaultValue: 'New Button', section: 'Content' },
    link: { type: 'text', label: 'Button URL', defaultValue: '#', section: 'Links' },
    iconName: {
      type: 'select',
      label: 'Icon',
      options: [
        ...Object.keys(LuIcons).filter((name) => name.startsWith('Lu')),
        ...Object.keys(PhosphorIcons).filter(
          (name) => name[0] === name[0].toUpperCase() && !name.includes('Weight')
        ),
        ...Object.keys(IconoirIcons).filter((name) => name[0] === name[0].toUpperCase()),
      ],
      defaultValue: 'LuHandshake',
      section: 'Icon'
    },
    iconSize: { type: 'number', label: 'Icon Size', defaultValue: 16, unit: 'px', section: 'Icon' },
    iconPosition: {
      type: 'select',
      label: 'Icon Position',
      options: ['left', 'right', 'top', 'bottom'],
      defaultValue: 'left',
      section: 'Icon'
    },
    bgColor: { type: 'colorpicker', label: 'Background Color', defaultValue: '#007bff', section: 'Style' },
    color: { type: 'colorpicker', label: 'Text Color', defaultValue: 'white', section: 'Style' },
    fontSize: { type: 'number', label: 'Font Size', defaultValue: 14, unit: 'px', section: 'Typography' },
    padding: { type: 'number', label: 'Padding', defaultValue: 16, unit: 'px', section: 'Layout' },
    margin: { type: 'number', label: 'Margin', defaultValue: 8, unit: 'px', section: 'Layout' },
    borderRadius: { type: 'number', label: 'Border Radius', defaultValue: 4, unit: 'px', section: 'Style' }
  }
};

export default ButtonWithIconBrickComponent;

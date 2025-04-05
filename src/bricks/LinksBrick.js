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

const StyledLinkWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-right: 0.5rem;
`;

const StyledLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: ${(props) => props.fontSize || '14px'};
  padding: ${(props) => props.padding || '8px'};
  margin: ${(props) => props.margin || '4px'};
  text-decoration: none;
  color: ${(props) => props.color || "#333333"};
  cursor: pointer;
  border-bottom: ${(props) => props.underline ? '2px solid currentColor' : 'none'};
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
    opacity: 0.7;
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
  
  ${StyledLinkWrapper}:hover & {
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
  return null;
}

export function LinksBrickComponent({ brick, onSelect, onDelete }) {
  const { id, props = { label: 'New Link' } } = brick;
  const { updateBrickProps, selectedBrickId } = useBuilderContext();
  const { viewMode } = useViewMode();
  const isPreview = viewMode === 'preview';
  const isSelected = selectedBrickId === id;

  const IconComponent = props.iconName ? getIconByName(props.iconName) : null;
  const showText = !props.iconOnly;

  return (
    <PreviewWrapper isSelected={isSelected}>
      <StyledLinkWrapper>
        <StyledLink
          href={props.link}
          color={props.color}
          fontSize={props.fontSize}
          padding={props.padding}
          margin={props.margin}
          underline={props.underline}
          iconPosition={props.iconPosition}
          onClick={(e) => {
            if (!isPreview) {
              e.stopPropagation();
              onSelect?.();
            }
          }}
        >
          {IconComponent && <IconComponent size={props.iconSize || 16} />}
          {showText && (
            <EditableSpan
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => {
                if (!isPreview) {
                  updateBrickProps(id, { label: e.target.innerText });
                }
              }}
            >
              {props.label || 'New Link'}
            </EditableSpan>
          )}
        </StyledLink>
        {!isPreview && <DeleteButton 
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          title="Delete Link"
        >
          <Trash2 size={12} />
        </DeleteButton>}
      </StyledLinkWrapper>
    </PreviewWrapper>
  );
}

export const LinksBrickInspector = {
  displayName: 'Link',
  props: {
    link: { type: 'text', label: 'URL', defaultValue: '#', section: 'Links' },
    iconOnly: { type: 'boolean', label: 'Icon Only', defaultValue: false, section: 'Display' },
    underline: { type: 'boolean', label: 'Show Underline', defaultValue: false, section: 'Style' },
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
      defaultValue: '',
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
    color: { type: 'colorpicker', label: 'Text Color', defaultValue: '#333333', section: 'Style' },
    fontSize: { type: 'number', label: 'Font Size', defaultValue: 14, unit: 'px', section: 'Typography' },
    padding: { type: 'number', label: 'Padding', defaultValue: 8, unit: 'px', section: 'Layout' },
    margin: { type: 'number', label: 'Margin', defaultValue: 4, unit: 'px', section: 'Layout' }
  }
};

export default LinksBrickComponent;

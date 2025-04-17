// src/Pages/Dashboard/WebsiteBuilder/components/SimplifiedPropertiesSidebar.jsx
import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useBuilderContext } from '../context/BuilderContext';
import { BrickRegistry } from '../bricks/BrickRegistry';
import { 
  Palette, 
  LayoutGrid, 
  Image, 
  Link, 
  Type, 
  Box, 
  CornerUpLeft, 
  ChevronRight, 
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  BoldIcon,
  ItalicIcon,
  Underline,
  Sliders,
  Move,
  Layers,
  ArrowDownToLine,
  ArrowUpToLine,
  Trash2
} from 'lucide-react';

const SidebarContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #ffffff;
  overflow-y: auto;
  font-family: 'Inter', sans-serif;
  border-left: 1px solid #eee;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #eee;
  background: #f9fafb;
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: #111827;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6b7280;
  font-size: 13px;
  padding: 0;
  
  &:hover {
    color: #111827;
  }
  
  svg {
    margin-right: 4px;
  }
`;

const EmptyState = styled.div`
  padding: 24px;
  text-align: center;
  color: #6b7280;
  font-size: 13px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-bottom: 12px;
    color: #9ca3af;
  }
`;

const AccordionSection = styled.div`
  border-bottom: 1px solid #eee;
`;

const AccordionHeader = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  background: ${props => props.isOpen ? '#f9fafb' : '#ffffff'};
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #111827;

  &:hover {
    background: #f9fafb;
  }
  
  svg:first-child {
    margin-right: 8px;
    color: #6b7280;
  }
  
  svg:last-child {
    margin-left: auto;
  }
`;

const AccordionBody = styled.div`
  padding: ${props => props.isOpen ? '8px 16px 16px' : '0 16px'};
  max-height: ${props => props.isOpen ? '1000px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
`;

const PropertyRow = styled.div`
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const PropertyLabel = styled.label`
  display: block;
  font-size: 12px;
  color: #4b5563;
  margin-bottom: 4px;
  font-weight: 500;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
`;

const ColorPickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ColorPreview = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: ${props => props.color};
  border: 1px solid #d1d5db;
  cursor: pointer;
  position: relative;
  overflow: hidden;
`;

const ColorInput = styled.input`
  width: 100%;
  height: 24px;
  cursor: pointer;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
`;

const Select = styled.select`
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  background-color: #fff;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
`;

const NumberInputWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const NumberInput = styled.input`
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
`;

const UnitLabel = styled.span`
  margin-left: 8px;
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  overflow: hidden;
`;

const IconButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  background: ${props => props.active ? '#f3f4f6' : '#ffffff'};
  border: none;
  cursor: pointer;
  color: ${props => props.active ? '#111827' : '#6b7280'};
  
  &:not(:last-child) {
    border-right: 1px solid #d1d5db;
  }
  
  &:hover {
    background: #f9fafb;
  }
`;

const ActionButtons = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid #eee;
  margin-top: auto;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 8px;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  
  &:hover {
    background: #f9fafb;
  }
  
  svg {
    margin-right: 8px;
  }
`;

const NudgeControls = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
`;

const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SliderControl = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #3b82f6;
    border: none;
    border-radius: 50%;
    cursor: pointer;
  }
`;

const SliderValue = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6b7280;
`;

const ColorPalette = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  margin-top: 8px;
`;

const ColorSwatch = styled.button`
  width: 100%;
  aspect-ratio: 1;
  background-color: ${props => props.color};
  border: 1px solid ${props => props.selected ? '#3b82f6' : '#d1d5db'};
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.05);
  }
`;

// Main component
const SimplifiedPropertiesSidebar = () => {
  const { 
    selectedBrickId, 
    pageData, 
    updateBrickProps, 
    getBrickById,
    duplicateBrick,
    removeBrick,
    moveBlockUp,
    moveBlockDown
  } = useBuilderContext();
  
  // State for open/closed accordion sections
  const [openSections, setOpenSections] = useState({
    style: true,
    layout: true,
    typography: true,
    content: false,
    effects: false
  });
  
  // Get the selected brick
  const selectedBrick = useMemo(
    () => getBrickById(selectedBrickId),
    [selectedBrickId, getBrickById]
  );
  
  // Toggle accordion sections
  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  if (!selectedBrick) {
    return (
      <SidebarContainer>
        <Header>
          <Title>Properties</Title>
        </Header>
        <EmptyState>
          <Box size={32} />
          <p>Select an element to edit its properties</p>
        </EmptyState>
      </SidebarContainer>
    );
  }
  
  const brickDef = BrickRegistry[selectedBrick.type];
  if (!brickDef || !brickDef.inspector) {
    return (
      <SidebarContainer>
        <Header>
          <Title>Properties</Title>
        </Header>
        <EmptyState>
          <Sliders size={32} />
          <p>No properties available for this element</p>
        </EmptyState>
      </SidebarContainer>
    );
  }
  
  // Get the inspector config for this brick type
  const inspectorConfig = typeof brickDef.inspector.getInspectorProps === 'function'
    ? brickDef.inspector.getInspectorProps(selectedBrick, selectedBrickId)
    : brickDef.inspector;
  
  const propsConfig = inspectorConfig.props || {};
  
  // Group props by category for accordion sections
  const styleProps = Object.entries(propsConfig).filter(
    ([propName, field]) => 
      field.type === 'colorpicker' || 
      propName.includes('background') || 
      propName.includes('color') || 
      propName.includes('border') || 
      propName.includes('shadow')
  );
  
  const layoutProps = Object.entries(propsConfig).filter(
    ([propName]) => 
      propName.includes('padding') || 
      propName.includes('margin') || 
      propName.includes('width') || 
      propName.includes('height') || 
      propName.includes('position') || 
      propName.includes('display') || 
      propName.includes('flex') || 
      propName.includes('align') || 
      propName.includes('justify')
  );
  
  const typographyProps = Object.entries(propsConfig).filter(
    ([propName]) => 
      propName.includes('font') || 
      propName.includes('text') || 
      propName.includes('line') || 
      propName.includes('letter') || 
      propName === 'alignment'
  );
  
  const contentProps = Object.entries(propsConfig).filter(
    ([propName, field]) => 
      (field.type === 'text' || field.type === 'textarea') && 
      !typographyProps.some(([name]) => name === propName) && 
      !styleProps.some(([name]) => name === propName) && 
      !layoutProps.some(([name]) => name === propName)
  );
  
  const effectProps = Object.entries(propsConfig).filter(
    ([propName]) => 
      propName.includes('hover') || 
      propName.includes('animation') || 
      propName.includes('transition') || 
      propName.includes('transform')
  );
  
  const handleChange = (propName, value) => {
    updateBrickProps(selectedBrick.id, { [propName]: value });
  };
  
  const renderField = (propName, field) => {
    const value = selectedBrick.props[propName] !== undefined 
      ? selectedBrick.props[propName] 
      : field.defaultValue;
      
    switch (field.type) {
      case 'text':
        return (
          <PropertyRow key={propName}>
            <PropertyLabel>{field.label || propName}</PropertyLabel>
            <TextInput
              type="text"
              value={value || ''}
              onChange={(e) => handleChange(propName, e.target.value)}
            />
          </PropertyRow>
        );
        
      case 'textarea':
        return (
          <PropertyRow key={propName}>
            <PropertyLabel>{field.label || propName}</PropertyLabel>
            <TextArea
              value={value || ''}
              onChange={(e) => handleChange(propName, e.target.value)}
            />
          </PropertyRow>
        );
        
      case 'colorpicker': {
        // Define a set of common colors for the palette
        const commonColors = [
          '#ffffff', '#f3f4f6', '#d1d5db', '#6b7280', '#374151', '#111827', 
          '#fee2e2', '#fecaca', '#ef4444', '#b91c1c', '#7f1d1d', '#450a0a',
          '#ecfdf5', '#a7f3d0', '#10b981', '#047857', '#064e3b', '#022c22',
          '#eff6ff', '#bfdbfe', '#3b82f6', '#1d4ed8', '#1e40af', '#1e3a8a',
          '#fdf2f8', '#fbcfe8', '#ec4899', '#be185d', '#831843', '#500724',
          '#f5f3ff', '#ddd6fe', '#8b5cf6', '#6d28d9', '#4c1d95', '#2e1065'
        ];
        
        return (
          <PropertyRow key={propName}>
            <PropertyLabel>{field.label || propName}</PropertyLabel>
            <ColorPickerWrapper>
              <ColorPreview color={value || '#000000'}>
                <ColorInput
                  type="color"
                  value={value || '#000000'}
                  onChange={(e) => handleChange(propName, e.target.value)}
                />
              </ColorPreview>
              <TextInput
                type="text"
                value={value || ''}
                onChange={(e) => handleChange(propName, e.target.value)}
                style={{ flex: 1 }}
              />
            </ColorPickerWrapper>
            
            <ColorPalette>
              {commonColors.slice(0, 18).map((color, index) => (
                <ColorSwatch 
                  key={index}
                  color={color}
                  selected={value === color}
                  onClick={() => handleChange(propName, color)}
                />
              ))}
            </ColorPalette>
          </PropertyRow>
        );
      }
        
      case 'number':
        return (
          <PropertyRow key={propName}>
            <PropertyLabel>{field.label || propName}</PropertyLabel>
            <NumberInputWrapper>
              <NumberInput
                type="number"
                value={value || 0}
                onChange={(e) => handleChange(propName, Number(e.target.value))}
              />
              {field.unit && <UnitLabel>{field.unit}</UnitLabel>}
            </NumberInputWrapper>
          </PropertyRow>
        );
        
      case 'select':
        return (
          <PropertyRow key={propName}>
            <PropertyLabel>{field.label || propName}</PropertyLabel>
            <Select
              value={value || ''}
              onChange={(e) => handleChange(propName, e.target.value)}
            >
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </PropertyRow>
        );
        
      case 'boolean':
        return (
          <PropertyRow key={propName}>
            <CheckboxWrapper>
              <Checkbox
                type="checkbox"
                checked={value || false}
                onChange={(e) => handleChange(propName, e.target.checked)}
                id={`checkbox-${propName}`}
              />
              <PropertyLabel htmlFor={`checkbox-${propName}`} style={{ marginBottom: 0 }}>
                {field.label || propName}
              </PropertyLabel>
            </CheckboxWrapper>
          </PropertyRow>
        );
        
      default:
        return null;
    }
  };

  // Special rendering for alignment buttons
  const renderAlignmentButtons = (propName, field) => {
    const value = selectedBrick.props[propName] || field.defaultValue;
    
    return (
      <PropertyRow key={propName}>
        <PropertyLabel>{field.label || propName}</PropertyLabel>
        <ButtonGroup>
          <IconButton 
            active={value === 'left'} 
            onClick={() => handleChange(propName, 'left')}
            title="Align Left"
          >
            <AlignLeft size={16} />
          </IconButton>
          <IconButton 
            active={value === 'center'} 
            onClick={() => handleChange(propName, 'center')}
            title="Align Center"
          >
            <AlignCenter size={16} />
          </IconButton>
          <IconButton 
            active={value === 'right'} 
            onClick={() => handleChange(propName, 'right')}
            title="Align Right"
          >
            <AlignRight size={16} />
          </IconButton>
          {field.options.includes('justify') && (
            <IconButton 
              active={value === 'justify'} 
              onClick={() => handleChange(propName, 'justify')}
              title="Justify"
            >
              <AlignJustify size={16} />
            </IconButton>
          )}
        </ButtonGroup>
      </PropertyRow>
    );
  };
  
  // Special rendering for font weight buttons
  const renderFontWeightButtons = (propName, field) => {
    const value = selectedBrick.props[propName] || field.defaultValue;
    
    return (
      <PropertyRow key={propName}>
        <PropertyLabel>{field.label || propName}</PropertyLabel>
        <ButtonGroup>
          <IconButton 
            active={parseInt(value) < 500} 
            onClick={() => handleChange(propName, '400')}
            title="Normal"
          >
            Normal
          </IconButton>
          <IconButton 
            active={parseInt(value) >= 500 && parseInt(value) < 700} 
            onClick={() => handleChange(propName, '500')}
            title="Medium"
          >
            Medium
          </IconButton>
          <IconButton 
            active={parseInt(value) >= 700} 
            onClick={() => handleChange(propName, '700')}
            title="Bold"
          >
            <BoldIcon size={16} />
          </IconButton>
        </ButtonGroup>
      </PropertyRow>
    );
  };
  
  // Special rendering for size slider
  const renderSizeSlider = (propName, field, min = 8, max = 48) => {
    const value = parseInt(selectedBrick.props[propName]) || parseInt(field.defaultValue) || 16;
    
    return (
      <PropertyRow key={propName}>
        <PropertyLabel>{field.label || propName}</PropertyLabel>
        <SliderWrapper>
          <SliderControl
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => handleChange(propName, e.target.value)}
          />
          <SliderValue>
            <span>{min}px</span>
            <span>{value}px</span>
            <span>{max}px</span>
          </SliderValue>
        </SliderWrapper>
      </PropertyRow>
    );
  };
  
  return (
    <SidebarContainer>
      <Header>
        <Title>{inspectorConfig.displayName || selectedBrick.type}</Title>
      </Header>
      
      {/* Typography Section */}
      {typographyProps.length > 0 && (
        <AccordionSection>
          <AccordionHeader 
            onClick={() => toggleSection('typography')}
            isOpen={openSections.typography}
          >
            <Type size={16} />
            Typography
            {openSections.typography ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </AccordionHeader>
          <AccordionBody isOpen={openSections.typography}>
            {typographyProps.map(([propName, field]) => {
              // Special handling for specific props
              if (propName === 'alignment' && field.options?.includes('left', 'center', 'right')) {
                return renderAlignmentButtons(propName, field);
              } else if (propName === 'fontWeight' || propName === 'font-weight') {
                return renderFontWeightButtons(propName, field);
              } else if (propName === 'fontSize' || propName === 'font-size') {
                return renderSizeSlider(propName, field);
              } else {
                return renderField(propName, field);
              }
            })}
          </AccordionBody>
        </AccordionSection>
      )}
      
      {/* Style Section */}
      {styleProps.length > 0 && (
        <AccordionSection>
          <AccordionHeader 
            onClick={() => toggleSection('style')}
            isOpen={openSections.style}
          >
            <Palette size={16} />
            Style
            {openSections.style ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </AccordionHeader>
          <AccordionBody isOpen={openSections.style}>
            {styleProps.map(([propName, field]) => renderField(propName, field))}
          </AccordionBody>
        </AccordionSection>
      )}
      
      {/* Layout Section */}
      {layoutProps.length > 0 && (
        <AccordionSection>
          <AccordionHeader 
            onClick={() => toggleSection('layout')}
            isOpen={openSections.layout}
          >
            <LayoutGrid size={16} />
            Layout
            {openSections.layout ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </AccordionHeader>
          <AccordionBody isOpen={openSections.layout}>
            {layoutProps.map(([propName, field]) => renderField(propName, field))}
          </AccordionBody>
        </AccordionSection>
      )}
      
      {/* Effects Section */}
      {effectProps.length > 0 && (
        <AccordionSection>
          <AccordionHeader 
            onClick={() => toggleSection('effects')}
            isOpen={openSections.effects}
          >
            <Sliders size={16} />
            Effects
            {openSections.effects ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </AccordionHeader>
          <AccordionBody isOpen={openSections.effects}>
            {effectProps.map(([propName, field]) => renderField(propName, field))}
          </AccordionBody>
        </AccordionSection>
      )}
      
      {/* Content Section - Only shown for special cases that aren't handled by inline editing */}
      {contentProps.length > 0 && (
        <AccordionSection>
          <AccordionHeader 
            onClick={() => toggleSection('content')}
            isOpen={openSections.content}
          >
            <Box size={16} />
            Additional Content
            {openSections.content ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </AccordionHeader>
          <AccordionBody isOpen={openSections.content}>
            {contentProps.map(([propName, field]) => renderField(propName, field))}
          </AccordionBody>
        </AccordionSection>
      )}
      
      {/* Actions Section */}
      <ActionButtons>
        <NudgeControls>
          <ActionButton 
            onClick={() => moveBlockUp(selectedBrick.id)}
            title="Move Up"
          >
            <ArrowUpToLine size={16} />
            Move Up
          </ActionButton>
          <ActionButton 
            onClick={() => moveBlockDown(selectedBrick.id)}
            title="Move Down"
          >
            <ArrowDownToLine size={16} />
            Move Down
          </ActionButton>
        </NudgeControls>
        
        <ActionButton 
          onClick={() => duplicateBrick(selectedBrick.id)}
          title="Duplicate"
        >
          <Layers size={16} />
          Duplicate Element
        </ActionButton>
        
        <ActionButton 
          onClick={() => removeBrick(selectedBrick.id)}
          title="Delete"
          style={{ color: '#ef4444', borderColor: '#fecaca' }}
        >
          <Trash2 size={16} />
          Delete Element
        </ActionButton>
      </ActionButtons>
    </SidebarContainer>
  );
};

export default SimplifiedPropertiesSidebar;
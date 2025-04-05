import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useBuilderContext } from '../context/BuilderContext';
import { BrickRegistry } from '../bricks/BrickRegistry';
import { Maximize2, BoxSelect, Palette, Grid, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, Type, Feather, Layout, Rows } from 'lucide-react';
import { format as formatDate } from 'date-fns';

// Helper function to get brick hierarchy
function getBrickHierarchy(brickId, bricks, path = []) {
  for (const brick of bricks) {
    const newPath = [...path, brick];
    if (brick.id === brickId) return newPath;
    if (brick.components) {
      const result = getBrickHierarchy(brickId, brick.components, newPath);
      if (result) return result;
    }
  }
  return null;
}

// Styled Components for UI
const SidebarContainer = styled.div`
  width: 320px;
  padding: 12px;
  border: 1px solid #ddd;
  background: #fff;
  height: 100%;
  overflow-y: auto;
  font-family: 'Inter', Arial, sans-serif;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const Section = styled.div`
  padding: 16px 0;
  border-bottom: 1px solid #eee;
`;

const SectionTitle = styled.div`
  font-size: 14px;
  margin-bottom: 12px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Field = styled.div`
  margin-bottom: 12px;
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  font-size: 13px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f8f9fa;
  &:focus {
    outline: none;
    border-color: #aaa;
  }
`;

const NumberInputWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const UnitLabel = styled.span`
  margin-left: 4px;
  font-size: 13px;
  color: #555;
`;

const FlexRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

const ColorPreview = styled.div`
  height: 40px;
  border-radius: 4px;
  background-color: ${(props) => props.color};
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
`;

const ThemeSwatches = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 12px;
`;

const ThemeSwatch = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background-color: ${(props) => props.color};
  border-radius: 4px;
  border: 2px solid ${(props) => (props.active ? '#000' : 'transparent')};
  cursor: pointer;
`;

const ClearButton = styled.button`
  background: none;
  border: 1px solid #ccc;
  padding: 4px 12px;
  font-size: 12px;
  border-radius: 4px;
  margin-top: 8px;
  cursor: pointer;
  &:hover {
    background: #eee;
  }
`;

const ToggleIconWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
  gap: 16px;
`;

const ToggleIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const ToggleIconLabel = styled.span`
  margin-top: 4px;
  font-size: 10px;
  color: #555;
`;

const IconButton = styled.button`
  background-color: transparent;
  border: none;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  cursor: pointer;
  &:hover {
    background-color: #e7e9eb;
    color: #333;
  }
  &.active {
    background-color: #ddd;
    color: #333;
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 20px;
    
    &:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
  }
  
  input:checked + span {
    background-color: #007bff;
  }
  
  input:checked + span:before {
    transform: translateX(20px);
  }
`;

// Main Component
const PropertiesSidebar = () => {
  const { selectedBrickId, pageData, getBrickById, updateBrickProps, updateNestedBrickProps } = useBuilderContext();
  const [showMargin, setShowMargin] = useState(false);
  const [showPadding, setShowPadding] = useState(false);
  const [currentColor, setCurrentColor] = useState('#ffffff');

  const themeSwatches = [
    { label: 'White', color: '#FFFFFF' },
    { label: 'Black', color: '#000000' },
    { label: 'Gray', color: '#999999' },
    { label: 'Dark Gray', color: '#666666' },
    { label: 'Accent / Brown', color: '#bfa890' },
    { label: 'Accent / Green', color: '#95ad90' },
    { label: 'Accent / Silver', color: '#bcc4c0' },
    { label: 'Accent / Three', color: '#D8613C' },
  ];

  // Get the selected brick and its hierarchy
  const hierarchy = useMemo(() => getBrickHierarchy(selectedBrickId, pageData), [selectedBrickId, pageData]);
  const selectedBrick = useMemo(
    () => (hierarchy?.[hierarchy.length - 1]) || getBrickById(selectedBrickId),
    [hierarchy, selectedBrickId, getBrickById]
  );

  if (!selectedBrick) {
    return <SidebarContainer>Select a brick to edit its properties</SidebarContainer>;
  }

  const brickDef = BrickRegistry[selectedBrick.type];
  if (!brickDef || !brickDef.inspector) {
    return <SidebarContainer>No properties available for this block type</SidebarContainer>;
  }

  const inspectorConfig =
    typeof brickDef.inspector.getInspectorProps === 'function'
      ? brickDef.inspector.getInspectorProps(selectedBrick, selectedBrickId)
      : brickDef.inspector;

  const propsConfig = inspectorConfig.props || {};

  const sectionMappings = {
    General: ['useCustomDuration', 'days', 'hours', 'minutes', 'seconds', 'targetDate'],
    Links: ['link'],
    Icon: ['iconName', 'iconSize', 'iconPosition'],
    Layout: ['width', 'height', 'padding', 'margin', 'gap', 'alignment', 'direction'],
    Spacing: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
    Style: ['bgColor', 'color', 'borderRadius', 'border', 'boxShadow'],
    Typography: ['font', 'weight', 'fontSize', 'letterSpacing', 'lineHeight', 'fontWeight', 'textAlign'],
    Fill: ['imageSrc', 'fillSize'],
    Image: ['imageUrl', 'altText'],
    Video: ['videoUrl', 'autoplay', 'controls', 'loop', 'muted']
  };

  // Helper to strip units from values
  const stripUnit = (value, unit) => {
    if (typeof value === 'string' && value.endsWith(unit)) {
      return parseFloat(value);
    }
    return value;
  };

  // Handle property updates
  const handleChange = (propName, value, unit = '') => {
    const formattedValue = unit ? `${value}${unit}` : value;
    if (hierarchy && hierarchy.length > 1 && updateNestedBrickProps) {
      const containerBrick = hierarchy[hierarchy.length - 2];
      updateNestedBrickProps(containerBrick.id, selectedBrickId, { [propName]: formattedValue });
    } else {
      updateBrickProps(selectedBrickId, { [propName]: formattedValue });
    }
  };

  const handleDateChange = (propName, value) => {
    updateBrickProps(selectedBrickId, { [propName]: new Date(value).getTime() });
  };

  // Render individual fields based on property type
  const renderField = (propName, field) => {
    // Add handling for direction property with icons
    if (propName === 'direction' && field.icon) {
      return (
        <FlexRow>
          <IconButton
            className={selectedBrick.props[propName] === 'row' ? 'active' : ''}
            onClick={() => handleChange(propName, 'row')}
            title="Horizontal Layout"
          >
            <Layout size={16} />
          </IconButton>
          <IconButton
            className={selectedBrick.props[propName] === 'column' ? 'active' : ''}
            onClick={() => handleChange(propName, 'column')}
            title="Vertical Layout"
          >
            <Rows size={16} />
          </IconButton>
        </FlexRow>
      );
    }

    if (propName === 'alignment') {
      return (
        <FlexRow>
          <IconButton
            className={selectedBrick.props[propName] === 'left' ? 'active' : ''}
            onClick={() => handleChange(propName, 'left')}
          >
            <AlignLeft size={16} />
          </IconButton>
          <IconButton
            className={selectedBrick.props[propName] === 'center' ? 'active' : ''}
            onClick={() => handleChange(propName, 'center')}
          >
            <AlignCenter size={16} />
          </IconButton>
          <IconButton
            className={selectedBrick.props[propName] === 'right' ? 'active' : ''}
            onClick={() => handleChange(propName, 'right')}
          >
            <AlignRight size={16} />
          </IconButton>
        </FlexRow>
      );
    }

    switch (field.type) {
      case 'text':
        return (
          <Input
            type="text"
            value={selectedBrick.props[propName] ?? field.defaultValue ?? ''}
            onChange={(e) => handleChange(propName, e.target.value)}
          />
        );
      case 'number': {
        const unit = field.unit || '';
        const numericValue = stripUnit(selectedBrick.props[propName], unit);
        return (
          <NumberInputWrapper>
            <Input
              type="number"
              value={numericValue ?? field.defaultValue ?? ''}
              onChange={(e) => handleChange(propName, Number(e.target.value), unit)}
            />
            {unit && <UnitLabel>{unit}</UnitLabel>}
          </NumberInputWrapper>
        );
      }
      case 'colorpicker':
        return (
          <div>
            <ColorPreview color={currentColor}>{currentColor}</ColorPreview>
            <ThemeSwatches>
              {themeSwatches.map((swatch, i) => (
                <ThemeSwatch
                  key={i}
                  color={swatch.color}
                  active={swatch.color.toLowerCase() === currentColor.toLowerCase()}
                  onClick={() => {
                    setCurrentColor(swatch.color);
                    handleChange(propName, swatch.color);
                  }}
                />
              ))}
            </ThemeSwatches>
            <ClearButton
              onClick={() => {
                setCurrentColor('#ffffff');
                handleChange(propName, '#ffffff');
              }}
            >
              Clear
            </ClearButton>
            <Input
              type="color"
              value={selectedBrick.props[propName] || field.defaultValue || '#000000'}
              onChange={(e) => {
                setCurrentColor(e.target.value);
                handleChange(propName, e.target.value);
              }}
            />
          </div>
        );
      case 'boolean':
        return (
          <ToggleSwitch style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={selectedBrick.props[propName] ?? field.defaultValue ?? false}
              onChange={(e) => handleChange(propName, e.target.checked)}
            />
            <span />
          </ToggleSwitch>
        );
      case 'date':
        const dateValue = new Date(selectedBrick.props[propName] || field.defaultValue);
        return (
          <div>
            <Label>{field.label}</Label>
            <Input
              type="datetime-local"
              value={formatDate(dateValue, "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) => handleDateChange(propName, e.target.value)}
            />
          </div>
        );
      default:
        return <div>Unsupported field type: {field.type}</div>;
    }
  };

  // Render a section with its properties
  const renderSection = (sectionName) => {
    const properties = Object.entries(propsConfig)
      .filter(([propName, field]) => {
        // Add show condition check
        if (field.show && !field.show(selectedBrick.props)) return false;
        // Include if property has explicit section
        if (field.section === sectionName) return true;
        // Or if property name is in sectionMappings
        return sectionMappings[sectionName]?.includes(propName);
      })
      .map(([propName]) => propName);

    if (properties.length === 0) return null;

    return (
      <Section>
        <SectionTitle>
          {sectionName}
          {sectionName === 'Content' && <Type size={16} />}
          {sectionName === 'Icon' && <Feather size={16} />}
          {sectionName === 'Style' && <Palette size={16} />}
          {sectionName === 'Layout' && <Layout size={16} />}
          {sectionName === 'Typography' && <Type size={16} />}
        </SectionTitle>
        {properties.map((propName) => {
          const field = propsConfig[propName];
          if (!field) return null; // Skip if field config not found
          return (
            <Field key={propName}>
              <Label>{field.label || propName}</Label>
              {renderField(propName, field)}
            </Field>
          );
        })}
      </Section>
    );
  };

  return (
    <SidebarContainer>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <h3 style={{
          color: '#333',
          padding: '10px 15px', 
          margin: '0',
          backgroundColor: '#f7f9fc', 
          fontSize: '18px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          textAlign: 'center',
          marginBottom: '20px',
        }}>
          {inspectorConfig.displayName || selectedBrick.type} Properties
        </h3>
      </div>
      {renderSection('General')}
      {['Links', 'Icon', 'Style', 'Layout', 'Typography'].map((sectionName) => {
        // Only show Icon section for ButtonWithIcon brick
        if (sectionName === 'Icon' && selectedBrick.type !== 'buttonWithIcon') {
          return null;
        }
        return renderSection(sectionName);
      })}
    </SidebarContainer>
  );
};

export default PropertiesSidebar;
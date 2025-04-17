// Create this file at: src/Pages/Dashboard/WebsiteBuilder/components/SimplifiedPropertiesSidebar.jsx
import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useBuilderContext } from '../context/BuilderContext';
import { BrickRegistry } from '../bricks/BrickRegistry';

// Icons - assuming you have lucide-react installed
import { Palette, Type, Layout, Image, Link } from 'lucide-react';

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

// Styled Components
const SidebarContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 16px;
  background: #fff;
  overflow-y: auto;
  font-family: 'Inter', sans-serif;
  border-left: 1px solid #eee;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #eee;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #333;
`;

const EmptyState = styled.div`
  padding: 24px;
  text-align: center;
  color: #666;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
  border-bottom: 1px solid #eee;
`;

const Tab = styled.button`
  padding: 8px 16px;
  background: ${props => props.active ? '#f5f7fa' : 'transparent'};
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#2563eb' : 'transparent'};
  color: ${props => props.active ? '#2563eb' : '#666'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: ${props => props.active ? '#f5f7fa' : '#f9fafb'};
  }
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h4`
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Field = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 6px;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  }
`;

const ColorPicker = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ColorPreview = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: ${props => props.color};
  border: 1px solid #ddd;
`;

const ColorInput = styled.input`
  width: 100%;
  height: 32px;
  cursor: pointer;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  input {
    width: 16px;
    height: 16px;
  }
`;

const SimplifiedPropertiesSidebar = () => {
  const { selectedBrickId, pageData, updateBrickProps, getBrickById } = useBuilderContext();
  const [activeTab, setActiveTab] = useState('content');
  
  // Get the selected brick and its hierarchy for breadcrumb display
  const hierarchy = useMemo(
    () => getBrickHierarchy(selectedBrickId, pageData),
    [selectedBrickId, pageData]
  );
  
  const selectedBrick = useMemo(
    () => hierarchy?.[hierarchy.length - 1] || getBrickById(selectedBrickId),
    [hierarchy, selectedBrickId, getBrickById]
  );
  
  if (!selectedBrick) {
    return (
      <SidebarContainer>
        <EmptyState>
          <p>Select an element to edit its properties</p>
        </EmptyState>
      </SidebarContainer>
    );
  }
  
  const brickDef = BrickRegistry[selectedBrick.type];
  if (!brickDef || !brickDef.inspector) {
    return (
      <SidebarContainer>
        <EmptyState>
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
  
  // Group props by category for tabs
  const contentProps = Object.entries(propsConfig).filter(
    ([_, field]) => field.type === 'text' || field.type === 'textarea'
  );
  
  const styleProps = Object.entries(propsConfig).filter(
    ([_, field]) => field.type === 'colorpicker' || field.type === 'number'
  );
  
  const layoutProps = Object.entries(propsConfig).filter(
    ([propName]) => propName.includes('padding') || propName.includes('margin') || propName.includes('width') || propName.includes('height')
  );
  
  const handleChange = (propName, value) => {
    updateBrickProps(selectedBrick.id, { [propName]: value });
  };
  
  const renderField = (propName, field) => {
    switch (field.type) {
      case 'text':
        return (
          <Field key={propName}>
            <Label>{field.label || propName}</Label>
            <TextInput
              type="text"
              value={selectedBrick.props[propName] || field.defaultValue || ''}
              onChange={(e) => handleChange(propName, e.target.value)}
            />
          </Field>
        );
        
      case 'textarea':
        return (
          <Field key={propName}>
            <Label>{field.label || propName}</Label>
            <TextArea
              value={selectedBrick.props[propName] || field.defaultValue || ''}
              onChange={(e) => handleChange(propName, e.target.value)}
            />
          </Field>
        );
        
      case 'colorpicker':
        return (
          <Field key={propName}>
            <Label>{field.label || propName}</Label>
            <ColorPicker>
              <ColorPreview color={selectedBrick.props[propName] || field.defaultValue} />
              <ColorInput
                type="color"
                value={selectedBrick.props[propName] || field.defaultValue || '#000000'}
                onChange={(e) => handleChange(propName, e.target.value)}
              />
            </ColorPicker>
          </Field>
        );
        
      case 'number':
        return (
          <Field key={propName}>
            <Label>{field.label || propName}{field.unit ? ` (${field.unit})` : ''}</Label>
            <TextInput
              type="number"
              value={selectedBrick.props[propName] || field.defaultValue || 0}
              onChange={(e) => handleChange(propName, Number(e.target.value))}
            />
          </Field>
        );
        
      case 'select':
        return (
          <Field key={propName}>
            <Label>{field.label || propName}</Label>
            <Select
              value={selectedBrick.props[propName] || field.defaultValue || ''}
              onChange={(e) => handleChange(propName, e.target.value)}
            >
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </Field>
        );
        
      case 'boolean':
        return (
          <Field key={propName}>
            <Label>{field.label || propName}</Label>
            <Checkbox>
              <input
                type="checkbox"
                checked={selectedBrick.props[propName] || field.defaultValue || false}
                onChange={(e) => handleChange(propName, e.target.checked)}
              />
            </Checkbox>
          </Field>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <SidebarContainer>
      <Header>
        <Title>{inspectorConfig.displayName || selectedBrick.type}</Title>
      </Header>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'content'} 
          onClick={() => setActiveTab('content')}
        >
          <Type size={16} />
          Content
        </Tab>
        <Tab 
          active={activeTab === 'style'} 
          onClick={() => setActiveTab('style')}
        >
          <Palette size={16} />
          Style
        </Tab>
        <Tab 
          active={activeTab === 'layout'} 
          onClick={() => setActiveTab('layout')}
        >
          <Layout size={16} />
          Layout
        </Tab>
        {(selectedBrick.type === 'image' || selectedBrick.type === 'video') && (
          <Tab 
            active={activeTab === 'media'} 
            onClick={() => setActiveTab('media')}
          >
            <Image size={16} />
            Media
          </Tab>
        )}
        {selectedBrick.type === 'button' && (
          <Tab 
            active={activeTab === 'link'} 
            onClick={() => setActiveTab('link')}
          >
            <Link size={16} />
            Link
          </Tab>
        )}
      </TabContainer>
      
      {activeTab === 'content' && (
        <Section>
          {contentProps.length > 0 ? (
            contentProps.map(([propName, field]) => renderField(propName, field))
          ) : (
            <EmptyState>
              <p>No content properties available</p>
            </EmptyState>
          )}
        </Section>
      )}
      
      {activeTab === 'style' && (
        <Section>
          {styleProps.length > 0 ? (
            styleProps.map(([propName, field]) => renderField(propName, field))
          ) : (
            <EmptyState>
              <p>No style properties available</p>
            </EmptyState>
          )}
        </Section>
      )}
      
      {activeTab === 'layout' && (
        <Section>
          {layoutProps.length > 0 ? (
            layoutProps.map(([propName, field]) => renderField(propName, field))
          ) : (
            <EmptyState>
              <p>No layout properties available</p>
            </EmptyState>
          )}
        </Section>
      )}
      
      {activeTab === 'media' && selectedBrick.type === 'image' && (
        <Section>
          <Field>
            <Label>Image URL</Label>
            <TextInput
              type="text"
              value={selectedBrick.props.src || ''}
              onChange={(e) => handleChange('src', e.target.value)}
            />
          </Field>
          <Field>
            <Label>Alt Text</Label>
            <TextInput
              type="text"
              value={selectedBrick.props.alt || ''}
              onChange={(e) => handleChange('alt', e.target.value)}
            />
          </Field>
        </Section>
      )}
      
      {activeTab === 'link' && selectedBrick.type === 'button' && (
        <Section>
          <Field>
            <Label>URL</Label>
            <TextInput
              type="text"
              value={selectedBrick.props.link || '#'}
              onChange={(e) => handleChange('link', e.target.value)}
            />
          </Field>
          <Field>
            <Label>Open in new tab</Label>
            <Checkbox>
              <input
                type="checkbox"
                checked={selectedBrick.props.target === '_blank'}
                onChange={(e) => handleChange('target', e.target.checked ? '_blank' : '')}
              />
            </Checkbox>
          </Field>
        </Section>
      )}
    </SidebarContainer>
  );
};

export default SimplifiedPropertiesSidebar;
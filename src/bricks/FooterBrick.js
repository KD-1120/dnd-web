import React, { useState } from 'react';
import styled from 'styled-components';
import { Container, Row, Col } from 'react-bootstrap';
import { useBuilderContext } from '../context/BuilderContext';
import { ImageBrickComponent } from './ImageBrick';
import { TextBrickComponent } from './TextBrick';
import { IconBrickComponent } from './IconBrick';
import { LinksBrickComponent } from './LinksBrick';
import { v4 as uuidv4 } from 'uuid';
import { PlusCircle } from 'lucide-react';
import { useViewMode } from '../context/ViewModeContext';

const FooterWrapper = styled.footer`
  background-color: ${props => props.bgColor || '#f8f9fa'};
  padding: ${props => props.padding || '3rem 0'};
  margin-top: 3rem;
  border-top: 1px solid #dee2e6;
`;

const FooterContent = styled.div`
  max-width: ${props => props.maxWidth || '1200px'};
  margin: 0 auto;
  padding: 0 20px;
`;

const FooterColumn = styled(Col)`
  margin-bottom: 2rem;
`;

const SocialIconsWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 1rem;
`;

const AddButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 8px 0;
  color: #007bff;
  display: flex;
  align-items: center;
  gap: 4px;
  &:hover {
    color: #0056b3;
  }
`;

export function FooterBrickComponent({ brick, onSelect }) {
  const { id, props, components = [] } = brick;
  const { selectedBrickId, updateNestedBrickProps, setPageData, addNestedComponent, removeNestedComponent } = useBuilderContext();
  const { viewMode } = useViewMode();
  const isSelected = selectedBrickId === id;
  const isPreview = viewMode === 'preview';

  const [showIconSelector, setShowIconSelector] = useState(false);

  const handleChildSelect = (childId) => {
    onSelect(childId);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect?.(id);
  };

  const handleAddLink = () => {
    addNestedComponent(id, 'links', {
      label: 'New Link',
      link: '#',
      fontSize: '14px',
      color: '#6c757d',
      marginBottom: '0.5rem'
    });
  };

  const handleAddIcon = () => {
    setShowIconSelector(true);
  };

  const handleIconSelect = (iconProps) => {
    addNestedComponent(id, 'icon', {
      iconName: iconProps.iconName,
      size: 24,
      color: '#495057'
    }, 'social');
    setShowIconSelector(false);
  };

  const handleDelete = (componentId) => {
    removeNestedComponent(id, componentId);
  };

  React.useEffect(() => {
    if (!components.length) {
      const newComponents = [
        {
          id: uuidv4(),
          type: 'image',
          props: {
            src: '',
            alt: 'Company Logo',
            width: '150px',
            height: 'auto',
            marginBottom: '1rem'
          }
        },
        {
          id: uuidv4(),
          type: 'text',
          props: {
            text: 'Your company description goes here. Make it engaging and informative.',
            fontSize: '14px',
            color: '#6c757d',
            lineHeight: '1.5',
            marginBottom: '2rem'
          }
        },
        {
          id: uuidv4(),
          type: 'links',
          props: {
            items: [
              { label: 'About Us', url: '/about' },
              { label: 'Services', url: '/services' },
              { label: 'Contact', url: '/contact' },
              { label: 'Privacy Policy', url: '/privacy' }
            ],
            fontSize: '14px',
            color: '#6c757d',
            marginBottom: '0.5rem'
          }
        },
        {
          id: uuidv4(),
          type: 'icon',
          section: 'social',
          props: {
            iconName: 'LuFacebook',
            size: 24,
            color: '#495057'
          }
        },
        {
          id: uuidv4(),
          type: 'icon',
          section: 'social',
          props: {
            iconName: 'LuTwitter',
            size: 24,
            color: '#495057'
          }
        },
        {
          id: uuidv4(),
          type: 'icon',
          section: 'social',
          props: {
            iconName: 'LuInstagram',
            size: 24,
            color: '#495057'
          }
        },
        {
          id: uuidv4(),
          type: 'text',
          props: {
            text: `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
            fontSize: '14px',
            color: '#6c757d',
            textAlign: 'center',
            marginTop: '2rem'
          }
        }
      ];

      setPageData(prevPageData => 
        prevPageData.map(b => {
          if (b.id === id) {
            return { ...b, components: newComponents };
          }
          return b;
        })
      );
    }
  }, [id, components.length, setPageData]);

  return (
    <FooterWrapper 
      onClick={handleClick}
      style={{ border: isSelected ? '2px solid #10a5e0' : 'none' }}
      {...props}
    >
      <Container>
        <Row>
          <FooterColumn md={4}>
            {components.map(component => {
              if (component.type === 'image' || component.type === 'text') {
                const Component = component.type === 'image' ? ImageBrickComponent : TextBrickComponent;
                return (
                  <Component
                    key={component.id}
                    brick={component}
                    isSelected={selectedBrickId === component.id}
                    onSelect={() => handleChildSelect(component.id)}
                    onUpdate={(newProps) => updateNestedBrickProps(id, component.id, newProps)}
                  />
                );
              }
              return null;
            })}
          </FooterColumn>

          <FooterColumn md={4}>
            {components.map(component => {
              if (component.type === 'links') {
                return (
                  <LinksBrickComponent
                    key={component.id}
                    brick={component}
                    isSelected={selectedBrickId === component.id}
                    onSelect={() => handleChildSelect(component.id)}
                    onUpdate={(newProps) => updateNestedBrickProps(id, component.id, newProps)}
                    onDelete={() => handleDelete(component.id)}
                  />
                );
              }
              return null;
            })}
            {!isPreview && isSelected && (
              <AddButton onClick={handleAddLink}>
                <PlusCircle size={16} />
                Add Link
              </AddButton>
            )}
          </FooterColumn>

          <FooterColumn md={4}>
            <SocialIconsWrapper>
              {components.map(component => {
                if (component.type === 'icon' && component.section === 'social') {
                  return (
                    <IconBrickComponent
                      key={component.id}
                      brick={{
                        ...component,
                        props: {
                          ...component.props,
                          size: component.props.size || 24
                        }
                      }}
                      isSelected={selectedBrickId === component.id}
                      onSelect={() => handleChildSelect(component.id)}
                      onUpdate={(newProps) => updateNestedBrickProps(id, component.id, newProps)}
                      onDelete={() => handleDelete(component.id)}
                    />
                  );
                }
                return null;
              })}
            </SocialIconsWrapper>
            {!isPreview && isSelected && (
              <AddButton onClick={handleAddIcon}>
                <PlusCircle size={16} />
                Add Icon
              </AddButton>
            )}
          </FooterColumn>
        </Row>

        {components.map(component => {
          if (component.type === 'text' && component.props.text?.includes('©')) {
            return (
              <TextBrickComponent
                key={component.id}
                brick={component}
                isSelected={selectedBrickId === component.id}
                onSelect={() => handleChildSelect(component.id)}
                onUpdate={(newProps) => updateNestedBrickProps(id, component.id, newProps)}
              />
            );
          }
          return null;
        })}
      </Container>

      {showIconSelector && (
        <IconBrickComponent
          brick={{
            type: 'icon',
            props: {
              iconName: 'LuShare2',
              size: 24,
              color: '#495057'
            }
          }}
          isTemporary={true}
          onUpdate={handleIconSelect}
          onClose={() => setShowIconSelector(false)}
        />
      )}
    </FooterWrapper>
  );
}

export const FooterInspector = {
  displayName: 'Footer',
  getInspectorProps: (brick, selectedBrickId) => {
    const selectedComponent = brick.components?.find(comp => comp.id === selectedBrickId);
    
    if (selectedComponent) {
      switch (selectedComponent.type) {
        case 'image':
        case 'text':
        case 'icon':
        case 'links':
          return {
            id: selectedComponent.id,
            displayName: selectedComponent.type.charAt(0).toUpperCase() + selectedComponent.type.slice(1),
            props: selectedComponent.props
          };
      }
    }

    return {
      id: brick.id,
      displayName: 'Footer',
      props: {
        bgColor: { type: 'colorpicker', label: 'Background Color', defaultValue: '#f8f9fa' },
        padding: { type: 'text', label: 'Padding', defaultValue: '3rem 0' },
        maxWidth: { type: 'number', label: 'Max Width', defaultValue: 1200, unit: 'px' }
      }
    };
  }
};

export default FooterBrickComponent;

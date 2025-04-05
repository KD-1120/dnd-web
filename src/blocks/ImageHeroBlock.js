// src/bricks/HeroBrick.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { useBuilderContext } from '../context/BuilderContext';
import { TitleBrickComponent } from "../bricks/TitleBrick";
import { TextBrickComponent } from "../bricks/TextBrick";
import ButtonGroupBrickComponent from "../bricks/ButtonGroupBrick";
import { ImageBrickComponent } from "../bricks/ImageBrick";
import { v4 as uuidv4 } from 'uuid';

// Base container
const HeroSection = styled.div`
  text-align: center;
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

// Styled components for nested bricks
const HighTechText = styled(TextBrickComponent)`
  color: ${props => props.brick?.props?.color || '#10a5e0'};
  font-weight: ${props => props.brick?.props?.fontWeight || '600'};
  letter-spacing: ${props => props.brick?.props?.letterSpacing || '4px'};
  margin-bottom: ${props => props.brick?.props?.marginBottom || '20px'};
  font-size: ${props => props.brick?.props?.fontSize || '16px'};
`;

const MainTitle = styled(TitleBrickComponent)`
  margin-bottom: ${props => props.brick?.props?.marginBottom || '40px'};
  font-size: ${props => props.brick?.props?.fontSize || '48px'};
  font-weight: ${props => props.brick?.props?.fontWeight || '700'};
  color: ${props => props.brick?.props?.color || '#1e2a39'};
`;

const Description = styled(TextBrickComponent)`
  color: ${props => props.brick?.props?.color || '#566077'};
  font-size: ${props => props.brick?.props?.fontSize || '20px'};
  line-height: ${props => props.brick?.props?.lineHeight || '1.5'};
  max-width: ${props => props.brick?.props?.maxWidth || '800px'};
  margin: ${props => `0 auto ${props.brick?.props?.marginBottom || '40px'}`};
`;

const HeroImage = styled(ImageBrickComponent)`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
`;

export function ImageHeroBrickComponent({ brick, onSelect }) {
  const { id, props, components = [] } = brick;
  const { selectedBrickId, updateNestedBrickProps, setPageData } = useBuilderContext();
  const isSelected = selectedBrickId === id;

  const handleChildSelect = (childId) => {
    onSelect(childId);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect?.(id);
  };

  React.useEffect(() => {
    if (!components.length) {
      const newComponents = [
        {
          id: uuidv4(),
          type: 'text',
          props: {
            text: 'HIGH TECH',
            fontSize: '16px',
            color: '#10a5e0',
            fontWeight: '600',
            letterSpacing: '4px',
            marginBottom: '20px'
          }
        },
        {
          id: uuidv4(),
          type: 'title',
          props: {
            text: 'We develop beautiful web applications',
            fontSize: '48px',
            fontWeight: '700',
            color: '#1e2a39',
            marginBottom: '40px'
          }
        },
        {
          id: uuidv4(),
          type: 'text',
          props: {
            text: "We are a hi-tech web development company committed to delivering great products on time. We love to understand our customers' needs and exceed expectations.",
            fontSize: '20px',
            color: '#566077',
            lineHeight: '1.5',
            maxWidth: '800px',
            marginBottom: '40px'
          }
        },
        {
          id: uuidv4(),
          type: 'buttonGroup',
          props: {
            alignment: 'center',
            components: [
              {
                type: 'button',
                id: uuidv4(),
                props: {
                  label: 'Get Started',
                  bgColor: '#10a5e0',
                  color: '#ffffff',
                  fontSize: '16px'
                }
              },
              {
                type: 'button',
                id: uuidv4(),
                props: {
                  label: 'Learn More',
                  bgColor: 'transparent',
                  color: '#10a5e0',
                  border: '2px solid #10a5e0',
                  fontSize: '16px'
                }
              }
            ]
          }
        },
        {
          id: uuidv4(),
          type: 'image',
          props: {
            src: '/api/placeholder/600/480',
            alt: 'Content editing workspace with design tools and sketches',
            width: '600px',
            height: '480px'
          }
        }
      ];

      setPageData(prevPageData => {
        return prevPageData.map(b => {
          if (b.id === id) {
            return {
              ...b,
              components: newComponents
            };
          }
          return b;
        });
      });
    }
  }, [id, components.length, setPageData]);

  return (
    <Container fluid>
      <HeroSection onClick={handleClick} style={{ border: isSelected ? '2px solid #10a5e0' : 'none' }}>
        <Row>
          <Col lg={6} md={12}>
            {components.map((component) => {
              switch (component.type) {
                case 'text':
                  return component.props.text === 'HIGH TECH' ? (
                    <HighTechText
                      key={component.id}
                      brick={component}
                      isSelected={selectedBrickId === component.id}
                      onSelect={() => handleChildSelect(component.id)}
                      onUpdate={(newProps) => updateNestedBrickProps(id, component.id, newProps)}
                    />
                  ) : (
                    <Description
                      key={component.id}
                      brick={component}
                      isSelected={selectedBrickId === component.id}
                      onSelect={() => handleChildSelect(component.id)}
                      onUpdate={(newProps) => updateNestedBrickProps(id, component.id, newProps)}
                    />
                  );
                case 'title':
                  return (
                    <MainTitle
                      key={component.id}
                      brick={component}
                      isSelected={selectedBrickId === component.id}
                      onSelect={() => handleChildSelect(component.id)}
                      onUpdate={(newProps) => updateNestedBrickProps(id, component.id, newProps)}
                    />
                  );
                case 'buttonGroup':
                  return (
                    <ButtonGroupBrickComponent
                      key={component.id}
                      brick={component}
                      isSelected={selectedBrickId === component.id}
                      onSelect={() => handleChildSelect(component.id)}
                      onUpdate={(newProps) => updateNestedBrickProps(id, component.id, newProps)}
                    />
                  );
                default:
                  return null;
              }
            })}
          </Col>
          <Col lg={6} md={12}>
            {components.map((component) => {
              if (component.type === 'image') {
                return (
                  <HeroImage
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
          </Col>
        </Row>
      </HeroSection>
    </Container>
  );
}

export const ImageHeroInspector = {
  displayName: 'Image Hero',
  getInspectorProps: (brick, selectedBrickId) => {
    const selectedComponent = brick.components?.find((comp) => comp.id === selectedBrickId);
    
    if (selectedComponent) {
      switch (selectedComponent.type) {
        case "text":
          return { 
            id: selectedComponent.id, 
            displayName: "Text", 
            props: selectedComponent.props 
          };
        case "title":
          return { 
            id: selectedComponent.id, 
            displayName: "Title", 
            props: selectedComponent.props 
          };
        case "buttonGroup":
          return { 
            id: selectedComponent.id, 
            displayName: "Button Group", 
            props: selectedComponent.props 
          };
        case "image":
          return { 
            id: selectedComponent.id, 
            displayName: "Image", 
            props: selectedComponent.props 
          };
        default:
          return null;
      }
    }

    return {
      id: brick.id,
      displayName: "Image Hero",
      props: {
        maxWidth: { type: "number", label: "Max Width", defaultValue: 1200, unit: "px" },
        padding: { type: "text", label: "Padding", defaultValue: "80px 20px" }
      }
    };
  }
};

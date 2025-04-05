import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { useBuilderContext } from "../context/BuilderContext";
import { TitleBrickComponent } from "../bricks/TitleBrick";
import { TextBrickComponent } from "../bricks/TextBrick";
import ButtonGroupBrickComponent from "../bricks/ButtonGroupBrick";
import { v4 as uuidv4 } from 'uuid';

// Styled container modeled after FeatureContainer
const HeroContainer = styled.div`
  border: ${(props) => (props.isSelected ? "2px solid #10a5e0" : "none")};
  padding: ${(props) => props.padding || "80px 20px"};
  max-width: ${(props) => props.maxWidth || "1200px"};
  margin: 0 auto;
  text-align: center;
  background-color: ${(props) => props.bgColor || "#ffffff"};
`;

// Add styled components for text elements
const HighTechText = styled(TextBrickComponent)`
  font-size: ${props => props.brick?.props?.fontSize || '16px'};
  color: ${props => props.brick?.props?.color || '#10a5e0'};
  font-weight: ${props => props.brick?.props?.fontWeight || '600'};
  letter-spacing: ${props => props.brick?.props?.letterSpacing || '4px'};
  margin-bottom: ${props => props.brick?.props?.marginBottom || '20px'};
`;

const HeroTitle = styled(TitleBrickComponent)`
  font-size: ${props => props.brick?.props?.fontSize || '48px'};
  font-weight: ${props => props.brick?.props?.fontWeight || '700'};
  color: ${props => props.brick?.props?.color || '#1e2a39'};
  margin-bottom: ${props => props.brick?.props?.marginBottom || '40px'};
`;

const HeroText = styled(TextBrickComponent)`
  font-size: ${props => props.brick?.props?.fontSize || '20px'};
  color: ${props => props.brick?.props?.color || '#566077'};
  line-height: ${props => props.brick?.props?.lineHeight || '1.5'};
  max-width: ${props => props.brick?.props?.maxWidth || '800px'};
  margin-bottom: ${props => props.brick?.props?.marginBottom || '40px'};
  margin: 0 auto;
`;

export function HeroBrickComponent({ brick, onSelect }) {
  const { id, props, components = [] } = brick;
  const { selectedBrickId, updateNestedBrickProps, addNestedComponent, setPageData } = useBuilderContext();
  const isSelected = selectedBrickId === id;

  const handleChildSelect = (childId) => {
    onSelect(childId);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect?.(id);
  };

  // Initialize nested components if they don't exist
  React.useEffect(() => {
    if (!components.length) {
      // Create all components with their IDs upfront
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
        }
      ];

      // Add all components at once by updating the brick directly
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
      <HeroContainer
        onClick={handleClick}
        isSelected={isSelected}
        {...props}
      >
        <Row>
          <Col>
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
                    <HeroText
                      key={component.id}
                      brick={component}
                      isSelected={selectedBrickId === component.id}
                      onSelect={() => handleChildSelect(component.id)}
                      onUpdate={(newProps) => updateNestedBrickProps(id, component.id, newProps)}
                    />
                  );
                case 'title':
                  return (
                    <HeroTitle
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
        </Row>
      </HeroContainer>
    </Container>
  );
}

export const HeroInspector = {
  displayName: "Hero",
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
        default:
          return null;
      }
    }

    return {
      id: brick.id,
      displayName: "Hero",
      props: {
        bgColor: { type: "colorpicker", label: "Background Color", defaultValue: "#ffffff" },
        maxWidth: { type: "number", label: "Max Width", defaultValue: 1200, unit: "px" },
        paddingTop: { type: "number", label: "Padding Top", defaultValue: 80, unit: "px" },
        paddingBottom: { type: "number", label: "Padding Bottom", defaultValue: 80, unit: "px" },
        paddingLeft: { type: "number", label: "Padding Left", defaultValue: 20, unit: "px" },
        paddingRight: { type: "number", label: "Padding Right", defaultValue: 20, unit: "px" },
        marginTop: { type: "number", label: "Margin Top", defaultValue: 0, unit: "px" },
        marginBottom: { type: "number", label: "Margin Bottom", defaultValue: 0, unit: "px" },
        marginLeft: { type: "number", label: "Margin Left", defaultValue: "auto" },
        marginRight: { type: "number", label: "Margin Right", defaultValue: "auto" }
      }
    };
  }
};

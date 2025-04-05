import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { useBuilderContext } from '../context/BuilderContext';
import { TitleBrickComponent } from "../bricks/TitleBrick";
import { ButtonBrickComponent } from "../bricks/ButtonBrick";
import { v4 as uuidv4 } from 'uuid';

// Base container styling
const HeaderWrapper = styled.div`
  padding: ${props => props.padding || '3rem 0'};
  background-color: ${props => props.bgColor || '#ffffff'};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Styled components for nested bricks
const HeaderTitle = styled(TitleBrickComponent)`
  color: ${props => props.brick?.props?.color || '#212b36'};
  font-size: ${props => props.brick?.props?.fontSize || '32px'};
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
  width: 100%;
  @media (max-width: 768px) {
    font-size: ${props => props.brick?.props?.fontSize || '2rem'};
  }
  @media (max-width: 576px) {
    font-size: ${props => props.brick?.props?.fontSize || '1.75rem'};
  }
`;

const HeaderButton = styled(ButtonBrickComponent)`
  background-color: ${props => props.brick?.props?.bgColor || '#00a8e8'};
  border-color: ${props => props.brick?.props?.bgColor || '#00a8e8'};
  border-radius: 50px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  font-size: ${props => props.brick?.props?.fontSize || '16px'};
  transition: all 0.3s ease;
  &:hover {
    background-color: ${props => props.brick?.props?.hoverBgColor || '#0096cc'};
    border-color: ${props => props.brick?.props?.hoverBgColor || '#0096cc'};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const HeaderWithButtonBrickComponent = ({ brick, onSelect }) => {
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
          type: 'title',
          props: {
            text: 'React Bricks is great for developers and marketing teams.',
            fontSize: '32px',
            color: '#212b36',
            fontWeight: '700',
            marginBottom: '1rem'
          }
        },
        {
          id: uuidv4(),
          type: 'button',
          props: {
            label: 'Discover more',
            bgColor: '#00a8e8',
            hoverBgColor: '#0096cc',
            fontSize: '16px',
            color: '#ffffff'
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
    <HeaderWrapper 
      padding={props.padding} 
      bgColor={props.bgColor}
      onClick={handleClick}
      style={{ border: isSelected ? '2px solid #10a5e0' : 'none' }}
    >
      <Container>
        <Row className="align-items-center">
          <Col lg={7} md={6} sm={12}>
            {components.map((component) => {
              if (component.type === 'title') {
                return (
                  <HeaderTitle
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
          <Col lg={5} md={6} sm={12} className="text-md-end text-center mt-md-0 mt-3">
            {components.map((component) => {
              if (component.type === 'button') {
                return (
                  <HeaderButton
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
      </Container>
    </HeaderWrapper>
  );
};

export const HeaderWithButtonInspector = {
  displayName: 'Header',
  getInspectorProps: (brick, selectedBrickId) => {
    const selectedComponent = brick.components?.find((comp) => comp.id === selectedBrickId);
    
    if (selectedComponent) {
      switch (selectedComponent.type) {
        case "title":
          return { 
            id: selectedComponent.id, 
            displayName: "Title", 
            props: selectedComponent.props 
          };
        case "button":
          return { 
            id: selectedComponent.id, 
            displayName: "Button", 
            props: selectedComponent.props 
          };
        default:
          return null;
      }
    }

    return {
      id: brick.id,
      displayName: "Header",
      props: {
        bgColor: { type: "colorpicker", label: "Background Color", defaultValue: "#ffffff" },
      }
    };
  }
};

export default HeaderWithButtonBrickComponent;

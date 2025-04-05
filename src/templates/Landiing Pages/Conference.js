import React from 'react';
import styled from 'styled-components';
import { Container, Row, Col } from 'react-bootstrap';
import { TitleBrickComponent } from '../../bricks/TitleBrick';
import { TextBrickComponent } from '../../bricks/TextBrick';
import { ImageBrickComponent } from '../../bricks/ImageBrick';
import ButtonGroupBrickComponent from '../../bricks/ButtonGroupBrick';
import { useBuilderContext } from '../../context/BuilderContext';
import { v4 as uuidv4 } from 'uuid';

// Styled components
const PageWrapper = styled.div`
  background-color: #000;
  color: white;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
`;

const VerticalLine = styled.div`
  position: absolute;
  left: 24px;
  top: 0;
  height: 100%;
  width: 2px;
  background-color: #CCFF00;
  z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 10px;
    left: -9px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 16px solid #CCFF00;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  margin-left: 40px;
  padding: 20px 0;
  
  @media (max-width: 768px) {
    margin-left: 20px;
  }
`;

const StyledDateBanner = styled(TextBrickComponent)`
  padding: 10px 0;
  font-size: ${props => props.brick?.props?.fontSize || '14px'};
  letter-spacing: ${props => props.brick?.props?.letterSpacing || '1px'};
  color: ${props => props.brick?.props?.color || '#FFFFFF'};
  font-weight: ${props => props.brick?.props?.fontWeight || '500'};
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0 10px 10px 10px;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background-color: #FF00FF;
  }
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: #FF00FF;
  }
`;

const StyledTitle = styled(TitleBrickComponent)`
  font-size: ${props => props.brick?.props?.fontSize || '80px'};
  font-weight: ${props => props.brick?.props?.fontWeight || '900'};
  line-height: 0.9;
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: -1px;
  color: white;
  
  @media (max-width: 768px) {
    font-size: ${props => props.brick?.props?.tabletFontSize || '60px'};
  }
  
  @media (max-width: 576px) {
    font-size: ${props => props.brick?.props?.mobileFontSize || '48px'};
  }
`;

const StyledText = styled(TextBrickComponent)`
  font-size: ${props => props.brick?.props?.fontSize || '16px'};
  line-height: ${props => props.brick?.props?.lineHeight || '1.6'};
  margin-bottom: ${props => props.brick?.props?.marginBottom || '30px'};
  max-width: ${props => props.brick?.props?.maxWidth || '500px'};
  opacity: ${props => props.brick?.props?.opacity || '0.9'};
  color: white;
`;

const StyledImage = styled(ImageBrickComponent)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: ${props => props.brick?.props?.border || '3px solid #FF00FF'};
  border-radius: 0;
`;

const ConferenceLandingPage = () => {
  const { updateBrickProps, selectedBrickId } = useBuilderContext();

  const titleBrick = {
    id: 'title-1',
    type: 'title',
    props: {
      text: 'EXCITING\nCONFERENCE',
      fontSize: '80px',
      fontWeight: '900',
      color: '#ffffff',
      tabletFontSize: '60px',
      mobileFontSize: '48px'
    }
  };

  const descriptionBrick = {
    id: 'text-1',
    type: 'text',
    props: {
      text: 'Brightlane is a versatile and easy-to-use theme that can transform your scaling business with little effort. Made with care by HubSpot experts, Brightlane is responsive and customizable for your specific business needs.',
      fontSize: '16px',
      lineHeight: '1.6',
      marginBottom: '30px',
      maxWidth: '500px',
      opacity: '0.9',
      color: '#ffffff'
    }
  };

  const imageBrick = {
    id: 'image-1',
    type: 'image',
    props: {
      src: '/api/placeholder/800/500',
      alt: 'People working on laptops at a conference',
      border: '3px solid #FF00FF',
      borderRadius: '0'
    }
  };

  const dateBrick = {
    id: 'date-1',
    type: 'text',
    props: {
      text: 'MAY 14-16, 2025•SAN FRANCISCO, CA',
      fontSize: '14px',
      letterSpacing: '1px',
      color: '#FFFFFF',
      fontWeight: '500'
    }
  };

  const buttonGroupBrick = {
    id: 'buttons-1',
    type: 'buttonGroup',
    props: {
      alignment: 'left',
      gap: '20px'
    },
    components: [
      {
        id: uuidv4(),
        type: 'button',
        props: {
          label: 'REGISTER NOW',
          bgColor: '#6200EE',
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: '600',
          letterSpacing: '0.5px',
          padding: '12px 30px',
          borderRadius: '25px',
          border: 'none'
        }
      },
      {
        id: uuidv4(),
        type: 'button',
        props: {
          label: 'WATCH VIDEO',
          bgColor: 'transparent',
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: '600',
          letterSpacing: '0.5px',
          padding: '12px 30px',
          borderRadius: '25px',
          border: '1px solid #FFF',
          icon: 'Play',
          iconPosition: 'left',
          iconSize: 16
        }
      }
    ]
  };

  return (
    <PageWrapper>
      <VerticalLine />
      <ContentWrapper>
        <Container fluid>
          <StyledDateBanner 
            brick={dateBrick}
            onSelect={() => {}}
            onUpdate={(props) => updateBrickProps(dateBrick.id, props)}
            isSelected={selectedBrickId === dateBrick.id}
          />
          <Row className="mt-4">
            <Col lg={6} className="d-flex flex-column justify-content-center mb-5 mb-lg-0">
              <StyledTitle 
                brick={titleBrick}
                onSelect={() => {}} 
                onUpdate={(props) => updateBrickProps(titleBrick.id, props)}
                isSelected={selectedBrickId === titleBrick.id}
              />
              <StyledText
                brick={descriptionBrick}
                onSelect={() => {}}
                onUpdate={(props) => updateBrickProps(descriptionBrick.id, props)}
                isSelected={selectedBrickId === descriptionBrick.id}
              />
              <ButtonGroupBrickComponent
                brick={buttonGroupBrick}
                onSelect={() => {}}
                onUpdate={(props) => updateBrickProps(buttonGroupBrick.id, props)}
                isSelected={selectedBrickId === buttonGroupBrick.id}
              />
            </Col>
            <Col lg={6}>
              <ImageWrapper>
                <ImageContainer>
                  <StyledImage
                    brick={imageBrick}
                    onSelect={() => {}}
                    onUpdate={(props) => updateBrickProps(imageBrick.id, props)}
                    isSelected={selectedBrickId === imageBrick.id}
                  />
                </ImageContainer>
              </ImageWrapper>
            </Col>
          </Row>
        </Container>
      </ContentWrapper>
    </PageWrapper>
  );
};

export const ConferenceInspector = {
  displayName: 'Conference Landing',
  getInspectorProps: (brick, selectedBrickId) => {
    const selectedComponent = brick.components?.find((comp) => comp.id === selectedBrickId);
    
    if (selectedComponent) {
      switch (selectedComponent.type) {
        case "title":
          return {
            id: selectedComponent.id,
            displayName: "Title",
            props: {
              fontSize: { type: "number", label: "Font Size", defaultValue: 80, unit: "px" },
              tabletFontSize: { type: "number", label: "Tablet Font Size", defaultValue: 60, unit: "px" },
              mobileFontSize: { type: "number", label: "Mobile Font Size", defaultValue: 48, unit: "px" },
              fontWeight: { type: "number", label: "Font Weight", defaultValue: 900 },
              color: { type: "colorpicker", label: "Color", defaultValue: "#ffffff" }
            }
          };
        case "text":
          return {
            id: selectedComponent.id,
            displayName: "Description",
            props: {
              fontSize: { type: "number", label: "Font Size", defaultValue: 16, unit: "px" },
              lineHeight: { type: "number", label: "Line Height", defaultValue: 1.6 },
              marginBottom: { type: "number", label: "Margin Bottom", defaultValue: 30, unit: "px" },
              maxWidth: { type: "number", label: "Max Width", defaultValue: 500, unit: "px" },
              opacity: { type: "number", label: "Opacity", defaultValue: 0.9 },
              color: { type: "colorpicker", label: "Color", defaultValue: "#ffffff" }
            }
          };
        case "image":
          return {
            id: selectedComponent.id,
            displayName: "Conference Image",
            props: {
              src: { type: "text", label: "Image Source", defaultValue: "/api/placeholder/800/500" },
              alt: { type: "text", label: "Alt Text", defaultValue: "Conference image" },
              border: { type: "text", label: "Border", defaultValue: "3px solid #FF00FF" },
              borderRadius: { type: "number", label: "Border Radius", defaultValue: 0, unit: "px" }
            }
          };
        case "date":
          return {
            id: selectedComponent.id,
            displayName: "Date Banner",
            props: {
              fontSize: { type: "number", label: "Font Size", defaultValue: 14, unit: "px" },
              letterSpacing: { type: "number", label: "Letter Spacing", defaultValue: 1, unit: "px" },
              fontWeight: { type: "number", label: "Font Weight", defaultValue: 500 },
              color: { type: "colorpicker", label: "Color", defaultValue: "#ffffff" }
            }
          };
        case "buttonGroup":
          return {
            id: selectedComponent.id,
            displayName: "Buttons",
            props: {
              alignment: { type: "select", label: "Alignment", options: ['left', 'center', 'right'], defaultValue: 'left' },
              gap: { type: "number", label: "Gap", defaultValue: 20, unit: "px" }
            }
          };
        case "button":
          return {
            id: selectedComponent.id,
            displayName: "Button",
            props: {
              label: { type: "text", label: "Label", defaultValue: "Button" },
              bgColor: { type: "colorpicker", label: "Background Color", defaultValue: "#6200EE" },
              color: { type: "colorpicker", label: "Text Color", defaultValue: "#ffffff" },
              fontSize: { type: "number", label: "Font Size", defaultValue: 14, unit: "px" },
              fontWeight: { type: "number", label: "Font Weight", defaultValue: 600 },
              letterSpacing: { type: "number", label: "Letter Spacing", defaultValue: 0.5, unit: "px" },
              padding: { type: "text", label: "Padding", defaultValue: "12px 30px" },
              borderRadius: { type: "number", label: "Border Radius", defaultValue: 25, unit: "px" },
              border: { type: "text", label: "Border", defaultValue: "none" },
              icon: { type: "text", label: "Icon", defaultValue: "" },
              iconPosition: { type: "select", label: "Icon Position", options: ['left', 'right'], defaultValue: 'left' },
              iconSize: { type: "number", label: "Icon Size", defaultValue: 16, unit: "px" }
            }
          };
        default:
          return null;
      }
    }

    return {
      id: brick.id,
      displayName: "Conference Landing",
      props: {}
    };
  }
};

export default ConferenceLandingPage;
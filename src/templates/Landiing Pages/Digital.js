import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Container, Row, Col } from 'react-bootstrap';
import { Play } from 'lucide-react';
import { useBuilderContext } from '../../context/BuilderContext';
import { TitleBrickComponent } from '../../bricks/TitleBrick';
import { TextBrickComponent } from '../../bricks/TextBrick';
import { CounterBrickComponent } from '../../bricks/CounterBrick';
import ButtonGroupBrickComponent from '../../bricks/ButtonGroupBrick';
import { v4 as uuidv4 } from 'uuid';
import { BrickRegistry } from '../../bricks/BrickRegistry';

// Animations
const float = keyframes`
  0% { transform: translateY(0px) }
  50% { transform: translateY(-20px) }
  100% { transform: translateY(0px) }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

// Styled Components
const PageWrapper = styled.div`
  font-family: 'Montserrat', 'Arial', sans-serif;
  overflow-x: hidden;
  width: 100%;
`;

const HeroSection = styled.section`
  background: linear-gradient(to bottom, #131347, #1e1e5a);
  position: relative;
  padding: 8rem 0 6rem;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/api/placeholder/1600/900');
    background-size: cover;
    background-position: center;
    opacity: 0.15;
  }
`;

const WaveOne = styled.div`
  position: absolute;
  width: 150%;
  height: 50%;
  left: -25%;
  top: 30%;
  border: 2px solid #00c2ff;
  border-radius: 50%;
  opacity: 0.6;
  z-index: 1;
  animation: ${float} 15s ease-in-out infinite;
`;

const WaveTwo = styled.div`
  position: absolute;
  width: 170%;
  height: 60%;
  left: -10%;
  top: 20%;
  border: 2px solid #ff2cdf;
  border-radius: 40%;
  opacity: 0.5;
  z-index: 1;
  animation: ${float} 18s ease-in-out infinite reverse;
`;

const WaveThree = styled.div`
  position: absolute;
  width: 160%;
  height: 45%;
  left: -30%;
  top: 35%;
  border: 2px solid #ff9d00;
  border-radius: 45%;
  opacity: 0.4;
  z-index: 1;
  animation: ${float} 20s ease-in-out infinite;
`;

const HeroContent = styled.div`
  text-align: center;
  position: relative;
  z-index: 2;
`;

const EventBadge = styled.div`
  display: inline-block;
  position: relative;
  margin-bottom: 2rem;
  
  &::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: #a12cff;
    border-radius: 25px;
    transform: perspective(1em) rotateX(-5deg);
    z-index: 1;
  }
`;

const EventBadgeBrick = styled(TextBrickComponent)`
  display: inline-block;
  background: #bf45ff;
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 0.5rem 2rem;
  border-radius: 25px;
  position: relative;
  z-index: 2;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const EventInfoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2.5rem;
  color: white;
  margin-top: 3rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const EventInfoItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  
  .dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #a12cff;
    border-radius: 50%;
    margin-right: 0.8rem;
  }
`;

const EventInfoBrick = styled(TextBrickComponent)`
  font-size: 1.1rem;
  color: white;
`;

const PromoButton = styled.button`
  position: absolute;
  right: 10%;
  bottom: 20%;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #ff7b00;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 5px 15px rgba(255, 123, 0, 0.4);
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  animation: ${pulse} 2s infinite;
  
  &:hover {
    transform: scale(1.1);
    background: #ff9429;
  }
  
  svg {
    color: white;
    margin-left: 5px;
  }
  
  @media (max-width: 992px) {
    right: 8%;
    bottom: 15%;
    width: 70px;
    height: 70px;
  }
  
  @media (max-width: 768px) {
    right: 5%;
    bottom: 8%;
    width: 60px;
    height: 60px;
  }
`;

const PromoText = styled.span`
  position: absolute;
  right: calc(10% + 90px);
  bottom: 20%;
  color: white;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  @media (max-width: 992px) {
    display: none;
  }
`;

const TicketSection = styled.section`
  background: linear-gradient(135deg, #7928ca 0%, #ff0080 100%);
  padding: 5rem 0;
  color: white;
  position: relative;
  overflow: hidden;
  text-align: center;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  }
`;

const DigitalConferenceLanding = ({ brick, onSelect }) => {
  const { id, props } = brick;
  const { updateBrickProps, selectedBrickId } = useBuilderContext();

  const titleBrick = {
    id: 'digital-title',
    type: 'title',
    props: {
      text: 'BIGGEST DIGITAL CONFERENCE',
      fontSize: '4.5rem',
      color: '#ffffff',
      fontWeight: '800'
    }
  };

  const subHeadingBrick = {
    id: 'digital-subheading',
    type: 'text',
    props: {
      text: 'HURRY UP! DON\'T WASTE TIME',
      fontSize: '1.3rem',
      color: '#ffffff',
      fontWeight: '600'
    }
  };

  const counterBrick = {
    id: 'digital-counter',
    type: 'counter',
    props: {
      useCustomDuration: true,
      days: 26,
      hours: 19,
      minutes: 58,
      seconds: 37,
      bgColor: 'linear-gradient(135deg, #7928ca 0%, #ff0080 100%)'
    }
  };

  const buttonGroupBrick = {
    id: 'digital-buttons',
    type: 'buttonGroup',
    props: {
      alignment: 'center',
      gap: '20px'
    },
    components: [
      {
        id: uuidv4(),
        type: 'button',
        props: {
          label: 'BOOK YOUR TICKET',
          bgColor: '#ff0080',
          color: '#ffffff',
          fontSize: '14px',
          padding: '15px 30px',
          borderRadius: '25px'
        }
      }
    ]
  };

  const eventBadgeBrick = {
    id: 'digital-badge',
    type: 'text',
    props: {
      text: props.eventTitle || 'UPCOMING NEW 2024 EVENT',
      fontSize: '0.85rem',
      color: '#ffffff',
      fontWeight: '600'
    }
  };

  const locationBrick = {
    id: 'digital-location',
    type: 'text',
    props: {
      text: props.location || 'NEW YORK, USA',
      fontSize: '1.1rem',
      color: '#ffffff'
    }
  };

  const dateBrick = {
    id: 'digital-date',
    type: 'text',
    props: {
      text: props.date || 'JANUARY 5 TO 9, 2024',
      fontSize: '1.1rem',
      color: '#ffffff'
    }
  };

  const sectionLabelBrick = {
    id: 'digital-section-label',
    type: 'text',
    props: {
      text: 'TIME IS RUNNING OUT',
      fontSize: '0.9rem',
      color: '#ffffff',
      letterSpacing: '2px',
      textTransform: 'uppercase'
    }
  };

  const ticketHeadingBrick = {
    id: 'digital-ticket-heading',
    type: 'title',
    props: {
      text: 'BOOK YOUR TICKET.',
      fontSize: '3rem',
      color: '#ffffff',
      fontWeight: '700'
    }
  };

  const ticketDescriptionBrick = {
    id: 'digital-ticket-desc',
    type: 'text',
    props: {
      text: 'Join us for an immersive digital experience that will transform your understanding of technology and innovation.',
      fontSize: '1rem',
      color: '#ffffff',
      opacity: '0.8',
      lineHeight: '1.6'
    }
  };

  return (
    <PageWrapper>
      <HeroSection style={{ background: `linear-gradient(to bottom, ${props.backgroundColor}, ${props.backgroundColor}cc)` }}>
        <WaveOne style={{ borderColor: props.accentColor }} />
        <WaveTwo style={{ borderColor: props.accentColor }} />
        <WaveThree style={{ borderColor: props.accentColor }} />
        
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={10}>
              <HeroContent>
                <EventBadge>
                  <EventBadgeBrick
                    brick={eventBadgeBrick}
                    onSelect={onSelect}
                  />
                </EventBadge>
                <TextBrickComponent 
                  brick={subHeadingBrick}
                  onSelect={onSelect}
                />
                <TitleBrickComponent 
                  brick={titleBrick}
                  onSelect={onSelect}
                />
                
                <EventInfoContainer>
                  <EventInfoItem>
                    <span className="dot" style={{ backgroundColor: props.accentColor }}></span>
                    <EventInfoBrick
                      brick={locationBrick}
                      onSelect={onSelect}
                    />
                  </EventInfoItem>
                  <EventInfoItem>
                    <span className="dot" style={{ backgroundColor: props.accentColor }}></span>
                    <EventInfoBrick
                      brick={dateBrick}
                      onSelect={onSelect}
                    />
                  </EventInfoItem>
                </EventInfoContainer>
              </HeroContent>
            </Col>
          </Row>
        </Container>
        
        <PromoText>WATCH PROMO VIDEO</PromoText>
        <PromoButton style={{ background: props.accentColor }}>
          <Play size={28} />
        </PromoButton>
      </HeroSection>
      
      <TicketSection style={{ background: `linear-gradient(135deg, ${props.accentColor}cc, ${props.accentColor})` }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={8}>
              <TextBrickComponent
                brick={sectionLabelBrick}
                onSelect={onSelect}
              />
              <TitleBrickComponent
                brick={ticketHeadingBrick}
                onSelect={onSelect}
              />
              <TextBrickComponent
                brick={ticketDescriptionBrick}
                onSelect={onSelect}
              />
              
              <CounterBrickComponent 
                brick={counterBrick}
                onSelect={onSelect}
              />
              
              <ButtonGroupBrickComponent
                brick={buttonGroupBrick}
                onSelect={onSelect}
              />
            </Col>
          </Row>
        </Container>
      </TicketSection>
    </PageWrapper>
  );
};

export const DigitalInspector = {
  displayName: 'Digital Conference',
  getInspectorProps: (brick, selectedBrickId) => {
    // Helper function to create bricks with unique IDs
    const createBricks = () => {
      const titleBrick = {
        id: `digital-title-${brick.id}`,
        type: 'title',
        props: { text: 'BIGGEST DIGITAL CONFERENCE', fontSize: '4.5rem', color: '#ffffff', fontWeight: '800' }
      };

      const subHeadingBrick = {
        id: `digital-subheading-${brick.id}`,
        type: 'text',
        props: { text: 'HURRY UP! DON\'T WASTE TIME', fontSize: '1.3rem', color: '#ffffff', fontWeight: '600' }
      };

      const counterBrick = {
        id: `digital-counter-${brick.id}`,
        type: 'counter',
        props: { useCustomDuration: true, days: 26, hours: 19, minutes: 58, seconds: 37 }
      };

      const buttonGroupBrick = {
        id: `digital-buttons-${brick.id}`,
        type: 'buttonGroup',
        props: { alignment: 'center', gap: '20px' },
        components: [{
          id: uuidv4(),
          type: 'button',
          props: {
            label: 'BOOK YOUR TICKET',
            bgColor: '#ff0080',
            color: '#ffffff',
            fontSize: '14px',
            padding: '15px 30px',
            borderRadius: '25px'
          }
        }]
      };

      const eventBadgeBrick = {
        id: `digital-badge-${brick.id}`,
        type: 'text',
        props: { text: brick.props.eventTitle || 'UPCOMING NEW 2024 EVENT', fontSize: '0.85rem', color: '#ffffff', fontWeight: '600' }
      };

      return {
        eventBadgeBrick,
        titleBrick,
        subHeadingBrick,
        locationBrick: {
          id: `digital-location-${brick.id}`,
          type: 'text',
          props: { text: brick.props.location || 'NEW YORK, USA', fontSize: '1.1rem', color: '#ffffff' }
        },
        dateBrick: {
          id: `digital-date-${brick.id}`,
          type: 'text',
          props: { text: brick.props.date || 'JANUARY 5 TO 9, 2024', fontSize: '1.1rem', color: '#ffffff' }
        },
        sectionLabelBrick: {
          id: `digital-section-label-${brick.id}`,
          type: 'text',
          props: { text: 'TIME IS RUNNING OUT', fontSize: '0.9rem', color: '#ffffff', letterSpacing: '2px', textTransform: 'uppercase' }
        },
        ticketHeadingBrick: {
          id: `digital-ticket-heading-${brick.id}`,
          type: 'title',
          props: { text: 'BOOK YOUR TICKET.', fontSize: '3rem', color: '#ffffff', fontWeight: '700' }
        },
        ticketDescriptionBrick: {
          id: `digital-ticket-desc-${brick.id}`,
          type: 'text',
          props: { text: 'Join us for an immersive digital experience...', fontSize: '1rem', color: '#ffffff', fontWeight: '600' }
        },
        counterBrick,
        buttonGroupBrick
      };
    };

    const nestedBrick = brick.components?.find(comp => comp.id === selectedBrickId);
    
    if (nestedBrick) {
      return BrickRegistry[nestedBrick.type].inspector.getInspectorProps?.(nestedBrick, selectedBrickId) ||
             BrickRegistry[nestedBrick.type].inspector;
    }

    const bricks = createBricks();

    return {
      id: brick.id,
      displayName: 'Digital Conference',
      props: {
        eventTitle: {
          type: 'text',
          label: 'Event Title',
          defaultValue: 'UPCOMING NEW 2024 EVENT',
          section: 'Content'
        },
        location: {
          type: 'text',
          label: 'Location',
          defaultValue: 'NEW YORK, USA',
          section: 'Content'
        },
        date: {
          type: 'text',
          label: 'Event Date',
          defaultValue: 'JANUARY 5 TO 9, 2024',
          section: 'Content'
        },
        backgroundColor: {
          type: 'colorpicker',
          label: 'Background Color',
          defaultValue: '#131347',
          section: 'Style'
        },
        accentColor: {
          type: 'colorpicker',
          label: 'Accent Color',
          defaultValue: '#ff0080',
          section: 'Style'
        },
        components: Object.values(bricks)
      }
    };
  }
};

export default DigitalConferenceLanding;
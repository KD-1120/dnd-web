import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { useBuilderContext } from '../context/BuilderContext';
import { useViewMode } from '../context/ViewModeContext';
import { PreviewWrapper } from '../components/PreviewWrapper';

// Styled components
const CountdownContainer = styled(Container)`
  max-width: 800px;
  margin: 2rem auto;
`;

const CountdownBox = styled.div`
  background: ${props => props.bgColor || 'linear-gradient(to bottom, #2c6da3 0%, #1a3d5c 100%)'};
  color: ${props => props.textColor || 'white'};
  border-radius: ${props => props.borderRadius || '4px'};
  padding: ${props => props.padding || '1.5rem 0.5rem'};
  text-align: center;
  margin-bottom: ${props => props.marginBottom || '1rem'};
  box-shadow: ${props => props.showShadow ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none'};
`;

const CountdownNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 576px) {
    font-size: 1.5rem;
  }
`;

const CountdownLabel = styled.div`
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.8);
`;

const Divider = styled.div`
  height: 2px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 0.5rem 0;
`;

// Countdown Component
const CountdownTimer = ({ targetDate, bgColor, textColor, borderRadius, padding, marginBottom, showShadow }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(targetDate) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timeComponents = Object.keys(timeLeft).map(interval => {
    if (!timeLeft[interval]) {
      return null;
    }

    return (
      <Col key={interval} xs={6} md={3}>
        <CountdownBox
          bgColor={bgColor}
          textColor={textColor}
          borderRadius={borderRadius}
          padding={padding}
          marginBottom={marginBottom}
          showShadow={showShadow}
        >
          <CountdownNumber>
            {timeLeft[interval].toString().padStart(2, '0')}
          </CountdownNumber>
          <Divider />
          <CountdownLabel>
            {interval}
          </CountdownLabel>
        </CountdownBox>
      </Col>
    );
  });

  return (
    <CountdownContainer>
      <Row>
        {timeComponents.length ? timeComponents : <div>Time's up!</div>}
      </Row>
    </CountdownContainer>
  );
};

export function CounterBrickComponent({ brick, onSelect }) {
  const { id, props = {} } = brick;
  const initialProps = {
    useCustomDuration: false,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    targetDate: new Date().setDate(new Date().getDate() + 7),
    ...props
  };
  const { selectedBrickId } = useBuilderContext();
  const { viewMode } = useViewMode();
  const isPreview = viewMode === 'preview';
  const isSelected = selectedBrickId === id;

  // Calculate target date based on duration values
  const targetDate = useMemo(() => {
    if (initialProps.useCustomDuration) {
      const now = new Date();
      const durationMs = (initialProps.days || 0) * 86400000 + // days to ms
                        (initialProps.hours || 0) * 3600000 + // hours to ms
                        (initialProps.minutes || 0) * 60000 + // minutes to ms
                        (initialProps.seconds || 0) * 1000;   // seconds to ms
      return new Date(now.getTime() + durationMs);
    }
    return new Date(initialProps.targetDate || new Date().setDate(new Date().getDate() + 7));
  }, [initialProps.useCustomDuration, initialProps.days, initialProps.hours, initialProps.minutes, initialProps.seconds, initialProps.targetDate]);

  const handleClick = (e) => {
    if (!isPreview) {
      e.stopPropagation();
      onSelect?.(id);
    }
  };

  return (
    <PreviewWrapper isSelected={isSelected}>
      <div onClick={handleClick}>
        <CountdownContainer style={{ maxWidth: initialProps.maxWidth || '800px' }}>
          <Row>
            <CountdownTimer 
              targetDate={targetDate}
              bgColor={initialProps.bgColor}
              textColor={initialProps.textColor}
              borderRadius={initialProps.borderRadius}
              padding={initialProps.padding}
              marginBottom={initialProps.marginBottom}
              showShadow={initialProps.showShadow}
            />
          </Row>
        </CountdownContainer>
      </div>
    </PreviewWrapper>
  );
}

export const CounterInspector = {
  displayName: 'Counter',
  props: {
    useCustomDuration: {
      type: 'boolean',
      label: 'Use Custom Duration',
      defaultValue: false,
      section: 'General'
    },
    days: {
      type: 'number',
      label: 'Days',
      defaultValue: 0,
      min: 0,
      section: 'General',
      show: (props) => props.useCustomDuration === true
    },
    hours: {
      type: 'number',
      label: 'Hours',
      defaultValue: 0,
      min: 0,
      max: 23,
      section: 'General',
      show: (props) => props.useCustomDuration === true
    },
    minutes: {
      type: 'number',
      label: 'Minutes',
      defaultValue: 0,
      min: 0,
      max: 59,
      section: 'General',
      show: (props) => props.useCustomDuration === true
    },
    seconds: {
      type: 'number',
      label: 'Seconds',
      defaultValue: 0,
      min: 0,
      max: 59,
      section: 'General',
      show: (props) => props.useCustomDuration === true
    },
    targetDate: { 
      type: 'date', 
      label: 'Target Date', 
      defaultValue: new Date().setDate(new Date().getDate() + 7),
      section: 'General',
      show: (props) => props.useCustomDuration !== true
    },
    maxWidth: { 
      type: 'number', 
      label: 'Max Width', 
      defaultValue: 800, 
      unit: 'px',
      section: 'Layout'
    },
    bgColor: { 
      type: 'colorpicker', 
      label: 'Background', 
      defaultValue: 'linear-gradient(to bottom, #2c6da3 0%, #1a3d5c 100%)',
      section: 'Style'
    },
    textColor: { 
      type: 'colorpicker', 
      label: 'Text Color', 
      defaultValue: '#ffffff',
      section: 'Style'
    },
    borderRadius: { 
      type: 'number', 
      label: 'Border Radius', 
      defaultValue: 4, 
      unit: 'px',
      section: 'Style'
    },
    padding: { 
      type: 'text', 
      label: 'Padding', 
      defaultValue: 1.5,
      unit: 'rem',
      section: 'Layout'
    },
    marginBottom: { 
      type: 'number', 
      label: 'Margin Bottom', 
      defaultValue: 16, 
      unit: 'px',
      section: 'Layout'
    },
    showShadow: { 
      type: 'boolean', 
      label: 'Show Shadow', 
      defaultValue: true,
      section: 'Style'
    }
  }
};

export default CounterBrickComponent;
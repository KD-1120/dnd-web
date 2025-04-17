// src/Pages/Dashboard/WebsiteBuilder/bricks/CountdownTimerBrick.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const TimerContainer = styled.div`
  width: 100%;
  background-color: ${props => props.bgColor || 'white'};
  border-radius: ${props => props.borderRadius || '8px'};
  padding: ${props => props.padding || '24px'};
  margin-top: ${props => props.marginTop || '0'};
  margin-bottom: ${props => props.marginBottom || '0'};
  margin-left: ${props => props.marginLeft || '0'};
  margin-right: ${props => props.marginRight || '0'};
  border: ${props => props.border || 'none'};
  box-shadow: ${props => props.boxShadow || 'none'};
  font-family: ${props => props.fontFamily || 'Inter, sans-serif'};
  text-align: ${props => props.alignment || 'center'};
`;

const TimerHeader = styled.div`
  margin-bottom: ${props => props.spacing || '24px'};
`;

const TimerTitle = styled.h3`
  font-size: ${props => props.fontSize || '24px'};
  font-weight: ${props => props.fontWeight || '700'};
  color: ${props => props.color || '#1a202c'};
  margin: 0 0 8px 0;
`;

const TimerSubtitle = styled.p`
  font-size: ${props => props.fontSize || '16px'};
  color: ${props => props.color || '#4a5568'};
  margin: 0;
`;

const EventInfo = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: ${props => props.spacing || '24px'};
`;

const EventInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.color || '#4a5568'};
  font-size: ${props => props.fontSize || '16px'};
`;

const CountdownWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${props => props.gap || '16px'};
`;

const CountdownItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: ${props => props.size || '80px'};
`;

const CountdownValue = styled.div`
  font-size: ${props => props.fontSize || '36px'};
  font-weight: ${props => props.fontWeight || '700'};
  color: ${props => props.color || '#1a202c'};
  background-color: ${props => props.bgColor || '#f7fafc'};
  border-radius: ${props => props.borderRadius || '8px'};
  width: ${props => props.size || '80px'};
  height: ${props => props.size || '80px'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  border: ${props => props.border || 'none'};
  box-shadow: ${props => props.boxShadow || 'none'};
`;

const CountdownLabel = styled.div`
  font-size: ${props => props.fontSize || '14px'};
  color: ${props => props.color || '#4a5568'};
  text-transform: ${props => props.textTransform || 'uppercase'};
  letter-spacing: ${props => props.letterSpacing || '1px'};
`;

const TimerDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || '#1a202c'};
  font-size: ${props => props.fontSize || '24px'};
  padding: ${props => props.padding || '0 4px'};
  align-self: center;
  height: ${props => props.size || '80px'};
  
  @media (max-width: 640px) {
    display: none;
  }
`;

const ActionButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: ${props => props.marginTop || '24px'};
  padding: ${props => props.padding || '12px 24px'};
  background-color: ${props => props.bgColor || '#3182ce'};
  color: ${props => props.color || 'white'};
  font-weight: ${props => props.fontWeight || '600'};
  border-radius: ${props => props.borderRadius || '4px'};
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.hoverBgColor || '#2b6cb0'};
    transform: translateY(-2px);
  }
`;

export function CountdownTimerBrickComponent({ brick, onSelect, isSelected }) {
  const { id, props = {} } = brick;
  
  // State for countdown values
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // State for whether event has started/ended
  const [eventStatus, setEventStatus] = useState('upcoming'); // 'upcoming', 'ongoing', 'ended'
  
  useEffect(() => {
    // Parse event date from props
    const eventDate = props.eventDate ? new Date(props.eventDate) : new Date();
    const eventEndDate = props.eventEndDate ? new Date(props.eventEndDate) : null;
    
    // Calculate time remaining
    const calculateTimeLeft = () => {
      const now = new Date();
      
      // Check if event has ended
      if (eventEndDate && now > eventEndDate) {
        setEventStatus('ended');
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      // Check if event is ongoing
      if (now > eventDate && eventEndDate && now < eventEndDate) {
        setEventStatus('ongoing');
        
        // Calculate time until event ends
        const difference = eventEndDate - now;
        
        if (difference <= 0) {
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      
      // Event is upcoming
      const difference = eventDate - now;
      
      if (difference <= 0) {
        // If no end date is specified, event is considered "ended" once start date has passed
        setEventStatus(eventEndDate ? 'ongoing' : 'ended');
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };
    
    // Update timer immediately and then every second
    setTimeLeft(calculateTimeLeft());
    
    const timerId = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [props.eventDate, props.eventEndDate]);
  
  // Format date for display
  const formatEventDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get appropriate title based on event status
  const getTitle = () => {
    if (eventStatus === 'ended') {
      return props.eventEndedTitle || 'Event Has Ended';
    } else if (eventStatus === 'ongoing') {
      return props.eventOngoingTitle || 'Event In Progress';
    } else {
      return props.title || 'Event Starts In';
    }
  };
  
  // Get appropriate subtitle based on event status
  const getSubtitle = () => {
    if (eventStatus === 'ended') {
      return props.eventEndedSubtitle || 'Thank you for your interest. See you at our next event!';
    } else if (eventStatus === 'ongoing') {
      return props.eventOngoingSubtitle || 'Time remaining until the event concludes';
    } else {
      return props.subtitle || 'Mark your calendar and don\'t miss it!';
    }
  };
  
  // Get appropriate button action based on event status
  const getActionButton = () => {
    if (!props.showActionButton) return null;
    
    let buttonText, buttonUrl;
    
    if (eventStatus === 'ended') {
      buttonText = props.eventEndedButtonText || 'View Recordings';
      buttonUrl = props.eventEndedButtonUrl || '#';
    } else if (eventStatus === 'ongoing') {
      buttonText = props.eventOngoingButtonText || 'Join Now';
      buttonUrl = props.eventOngoingButtonUrl || '#';
    } else {
      buttonText = props.actionButtonText || 'Add to Calendar';
      buttonUrl = props.actionButtonUrl || '#';
    }
    
    return (
      <ActionButton
        href={buttonUrl}
        target="_blank"
        rel="noopener noreferrer"
        marginTop={props.buttonMarginTop}
        padding={props.buttonPadding}
        bgColor={props.buttonBgColor}
        color={props.buttonTextColor}
        fontWeight={props.buttonFontWeight}
        borderRadius={props.buttonBorderRadius}
        hoverBgColor={props.buttonHoverBgColor}
      >
        {buttonText}
        <ArrowRight size={16} />
      </ActionButton>
    );
  };
  
  return (
    <div 
      style={{ 
        position: 'relative',
        padding: '4px',
        border: isSelected ? '1px dashed #2563eb' : 'none',
        borderRadius: '4px'
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(id);
      }}
    >
      <TimerContainer
        bgColor={props.bgColor}
        borderRadius={props.borderRadius}
        padding={props.padding}
        marginTop={props.marginTop}
        marginBottom={props.marginBottom}
        marginLeft={props.marginLeft}
        marginRight={props.marginRight}
        border={props.border}
        boxShadow={props.boxShadow}
        fontFamily={props.fontFamily}
        alignment={props.alignment}
      >
        <TimerHeader spacing={props.headerSpacing}>
          <TimerTitle
            fontSize={props.titleFontSize}
            fontWeight={props.titleFontWeight}
            color={props.titleColor}
          >
            {getTitle()}
          </TimerTitle>
          
          <TimerSubtitle
            fontSize={props.subtitleFontSize}
            color={props.subtitleColor}
          >
            {getSubtitle()}
          </TimerSubtitle>
        </TimerHeader>
        
        {props.showEventInfo && (
          <EventInfo spacing={props.eventInfoSpacing}>
            <EventInfoItem 
              color={props.eventInfoColor}
              fontSize={props.eventInfoFontSize}
            >
              <Calendar size={18} />
              {formatEventDate(props.eventDate)}
            </EventInfoItem>
            
            {props.eventLocation && (
              <EventInfoItem 
                color={props.eventInfoColor}
                fontSize={props.eventInfoFontSize}
              >
                <Clock size={18} />
                {props.eventLocation}
              </EventInfoItem>
            )}
          </EventInfo>
        )}
        
        <CountdownWrapper gap={props.countdownGap}>
          <CountdownItem size={props.countdownItemSize}>
            <CountdownValue 
              fontSize={props.countdownFontSize}
              fontWeight={props.countdownFontWeight}
              color={props.countdownValueColor}
              bgColor={props.countdownBgColor}
              borderRadius={props.countdownBorderRadius}
              size={props.countdownItemSize}
              border={props.countdownBorder}
              boxShadow={props.countdownBoxShadow}
            >
              {String(timeLeft.days).padStart(2, '0')}
            </CountdownValue>
            <CountdownLabel 
              fontSize={props.labelFontSize}
              color={props.labelColor}
              textTransform={props.labelTextTransform}
              letterSpacing={props.labelLetterSpacing}
            >
              {timeLeft.days === 1 ? 'Day' : 'Days'}
            </CountdownLabel>
          </CountdownItem>
          
          {props.showDividers && <TimerDivider 
            color={props.dividerColor}
            fontSize={props.dividerFontSize}
            padding={props.dividerPadding}
            size={props.countdownItemSize}
          >:</TimerDivider>}
          
          <CountdownItem size={props.countdownItemSize}>
            <CountdownValue 
              fontSize={props.countdownFontSize}
              fontWeight={props.countdownFontWeight}
              color={props.countdownValueColor}
              bgColor={props.countdownBgColor}
              borderRadius={props.countdownBorderRadius}
              size={props.countdownItemSize}
              border={props.countdownBorder}
              boxShadow={props.countdownBoxShadow}
            >
              {String(timeLeft.hours).padStart(2, '0')}
            </CountdownValue>
            <CountdownLabel 
              fontSize={props.labelFontSize}
              color={props.labelColor}
              textTransform={props.labelTextTransform}
              letterSpacing={props.labelLetterSpacing}
            >
              {timeLeft.hours === 1 ? 'Hour' : 'Hours'}
            </CountdownLabel>
          </CountdownItem>
          
          {props.showDividers && <TimerDivider 
            color={props.dividerColor}
            fontSize={props.dividerFontSize}
            padding={props.dividerPadding}
            size={props.countdownItemSize}
          >:</TimerDivider>}
          
          <CountdownItem size={props.countdownItemSize}>
            <CountdownValue 
              fontSize={props.countdownFontSize}
              fontWeight={props.countdownFontWeight}
              color={props.countdownValueColor}
              bgColor={props.countdownBgColor}
              borderRadius={props.countdownBorderRadius}
              size={props.countdownItemSize}
              border={props.countdownBorder}
              boxShadow={props.countdownBoxShadow}
            >
              {String(timeLeft.minutes).padStart(2, '0')}
            </CountdownValue>
            <CountdownLabel 
              fontSize={props.labelFontSize}
              color={props.labelColor}
              textTransform={props.labelTextTransform}
              letterSpacing={props.labelLetterSpacing}
            >
              {timeLeft.minutes === 1 ? 'Minute' : 'Minutes'}
            </CountdownLabel>
          </CountdownItem>
          
          {props.showDividers && <TimerDivider 
            color={props.dividerColor}
            fontSize={props.dividerFontSize}
            padding={props.dividerPadding}
            size={props.countdownItemSize}
          >:</TimerDivider>}
          
          <CountdownItem size={props.countdownItemSize}>
            <CountdownValue 
              fontSize={props.countdownFontSize}
              fontWeight={props.countdownFontWeight}
              color={props.countdownValueColor}
              bgColor={props.countdownBgColor}
              borderRadius={props.countdownBorderRadius}
              size={props.countdownItemSize}
              border={props.countdownBorder}
              boxShadow={props.countdownBoxShadow}
            >
              {String(timeLeft.seconds).padStart(2, '0')}
            </CountdownValue>
            <CountdownLabel 
              fontSize={props.labelFontSize}
              color={props.labelColor}
              textTransform={props.labelTextTransform}
              letterSpacing={props.labelLetterSpacing}
            >
              {timeLeft.seconds === 1 ? 'Second' : 'Seconds'}
            </CountdownLabel>
          </CountdownItem>
        </CountdownWrapper>
        
        {getActionButton()}
      </TimerContainer>
    </div>
  );
}

export const CountdownTimerBrickInspector = {
  displayName: 'Countdown Timer',
  props: {
    // General settings
    eventDate: { type: 'text', label: 'Event Start Date', defaultValue: '' },
    eventEndDate: { type: 'text', label: 'Event End Date', defaultValue: '' },
    eventLocation: { type: 'text', label: 'Event Location', defaultValue: '' },
    
    // Title settings
    title: { type: 'text', label: 'Title (Before Event)', defaultValue: 'Event Starts In' },
    subtitle: { type: 'text', label: 'Subtitle (Before Event)', defaultValue: 'Mark your calendar and don\'t miss it!' },
    eventOngoingTitle: { type: 'text', label: 'Title (During Event)', defaultValue: 'Event In Progress' },
    eventOngoingSubtitle: { type: 'text', label: 'Subtitle (During Event)', defaultValue: 'Time remaining until the event concludes' },
    eventEndedTitle: { type: 'text', label: 'Title (After Event)', defaultValue: 'Event Has Ended' },
    eventEndedSubtitle: { type: 'text', label: 'Subtitle (After Event)', defaultValue: 'Thank you for your interest. See you at our next event!' },
    
    // Container appearance
    alignment: { type: 'select', label: 'Text Alignment', options: ['left', 'center', 'right'], defaultValue: 'center' },
    bgColor: { type: 'colorpicker', label: 'Background Color', defaultValue: 'white' },
    borderRadius: { type: 'number', label: 'Border Radius', defaultValue: 8, unit: 'px' },
    boxShadow: { type: 'text', label: 'Box Shadow', defaultValue: '0 4px 12px rgba(0, 0, 0, 0.1)' },
    padding: { type: 'text', label: 'Padding', defaultValue: '24px' },
    border: { type: 'text', label: 'Border', defaultValue: 'none' },
    
    // Typography
    fontFamily: { type: 'select', label: 'Font Family', options: ['Inter, sans-serif', 'Georgia, serif', 'Montserrat, sans-serif', 'Roboto, sans-serif', 'Open Sans, sans-serif'], defaultValue: 'Inter, sans-serif' },
    titleFontSize: { type: 'text', label: 'Title Font Size', defaultValue: '24px' },
    titleFontWeight: { type: 'select', label: 'Title Font Weight', options: ['400', '500', '600', '700', '800'], defaultValue: '700' },
    titleColor: { type: 'colorpicker', label: 'Title Color', defaultValue: '#1a202c' },
    subtitleFontSize: { type: 'text', label: 'Subtitle Font Size', defaultValue: '16px' },
    subtitleColor: { type: 'colorpicker', label: 'Subtitle Color', defaultValue: '#4a5568' },
    headerSpacing: { type: 'text', label: 'Header Bottom Margin', defaultValue: '24px' },
    
    // Event info
    showEventInfo: { type: 'boolean', label: 'Show Event Info', defaultValue: true },
    eventInfoColor: { type: 'colorpicker', label: 'Event Info Color', defaultValue: '#4a5568' },
    eventInfoFontSize: { type: 'text', label: 'Event Info Font Size', defaultValue: '16px' },
    eventInfoSpacing: { type: 'text', label: 'Event Info Bottom Margin', defaultValue: '24px' },
    
    // Countdown styling
    countdownItemSize: { type: 'text', label: 'Countdown Item Size', defaultValue: '80px' },
    countdownGap: { type: 'text', label: 'Gap Between Items', defaultValue: '16px' },
    countdownFontSize: { type: 'text', label: 'Countdown Font Size', defaultValue: '36px' },
    countdownFontWeight: { type: 'select', label: 'Countdown Font Weight', options: ['400', '500', '600', '700', '800'], defaultValue: '700' },
    countdownValueColor: { type: 'colorpicker', label: 'Countdown Value Color', defaultValue: '#1a202c' },
    countdownBgColor: { type: 'colorpicker', label: 'Countdown Background', defaultValue: '#f7fafc' },
    countdownBorderRadius: { type: 'number', label: 'Countdown Border Radius', defaultValue: 8, unit: 'px' },
    countdownBorder: { type: 'text', label: 'Countdown Border', defaultValue: 'none' },
    countdownBoxShadow: { type: 'text', label: 'Countdown Box Shadow', defaultValue: 'none' },
    
    // Label styling
    labelFontSize: { type: 'text', label: 'Label Font Size', defaultValue: '14px' },
    labelColor: { type: 'colorpicker', label: 'Label Color', defaultValue: '#4a5568' },
    labelTextTransform: { type: 'select', label: 'Label Text Transform', options: ['none', 'uppercase', 'lowercase', 'capitalize'], defaultValue: 'uppercase' },
    labelLetterSpacing: { type: 'text', label: 'Label Letter Spacing', defaultValue: '1px' },
    
    // Dividers
    showDividers: { type: 'boolean', label: 'Show Dividers', defaultValue: true },
    dividerColor: { type: 'colorpicker', label: 'Divider Color', defaultValue: '#1a202c' },
    dividerFontSize: { type: 'text', label: 'Divider Font Size', defaultValue: '24px' },
    dividerPadding: { type: 'text', label: 'Divider Padding', defaultValue: '0 4px' },
    
    // Action button
    showActionButton: { type: 'boolean', label: 'Show Action Button', defaultValue: true },
    actionButtonText: { type: 'text', label: 'Button Text (Before Event)', defaultValue: 'Add to Calendar' },
    actionButtonUrl: { type: 'text', label: 'Button URL (Before Event)', defaultValue: '#' },
    eventOngoingButtonText: { type: 'text', label: 'Button Text (During Event)', defaultValue: 'Join Now' },
    eventOngoingButtonUrl: { type: 'text', label: 'Button URL (During Event)', defaultValue: '#' },
    eventEndedButtonText: { type: 'text', label: 'Button Text (After Event)', defaultValue: 'View Recordings' },
    eventEndedButtonUrl: { type: 'text', label: 'Button URL (After Event)', defaultValue: '#' },
    buttonMarginTop: { type: 'text', label: 'Button Top Margin', defaultValue: '24px' },
    buttonPadding: { type: 'text', label: 'Button Padding', defaultValue: '12px 24px' },
    buttonBgColor: { type: 'colorpicker', label: 'Button Background', defaultValue: '#3182ce' },
    buttonTextColor: { type: 'colorpicker', label: 'Button Text Color', defaultValue: 'white' },
    buttonFontWeight: { type: 'select', label: 'Button Font Weight', options: ['400', '500', '600', '700'], defaultValue: '600' },
    buttonBorderRadius: { type: 'number', label: 'Button Border Radius', defaultValue: 4, unit: 'px' },
    buttonHoverBgColor: { type: 'colorpicker', label: 'Button Hover Background', defaultValue: '#2b6cb0' },
    
    // Margins
    marginTop: { type: 'number', label: 'Margin Top', defaultValue: 0, unit: 'px' },
    marginBottom: { type: 'number', label: 'Margin Bottom', defaultValue: 0, unit: 'px' },
    marginLeft: { type: 'number', label: 'Margin Left', defaultValue: 0, unit: 'px' },
    marginRight: { type: 'number', label: 'Margin Right', defaultValue: 0, unit: 'px' },
  }
};
// src/Pages/Dashboard/WebsiteBuilder/bricks/ScheduleAgendaBrick.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Calendar, Clock, MapPin, User, ChevronDown, ChevronUp } from 'lucide-react';

const ScheduleContainer = styled.div`
  width: 100%;
  background-color: ${props => props.bgColor || 'white'};
  border-radius: ${props => props.borderRadius || '8px'};
  box-shadow: ${props => props.boxShadow || '0 4px 12px rgba(0, 0, 0, 0.1)'};
  padding: ${props => props.padding || '24px'};
  margin-top: ${props => props.marginTop || '0'};
  margin-bottom: ${props => props.marginBottom || '0'};
  margin-left: ${props => props.marginLeft || '0'};
  margin-right: ${props => props.marginRight || '0'};
  border: ${props => props.border || 'none'};
  font-family: ${props => props.fontFamily || 'Inter, sans-serif'};
`;

const ScheduleHeader = styled.div`
  margin-bottom: 24px;
  text-align: ${props => props.alignment || 'left'};
`;

const ScheduleTitle = styled.h3`
  font-size: ${props => props.fontSize || '24px'};
  font-weight: ${props => props.fontWeight || '700'};
  color: ${props => props.color || '#1a202c'};
  margin: 0 0 8px 0;
`;

const ScheduleDescription = styled.p`
  font-size: ${props => props.fontSize || '16px'};
  color: ${props => props.color || '#4a5568'};
  margin: 0;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: ${props => `1px solid ${props.borderColor || '#e2e8f0'}`};
  margin-bottom: 24px;
  overflow-x: auto;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.button`
  padding: 12px 24px;
  background: ${props => props.active ? props.activeBgColor || '#ebf8ff' : 'transparent'};
  border: none;
  border-bottom: 3px solid ${props => props.active ? props.activeColor || '#3182ce' : 'transparent'};
  color: ${props => props.active ? props.activeColor || '#3182ce' : props.color || '#4a5568'};
  font-weight: ${props => props.active ? '600' : '400'};
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  
  &:hover {
    color: ${props => props.active ? props.activeColor || '#3182ce' : props.hoverColor || '#2b6cb0'};
    background: ${props => props.active ? props.activeBgColor || '#ebf8ff' : props.hoverBgColor || '#f7fafc'};
  }
`;

const SessionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SessionCard = styled.div`
  border: 1px solid ${props => props.borderColor || '#e2e8f0'};
  border-radius: ${props => props.borderRadius || '6px'};
  overflow: hidden;
  background-color: ${props => props.bgColor || 'white'};
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: ${props => props.hoverBoxShadow || '0 2px 8px rgba(0, 0, 0, 0.05)'};
  }
`;

const SessionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  border-left: ${props => props.isActive ? `4px solid ${props.accentColor || '#3182ce'}` : '4px solid transparent'};
`;

const SessionTime = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
  padding-right: 16px;
  border-right: 1px solid ${props => props.borderColor || '#e2e8f0'};
`;

const SessionHour = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.color || '#2d3748'};
`;

const SessionDuration = styled.div`
  font-size: 14px;
  color: ${props => props.color || '#718096'};
`;

const SessionInfo = styled.div`
  flex: 1;
  padding: 0 16px;
`;

const SessionTitle = styled.h4`
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.color || '#2d3748'};
`;

const SessionSpeaker = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${props => props.color || '#4a5568'};
  gap: 4px;
`;

const SessionAction = styled.div`
  display: flex;
  align-items: center;
`;

const SessionDetails = styled.div`
  padding: 16px;
  border-top: 1px solid ${props => props.borderColor || '#e2e8f0'};
  background-color: ${props => props.bgColor || '#f7fafc'};
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const SessionDetailsItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SessionDetailsIcon = styled.div`
  color: ${props => props.color || '#718096'};
  display: flex;
  align-items: center;
  padding-top: 2px;
`;

const SessionDetailsContent = styled.div`
  color: ${props => props.color || '#4a5568'};
  font-size: 14px;
  flex: 1;
`;

const SessionDetailsTitle = styled.div`
  font-weight: 600;
  color: ${props => props.color || '#2d3748'};
  margin-bottom: 4px;
`;

const SessionDescription = styled.p`
  margin: 0 0 16px 0;
  line-height: 1.5;
`;

const SpeakerList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
`;

const SpeakerCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: ${props => props.bgColor || 'white'};
  border-radius: 6px;
  border: 1px solid ${props => props.borderColor || '#e2e8f0'};
`;

const SpeakerAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #e2e8f0;
`;

const SpeakerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SpeakerInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const SpeakerName = styled.div`
  font-weight: 600;
  color: ${props => props.color || '#2d3748'};
`;

const SpeakerRole = styled.div`
  font-size: 12px;
  color: ${props => props.color || '#718096'};
`;

export function ScheduleAgendaBrickComponent({ brick, onSelect, isSelected }) {
  const { id, props = {} } = brick;
  
  // State for active day tab and expanded session
  const [activeDay, setActiveDay] = useState(0);
  const [expandedSession, setExpandedSession] = useState(null);
  
  // Mock schedule data - in a real app, this would come from props or an API
  const schedule = props.schedule || [
    {
      day: 'Day 1',
      date: 'July 12, 2025',
      sessions: [
        {
          id: 'day1-session1',
          time: '09:00',
          duration: '60 min',
          title: 'Opening Keynote',
          location: 'Main Stage',
          speakers: [
            { name: 'Sarah Johnson', role: 'CEO, TechCorp', avatar: '/api/placeholder/48/48' }
          ],
          description: 'Join us for the opening keynote where we will introduce the conference theme and preview the exciting sessions ahead.'
        },
        {
          id: 'day1-session2',
          time: '10:30',
          duration: '45 min',
          title: 'Future of AI in Business',
          location: 'Workshop Room A',
          speakers: [
            { name: 'Michael Chen', role: 'AI Director, FutureNow', avatar: '/api/placeholder/48/48' }
          ],
          description: 'Explore the latest advancements in artificial intelligence and how they are transforming business operations and customer experiences.'
        },
        {
          id: 'day1-session3',
          time: '13:00',
          duration: '90 min',
          title: 'Networking Lunch',
          location: 'Grand Hall',
          speakers: [],
          description: 'Connect with fellow attendees, speakers, and sponsors during our catered networking lunch.'
        }
      ]
    },
    {
      day: 'Day 2',
      date: 'July 13, 2025',
      sessions: [
        {
          id: 'day2-session1',
          time: '09:30',
          duration: '90 min',
          title: 'Web Development Workshop',
          location: 'Lab Room 101',
          speakers: [
            { name: 'Lisa Rodriguez', role: 'Lead Developer, WebTech', avatar: '/api/placeholder/48/48' },
            { name: 'David Kim', role: 'UX Designer, WebTech', avatar: '/api/placeholder/48/48' }
          ],
          description: 'A hands-on workshop where you will learn the latest web development techniques and best practices.'
        },
        {
          id: 'day2-session2',
          time: '11:30',
          duration: '60 min',
          title: 'Cybersecurity Panel',
          location: 'Conference Room B',
          speakers: [
            { name: 'James Wilson', role: 'Security Expert, SecureNet', avatar: '/api/placeholder/48/48' },
            { name: 'Emma Davis', role: 'CISO, Enterprise Solutions', avatar: '/api/placeholder/48/48' },
            { name: 'Robert Taylor', role: 'Ethical Hacker', avatar: '/api/placeholder/48/48' }
          ],
          description: 'Industry experts discuss the evolving landscape of cybersecurity threats and share strategies for protecting your organization.'
        }
      ]
    }
  ];
  
  const toggleSession = (sessionId) => {
    setExpandedSession(expandedSession === sessionId ? null : sessionId);
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
      <ScheduleContainer
        bgColor={props.bgColor}
        borderRadius={props.borderRadius}
        boxShadow={props.boxShadow}
        padding={props.padding}
        marginTop={props.marginTop}
        marginBottom={props.marginBottom}
        marginLeft={props.marginLeft}
        marginRight={props.marginRight}
        border={props.border}
        fontFamily={props.fontFamily}
      >
        <ScheduleHeader alignment={props.headerAlignment}>
          <ScheduleTitle
            fontSize={props.titleFontSize}
            fontWeight={props.titleFontWeight}
            color={props.titleColor}
          >
            {props.title || 'Event Schedule'}
          </ScheduleTitle>
          <ScheduleDescription
            fontSize={props.descriptionFontSize}
            color={props.descriptionColor}
          >
            {props.description || 'View the complete program and plan your event experience.'}
          </ScheduleDescription>
        </ScheduleHeader>
        
        <TabsContainer borderColor={props.borderColor}>
          {schedule.map((day, index) => (
            <Tab 
              key={index}
              active={activeDay === index}
              onClick={() => setActiveDay(index)}
              color={props.tabColor}
              activeColor={props.tabActiveColor || props.accentColor}
              hoverColor={props.tabHoverColor}
              activeBgColor={props.tabActiveBgColor}
              hoverBgColor={props.tabHoverBgColor}
            >
              <div>{day.day}</div>
              <div style={{ fontSize: '12px' }}>{day.date}</div>
            </Tab>
          ))}
        </TabsContainer>
        
        <SessionsList>
          {schedule[activeDay]?.sessions.map((session) => {
            const isOpen = expandedSession === session.id;
            
            return (
              <SessionCard 
                key={session.id}
                borderColor={props.cardBorderColor}
                borderRadius={props.cardBorderRadius}
                bgColor={props.cardBgColor}
                hoverBoxShadow={props.cardHoverBoxShadow}
              >
                <SessionHeader 
                  onClick={() => toggleSession(session.id)}
                  isActive={isOpen}
                  accentColor={props.accentColor}
                >
                  <SessionTime borderColor={props.borderColor}>
                    <SessionHour color={props.timeColor}>
                      {session.time}
                    </SessionHour>
                    <SessionDuration color={props.durationColor}>
                      {session.duration}
                    </SessionDuration>
                  </SessionTime>
                  <SessionInfo>
                    <SessionTitle color={props.sessionTitleColor}>
                      {session.title}
                    </SessionTitle>
                    {session.speakers.length > 0 && (
                      <SessionSpeaker color={props.speakerColor}>
                        <User size={14} />
                        {session.speakers.length === 1 
                          ? session.speakers[0].name 
                          : `${session.speakers.length} Speakers`}
                      </SessionSpeaker>
                    )}
                  </SessionInfo>
                  <SessionAction>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </SessionAction>
                </SessionHeader>
                
                <SessionDetails 
                  isOpen={isOpen}
                  borderColor={props.borderColor}
                  bgColor={props.detailsBgColor}
                >
                  <SessionDescription color={props.detailsTextColor}>
                    {session.description}
                  </SessionDescription>
                  
                  <SessionDetailsItem>
                    <SessionDetailsIcon color={props.detailsIconColor}>
                      <Clock size={16} />
                    </SessionDetailsIcon>
                    <SessionDetailsContent color={props.detailsTextColor}>
                      <SessionDetailsTitle color={props.detailsTitleColor}>
                        Time
                      </SessionDetailsTitle>
                      {session.time} ({session.duration})
                    </SessionDetailsContent>
                  </SessionDetailsItem>
                  
                  <SessionDetailsItem>
                    <SessionDetailsIcon color={props.detailsIconColor}>
                      <MapPin size={16} />
                    </SessionDetailsIcon>
                    <SessionDetailsContent color={props.detailsTextColor}>
                      <SessionDetailsTitle color={props.detailsTitleColor}>
                        Location
                      </SessionDetailsTitle>
                      {session.location}
                    </SessionDetailsContent>
                  </SessionDetailsItem>
                  
                  {session.speakers.length > 0 && (
                    <SessionDetailsItem>
                      <SessionDetailsIcon color={props.detailsIconColor}>
                        <User size={16} />
                      </SessionDetailsIcon>
                      <SessionDetailsContent color={props.detailsTextColor}>
                        <SessionDetailsTitle color={props.detailsTitleColor}>
                          {session.speakers.length === 1 ? 'Speaker' : 'Speakers'}
                        </SessionDetailsTitle>
                        
                        <SpeakerList>
                          {session.speakers.map((speaker, index) => (
                            <SpeakerCard 
                              key={index}
                              bgColor={props.speakerCardBgColor}
                              borderColor={props.speakerCardBorderColor}
                            >
                              <SpeakerAvatar>
                                <SpeakerImage src={speaker.avatar} alt={speaker.name} />
                              </SpeakerAvatar>
                              <SpeakerInfo>
                                <SpeakerName color={props.speakerNameColor}>
                                  {speaker.name}
                                </SpeakerName>
                                <SpeakerRole color={props.speakerRoleColor}>
                                  {speaker.role}
                                </SpeakerRole>
                              </SpeakerInfo>
                            </SpeakerCard>
                          ))}
                        </SpeakerList>
                      </SessionDetailsContent>
                    </SessionDetailsItem>
                  )}
                </SessionDetails>
              </SessionCard>
            );
          })}
        </SessionsList>
      </ScheduleContainer>
    </div>
  );
}

export const ScheduleAgendaBrickInspector = {
  displayName: 'Schedule & Agenda',
  props: {
    // General settings
    title: { type: 'text', label: 'Schedule Title', defaultValue: 'Event Schedule' },
    description: { type: 'text', label: 'Schedule Description', defaultValue: 'View the complete program and plan your event experience.' },
    fontFamily: { type: 'select', label: 'Font Family', options: ['Inter, sans-serif', 'Georgia, serif', 'Montserrat, sans-serif', 'Roboto, sans-serif', 'Open Sans, sans-serif'], defaultValue: 'Inter, sans-serif' },
    headerAlignment: { type: 'select', label: 'Header Alignment', options: ['left', 'center', 'right'], defaultValue: 'left' },
    
    // Container appearance
    bgColor: { type: 'colorpicker', label: 'Background Color', defaultValue: 'white' },
    borderRadius: { type: 'number', label: 'Border Radius', defaultValue: 8, unit: 'px' },
    boxShadow: { type: 'text', label: 'Box Shadow', defaultValue: '0 4px 12px rgba(0, 0, 0, 0.1)' },
    padding: { type: 'text', label: 'Padding', defaultValue: '24px' },
    border: { type: 'text', label: 'Border', defaultValue: 'none' },
    borderColor: { type: 'colorpicker', label: 'Border Color', defaultValue: '#e2e8f0' },
    
    // Typography
    titleFontSize: { type: 'text', label: 'Title Font Size', defaultValue: '24px' },
    titleFontWeight: { type: 'select', label: 'Title Font Weight', options: ['400', '500', '600', '700', '800'], defaultValue: '700' },
    titleColor: { type: 'colorpicker', label: 'Title Color', defaultValue: '#1a202c' },
    descriptionFontSize: { type: 'text', label: 'Description Font Size', defaultValue: '16px' },
    descriptionColor: { type: 'colorpicker', label: 'Description Color', defaultValue: '#4a5568' },
    
    // Tab styling
    accentColor: { type: 'colorpicker', label: 'Accent Color', defaultValue: '#3182ce' },
    tabColor: { type: 'colorpicker', label: 'Tab Text Color', defaultValue: '#4a5568' },
    tabActiveColor: { type: 'colorpicker', label: 'Tab Active Text', defaultValue: '#3182ce' },
    tabHoverColor: { type: 'colorpicker', label: 'Tab Hover Text', defaultValue: '#2b6cb0' },
    tabActiveBgColor: { type: 'colorpicker', label: 'Tab Active BG', defaultValue: '#ebf8ff' },
    tabHoverBgColor: { type: 'colorpicker', label: 'Tab Hover BG', defaultValue: '#f7fafc' },
    
    // Card styling
    cardBorderColor: { type: 'colorpicker', label: 'Card Border Color', defaultValue: '#e2e8f0' },
    cardBorderRadius: { type: 'number', label: 'Card Border Radius', defaultValue: 6, unit: 'px' },
    cardBgColor: { type: 'colorpicker', label: 'Card Background', defaultValue: 'white' },
    cardHoverBoxShadow: { type: 'text', label: 'Card Hover Shadow', defaultValue: '0 2px 8px rgba(0, 0, 0, 0.05)' },
    
    // Session styling
    timeColor: { type: 'colorpicker', label: 'Time Color', defaultValue: '#2d3748' },
    durationColor: { type: 'colorpicker', label: 'Duration Color', defaultValue: '#718096' },
    sessionTitleColor: { type: 'colorpicker', label: 'Session Title Color', defaultValue: '#2d3748' },
    speakerColor: { type: 'colorpicker', label: 'Speaker Text Color', defaultValue: '#4a5568' },
    
    // Details styling
    detailsBgColor: { type: 'colorpicker', label: 'Details Background', defaultValue: '#f7fafc' },
    detailsTextColor: { type: 'colorpicker', label: 'Details Text Color', defaultValue: '#4a5568' },
    detailsTitleColor: { type: 'colorpicker', label: 'Details Title Color', defaultValue: '#2d3748' },
    detailsIconColor: { type: 'colorpicker', label: 'Details Icon Color', defaultValue: '#718096' },
    
    // Speaker card styling
    speakerCardBgColor: { type: 'colorpicker', label: 'Speaker Card BG', defaultValue: 'white' },
    speakerCardBorderColor: { type: 'colorpicker', label: 'Speaker Card Border', defaultValue: '#e2e8f0' },
    speakerNameColor: { type: 'colorpicker', label: 'Speaker Name Color', defaultValue: '#2d3748' },
    speakerRoleColor: { type: 'colorpicker', label: 'Speaker Role Color', defaultValue: '#718096' },
    
    // Margins
    marginTop: { type: 'number', label: 'Margin Top', defaultValue: 0, unit: 'px' },
    marginBottom: { type: 'number', label: 'Margin Bottom', defaultValue: 0, unit: 'px' },
    marginLeft: { type: 'number', label: 'Margin Left', defaultValue: 0, unit: 'px' },
    marginRight: { type: 'number', label: 'Margin Right', defaultValue: 0, unit: 'px' },
    
    // Schedule data - in a real app, this would link to your event management system
    schedule: { type: 'json', label: 'Schedule Data (JSON)', defaultValue: '' }
  }
};
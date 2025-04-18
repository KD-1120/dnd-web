import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Calendar, Clock, MapPin, ChevronRight, Plus } from 'lucide-react';
import { EventTicketService } from '../Other pages/services/EventTicketService';
import { colors, spacing, shadows, borderRadius } from '../../../GlobalStyles';

const PageWrapper = styled.div`
  padding: ${spacing.lg};
  background-color: ${colors.light};
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: ${colors.dark};
  margin-bottom: ${spacing.md};
`;

const StyledCard = styled(Card)`
  border: none;
  box-shadow: ${shadows.sm};
  border-radius: ${borderRadius.md};
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  height: 100%;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${shadows.md};
  }
`;

const EventImage = styled.div`
  height: 160px;
  background-color: ${colors.lightGray};
  background-size: cover;
  background-position: center;
  border-top-left-radius: ${borderRadius.md};
  border-top-right-radius: ${borderRadius.md};
`;

const EventTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.dark};
  margin-bottom: ${spacing.xs};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EventMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${colors.secondary};
  font-size: 14px;
  margin-bottom: 4px;
  
  svg {
    color: ${colors.primary};
  }
`;

const CreateEventButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EventSelector = ({ sectionType }) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map section types to their routes
  const sectionRoutes = {
    attendees: 'attendees',
    tickets: 'tickets',
    analytics: 'analytics',
    qa: 'qa',
    polls: 'polls',
    voting: 'awards'
  };
  
  // Map section types to their titles for display
  const sectionTitles = {
    attendees: 'Attendees',
    tickets: 'Tickets',
    analytics: 'Analytics',
    qa: 'Q&A',
    polls: 'Polls',
    voting: 'Awards & Voting'
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await EventTicketService.getEvents();
        setEvents(eventsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventSelect = (eventId) => {
    const route = sectionRoutes[sectionType] || sectionType;
    navigate(`/dashboard/events/${eventId}/${route}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <PageWrapper>
        <Container>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading events...</p>
          </div>
        </Container>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <Container>
          <Alert variant="danger">{error}</Alert>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <PageTitle>Select an Event to View {sectionTitles[sectionType] || sectionType.charAt(0).toUpperCase() + sectionType.slice(1)}</PageTitle>
          <CreateEventButton 
            as={Link} 
            to="/dashboard/events/create" 
            variant="primary"
          >
            <Plus size={18} />
            Create New Event
          </CreateEventButton>
        </div>

        {events.length === 0 ? (
          <Card className="text-center p-5">
            <Card.Body>
              <Calendar size={48} className="mb-3 text-muted" />
              <h4>No Events Created Yet</h4>
              <p className="text-muted mb-4">Start by creating your first event</p>
              <Button 
                variant="primary"
                as={Link}
                to="/dashboard/events/create"
              >
                <Plus size={16} className="me-2" />
                Create Event
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-4">
            {events.map(event => (
              <Col key={event.id} lg={4} md={6}>
                <StyledCard onClick={() => handleEventSelect(event.id)}>
                  <EventImage />
                  <Card.Body>
                    <EventTitle>{event.title}</EventTitle>
                    
                    <EventMeta>
                      <Calendar size={14} />
                      <span>{formatDate(event.startDate)}</span>
                    </EventMeta>
                    
                    {event.venue && (
                      <EventMeta>
                        <MapPin size={14} />
                        <span>{event.venue}</span>
                      </EventMeta>
                    )}
                    
                    <div className="d-flex justify-content-end mt-3">
                      <Button 
                        variant="link" 
                        className="p-0 text-primary d-flex align-items-center"
                      >
                        View {sectionTitles[sectionType] || sectionType}
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </Card.Body>
                </StyledCard>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </PageWrapper>
  );
};

export default EventSelector;
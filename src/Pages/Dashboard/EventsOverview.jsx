import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, Ticket, TrendingUp, Plus, Edit2, BarChart2, QrCode, Trash2, ArrowRight, Eye, MapPin, Globe } from 'lucide-react';
import { EventTicketService } from './Other pages/services/EventTicketService';
import { colors, spacing, shadows, borderRadius, typography } from '../../GlobalStyles';

const PageWrapper = styled.div`
  padding: ${spacing.lg};
  background-color: ${colors.light};
`;

const PageTitle = styled.h1`
  font-size: ${typography.fontSizes.h1};
  font-weight: 600;
  color: ${colors.dark};
  margin-bottom: ${spacing.md};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.lg};
`;

const StatsCard = styled(Card)`
  border: none;
  box-shadow: ${shadows.sm};
  transition: transform 0.2s;
  background: ${props => props.bgColor || colors.white};
  height: 100%;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${shadows.md};
  }
`;

const StatValue = styled.div`
  font-size: ${typography.fontSizes.xl};
  font-weight: 600;
  color: ${colors.dark};
`;

const StatLabel = styled.div`
  color: ${colors.secondary};
  font-size: ${typography.fontSizes.small};
`;

const EventCard = styled(Card)`
  border: none;
  box-shadow: ${shadows.sm};
  transition: transform 0.2s;
  margin-bottom: ${spacing.md};
  overflow: hidden;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${shadows.md};
  }
`;

const EventHeader = styled.div`
  padding: ${spacing.sm} ${spacing.md};
  background-color: ${props => props.bgColor || colors.light};
  border-bottom: 1px solid ${colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bg || colors.primaryLight};
  color: ${props => props.color || colors.primary};
  margin-bottom: ${spacing.sm};
`;

const ActionButton = styled(Button)`
  padding: 0.5rem 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  
  &.btn-primary {
    background-color: ${colors.primary};
    border-color: ${colors.primary};
    
    &:hover {
      background-color: ${colors.primaryHover};
      border-color: ${colors.primaryHover};
    }
  }

  &.btn-light {
    background-color: ${colors.white};
    border-color: ${colors.border};
    color: ${colors.secondary};
    
    &:hover {
      background-color: ${colors.lightGray};
      color: ${colors.dark};
    }
  }
`;

const ActionIconButton = styled(Button)`
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${borderRadius.sm};
  margin-left: ${spacing.xs};
  color: ${colors.secondary};
  background-color: ${colors.white};
  border: 1px solid ${colors.border};
  
  &:hover {
    background-color: ${colors.lightGray};
    color: ${colors.dark};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const StatusBadge = styled(Badge)`
  font-weight: 500;
  padding: 0.35rem 0.75rem;
  border-radius: ${borderRadius.pill};
  
  &.bg-success {
    background-color: ${colors.success} !important;
  }
  
  &.bg-warning {
    background-color: ${colors.warning} !important;
  }
  
  &.bg-secondary {
    background-color: ${colors.secondary} !important;
  }
`;

const NoEventsCard = styled(Card)`
  text-align: center;
  padding: ${spacing.lg};
  border: 2px dashed ${colors.border};
  background-color: ${colors.white};
`;

const EventsOverview = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const allEvents = await EventTicketService.getEvents();
      
      // Enhance events with additional data
      const enhancedEvents = await Promise.all(allEvents.map(async event => {
        const tickets = await EventTicketService.getTicketTypes(event.id);
        const sales = await EventTicketService.getEventSales(event.id);
        
        const totalAttendees = sales.length;
        const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
        const ticketsSold = sales.reduce((sum, sale) => sum + (sale.quantity || 0), 0);
        
        return {
          ...event,
          totalAttendees,
          totalRevenue,
          ticketsSold,
          ticketTypes: tickets.length
        };
      }));
      
      // Sort by start date (most recent first)
      enhancedEvents.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      
      setEvents(enhancedEvents);
      setError(null);
    } catch (error) {
      console.error('Error loading events:', error);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    navigate('/dashboard/events/create');
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      // First remove the event from state for immediate feedback
      setEvents(events.filter(event => event.id !== eventId));
      setConfirmDelete(null);
      
      // Then delete from storage
      await EventTicketService.deleteEvent(eventId);
    } catch (error) {
      console.error('Error deleting event:', error);
      // Reload the events in case of error
      loadEvents();
    }
  };

  const getTotalStats = () => {
    return events.reduce((stats, event) => {
      stats.totalAttendees += event.totalAttendees || 0;
      stats.totalRevenue += event.totalRevenue || 0;
      stats.totalTicketsSold += event.ticketsSold || 0;
      return stats;
    }, {
      totalAttendees: 0,
      totalRevenue: 0,
      totalTicketsSold: 0
    });
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    if (now < startDate) {
      return { status: 'upcoming', badge: 'warning', label: 'Upcoming' };
    } else if (now >= startDate && now <= endDate) {
      return { status: 'live', badge: 'success', label: 'Live' };
    } else {
      return { status: 'past', badge: 'secondary', label: 'Past' };
    }
  };

  const stats = getTotalStats();

  return (
    <PageWrapper>
      <Container>
        <PageHeader>
          <div>
            <PageTitle>Events Overview</PageTitle>
            <p className="text-muted">Manage and monitor all your events</p>
          </div>
          <ActionButton variant="primary" onClick={handleCreateEvent}>
            <Plus size={16} />
            Create New Event
          </ActionButton>
        </PageHeader>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Row className="g-4 mb-4">
          <Col md={3}>
            <StatsCard bgColor="#f0fdf4">
              <Card.Body>
                <IconWrapper bg="#dcfce7" color="#16a34a">
                  <Calendar size={20} />
                </IconWrapper>
                <StatValue>{events.length}</StatValue>
                <StatLabel>Total Events</StatLabel>
              </Card.Body>
            </StatsCard>
          </Col>
          <Col md={3}>
            <StatsCard bgColor="#eff6ff">
              <Card.Body>
                <IconWrapper bg="#dbeafe" color="#2563eb">
                  <Ticket size={20} />
                </IconWrapper>
                <StatValue>{stats.totalTicketsSold}</StatValue>
                <StatLabel>Tickets Sold</StatLabel>
              </Card.Body>
            </StatsCard>
          </Col>
          <Col md={3}>
            <StatsCard bgColor="#fef2f2">
              <Card.Body>
                <IconWrapper bg="#fee2e2" color="#dc2626">
                  <Users size={20} />
                </IconWrapper>
                <StatValue>{stats.totalAttendees}</StatValue>
                <StatLabel>Total Attendees</StatLabel>
              </Card.Body>
            </StatsCard>
          </Col>
          <Col md={3}>
            <StatsCard bgColor="#f5f3ff">
              <Card.Body>
                <IconWrapper bg="#ede9fe" color="#7c3aed">
                  <TrendingUp size={20} />
                </IconWrapper>
                <StatValue>${stats.totalRevenue.toLocaleString()}</StatValue>
                <StatLabel>Total Revenue</StatLabel>
              </Card.Body>
            </StatsCard>
          </Col>
        </Row>

        <div className="mb-4">
          {loading ? (
            <Card className="text-center p-4">
              <Card.Body>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading your events...</p>
              </Card.Body>
            </Card>
          ) : events.length === 0 ? (
            <NoEventsCard>
              <h4>No Events Yet</h4>
              <p className="text-muted mb-4">Start by creating your first event</p>
              <Button variant="primary" onClick={handleCreateEvent}>
                <Plus size={16} className="me-2" />
                Create New Event
              </Button>
            </NoEventsCard>
          ) : (
            events.map(event => {
              const eventStatusInfo = getEventStatus(event);
              
              return (
                <EventCard key={event.id}>
                  <EventHeader bgColor={eventStatusInfo.status === 'live' ? '#f0fdf4' : '#f8fafc'}>
                    <StatusBadge bg={eventStatusInfo.badge}>
                      {eventStatusInfo.label}
                    </StatusBadge>
                    <div>
                      <ActionIconButton 
                        as="a"
                        href={`/events/${event.id}`}
                        target="_blank"
                        title="View Public Website"
                      >
                        <Globe size={16} />
                      </ActionIconButton>
                      <ActionIconButton 
                        as={Link} 
                        to={`/dashboard/events/${event.id}/website`}
                        title="Manage Website"
                      >
                        <Eye size={16} />
                      </ActionIconButton>
                      <ActionIconButton 
                        as={Link} 
                        to={`/dashboard/events/${event.id}/tickets/scan`}
                        title="Scan Tickets"
                      >
                        <QrCode size={16} />
                      </ActionIconButton>
                      <ActionIconButton 
                        as={Link} 
                        to={`/dashboard/events/${event.id}/analytics`}
                        title="View Analytics"
                      >
                        <BarChart2 size={16} />
                      </ActionIconButton>
                      <ActionIconButton 
                        as={Link} 
                        to={`/dashboard/events/${event.id}/edit`}
                        title="Edit Event"
                      >
                        <Edit2 size={16} />
                      </ActionIconButton>
                      <ActionIconButton 
                        onClick={() => setConfirmDelete(event.id)}
                        title="Delete Event"
                      >
                        <Trash2 size={16} />
                      </ActionIconButton>
                    </div>
                  </EventHeader>
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col md={5}>
                        <h5 className="mb-1">{event.title}</h5>
                        <div className="text-muted small">
                          <Calendar size={14} className="me-1" />
                          {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                        </div>
                        <div className="text-muted small mt-1">
                          <MapPin size={14} className="me-1" />
                          {event.venue}
                        </div>
                        <div className="text-muted small mt-1">
                          <Users size={14} className="me-1" />
                          Capacity: {event.capacity} attendees
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="text-muted small">Ticket Types</div>
                        <div className="fw-bold">{event.ticketTypes || 0}</div>
                      </Col>
                      <Col md={2}>
                        <div className="text-muted small">Tickets Sold</div>
                        <div className="fw-bold">{event.ticketsSold || 0}</div>
                      </Col>
                      <Col md={2}>
                        <div className="text-muted small">Revenue</div>
                        <div className="fw-bold">${(event.totalRevenue || 0).toLocaleString()}</div>
                      </Col>
                      <Col md={1} className="text-end">
                        <ActionButton
                          variant="light"
                          as={Link}
                          to={`/dashboard/events/${event.id}/attendees`}
                          title="View Attendees"
                        >
                          <ArrowRight size={16} />
                        </ActionButton>
                      </Col>
                    </Row>
                  </Card.Body>
                </EventCard>
              );
            })
          )}
        </div>

        {/* Delete confirmation modal */}
        {confirmDelete && (
          <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button type="button" className="btn-close" onClick={() => setConfirmDelete(null)}></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this event? This action cannot be undone.</p>
                </div>
                <div className="modal-footer">
                  <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteEvent(confirmDelete)}>
                    Delete Event
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </PageWrapper>
  );
}

export default EventsOverview;

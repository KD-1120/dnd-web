import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { Calendar, Clock, MapPin, Users, Ticket, ArrowRight, Plus } from 'lucide-react';
import { EventTicketService } from './services/EventTicketService';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { colors, spacing, shadows, borderRadius, typography } from '../../../GlobalStyles';

const PageWrapper = styled.div`
  padding: ${spacing.lg};
  background-color: ${colors.light};
`;

const PageHeader = styled.div`
  margin-bottom: ${spacing.lg};
`;

const PageTitle = styled.h1`
  font-size: ${typography.fontSizes.h1};
  font-weight: 600;
  color: ${colors.dark};
`;

const FormSection = styled(Card)`
  margin-bottom: ${spacing.lg};
  border: none;
  box-shadow: ${shadows.sm};
  border-radius: ${borderRadius.md};
`;

const FormLabel = styled(Form.Label)`
  font-weight: 500;
  margin-bottom: ${spacing.xs};
`;

const ActionButton = styled(Button)`
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  border-radius: ${borderRadius.sm};
  
  &.btn-primary {
    background-color: ${colors.primary};
    border-color: ${colors.primary};
    
    &:hover {
      background-color: ${colors.primaryHover};
      border-color: ${colors.primaryHover};
    }
  }
`;

const TicketTypeCard = styled.div`
  background-color: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  margin-bottom: ${spacing.md};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${shadows.sm};
  }
`;

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    venue: '',
    capacity: '',
    category: 'conference',
    isPublic: true,
    organizerName: '',
    contactEmail: '',
    ticketTypes: []
  });

  useEffect(() => {
    const loadEventData = async () => {
      try {
        const event = await EventTicketService.getEvent(eventId);
        if (!event) {
          setError('Event not found');
          return;
        }

        const tickets = await EventTicketService.getTicketTypes(eventId);
        
        setEventData({
          title: event.title || '',
          description: event.description || '',
          startDate: event.startDate || '',
          endDate: event.endDate || '',
          venue: event.venue || '',
          capacity: event.capacity || '',
          category: event.category || 'conference',
          isPublic: event.isPublic ?? true,
          organizerName: event.organizerName || '',
          contactEmail: event.contactEmail || '',
          ticketTypes: tickets || []
        });
      } catch (error) {
        console.error('Error loading event:', error);
        setError('Failed to load event data');
      }
    };

    loadEventData();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Update the event
      await EventTicketService.updateEvent(eventId, {
        title: eventData.title,
        description: eventData.description,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        venue: eventData.venue,
        capacity: parseInt(eventData.capacity),
        category: eventData.category,
        isPublic: eventData.isPublic,
        organizerName: eventData.organizerName,
        contactEmail: eventData.contactEmail
      });

      // Update existing ticket types and create new ones
      await Promise.all(
        eventData.ticketTypes.map(ticket => {
          if (ticket.id) {
            // Update existing ticket
            return EventTicketService.updateTicketType(eventId, ticket.id, {
              name: ticket.name,
              price: parseFloat(ticket.price),
              quantity: parseInt(ticket.quantity),
              description: ticket.description,
              validFrom: ticket.validFrom || new Date().toISOString(),
              validUntil: ticket.validUntil || eventData.endDate
            });
          } else {
            // Create new ticket
            return EventTicketService.createTicketType(eventId, {
              name: ticket.name,
              price: parseFloat(ticket.price),
              quantity: parseInt(ticket.quantity),
              description: ticket.description,
              validFrom: new Date().toISOString(),
              validUntil: eventData.endDate,
              status: 'active'
            });
          }
        })
      );

      setSuccess('Event updated successfully!');
      setTimeout(() => {
        navigate('/dashboard/events');
      }, 1500);
    } catch (error) {
      console.error('Error updating event:', error);
      setError('There was an error updating your event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const addTicketType = () => {
    setEventData(prev => ({
      ...prev,
      ticketTypes: [
        ...prev.ticketTypes,
        {
          name: '',
          price: '',
          quantity: '',
          description: ''
        }
      ]
    }));
  };

  const removeTicketType = (index) => {
    const ticketToRemove = eventData.ticketTypes[index];
    if (ticketToRemove.id) {
      // If it's an existing ticket, mark it for deletion
      EventTicketService.deleteTicketType(eventId, ticketToRemove.id);
    }
    
    const newTicketTypes = [...eventData.ticketTypes];
    newTicketTypes.splice(index, 1);
    setEventData(prev => ({
      ...prev,
      ticketTypes: newTicketTypes
    }));
  };

  const updateTicketData = (index, field, value) => {
    const newTicketTypes = [...eventData.ticketTypes];
    newTicketTypes[index][field] = value;
    setEventData(prev => ({
      ...prev,
      ticketTypes: newTicketTypes
    }));
  };

  return (
    <PageWrapper>
      <Container>
        <PageHeader>
          <PageTitle>Edit Event</PageTitle>
          <p className="text-muted">Update your event details</p>
        </PageHeader>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mb-4">
            {success}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <FormSection>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <FormLabel>Event Title</FormLabel>
                    <Form.Control
                      type="text"
                      name="title"
                      value={eventData.title}
                      onChange={handleInputChange}
                      placeholder="Enter a descriptive title"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <FormLabel>Event Category</FormLabel>
                    <Form.Select
                      name="category"
                      value={eventData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="conference">Conference</option>
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                      <option value="concert">Concert</option>
                      <option value="exhibition">Exhibition</option>
                      <option value="networking">Networking</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <FormLabel>Description</FormLabel>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={eventData.description}
                  onChange={handleInputChange}
                  placeholder="Provide details about your event"
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <FormLabel>
                      <Calendar size={16} className="me-2" />
                      Start Date & Time
                    </FormLabel>
                    <Form.Control
                      type="datetime-local"
                      name="startDate"
                      value={eventData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <FormLabel>
                      <Clock size={16} className="me-2" />
                      End Date & Time
                    </FormLabel>
                    <Form.Control
                      type="datetime-local"
                      name="endDate"
                      value={eventData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <FormLabel>
                      <MapPin size={16} className="me-2" />
                      Venue
                    </FormLabel>
                    <Form.Control
                      type="text"
                      name="venue"
                      value={eventData.venue}
                      onChange={handleInputChange}
                      placeholder="Enter the location of your event"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <FormLabel>
                      <Users size={16} className="me-2" />
                      Maximum Capacity
                    </FormLabel>
                    <Form.Control
                      type="number"
                      name="capacity"
                      value={eventData.capacity}
                      onChange={handleInputChange}
                      placeholder="Enter max attendees"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <FormLabel>Organizer Name</FormLabel>
                    <Form.Control
                      type="text"
                      name="organizerName"
                      value={eventData.organizerName}
                      onChange={handleInputChange}
                      placeholder="Who is organizing this event"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <FormLabel>Contact Email</FormLabel>
                    <Form.Control
                      type="email"
                      name="contactEmail"
                      value={eventData.contactEmail}
                      onChange={handleInputChange}
                      placeholder="Email for attendee inquiries"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Make this event public and searchable"
                  name="isPublic"
                  checked={eventData.isPublic}
                  onChange={handleCheckboxChange}
                />
              </Form.Group>
            </Card.Body>
          </FormSection>

          <FormSection>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h3 className="mb-0">
                    <Ticket size={20} className="me-2" />
                    Ticket Types
                  </h3>
                  <p className="text-muted mb-0">Manage your event's ticket types</p>
                </div>
                <Button 
                  variant="outline-primary" 
                  onClick={addTicketType}
                >
                  <Plus size={16} className="me-2" />
                  Add Ticket Type
                </Button>
              </div>

              {eventData.ticketTypes.map((ticket, index) => (
                <TicketTypeCard key={index}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <FormLabel>Ticket Name</FormLabel>
                        <Form.Control
                          type="text"
                          value={ticket.name}
                          onChange={(e) => updateTicketData(index, 'name', e.target.value)}
                          placeholder="e.g. VIP, Early Bird, Standard"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <FormLabel>Price ($ USD)</FormLabel>
                        <Form.Control
                          type="number"
                          step="0.01"
                          min="0"
                          value={ticket.price}
                          onChange={(e) => updateTicketData(index, 'price', e.target.value)}
                          placeholder="Enter 0 for free tickets"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <FormLabel>Quantity Available</FormLabel>
                        <Form.Control
                          type="number"
                          min="1"
                          value={ticket.quantity}
                          onChange={(e) => updateTicketData(index, 'quantity', e.target.value)}
                          placeholder="Number of tickets available"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <FormLabel>Description</FormLabel>
                        <Form.Control
                          as="textarea"
                          rows={1}
                          value={ticket.description}
                          onChange={(e) => updateTicketData(index, 'description', e.target.value)}
                          placeholder="What's included with this ticket"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="text-end">
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => removeTicketType(index)}
                    >
                      Remove Ticket Type
                    </Button>
                  </div>
                </TicketTypeCard>
              ))}
            </Card.Body>
          </FormSection>

          <div className="d-flex justify-content-between">
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate('/dashboard/events')}
            >
              Cancel
            </Button>
            <ActionButton 
              variant="primary" 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </ActionButton>
          </div>
        </Form>
      </Container>
    </PageWrapper>
  );
};

export default EditEvent;
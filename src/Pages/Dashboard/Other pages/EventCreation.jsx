import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { Calendar, Clock, MapPin, Users, Ticket, ArrowRight, Plus } from 'lucide-react';
import { EventTicketService } from './services/EventTicketService';
import { EventService } from '../WebsiteBuilder/services/EventService';
import { useNavigate } from 'react-router-dom';
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

const SectionTitle = styled.h2`
  font-size: ${typography.fontSizes.large};
  font-weight: 600;
  margin-bottom: ${spacing.md};
  color: ${colors.dark};
`;

const FormLabel = styled(Form.Label)`
  font-weight: 500;
  margin-bottom: ${spacing.xs};
`;

const ProgressStep = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${spacing.lg};
`;

const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: ${props => props.active ? colors.primary : colors.border};
    top: 20px;
    left: 50%;
    z-index: 0;
  }
`;

const StepCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.active ? colors.primary : colors.lightGray};
  color: ${props => props.active ? colors.white : colors.gray};
  font-weight: 600;
  margin-bottom: ${spacing.xs};
  z-index: 1;
  transition: all 0.3s ease;
`;

const StepLabel = styled.div`
  font-size: ${typography.fontSizes.small};
  color: ${props => props.active ? colors.primary : colors.gray};
  text-align: center;
  font-weight: ${props => props.active ? '600' : '400'};
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
  
  &.btn-outline-secondary {
    color: ${colors.secondary};
    border-color: ${colors.border};
    
    &:hover {
      background-color: ${colors.lightGray};
      color: ${colors.dark};
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

const EventCreation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
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
    schedule: [
      {
        day: 'Day 1',
        date: '',
        sessions: []
      }
    ],
    ticketTypes: [
      {
        name: 'General Admission',
        price: '0',
        quantity: '100',
        description: 'Standard entry to the event'
      }
    ]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create the event first
      const eventId = await EventTicketService.createEvent({
        title: eventData.title,
        description: eventData.description,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        venue: eventData.venue,
        capacity: parseInt(eventData.capacity),
        category: eventData.category,
        isPublic: eventData.isPublic,
        organizerName: eventData.organizerName,
        contactEmail: eventData.contactEmail,
        schedule: eventData.schedule,
        status: 'draft'
      });

      // Create ticket types for the event
      await Promise.all(
        eventData.ticketTypes.map(ticket =>
          EventTicketService.createTicketType(eventId, {
            name: ticket.name,
            price: parseFloat(ticket.price),
            quantity: parseInt(ticket.quantity),
            description: ticket.description,
            validFrom: new Date().toISOString(),
            validUntil: eventData.endDate,
            status: 'active'
          })
        )
      );

      setSuccess('Event created successfully! Redirecting to template selection...');

      // Store event data in session storage for template initialization
      sessionStorage.setItem('newEventData', JSON.stringify({
        title: eventData.title,
        description: eventData.description,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        venue: eventData.venue,
        organizerName: eventData.organizerName,
        contactEmail: eventData.contactEmail,
        schedule: eventData.schedule
      }));

      // Redirect to template selection with event ID
      setTimeout(() => {
        navigate('/dashboard/events/website-templates', { 
          state: { 
            eventId,
            isNewEvent: true
          }
        });
      }, 1500);
    } catch (error) {
      console.error('Error creating event:', error);
      setError('There was an error creating your event. Please try again.');
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
    if (eventData.ticketTypes.length <= 1) return;
    
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

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  return (
    <PageWrapper>
      <Container>
        <PageHeader>
          <PageTitle>Create New Event</PageTitle>
          <p className="text-muted">Fill in the details below to create your event</p>
        </PageHeader>

        <ProgressStep>
          <StepItem active={currentStep >= 1}>
            <StepCircle active={currentStep >= 1}>1</StepCircle>
            <StepLabel active={currentStep >= 1}>Event Details</StepLabel>
          </StepItem>
          <StepItem active={currentStep >= 2}>
            <StepCircle active={currentStep >= 2}>2</StepCircle>
            <StepLabel active={currentStep >= 2}>Ticket Options</StepLabel>
          </StepItem>
          <StepItem active={currentStep >= 3}>
            <StepCircle active={currentStep >= 3}>3</StepCircle>
            <StepLabel active={currentStep >= 3}>Review & Create</StepLabel>
          </StepItem>
        </ProgressStep>

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
          {currentStep === 1 && (
            <FormSection>
              <Card.Body>
                <SectionTitle>Event Details</SectionTitle>
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

                <SectionTitle className="mt-4">
                  <Calendar size={20} className="me-2" />
                  Event Schedule
                </SectionTitle>
                <p className="text-muted mb-4">Add sessions to your event schedule (optional)</p>

                {eventData.schedule.map((day, dayIndex) => (
                  <TicketTypeCard key={dayIndex}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <FormLabel>Day Label</FormLabel>
                          <Form.Control
                            type="text"
                            value={day.day}
                            onChange={(e) => {
                              const newSchedule = [...eventData.schedule];
                              newSchedule[dayIndex].day = e.target.value;
                              setEventData(prev => ({ ...prev, schedule: newSchedule }));
                            }}
                            placeholder="e.g., Day 1, Opening Day"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <FormLabel>Date</FormLabel>
                          <Form.Control
                            type="date"
                            value={day.date}
                            onChange={(e) => {
                              const newSchedule = [...eventData.schedule];
                              newSchedule[dayIndex].date = e.target.value;
                              setEventData(prev => ({ ...prev, schedule: newSchedule }));
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {day.sessions.map((session, sessionIndex) => (
                      <Card key={sessionIndex} className="mb-3">
                        <Card.Body>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <FormLabel>Session Title</FormLabel>
                                <Form.Control
                                  type="text"
                                  value={session.title || ''}
                                  onChange={(e) => {
                                    const newSchedule = [...eventData.schedule];
                                    if (!newSchedule[dayIndex].sessions[sessionIndex]) {
                                      newSchedule[dayIndex].sessions[sessionIndex] = {};
                                    }
                                    newSchedule[dayIndex].sessions[sessionIndex].title = e.target.value;
                                    setEventData(prev => ({ ...prev, schedule: newSchedule }));
                                  }}
                                  placeholder="Session title"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={3}>
                              <Form.Group className="mb-3">
                                <FormLabel>Time</FormLabel>
                                <Form.Control
                                  type="time"
                                  value={session.time || ''}
                                  onChange={(e) => {
                                    const newSchedule = [...eventData.schedule];
                                    if (!newSchedule[dayIndex].sessions[sessionIndex]) {
                                      newSchedule[dayIndex].sessions[sessionIndex] = {};
                                    }
                                    newSchedule[dayIndex].sessions[sessionIndex].time = e.target.value;
                                    setEventData(prev => ({ ...prev, schedule: newSchedule }));
                                  }}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={3}>
                              <Form.Group className="mb-3">
                                <FormLabel>Duration (mins)</FormLabel>
                                <Form.Control
                                  type="number"
                                  value={session.duration || ''}
                                  onChange={(e) => {
                                    const newSchedule = [...eventData.schedule];
                                    if (!newSchedule[dayIndex].sessions[sessionIndex]) {
                                      newSchedule[dayIndex].sessions[sessionIndex] = {};
                                    }
                                    newSchedule[dayIndex].sessions[sessionIndex].duration = e.target.value;
                                    setEventData(prev => ({ ...prev, schedule: newSchedule }));
                                  }}
                                  placeholder="Duration"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <FormLabel>Location</FormLabel>
                                <Form.Control
                                  type="text"
                                  value={session.location || ''}
                                  onChange={(e) => {
                                    const newSchedule = [...eventData.schedule];
                                    if (!newSchedule[dayIndex].sessions[sessionIndex]) {
                                      newSchedule[dayIndex].sessions[sessionIndex] = {};
                                    }
                                    newSchedule[dayIndex].sessions[sessionIndex].location = e.target.value;
                                    setEventData(prev => ({ ...prev, schedule: newSchedule }));
                                  }}
                                  placeholder="Session location"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <FormLabel>Description</FormLabel>
                                <Form.Control
                                  as="textarea"
                                  rows={2}
                                  value={session.description || ''}
                                  onChange={(e) => {
                                    const newSchedule = [...eventData.schedule];
                                    if (!newSchedule[dayIndex].sessions[sessionIndex]) {
                                      newSchedule[dayIndex].sessions[sessionIndex] = {};
                                    }
                                    newSchedule[dayIndex].sessions[sessionIndex].description = e.target.value;
                                    setEventData(prev => ({ ...prev, schedule: newSchedule }));
                                  }}
                                  placeholder="Session description"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <div className="text-end">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => {
                                const newSchedule = [...eventData.schedule];
                                newSchedule[dayIndex].sessions.splice(sessionIndex, 1);
                                setEventData(prev => ({ ...prev, schedule: newSchedule }));
                              }}
                            >
                              Remove Session
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                    
                    <div className="mb-3">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          const newSchedule = [...eventData.schedule];
                          if (!newSchedule[dayIndex].sessions) {
                            newSchedule[dayIndex].sessions = [];
                          }
                          newSchedule[dayIndex].sessions.push({
                            title: '',
                            time: '',
                            duration: '',
                            location: '',
                            description: ''
                          });
                          setEventData(prev => ({ ...prev, schedule: newSchedule }));
                        }}
                      >
                        <Plus size={16} className="me-2" />
                        Add Session
                      </Button>
                    </div>

                    {eventData.schedule.length > 1 && (
                      <div className="text-end">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            const newSchedule = eventData.schedule.filter((_, index) => index !== dayIndex);
                            setEventData(prev => ({ ...prev, schedule: newSchedule }));
                          }}
                        >
                          Remove Day
                        </Button>
                      </div>
                    )}
                  </TicketTypeCard>
                ))}

                <div className="mb-4">
                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      setEventData(prev => ({
                        ...prev,
                        schedule: [
                          ...prev.schedule,
                          {
                            day: `Day ${prev.schedule.length + 1}`,
                            date: '',
                            sessions: []
                          }
                        ]
                      }));
                    }}
                  >
                    <Plus size={16} className="me-2" />
                    Add Another Day
                  </Button>
                </div>

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
              <Card.Footer className="d-flex justify-content-end">
                <ActionButton variant="primary" onClick={nextStep}>
                  Continue to Tickets <ArrowRight size={16} className="ms-2" />
                </ActionButton>
              </Card.Footer>
            </FormSection>
          )}

          {currentStep === 2 && (
            <FormSection>
              <Card.Body>
                <SectionTitle>
                  <Ticket size={20} className="me-2" />
                  Ticket Types
                </SectionTitle>
                <p className="text-muted mb-4">Create different ticket tiers with varying prices and quantities</p>

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

                    {eventData.ticketTypes.length > 1 && (
                      <div className="text-end">
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => removeTicketType(index)}
                        >
                          Remove Ticket Type
                        </Button>
                      </div>
                    )}
                  </TicketTypeCard>
                ))}

                <div className="mb-4">
                  <Button 
                    variant="outline-primary" 
                    onClick={addTicketType}
                  >
                    <Plus size={16} className="me-2" />
                    Add Another Ticket Type
                  </Button>
                </div>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between">
                <ActionButton variant="outline-secondary" onClick={prevStep}>
                  Back to Event Details
                </ActionButton>
                <ActionButton variant="primary" onClick={nextStep}>
                  Review Event <ArrowRight size={16} className="ms-2" />
                </ActionButton>
              </Card.Footer>
            </FormSection>
          )}

          {currentStep === 3 && (
            <FormSection>
              <Card.Body>
                <SectionTitle>Review Your Event</SectionTitle>
                <p className="text-muted mb-4">Please review all details before creating your event</p>

                <Card className="mb-4">
                  <Card.Body>
                    <Row>
                      <Col md={8}>
                        <h4>{eventData.title}</h4>
                        <p className="text-muted">{eventData.description}</p>
                      </Col>
                      <Col md={4}>
                        <div className="mb-3">
                          <strong>
                            <Calendar size={16} className="me-2" />
                            Date & Time
                          </strong>
                          <div className="text-muted">
                            {eventData.startDate && new Date(eventData.startDate).toLocaleString()}
                            <div>to</div>
                            {eventData.endDate && new Date(eventData.endDate).toLocaleString()}
                          </div>
                        </div>
                        <div className="mb-3">
                          <strong>
                            <MapPin size={16} className="me-2" />
                            Location
                          </strong>
                          <div className="text-muted">{eventData.venue}</div>
                        </div>
                        <div>
                          <strong>
                            <Users size={16} className="me-2" />
                            Capacity
                          </strong>
                          <div className="text-muted">{eventData.capacity} attendees</div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <h5 className="mb-3">Ticket Types</h5>
                <Row className="g-3 mb-4">
                  {eventData.ticketTypes.map((ticket, index) => (
                    <Col md={4} key={index}>
                      <Card>
                        <Card.Body>
                          <h5>{ticket.name}</h5>
                          <h4 className="text-primary mb-2">
                            ${parseFloat(ticket.price).toFixed(2)}
                          </h4>
                          <p className="text-muted small">{ticket.description}</p>
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">Available: </span>
                            <span className="fw-bold">{ticket.quantity}</span>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between">
                <ActionButton variant="outline-secondary" onClick={prevStep}>
                  Back to Tickets
                </ActionButton>
                <ActionButton 
                  variant="primary" 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Event...' : 'Create Event'}
                </ActionButton>
              </Card.Footer>
            </FormSection>
          )}
        </Form>
      </Container>
    </PageWrapper>
  );
};

export default EventCreation;
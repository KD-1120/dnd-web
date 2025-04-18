import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Container, Card, Button, Table, Badge, Form, Modal } from 'react-bootstrap';
import { Plus, Edit2, Archive, BarChart2 } from 'lucide-react';
import { EventTicketService } from './services/EventTicketService';

const PageWrapper = styled.div`
  padding: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #1a202c;
`;

const StatsCard = styled(Card)`
  background: ${props => props.bgColor || '#fff'};
  margin-bottom: 1rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
`;

const StatLabel = styled.div`
  color: #64748b;
  font-size: 0.875rem;
`;

const TicketManagement = () => {
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTicket, setNewTicket] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
    validFrom: '',
    validUntil: ''
  });

  // In a real app, eventId would come from the route or context
  const eventId = 'current_event_id';

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const ticketTypes = await EventTicketService.getTicketTypes(eventId);
      setTickets(ticketTypes);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = () => {
    setEditingTicket(null);
    setNewTicket({
      name: '',
      price: '',
      quantity: '',
      description: '',
      validFrom: '',
      validUntil: ''
    });
    setShowTicketModal(true);
  };

  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
    setNewTicket({
      name: ticket.name,
      price: ticket.price,
      quantity: ticket.quantity,
      description: ticket.description,
      validFrom: ticket.validFrom,
      validUntil: ticket.validUntil
    });
    setShowTicketModal(true);
  };

  const handleSaveTicket = async () => {
    try {
      if (editingTicket) {
        // Update existing ticket
        await EventTicketService.updateTicketType(eventId, editingTicket.id, {
          ...newTicket,
          price: parseFloat(newTicket.price),
          quantity: parseInt(newTicket.quantity)
        });
      } else {
        // Create new ticket
        await EventTicketService.createTicketType(eventId, {
          ...newTicket,
          price: parseFloat(newTicket.price),
          quantity: parseInt(newTicket.quantity)
        });
      }
      
      // Reload tickets to get updated data
      await loadTickets();
      setShowTicketModal(false);
    } catch (error) {
      console.error('Error saving ticket:', error);
    }
  };

  const toggleTicketStatus = async (ticketId) => {
    try {
      const ticket = tickets.find(t => t.id === ticketId);
      await EventTicketService.updateTicketType(eventId, ticketId, {
        status: ticket.status === 'active' ? 'archived' : 'active'
      });
      await loadTickets();
    } catch (error) {
      console.error('Error toggling ticket status:', error);
    }
  };

  const getTotalRevenue = () => {
    return tickets.reduce((sum, ticket) => sum + (ticket.price * ticket.sold), 0);
  };

  const getTotalSold = () => {
    return tickets.reduce((sum, ticket) => sum + ticket.sold, 0);
  };

  const getRemainingTickets = () => {
    return tickets.reduce((sum, ticket) => {
      return sum + (ticket.status === 'active' ? ticket.quantity - ticket.sold : 0);
    }, 0);
  };

  return (
    <PageWrapper>
      <Container>
        <PageHeader>
          <PageTitle>Ticket Management</PageTitle>
          <Button variant="primary" onClick={handleCreateTicket}>
            <Plus size={16} className="me-2" />
            Create New Ticket Type
          </Button>
        </PageHeader>

        <div className="row mb-4">
          <div className="col-md-4">
            <StatsCard bgColor="#f7fee7">
              <Card.Body>
                <StatValue>${getTotalRevenue().toLocaleString()}</StatValue>
                <StatLabel>Total Revenue</StatLabel>
              </Card.Body>
            </StatsCard>
          </div>
          <div className="col-md-4">
            <StatsCard bgColor="#eff6ff">
              <Card.Body>
                <StatValue>{getTotalSold()}</StatValue>
                <StatLabel>Tickets Sold</StatLabel>
              </Card.Body>
            </StatsCard>
          </div>
          <div className="col-md-4">
            <StatsCard bgColor="#fef2f2">
              <Card.Body>
                <StatValue>{getRemainingTickets()}</StatValue>
                <StatLabel>Tickets Remaining</StatLabel>
              </Card.Body>
            </StatsCard>
          </div>
        </div>

        <Card>
          <Card.Body>
            <Table responsive>
              <thead>
                <tr>
                  <th>Ticket Type</th>
                  <th>Price</th>
                  <th>Sold</th>
                  <th>Available</th>
                  <th>Valid Period</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(ticket => (
                  <tr key={ticket.id}>
                    <td>
                      <div className="fw-bold">{ticket.name}</div>
                      <small className="text-muted">{ticket.description}</small>
                    </td>
                    <td>${ticket.price}</td>
                    <td>{ticket.sold}</td>
                    <td>{ticket.quantity - ticket.sold}</td>
                    <td>
                      <small>
                        {ticket.validFrom} to {ticket.validUntil}
                      </small>
                    </td>
                    <td>
                      <Badge bg={ticket.status === 'active' ? 'success' : 'secondary'}>
                        {ticket.status}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="light"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEditTicket(ticket)}
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => toggleTicketStatus(ticket.id)}
                      >
                        <Archive size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        <Modal show={showTicketModal} onHide={() => setShowTicketModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {editingTicket ? 'Edit Ticket Type' : 'Create New Ticket Type'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Ticket Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newTicket.name}
                  onChange={e => setNewTicket({...newTicket, name: e.target.value})}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={newTicket.description}
                  onChange={e => setNewTicket({...newTicket, description: e.target.value})}
                />
              </Form.Group>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Price ($)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={newTicket.price}
                      onChange={e => setNewTicket({...newTicket, price: e.target.value})}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Quantity Available</Form.Label>
                    <Form.Control
                      type="number"
                      value={newTicket.quantity}
                      onChange={e => setNewTicket({...newTicket, quantity: e.target.value})}
                      required
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Valid From</Form.Label>
                    <Form.Control
                      type="date"
                      value={newTicket.validFrom}
                      onChange={e => setNewTicket({...newTicket, validFrom: e.target.value})}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Valid Until</Form.Label>
                    <Form.Control
                      type="date"
                      value={newTicket.validUntil}
                      onChange={e => setNewTicket({...newTicket, validUntil: e.target.value})}
                      required
                    />
                  </Form.Group>
                </div>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTicketModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveTicket}>
              {editingTicket ? 'Save Changes' : 'Create Ticket'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </PageWrapper>
  );
};

export default TicketManagement;
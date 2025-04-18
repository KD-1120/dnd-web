import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Form, Button, Badge, Dropdown, Row, Col, Alert } from 'react-bootstrap';
import { Search, Download, Mail, Edit2, CheckCircle, Clock, X, Filter, Trash2, UserPlus, Ticket } from 'lucide-react';
import EditAttendeeModal from './components/EditAttendeeModal';
import AttendeeDetailModal from './components/AttendeeDetailModal';
import styled from 'styled-components';
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
  margin-bottom: ${spacing.sm};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.lg};
`;

const ContentCard = styled(Card)`
  border: none;
  box-shadow: ${shadows.sm};
  border-radius: ${borderRadius.md};
  margin-bottom: ${spacing.md};
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
`;

const Th = styled.th`
  text-align: left;
  padding: ${spacing.sm} ${spacing.md};
  border-bottom: 2px solid ${colors.border};
  color: ${colors.secondary};
  font-weight: 600;
  font-size: ${typography.fontSizes.small};
`;

const Td = styled.td`
  padding: ${spacing.sm} ${spacing.md};
  border-bottom: 1px solid ${colors.border};
  vertical-align: middle;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: ${spacing.md};
  margin-bottom: ${spacing.md};
`;

const SearchInput = styled(Form.Control)`
  max-width: 300px;
  padding: ${spacing.xs} ${spacing.sm};
  border-color: ${colors.border};
  
  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 0.25rem rgba(0, 157, 136, 0.25);
  }
`;

const FilterDropdown = styled(Dropdown)`
  .dropdown-toggle {
    background-color: ${colors.white};
    border-color: ${colors.border};
    color: ${colors.dark};
    padding: ${spacing.xs} ${spacing.sm};
    
    &:focus, &:hover {
      background-color: ${colors.white};
      border-color: ${colors.primary};
      color: ${colors.dark};
    }
    
    &::after {
      display: none;
    }
  }
  
  .dropdown-menu {
    border-color: ${colors.border};
    box-shadow: ${shadows.md};
    border-radius: ${borderRadius.sm};
    padding: ${spacing.xs};
  }
  
  .dropdown-item {
    padding: ${spacing.xs} ${spacing.sm};
    border-radius: ${borderRadius.sm};
    
    &:active, &:focus {
      background-color: ${colors.primaryLight};
      color: ${colors.primary};
    }
  }
`;

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  padding: ${spacing.xs} ${spacing.sm};
  
  &.btn-primary {
    background-color: ${colors.primary};
    border-color: ${colors.primary};
    
    &:hover {
      background-color: ${colors.primaryHover};
      border-color: ${colors.primaryHover};
    }
  }
  
  &.btn-outline-primary {
    color: ${colors.primary};
    border-color: ${colors.primary};
    background-color: transparent;
    
    &:hover {
      background-color: ${colors.primaryLight};
      color: ${colors.primary};
      border-color: ${colors.primary};
    }
  }
`;

const Status = styled(Badge)`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.65rem;
  font-weight: 500;
  
  svg {
    width: 14px;
    height: 14px;
  }
  
  &.bg-success {
    background-color: #C6F6D5 !important;
    color: #22543D !important;
  }
  
  &.bg-warning {
    background-color: #FEEBC8 !important;
    color: #744210 !important;
  }
  
  &.bg-danger {
    background-color: #FED7D7 !important;
    color: #742A2A !important;
  }
  
  &.bg-secondary {
    background-color: #E2E8F0 !important;
    color: #2D3748 !important;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${spacing.xl};
  color: ${colors.secondary};
`;

const ActionButtonsGroup = styled.div`
  display: flex;
  gap: ${spacing.xs};
`;

const AddAttendeeForm = styled.div`
  padding: ${spacing.md};
  border-top: 1px solid ${colors.border};
`;

const AttendeesDashboard = () => {
  const { eventId } = useParams();
  
  // Move ALL hooks to the top level - not inside conditions
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ticketTypeFilter, setTicketTypeFilter] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  
  // New attendee form state
  const [newAttendee, setNewAttendee] = useState({
    name: '',
    email: '',
    ticketTypeId: '',
    status: 'confirmed'
  });

  const loadAttendees = useCallback(async () => {
    // Check if eventId exists inside the callback
    if (!eventId) return;
    
    try {
      const sales = await EventTicketService.getEventSales(eventId);
      const attendeeData = await Promise.all(sales.map(async sale => {
        const ticket = await EventTicketService.getTicketTypes(eventId)
          .then(tickets => tickets.find(t => t.id === sale.ticketId));
        return {
          id: sale.id,
          name: sale.attendeeData?.name || 'N/A',
          email: sale.attendeeData?.email || 'N/A',
          event: sale.eventName || event?.title || 'Current Event',
          eventId: eventId,
          ticketType: ticket?.name || 'Standard',
          ticketTypeId: sale.ticketId,
          purchaseDate: new Date(sale.purchaseDate).toLocaleDateString(),
          status: sale.status || 'confirmed'
        };
      }));
      setAttendees(attendeeData);
    } catch (error) {
      console.error('Error loading attendees:', error);
      setError("Failed to load attendees. Please try again.");
    }
  }, [eventId, event?.title]);

  const loadEventData = useCallback(async () => {
    // Check if eventId exists inside the callback
    if (!eventId) return;
    
    try {
      setLoading(true);
      
      // Load event details
      const eventData = await EventTicketService.getEvent(eventId);
      if (!eventData) {
        setError("Event not found");
        return;
      }
      setEvent(eventData);
      
      // Load ticket types
      const ticketTypeData = await EventTicketService.getTicketTypes(eventId);
      setTicketTypes(ticketTypeData);
      
      // Load attendees (ticket sales)
      await loadAttendees();
    } catch (error) {
      console.error('Error loading event data:', error);
      setError("Failed to load event data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [eventId, loadAttendees]);

  // Move useEffect to top level and place condition inside
  useEffect(() => {
    if (eventId) {
      loadEventData();
    }
  }, [eventId, loadEventData]);

  const handleExport = () => {
    // Implementation for exporting attendee data
    const attendeesCsv = [
      ['Name', 'Email', 'Ticket Type', 'Purchase Date', 'Status'].join(','),
      ...filteredAttendees.map(attendee => 
        [
          attendee.name, 
          attendee.email, 
          attendee.ticketType, 
          attendee.purchaseDate, 
          attendee.status
        ].join(',')
      )
    ].join('\n');
    
    // Create download link
    const blob = new Blob([attendeesCsv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event?.title || 'event'}-attendees.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleEmailAll = () => {
    // Get all selected attendee emails
    const emails = filteredAttendees.map(a => a.email).join(',');
    window.location.href = `mailto:?bcc=${emails}&subject=${encodeURIComponent(`${event?.title || 'Event'} Update`)}`;
  };

  const handleEdit = (attendee) => {
    setSelectedAttendee(attendee);
    setShowEditModal(true);
  };

  const handleViewDetails = (attendee) => {
    setSelectedAttendee(attendee);
    setShowDetailModal(true);
  };

  const handleDelete = async (attendeeId) => {
    try {
      await EventTicketService.deleteTicketSale(eventId, attendeeId);
      setConfirmDelete(null);
      // Update UI by removing the deleted attendee
      setAttendees(attendees.filter(a => a.id !== attendeeId));
    } catch (error) {
      console.error('Error deleting attendee:', error);
      setError("Failed to delete attendee. Please try again.");
    }
  };

  const handleSaveAttendee = async (formData) => {
    try {
      await EventTicketService.updateTicketSale(eventId, selectedAttendee.id, {
        attendeeData: {
          name: formData.name,
          email: formData.email
        },
        status: formData.status
      });
      await loadAttendees(); // Reload the attendees list
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating attendee:', error);
      setError("Failed to update attendee. Please try again.");
    }
  };

  const handleAddAttendee = async (e) => {
    e.preventDefault();
    
    try {
      // Validate form
      if (!newAttendee.name || !newAttendee.email || !newAttendee.ticketTypeId) {
        setError("Please fill all required fields");
        return;
      }
      
      // Create a ticket sale record
      await EventTicketService.recordTicketSale(
        eventId,
        newAttendee.ticketTypeId,
        1, // Quantity
        {
          attendeeData: {
            name: newAttendee.name,
            email: newAttendee.email
          },
          status: newAttendee.status,
          eventName: event?.title
        }
      );
      
      // Reset form
      setNewAttendee({
        name: '',
        email: '',
        ticketTypeId: '',
        status: 'confirmed'
      });
      
      setShowAddForm(false);
      await loadAttendees();
    } catch (error) {
      console.error('Error adding attendee:', error);
      setError("Failed to add attendee. Please try again.");
    }
  };

  // Move useMemo to top level
  const filteredAttendees = useMemo(() => {
    // Return an empty array if attendees is not yet initialized
    if (!attendees || !Array.isArray(attendees)) return [];
    
    return attendees.filter(attendee => {
      const matchesSearch = searchQuery.toLowerCase() === '' || 
        attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendee.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || attendee.status === statusFilter;
      
      const matchesTicketType = ticketTypeFilter === 'all' || 
        attendee.ticketTypeId === ticketTypeFilter;
      
      return matchesSearch && matchesStatus && matchesTicketType;
    });
  }, [attendees, searchQuery, statusFilter, ticketTypeFilter]);

  if (loading) {
    return (
      <PageWrapper>
        <Container>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading attendees...</p>
          </div>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <PageHeader>
          <div>
            <PageTitle>Attendee Management</PageTitle>
            <p className="text-muted">
              {event ? `Event: ${event.title}` : 'Manage your event attendees'}
            </p>
          </div>
          <div className="d-flex gap-2">
            <ActionButton variant="outline-primary" onClick={() => setShowAddForm(!showAddForm)}>
              <UserPlus size={16} />
              Add Attendee
            </ActionButton>
            <ActionButton variant="outline-primary" onClick={handleEmailAll}>
              <Mail size={16} />
              Email All
            </ActionButton>
            <ActionButton variant="primary" onClick={handleExport}>
              <Download size={16} />
              Export
            </ActionButton>
          </div>
        </PageHeader>

        {error && (
          <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        <ContentCard>
          <Card.Body>
            <SearchContainer className="mb-3">
              <div className="d-flex align-items-center position-relative">
                <SearchInput
                  type="text"
                  placeholder="Search attendees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search size={18} className="position-absolute end-0 me-3 text-muted" />
              </div>
              
              <FilterDropdown>
                <Dropdown.Toggle id="status-filter" variant="light">
                  <Filter size={16} className="me-2" />
                  Status: {statusFilter === 'all' ? 'All' : statusFilter}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setStatusFilter('all')}>All</Dropdown.Item>
                  <Dropdown.Item onClick={() => setStatusFilter('confirmed')}>Confirmed</Dropdown.Item>
                  <Dropdown.Item onClick={() => setStatusFilter('pending')}>Pending</Dropdown.Item>
                  <Dropdown.Item onClick={() => setStatusFilter('cancelled')}>Cancelled</Dropdown.Item>
                </Dropdown.Menu>
              </FilterDropdown>
              
              {ticketTypes.length > 0 && (
                <FilterDropdown>
                  <Dropdown.Toggle id="ticket-type-filter" variant="light">
                    <Ticket size={16} className="me-2" />
                    Ticket: {ticketTypeFilter === 'all' ? 'All Types' : 
                      ticketTypes.find(t => t.id === ticketTypeFilter)?.name || 'All Types'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setTicketTypeFilter('all')}>All Types</Dropdown.Item>
                    {ticketTypes.map(type => (
                      <Dropdown.Item 
                        key={type.id}
                        onClick={() => setTicketTypeFilter(type.id)}
                      >
                        {type.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </FilterDropdown>
              )}
            </SearchContainer>
            
            {showAddForm && (
              <AddAttendeeForm>
                <h5 className="mb-3">Add New Attendee</h5>
                <Form onSubmit={handleAddAttendee}>
                  <Row className="g-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={newAttendee.name}
                          onChange={(e) => setNewAttendee({...newAttendee, name: e.target.value})}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          value={newAttendee.email}
                          onChange={(e) => setNewAttendee({...newAttendee, email: e.target.value})}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Ticket Type</Form.Label>
                        <Form.Select
                          value={newAttendee.ticketTypeId}
                          onChange={(e) => setNewAttendee({...newAttendee, ticketTypeId: e.target.value})}
                          required
                        >
                          <option value="">Select...</option>
                          {ticketTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                          value={newAttendee.status}
                          onChange={(e) => setNewAttendee({...newAttendee, status: e.target.value})}
                          required
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="pending">Pending</option>
                          <option value="cancelled">Cancelled</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-end mt-3">
                    <Button 
                      variant="outline-secondary" 
                      className="me-2" 
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                      Add Attendee
                    </Button>
                  </div>
                </Form>
              </AddAttendeeForm>
            )}
            
            <TableContainer>
              {filteredAttendees.length === 0 ? (
                <EmptyState>
                  <h4>No attendees found</h4>
                  <p>There are no attendees matching your search criteria.</p>
                </EmptyState>
              ) : (
                <Table>
                  <thead>
                    <tr>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Ticket Type</Th>
                      <Th>Purchase Date</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendees.map((attendee) => (
                      <tr key={attendee.id}>
                        <Td>{attendee.name}</Td>
                        <Td>{attendee.email}</Td>
                        <Td>{attendee.ticketType}</Td>
                        <Td>{attendee.purchaseDate}</Td>
                        <Td>
                          <Status 
                            bg={
                              attendee.status === 'confirmed' ? 'success' :
                              attendee.status === 'pending' ? 'warning' :
                              'danger'
                            }
                          >
                            {attendee.status === 'confirmed' && <CheckCircle size={14} />}
                            {attendee.status === 'pending' && <Clock size={14} />}
                            {attendee.status === 'cancelled' && <X size={14} />}
                            {attendee.status.charAt(0).toUpperCase() + attendee.status.slice(1)}
                          </Status>
                        </Td>
                        <Td>
                          <ActionButtonsGroup>
                            <ActionButton variant="outline-primary" size="sm" onClick={() => handleEdit(attendee)}>
                              <Edit2 size={14} />
                              Edit
                            </ActionButton>
                            <ActionButton variant="primary" size="sm" onClick={() => handleViewDetails(attendee)}>
                              View
                            </ActionButton>
                            <ActionButton variant="light" size="sm" onClick={() => setConfirmDelete(attendee.id)}>
                              <Trash2 size={14} />
                            </ActionButton>
                          </ActionButtonsGroup>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </TableContainer>
          </Card.Body> 
        </ContentCard>
        
        {confirmDelete && (
          <Alert variant="danger" className="mt-3">
            <p>Are you sure you want to delete this attendee?</p>
            <div className="d-flex justify-content-end">
              <Button variant="outline-secondary" className="me-2" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => handleDelete(confirmDelete)}>
                Delete
              </Button>
            </div>
          </Alert>
        )}
        
        {showEditModal && selectedAttendee && (
          <EditAttendeeModal
            show={showEditModal}
            onHide={() => setShowEditModal(false)}
            attendee={selectedAttendee}
            onSave={handleSaveAttendee}
          />
        )}
        
        {showDetailModal && selectedAttendee && (
          <AttendeeDetailModal
            show={showDetailModal}
            onHide={() => setShowDetailModal(false)}
            attendee={selectedAttendee}
          />
        )}
      </Container>
    </PageWrapper>
  );
};

export default AttendeesDashboard;
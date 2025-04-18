import React, { useState, useEffect, useCallback } from 'react';
import { Table, Badge, Form, InputGroup } from 'react-bootstrap';
import styled from 'styled-components';
import { Search, MapPin, AlertCircle } from 'lucide-react';
import { EventTicketService } from '../services/EventTicketService';

const SearchContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;
`;

const LocationBadge = styled(Badge)`
  background-color: #e2e8f0;
  color: #475569;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const WarningBadge = styled(Badge)`
  background-color: #fef3c7;
  color: #92400e;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const CheckInHistory = ({ eventId }) => {
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');

  const loadCheckIns = useCallback(async () => {
    try {
      setLoading(true);
      const history = await EventTicketService.getCheckInHistory(eventId);
      const checkInsWithDetails = await Promise.all(
        history.map(async checkIn => {
          const validation = await EventTicketService.validateTicket(checkIn.ticketCode);
          return {
            ...checkIn,
            attendeeDetails: validation.ticket || {}
          };
        })
      );
      
      // Sort by timestamp descending
      checkInsWithDetails.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      
      setCheckIns(checkInsWithDetails);
    } catch (error) {
      console.error('Error loading check-in history:', error);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadCheckIns();
  }, [loadCheckIns]);

  const getUniqueLocations = () => {
    return [...new Set(checkIns.map(checkIn => checkIn.location))];
  };

  const filteredCheckIns = checkIns.filter(checkIn => {
    const matchesSearch = searchQuery.toLowerCase() === '' ||
      checkIn.attendeeDetails.attendeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      checkIn.ticketCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = locationFilter === 'all' || 
      checkIn.location === locationFilter;
    
    return matchesSearch && matchesLocation;
  });

  return (
    <>
      <SearchContainer>
        <div className="row g-3">
          <div className="col-md-8">
            <InputGroup>
              <InputGroup.Text>
                <Search size={16} />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search by attendee name or ticket code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </div>
          <div className="col-md-4">
            <Form.Select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="all">All Locations</option>
              {getUniqueLocations().map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>
      </SearchContainer>

      <TableContainer>
        {loading ? (
          <NoResults>Loading check-in history...</NoResults>
        ) : filteredCheckIns.length === 0 ? (
          <NoResults>No check-ins found matching your criteria</NoResults>
        ) : (
          <Table hover>
            <thead>
              <tr>
                <th>Time</th>
                <th>Attendee</th>
                <th>Ticket Type</th>
                <th>Location</th>
                <th>Staff Member</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCheckIns.map((checkIn) => (
                <tr key={checkIn.id}>
                  <td>{new Date(checkIn.timestamp).toLocaleString()}</td>
                  <td>
                    {checkIn.attendeeDetails.attendeeName || 'N/A'}
                  </td>
                  <td>{checkIn.attendeeDetails.ticketType}</td>
                  <td>
                    <LocationBadge>
                      <MapPin size={12} />
                      {checkIn.location}
                    </LocationBadge>
                  </td>
                  <td>{checkIn.staffMember}</td>
                  <td>
                    {checkIn.attendeeDetails.usageCount > 1 ? (
                      <WarningBadge>
                        <AlertCircle size={12} />
                        Multiple Uses
                      </WarningBadge>
                    ) : (
                      <Badge bg="success">Valid</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </TableContainer>
    </>
  );
};

export default CheckInHistory;
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { User, Mail, Ticket, Calendar, CheckCircle, Clock, X } from 'lucide-react';

const DetailRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailIcon = styled.div`
  color: #6B7280;
  display: flex;
  align-items: center;
  padding-top: 2px;
`;

const DetailContent = styled.div`
  flex: 1;
`;

const DetailLabel = styled.div`
  font-size: 0.875rem;
  color: #6B7280;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  color: #111827;
  font-weight: 500;
`;

const Status = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 500;
  font-size: 0.875rem;
  
  &.confirmed {
    background-color: #C6F6D5;
    color: #22543D;
  }
  
  &.pending {
    background-color: #FEEBC8;
    color: #744210;
  }
  
  &.cancelled {
    background-color: #FED7D7;
    color: #742A2A;
  }
`;

const AttendeeDetailModal = ({ show, onHide, attendee }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} />;
      case 'pending':
        return <Clock size={16} />;
      case 'cancelled':
        return <X size={16} />;
      default:
        return null;
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Attendee Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DetailRow>
          <DetailIcon>
            <User size={20} />
          </DetailIcon>
          <DetailContent>
            <DetailLabel>Name</DetailLabel>
            <DetailValue>{attendee.name}</DetailValue>
          </DetailContent>
        </DetailRow>

        <DetailRow>
          <DetailIcon>
            <Mail size={20} />
          </DetailIcon>
          <DetailContent>
            <DetailLabel>Email</DetailLabel>
            <DetailValue>{attendee.email}</DetailValue>
          </DetailContent>
        </DetailRow>

        <DetailRow>
          <DetailIcon>
            <Ticket size={20} />
          </DetailIcon>
          <DetailContent>
            <DetailLabel>Ticket Type</DetailLabel>
            <DetailValue>{attendee.ticketType}</DetailValue>
          </DetailContent>
        </DetailRow>

        <DetailRow>
          <DetailIcon>
            <Calendar size={20} />
          </DetailIcon>
          <DetailContent>
            <DetailLabel>Purchase Date</DetailLabel>
            <DetailValue>{attendee.purchaseDate}</DetailValue>
          </DetailContent>
        </DetailRow>

        <DetailRow>
          <DetailIcon>
            {getStatusIcon(attendee.status)}
          </DetailIcon>
          <DetailContent>
            <DetailLabel>Status</DetailLabel>
            <Status className={attendee.status}>
              {getStatusIcon(attendee.status)}
              {attendee.status.charAt(0).toUpperCase() + attendee.status.slice(1)}
            </Status>
          </DetailContent>
        </DetailRow>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AttendeeDetailModal;
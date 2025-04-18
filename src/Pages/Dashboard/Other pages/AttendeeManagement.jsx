import React from 'react';
import styled from 'styled-components';
import { Card, Row, Col, Table } from 'react-bootstrap';

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 24px;
`;

const AttendeeManagement = () => {
  return (
    <div>
      <PageTitle>Attendee Management</PageTitle>
      <Card>
        <Card.Body>
          <Table responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Event</th>
                <th>Ticket Type</th>
                <th>Purchase Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Will be populated with actual attendee data */}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AttendeeManagement;
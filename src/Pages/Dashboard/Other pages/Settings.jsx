import React from 'react';
import styled from 'styled-components';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 16px;
`;

const Settings = () => {
  return (
    <div>
      <PageTitle>Settings</PageTitle>
      
      <Row className="g-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <SectionTitle>Profile Settings</SectionTitle>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Organization Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter organization name" />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="tel" placeholder="Enter phone number" />
                </Form.Group>
                
                <Button variant="primary">Save Changes</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Body>
              <SectionTitle>Event Defaults</SectionTitle>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Default Time Zone</Form.Label>
                  <Form.Select>
                    <option>Select timezone</option>
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="PST">Pacific Time</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Default Currency</Form.Label>
                  <Form.Select>
                    <option>Select currency</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </Form.Select>
                </Form.Group>
                
                <Button variant="primary">Save Defaults</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Settings;
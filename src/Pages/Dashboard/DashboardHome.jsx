import React from 'react';
import styled from 'styled-components';
import { Card, Row, Col } from 'react-bootstrap';
import { 
  Users,
  Ticket,
  Calendar,
  TrendingUp,
  ArrowRight,
  Plus,
  BarChart2,
  QrCode
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 24px;
`;

const StatsCard = styled(Card)`
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #1a202c;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #64748b;
  margin-top: 4px;
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bg};
  color: ${props => props.color};
  margin-bottom: 16px;
`;

const QuickActionCard = styled(Link)`
  display: block;
  color: inherit;
  text-decoration: none;
  
  &:hover {
    color: inherit;
    text-decoration: none;
    
    ${StatsCard} {
      transform: translateY(-2px);
    }
  }
`;

const ActionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
`;

const ActionDescription = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 8px 0 0;
`;

const DashboardHome = () => {
  return (
    <div>
      <PageTitle>Dashboard</PageTitle>

      <Row className="g-4 mb-4">
        <Col md={3}>
          <StatsCard>
            <Card.Body>
              <IconWrapper bg="#e0f2fe" color="#0284c7">
                <Calendar size={20} />
              </IconWrapper>
              <StatValue>12</StatValue>
              <StatLabel>Active Events</StatLabel>
            </Card.Body>
          </StatsCard>
        </Col>
        <Col md={3}>
          <StatsCard>
            <Card.Body>
              <IconWrapper bg="#dcfce7" color="#16a34a">
                <Ticket size={20} />
              </IconWrapper>
              <StatValue>1,234</StatValue>
              <StatLabel>Tickets Sold</StatLabel>
            </Card.Body>
          </StatsCard>
        </Col>
        <Col md={3}>
          <StatsCard>
            <Card.Body>
              <IconWrapper bg="#fef3c7" color="#d97706">
                <Users size={20} />
              </IconWrapper>
              <StatValue>5,678</StatValue>
              <StatLabel>Total Attendees</StatLabel>
            </Card.Body>
          </StatsCard>
        </Col>
        <Col md={3}>
          <StatsCard>
            <Card.Body>
              <IconWrapper bg="#ede9fe" color="#7c3aed">
                <TrendingUp size={20} />
              </IconWrapper>
              <StatValue>$45.6K</StatValue>
              <StatLabel>Revenue</StatLabel>
            </Card.Body>
          </StatsCard>
        </Col>
      </Row>

      <h2 className="h5 mb-4">Quick Actions</h2>
      <Row className="g-4">
        <Col md={4}>
          <QuickActionCard to="/dashboard/events/create">
            <StatsCard>
              <Card.Body className="d-flex align-items-center">
                <div className="me-3">
                  <IconWrapper bg="#e0f2fe" color="#0284c7">
                    <Plus size={20} />
                  </IconWrapper>
                </div>
                <div>
                  <ActionTitle>Create Event</ActionTitle>
                  <ActionDescription>Set up a new event page</ActionDescription>
                </div>
                <ArrowRight className="ms-auto" size={20} color="#64748b" />
              </Card.Body>
            </StatsCard>
          </QuickActionCard>
        </Col>
        <Col md={4}>
          <QuickActionCard to="/dashboard/events">
            <StatsCard>
              <Card.Body className="d-flex align-items-center">
                <div className="me-3">
                  <IconWrapper bg="#dcfce7" color="#16a34a">
                    <Ticket size={20} />
                  </IconWrapper>
                </div>
                <div>
                  <ActionTitle>Manage Events</ActionTitle>
                  <ActionDescription>View and edit your events</ActionDescription>
                </div>
                <ArrowRight className="ms-auto" size={20} color="#64748b" />
              </Card.Body>
            </StatsCard>
          </QuickActionCard>
        </Col>
        <Col md={4}>
          <QuickActionCard to="/dashboard/analytics">
            <StatsCard>
              <Card.Body className="d-flex align-items-center">
                <div className="me-3">
                  <IconWrapper bg="#ede9fe" color="#7c3aed">
                    <BarChart2 size={20} />
                  </IconWrapper>
                </div>
                <div>
                  <ActionTitle>View Analytics</ActionTitle>
                  <ActionDescription>Check event performance</ActionDescription>
                </div>
                <ArrowRight className="ms-auto" size={20} color="#64748b" />
              </Card.Body>
            </StatsCard>
          </QuickActionCard>
        </Col>
      </Row>

      <h2 className="h5 mb-4 mt-4">Tools</h2>
      <Row className="g-4">
        <Col md={4}>
          <QuickActionCard to="/dashboard/events/current/tickets/scan">
            <StatsCard>
              <Card.Body className="d-flex align-items-center">
                <div className="me-3">
                  <IconWrapper bg="#fef3c7" color="#d97706">
                    <QrCode size={20} />
                  </IconWrapper>
                </div>
                <div>
                  <ActionTitle>Scan Tickets</ActionTitle>
                  <ActionDescription>Check-in attendees</ActionDescription>
                </div>
                <ArrowRight className="ms-auto" size={20} color="#64748b" />
              </Card.Body>
            </StatsCard>
          </QuickActionCard>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardHome;
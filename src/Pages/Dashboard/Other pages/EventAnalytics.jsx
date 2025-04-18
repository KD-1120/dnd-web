import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Alert, Badge } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  TrendingUp, 
  Users, 
  Ticket,
  Calendar,
  Clock,
  DollarSign,
  ChevronLeft,
  Share2,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { EventTicketService } from './services/EventTicketService';
import { PollService } from './services/PollService';
import { colors, spacing, shadows, borderRadius, typography } from '../../../GlobalStyles';

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

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  color: ${colors.secondary};
  text-decoration: none;
  margin-bottom: ${spacing.md};
  
  &:hover {
    color: ${colors.primary};
    text-decoration: none;
  }
`;

const StatsCard = styled(Card)`
  border: none;
  box-shadow: ${shadows.sm};
  border-radius: ${borderRadius.md};
  height: 100%;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${shadows.md};
  }
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bg || colors.primaryLight};
  color: ${props => props.color || colors.primary};
  margin-bottom: ${spacing.sm};
`;

const StatValue = styled.div`
  font-size: ${typography.fontSizes.xl};
  font-weight: 600;
  color: ${colors.dark};
  margin-bottom: ${spacing.xs};
`;

const StatLabel = styled.div`
  color: ${colors.secondary};
  font-size: ${typography.fontSizes.small};
`;

const TrendIndicator = styled.span`
  font-size: ${typography.fontSizes.small};
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.positive ? colors.success : colors.error};
`;

const ChartCard = styled(Card)`
  border: none;
  box-shadow: ${shadows.sm};
  border-radius: ${borderRadius.md};
  margin-bottom: ${spacing.lg};
  overflow: hidden;
`;

const ChartHeader = styled.div`
  padding: ${spacing.md};
  border-bottom: 1px solid ${colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChartTitle = styled.h3`
  font-size: ${typography.fontSizes.large};
  font-weight: 600;
  margin: 0;
`;

const ChartBody = styled.div`
  padding: ${spacing.md};
  height: 360px;
`;

const NoDataState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${colors.secondary};
  
  svg {
    margin-bottom: ${spacing.sm};
    color: ${colors.mediumGray};
  }
`;

const SectionHeader = styled.div`
  margin-bottom: ${spacing.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitle = styled.h2`
  font-size: ${typography.fontSizes.xl};
  font-weight: 600;
  color: ${colors.dark};
  margin: 0;
`;

const COLORS = [colors.primary, '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

const EventAnalytics = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [engagementData, setEngagementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEventData = useCallback(async () => {
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
      const ticketData = await EventTicketService.getTicketTypes(eventId);
      setTickets(ticketData);
      
      // Load analytics data
      const analyticsData = await EventTicketService.getSalesAnalytics(eventId);
      setAnalytics(analyticsData);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading event data:', error);
      setError("Failed to load event data. Please try again.");
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadEventData();
  }, [loadEventData]);

  useEffect(() => {
    const loadEngagementData = async () => {
      try {
        let questions = [], polls = [];
        
        try {
          questions = await PollService.getQuestionAnalytics(eventId);
        } catch (err) {
          console.log('No questions data available');
        }
        
        try {
          polls = await PollService.getEventPolls(eventId);
        } catch (err) {
          console.log('No polls data available');
        }
        
        setEngagementData({
          questions: questions || { total: 0, answered: 0, pending: 0 },
          totalPolls: polls?.length || 0,
          activePolls: polls?.filter(p => p.status === 'active')?.length || 0,
          totalResponses: polls?.reduce((sum, poll) => sum + (poll.responses?.length || 0), 0) || 0
        });
      } catch (error) {
        console.error('Error loading engagement data:', error);
      }
    };
    
    if (eventId && !loading) {
      loadEngagementData();
    }
  }, [eventId, loading]);

  const formatSalesData = () => {
    if (!analytics?.salesByDate || Object.keys(analytics.salesByDate).length === 0) {
      return [];
    }
    
    return Object.entries(analytics.salesByDate)
      .map(([date, data]) => ({
        date,
        sales: data.count,
        revenue: data.revenue
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const formatTicketDistribution = () => {
    if (!analytics?.ticketDistribution || analytics.ticketDistribution.length === 0) {
      return [];
    }
    
    return analytics.ticketDistribution.map(ticket => ({
      name: ticket.name,
      value: ticket.sold
    }));
  };

  const formatAttendeeStatus = () => {
    if (!analytics?.attendeeStats) {
      return [];
    }
    
    return [
      { name: 'Confirmed', value: analytics.attendeeStats.confirmed },
      { name: 'Pending', value: analytics.attendeeStats.pending },
      { name: 'Cancelled', value: analytics.attendeeStats.cancelled }
    ].filter(item => item.value > 0);
  };

  const getTotalRevenue = () => analytics?.totalRevenue || 0;
  const getTotalSold = () => analytics?.totalSold || 0;
  const getConversionRate = () => {
    const totalViews = event?.pageViews || 0;
    return totalViews > 0 ? (getTotalSold() / totalViews) * 100 : 0;
  };

  if (loading) {
    return (
      <PageWrapper>
        <Container>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading analytics data...</p>
          </div>
        </Container>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <Container>
          <Alert variant="danger">{error}</Alert>
          <div className="text-center mt-4">
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/dashboard/events')}
            >
              Back to Events
            </button>
          </div>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <BackLink to="/dashboard/events">
          <ChevronLeft size={16} />
          Back to Events
        </BackLink>
        
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <PageTitle>{event?.title || 'Event'} Analytics</PageTitle>
            <p className="text-muted">
              {event && (
                <>
                  <Calendar size={14} className="me-1" />
                  {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                </>
              )}
            </p>
          </div>
          <div>
            <Badge 
              bg={
                new Date() < new Date(event?.startDate) ? 'warning' :
                new Date() <= new Date(event?.endDate) ? 'success' :
                'secondary'
              }
              className="fs-6 px-3 py-2"
            >
              {new Date() < new Date(event?.startDate) ? 'Upcoming' :
               new Date() <= new Date(event?.endDate) ? 'Live' :
               'Past'}
            </Badge>
          </div>
        </div>

        <Row className="g-4 mb-4">
          <Col lg={3} md={6}>
            <StatsCard>
              <Card.Body>
                <IconWrapper bg="#dcfce7" color="#16a34a">
                  <DollarSign size={24} />
                </IconWrapper>
                <StatValue>${getTotalRevenue().toLocaleString()}</StatValue>
                <StatLabel>Total Revenue</StatLabel>
                {/*<TrendIndicator positive={true}>
                  <TrendingUp size={16} />
                  +12.5%
                </TrendIndicator>*/}
              </Card.Body>
            </StatsCard>
          </Col>

          <Col lg={3} md={6}>
            <StatsCard>
              <Card.Body>
                <IconWrapper bg="#dbeafe" color="#2563eb">
                  <Ticket size={24} />
                </IconWrapper>
                <StatValue>{getTotalSold().toLocaleString()}</StatValue>
                <StatLabel>Tickets Sold</StatLabel>
                {/*<TrendIndicator positive={true}>
                  <TrendingUp size={16} />
                  +8.3%
                </TrendIndicator>*/}
              </Card.Body>
            </StatsCard>
          </Col>

          <Col lg={3} md={6}>
            <StatsCard>
              <Card.Body>
                <IconWrapper bg="#fef3c7" color="#d97706">
                  <Users size={24} />
                </IconWrapper>
                <StatValue>{getConversionRate().toFixed(1)}%</StatValue>
                <StatLabel>Conversion Rate</StatLabel>
                {/*<TrendIndicator positive={true}>
                  <TrendingUp size={16} />
                  +2.1%
                </TrendIndicator>*/}
              </Card.Body>
            </StatsCard>
          </Col>

          <Col lg={3} md={6}>
            <StatsCard>
              <Card.Body>
                <IconWrapper bg="#ede9fe" color="#7c3aed">
                  <Clock size={24} />
                </IconWrapper>
                <StatValue>{event?.uniqueVisitors || 0}</StatValue>
                <StatLabel>Unique Visitors</StatLabel>
              </Card.Body>
            </StatsCard>
          </Col>
        </Row>

        <SectionHeader>
          <SectionTitle>Sales Performance</SectionTitle>
        </SectionHeader>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>Sales Overview</ChartTitle>
          </ChartHeader>
          <ChartBody>
            {formatSalesData().length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formatSalesData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: colors.secondary }} 
                    tickLine={{ stroke: colors.border }}
                  />
                  <YAxis 
                    yAxisId="left" 
                    tick={{ fill: colors.secondary }} 
                    tickLine={{ stroke: colors.border }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    tick={{ fill: colors.secondary }} 
                    tickLine={{ stroke: colors.border }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: borderRadius.sm,
                      boxShadow: shadows.md,
                      border: `1px solid ${colors.border}`
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="sales"
                    stroke={colors.primary}
                    name="Tickets Sold"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    name="Revenue ($)"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <NoDataState>
                <TrendingUp size={48} />
                <p>No sales data available yet</p>
              </NoDataState>
            )}
          </ChartBody>
        </ChartCard>

        <Row className="g-4 mb-4">
          <Col md={6}>
            <ChartCard>
              <ChartHeader>
                <ChartTitle>Ticket Distribution</ChartTitle>
              </ChartHeader>
              <ChartBody>
                {formatTicketDistribution().length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={formatTicketDistribution()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={130}
                        fill={colors.primary}
                        dataKey="value"
                        label={({ name, percent }) => 
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {formatTicketDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: borderRadius.sm,
                          boxShadow: shadows.md,
                          border: `1px solid ${colors.border}`
                        }}
                        formatter={(value) => [`${value} tickets`, 'Sold']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <NoDataState>
                    <Ticket size={48} />
                    <p>No ticket distribution data available</p>
                  </NoDataState>
                )}
              </ChartBody>
            </ChartCard>
          </Col>
          
          <Col md={6}>
            <ChartCard>
              <ChartHeader>
                <ChartTitle>Attendee Status</ChartTitle>
              </ChartHeader>
              <ChartBody>
                {formatAttendeeStatus().length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={formatAttendeeStatus()}>
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: colors.secondary }} 
                        tickLine={{ stroke: colors.border }}
                      />
                      <YAxis 
                        tick={{ fill: colors.secondary }} 
                        tickLine={{ stroke: colors.border }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: borderRadius.sm,
                          boxShadow: shadows.md,
                          border: `1px solid ${colors.border}`
                        }}
                      />
                      <Bar dataKey="value" name="Attendees" fill={colors.primary}>
                        {formatAttendeeStatus().map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={
                              entry.name === 'Confirmed' ? '#16a34a' :
                              entry.name === 'Pending' ? '#F59E0B' :
                              '#EF4444'
                            } 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <NoDataState>
                    <Users size={48} />
                    <p>No attendee status data available</p>
                  </NoDataState>
                )}
              </ChartBody>
            </ChartCard>
          </Col>
        </Row>

        <SectionHeader>
          <SectionTitle>Audience Engagement</SectionTitle>
        </SectionHeader>

        <Row className="g-4 mb-4">
          <Col md={4}>
            <StatsCard>
              <Card.Body className="text-center">
                <h4 className="mb-3">Q&A Participation</h4>
                <div className="d-flex justify-content-around mb-3">
                  <div>
                    <StatValue>{engagementData?.questions?.total || 0}</StatValue>
                    <StatLabel>Total Questions</StatLabel>
                  </div>
                  <div>
                    <StatValue>{engagementData?.questions?.answered || 0}</StatValue>
                    <StatLabel>Answered</StatLabel>
                  </div>
                </div>
                <Link to={`/dashboard/events/${eventId}/qa`} className="btn btn-outline-primary w-100">
                  Manage Q&A
                  <ChevronRight size={16} className="ms-2" />
                </Link>
              </Card.Body>
            </StatsCard>
          </Col>
          
          <Col md={4}>
            <StatsCard>
              <Card.Body className="text-center">
                <h4 className="mb-3">Poll Engagement</h4>
                <div className="d-flex justify-content-around mb-3">
                  <div>
                    <StatValue>{engagementData?.totalPolls || 0}</StatValue>
                    <StatLabel>Total Polls</StatLabel>
                  </div>
                  <div>
                    <StatValue>{engagementData?.totalResponses || 0}</StatValue>
                    <StatLabel>Responses</StatLabel>
                  </div>
                </div>
                <Link to={`/dashboard/events/${eventId}/polls`} className="btn btn-outline-primary w-100">
                  Manage Polls
                  <ChevronRight size={16} className="ms-2" />
                </Link>
              </Card.Body>
            </StatsCard>
          </Col>
          
          <Col md={4}>
            <StatsCard>
              <Card.Body className="text-center">
                <h4 className="mb-3">Attendee Management</h4>
                <div className="d-flex justify-content-around mb-3">
                  <div>
                    <StatValue>{analytics?.attendeeStats?.total || 0}</StatValue>
                    <StatLabel>Total Attendees</StatLabel>
                  </div>
                  <div>
                    <StatValue>{analytics?.attendeeStats?.confirmed || 0}</StatValue>
                    <StatLabel>Confirmed</StatLabel>
                  </div>
                </div>
                <Link to={`/dashboard/events/${eventId}/attendees`} className="btn btn-outline-primary w-100">
                  Manage Attendees
                  <ChevronRight size={16} className="ms-2" />
                </Link>
              </Card.Body>
            </StatsCard>
          </Col>
        </Row>
      </Container>
    </PageWrapper>
  );
};

export default EventAnalytics;
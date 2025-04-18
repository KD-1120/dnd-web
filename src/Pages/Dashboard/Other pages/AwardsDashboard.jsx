import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Badge, ProgressBar, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { AwardsVotingService } from '../Other pages/services/AwardsVotingService';
import { EventTicketService } from '../Other pages/services/EventTicketService';
import { Trophy, Plus, Clock, Users, ArrowLeft } from 'lucide-react';
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

const ActionButton = styled(Button)`
  margin-left: 16px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AwardCard = styled(Card)`
  margin-bottom: 1rem;
  border: none;
  box-shadow: ${shadows.sm};
  border-radius: ${borderRadius.md};
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const AwardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${colors.secondary};
  font-size: 0.875rem;
`;

const NomineeCard = styled(Card)`
  margin-bottom: 0.5rem;
  border: 1px solid #e2e8f0;
`;

const StatsCard = styled(Card)`
  background: ${props => props.bgColor || '#fff'};
  margin-bottom: 1rem;
  border: none;
  box-shadow: ${shadows.sm};
  height: 100%;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
`;

const StatLabel = styled.div`
  color: ${colors.secondary};
  font-size: 0.875rem;
`;

const AwardsDashboard = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [awards, setAwards] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEventData = async () => {
      if (!eventId) return;
      
      try {
        // Load event details
        const eventData = await EventTicketService.getEvent(eventId);
        if (!eventData) {
          setError("Event not found");
          return;
        }
        setEvent(eventData);
      } catch (error) {
        console.error('Error loading event data:', error);
        setError("Failed to load event data. Please try again.");
      }
    };

    loadEventData();
  }, [eventId]);

  useEffect(() => {
    const loadAwardsData = async () => {
      if (!eventId) return;
      
      try {
        setLoading(true);
        
        // Load award categories and analytics
        const [awardsData, analyticsData] = await Promise.all([
          AwardsVotingService.getEventCategories(eventId),
          AwardsVotingService.getCategoryAnalytics(eventId)
        ]);
        
        setAwards(awardsData);
        setAnalytics(analyticsData);
        setError(null);
      } catch (error) {
        console.error('Error loading awards data:', error);
        setError("Failed to load awards data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadAwardsData();
  }, [eventId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isVotingOpen = (deadline) => {
    return new Date(deadline) > new Date();
  };

  const calculatePercentage = (votes, totalVotes) => {
    return totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
  };

  if (loading) {
    return (
      <PageWrapper>
        <Container>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading awards data...</p>
          </div>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <BackLink to="/dashboard/events">
          <ArrowLeft size={16} />
          Back to Events
        </BackLink>
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <PageTitle>Awards & Voting</PageTitle>
            {event && <p className="text-muted">Event: {event.title}</p>}
          </div>
          <ActionButton
            variant="primary"
            as={Link}
            to={`/dashboard/events/${eventId}/awards/create`}
          >
            <Plus size={20} />
            Create Award Category
          </ActionButton>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {analytics && (
          <div className="row mb-4">
            <div className="col-md-3">
              <StatsCard>
                <Card.Body>
                  <StatValue>{analytics.totalCategories || 0}</StatValue>
                  <StatLabel>Total Awards</StatLabel>
                </Card.Body>
              </StatsCard>
            </div>
            <div className="col-md-3">
              <StatsCard>
                <Card.Body>
                  <StatValue>{analytics.activeCategories || 0}</StatValue>
                  <StatLabel>Open for Voting</StatLabel>
                </Card.Body>
              </StatsCard>
            </div>
            <div className="col-md-3">
              <StatsCard>
                <Card.Body>
                  <StatValue>{analytics.totalVotes || 0}</StatValue>
                  <StatLabel>Total Votes</StatLabel>
                </Card.Body>
              </StatsCard>
            </div>
            <div className="col-md-3">
              <StatsCard>
                <Card.Body>
                  <StatValue>{analytics.totalNominees || 0}</StatValue>
                  <StatLabel>Total Nominees</StatLabel>
                </Card.Body>
              </StatsCard>
            </div>
          </div>
        )}

        {awards && awards.length === 0 ? (
          <Card className="text-center p-5">
            <Card.Body>
              <Trophy size={48} className="mb-3 text-muted" />
              <h4>No Award Categories Yet</h4>
              <p className="text-muted mb-4">Start by creating your first award category</p>
              <Button 
                variant="primary"
                as={Link}
                to={`/dashboard/events/${eventId}/awards/create`}
              >
                <Plus size={16} className="me-2" />
                Create Award Category
              </Button>
            </Card.Body>
          </Card>
        ) : (
          awards.map(award => {
            const totalVotes = award.nominees.reduce((sum, nominee) => sum + (nominee.votes || 0), 0);
            
            return (
              <AwardCard key={award.id}>
                <Card.Body>
                  <CardHeader>
                    <div>
                      <h5 className="mb-1">{award.name}</h5>
                      <p className="text-muted mb-0">{award.description}</p>
                    </div>
                    <Badge bg={isVotingOpen(award.deadline) ? 'success' : 'secondary'}>
                      {isVotingOpen(award.deadline) ? 'Voting Open' : 'Voting Closed'}
                    </Badge>
                  </CardHeader>

                  <AwardMeta className="mb-3">
                    <span>
                      <Users size={14} className="me-1" />
                      {totalVotes} votes
                    </span>
                    <span>
                      <Clock size={14} className="me-1" />
                      {isVotingOpen(award.deadline)
                        ? `Closes ${formatDate(award.deadline)}`
                        : `Closed ${formatDate(award.deadline)}`}
                    </span>
                  </AwardMeta>

                  <div>
                    {award.nominees.map((nominee, index) => {
                      const votes = nominee.votes || 0;
                      const percentage = calculatePercentage(votes, totalVotes);

                      return (
                        <NomineeCard key={nominee.id || index}>
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div>
                                <h6 className="mb-1">{nominee.name}</h6>
                                {nominee.description && (
                                  <small className="text-muted">{nominee.description}</small>
                                )}
                              </div>
                            </div>
                            <ProgressBar
                              now={percentage}
                              label={`${Math.round(percentage)}%`}
                              variant="primary"
                            />
                            <small className="text-muted">
                              {votes} vote{votes !== 1 ? 's' : ''}
                            </small>
                          </Card.Body>
                        </NomineeCard>
                      );
                    })}
                  </div>

                  {!isVotingOpen(award.deadline) && award.nominees.length > 0 && (
                    <div className="mt-3 text-center">
                      <h6 className="text-success mb-2">Winner</h6>
                      <h5>
                        {award.nominees.reduce((winner, nominee) => 
                          !winner || (nominee.votes > winner.votes) ? nominee : winner
                        , null)?.name || 'No votes recorded'}
                      </h5>
                    </div>
                  )}
                </Card.Body>
              </AwardCard>
            );
          })
        )}
      </Container>
    </PageWrapper>
  );
};

export default AwardsDashboard;
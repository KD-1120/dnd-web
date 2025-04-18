import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Badge, ProgressBar } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { AwardsVotingService } from '../services/AwardsVotingService';
import { Trophy, Plus, BarChart2, Clock, Users } from 'lucide-react';

const PageWrapper = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 24px;
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  color: #64748b;
  font-size: 0.875rem;
`;

const NomineeCard = styled(Card)`
  margin-bottom: 0.5rem;
  border: 1px solid #e2e8f0;
`;

const AwardsDashboard = () => {
  const { eventId } = useParams();
  const [awards, setAwards] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'open', 'closed'

  useEffect(() => {
    loadData();
  }, [eventId]);

  const loadData = async () => {
    try {
      const [awardsData, analyticsData] = await Promise.all([
        AwardsVotingService.getEventAwards(eventId),
        AwardsVotingService.getAwardsAnalytics(eventId)
      ]);
      
      setAwards(awardsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (awardId, nomineeId) => {
    try {
      await AwardsVotingService.submitVote(eventId, awardId, nomineeId);
      await loadData();
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
  };

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

  const filteredAwards = awards.filter(award => {
    if (filter === 'open') return isVotingOpen(award.votingDeadline);
    if (filter === 'closed') return !isVotingOpen(award.votingDeadline);
    return true;
  });

  if (loading) {
    return (
      <PageWrapper>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="d-flex align-items-center mb-4">
        <PageTitle>Awards</PageTitle>
        <ActionButton
          variant="primary"
          as={Link}
          to={`/dashboard/events/${eventId}/awards/create`}
        >
          <Plus size={20} />
          Create Award Category
        </ActionButton>
      </div>

      {analytics && (
        <div className="row mb-4">
          <div className="col-md-3">
            <AwardCard>
              <Card.Body>
                <h6 className="text-muted mb-2">Total Awards</h6>
                <h3>{analytics.totalAwards}</h3>
              </Card.Body>
            </AwardCard>
          </div>
          <div className="col-md-3">
            <AwardCard>
              <Card.Body>
                <h6 className="text-muted mb-2">Open for Voting</h6>
                <h3>{analytics.openAwards}</h3>
              </Card.Body>
            </AwardCard>
          </div>
          <div className="col-md-3">
            <AwardCard>
              <Card.Body>
                <h6 className="text-muted mb-2">Total Votes</h6>
                <h3>{analytics.totalVotes}</h3>
              </Card.Body>
            </AwardCard>
          </div>
          <div className="col-md-3">
            <AwardCard>
              <Card.Body>
                <h6 className="text-muted mb-2">Total Nominees</h6>
                <h3>{analytics.totalNominees}</h3>
              </Card.Body>
            </AwardCard>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <Form.Select 
          style={{ width: 'auto' }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Awards</option>
          <option value="open">Open for Voting</option>
          <option value="closed">Voting Closed</option>
        </Form.Select>
      </div>

      {filteredAwards.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <Trophy size={48} className="mb-3 text-muted" />
            <h4>No Awards Yet</h4>
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
        filteredAwards.map(award => (
          <AwardCard key={award.id}>
            <Card.Body>
              <CardHeader>
                <div>
                  <h5 className="mb-1">{award.title}</h5>
                  <p className="text-muted mb-0">{award.description}</p>
                </div>
                <Badge bg={isVotingOpen(award.votingDeadline) ? 'success' : 'secondary'}>
                  {isVotingOpen(award.votingDeadline) ? 'Voting Open' : 'Voting Closed'}
                </Badge>
              </CardHeader>

              <AwardMeta className="mb-3">
                <span>
                  <Users size={14} className="me-1" />
                  {award.totalVotes} votes
                </span>
                <span>
                  <Clock size={14} className="me-1" />
                  {isVotingOpen(award.votingDeadline)
                    ? `Closes ${formatDate(award.votingDeadline)}`
                    : `Closed ${formatDate(award.votingDeadline)}`}
                </span>
              </AwardMeta>

              <div>
                {award.nominees.map((nominee, index) => {
                  const votes = award.votes[nominee.id] || 0;
                  const percentage = calculatePercentage(votes, award.totalVotes);
                  const hasVoted = award.userVote === nominee.id;

                  return (
                    <NomineeCard key={nominee.id}>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <h6 className="mb-1">{nominee.name}</h6>
                            {nominee.description && (
                              <small className="text-muted">{nominee.description}</small>
                            )}
                          </div>
                          {isVotingOpen(award.votingDeadline) && (
                            <Button
                              variant={hasVoted ? "primary" : "outline-primary"}
                              size="sm"
                              onClick={() => handleVote(award.id, nominee.id)}
                              disabled={hasVoted}
                            >
                              {hasVoted ? "Voted" : "Vote"}
                            </Button>
                          )}
                        </div>
                        <ProgressBar
                          now={percentage}
                          label={`${Math.round(percentage)}%`}
                          variant={hasVoted ? "primary" : "secondary"}
                        />
                        <small className="text-muted">
                          {votes} vote{votes !== 1 ? 's' : ''}
                        </small>
                      </Card.Body>
                    </NomineeCard>
                  );
                })}
              </div>

              {!isVotingOpen(award.votingDeadline) && award.winner && (
                <div className="mt-3 text-center">
                  <h6 className="text-success mb-2">Winner</h6>
                  <h5>{award.winner.name}</h5>
                </div>
              )}
            </Card.Body>
          </AwardCard>
        ))
      )}
    </PageWrapper>
  );
};

export default AwardsDashboard;
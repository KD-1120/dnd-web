import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Badge, ProgressBar } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { PollService } from './services/PollService';
import { Plus, BarChart2, Clock, Users } from 'lucide-react';

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

const ItemCard = styled(Card)`
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

const PollMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #64748b;
  font-size: 0.875rem;
`;

const PollsDashboard = () => {
  const { eventId } = useParams();
  const [polls, setPolls] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId] = useState('current-user-id'); // In a real app, this would come from auth
  const [votingInProgress, setVotingInProgress] = useState({});

  useEffect(() => {
    loadData();
  }, [eventId]);

  const loadData = async () => {
    try {
      const [pollsData, analyticsData] = await Promise.all([
        PollService.getEventPolls(eventId),
        PollService.getPollAnalytics(eventId)
      ]);
      
      setPolls(pollsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId, options) => {
    try {
      setVotingInProgress(prev => ({ ...prev, [pollId]: true }));
      await PollService.votePoll(eventId, pollId, options, userId);
      await loadData();
    } catch (error) {
      console.error('Error voting:', error);
      // In a real app, show an error toast/notification
    } finally {
      setVotingInProgress(prev => ({ ...prev, [pollId]: false }));
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

  const isPollActive = (deadline) => {
    return new Date(deadline) > new Date();
  };

  const calculatePercentage = (votes, totalVotes) => {
    return totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
  };

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
        <PageTitle>Polls</PageTitle>
        <ActionButton
          variant="primary"
          as={Link}
          to={`/dashboard/events/${eventId}/polls/create`}
        >
          <Plus size={20} />
          Create New Poll
        </ActionButton>
      </div>

      {analytics && (
        <div className="row mb-4">
          <div className="col-md-3">
            <ItemCard>
              <Card.Body>
                <h6 className="text-muted mb-2">Total Polls</h6>
                <h3>{analytics.totalPolls}</h3>
              </Card.Body>
            </ItemCard>
          </div>
          <div className="col-md-3">
            <ItemCard>
              <Card.Body>
                <h6 className="text-muted mb-2">Active Polls</h6>
                <h3>{analytics.activePolls}</h3>
              </Card.Body>
            </ItemCard>
          </div>
          <div className="col-md-3">
            <ItemCard>
              <Card.Body>
                <h6 className="text-muted mb-2">Total Votes</h6>
                <h3>{analytics.totalVotes}</h3>
              </Card.Body>
            </ItemCard>
          </div>
          <div className="col-md-3">
            <ItemCard>
              <Card.Body>
                <h6 className="text-muted mb-2">Avg. Votes per Poll</h6>
                <h3>{Math.round(analytics.averageVotesPerPoll)}</h3>
              </Card.Body>
            </ItemCard>
          </div>
        </div>
      )}

      {polls.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <BarChart2 size={48} className="mb-3 text-muted" />
            <h4>No Polls Yet</h4>
            <p className="text-muted mb-4">Start by creating your first poll</p>
            <Button 
              variant="primary"
              as={Link}
              to={`/dashboard/events/${eventId}/polls/create`}
            >
              <Plus size={16} className="me-2" />
              Create Poll
            </Button>
          </Card.Body>
        </Card>
      ) : (
        polls.map(poll => (
          <ItemCard key={poll.id}>
            <Card.Body>
              <CardHeader>
                <div>
                  <h5 className="mb-1">{poll.question}</h5>
                  {poll.description && (
                    <p className="text-muted mb-0">{poll.description}</p>
                  )}
                </div>
                <Badge bg={isPollActive(poll.deadline) ? 'success' : 'secondary'}>
                  {isPollActive(poll.deadline) ? 'Active' : 'Ended'}
                </Badge>
              </CardHeader>

              <PollMeta className="mb-3">
                <span>
                  <Users size={14} className="me-1" />
                  {poll.totalVotes} votes
                </span>
                <span>
                  <Clock size={14} className="me-1" />
                  {isPollActive(poll.deadline)
                    ? `Ends ${formatDate(poll.deadline)}`
                    : `Ended ${formatDate(poll.deadline)}`}
                </span>
              </PollMeta>

              <div className="mb-3">
                {poll.options.map((option, index) => {
                  const votes = poll.votes[option] || 0;
                  const percentage = calculatePercentage(votes, poll.totalVotes);
                  const userVoted = poll.votes[`${poll.id}_${userId}`]?.includes(option);

                  return (
                    <div key={index} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <div className="d-flex align-items-center gap-2">
                          {poll.type === 'multiple' ? (
                            <Form.Check
                              type="checkbox"
                              id={`${poll.id}_${index}`}
                              disabled={!isPollActive(poll.deadline)}
                              checked={userVoted}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleVote(poll.id, [option]);
                                }
                              }}
                            />
                          ) : (
                            <Form.Check
                              type="radio"
                              name={`poll_${poll.id}`}
                              id={`${poll.id}_${index}`}
                              disabled={!isPollActive(poll.deadline)}
                              checked={userVoted}
                              onChange={() => handleVote(poll.id, [option])}
                            />
                          )}
                          <span>{option}</span>
                        </div>
                        <small>{votes} votes ({percentage.toFixed(1)}%)</small>
                      </div>
                      <ProgressBar 
                        now={percentage} 
                        variant={userVoted ? "primary" : "secondary"}
                        style={{ height: '8px' }}
                      />
                    </div>
                  );
                })}
              </div>

              {!isPollActive(poll.deadline) && (
                <div className="text-center text-muted">
                  <small>This poll has ended</small>
                </div>
              )}
            </Card.Body>
          </ItemCard>
        ))
      )}
    </PageWrapper>
  );
};

export default PollsDashboard;
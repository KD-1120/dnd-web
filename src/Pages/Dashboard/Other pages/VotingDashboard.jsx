import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, ProgressBar, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Plus, Award, Users, Clock, ChevronLeft } from 'lucide-react';
import { colors, spacing, shadows, borderRadius } from '../../../GlobalStyles';

// This would be replaced with an actual service
const mockVotingService = {
  getEventAwards: async (eventId) => {
    // Simulated API call with mock data
    return [
      {
        id: '1',
        title: 'Best Presentation',
        description: 'Award for the most engaging presentation',
        nominees: [
          { id: 'n1', name: 'John Smith', votes: 42 },
          { id: 'n2', name: 'Sarah Johnson', votes: 37 },
          { id: 'n3', name: 'Mike Williams', votes: 21 }
        ],
        status: 'active',
        totalVotes: 100,
        deadline: new Date(Date.now() + 86400000).toISOString() // Tomorrow
      },
      {
        id: '2',
        title: 'Innovation Award',
        description: 'Recognizing the most innovative idea',
        nominees: [
          { id: 'n4', name: 'Tech Innovators Team', votes: 53 },
          { id: 'n5', name: 'Future Solutions', votes: 48 },
          { id: 'n6', name: 'NextGen Startup', votes: 39 }
        ],
        status: 'active',
        totalVotes: 140,
        deadline: new Date(Date.now() + 172800000).toISOString() // Day after tomorrow
      },
      {
        id: '3',
        title: 'Community Choice',
        description: 'Selected by the community as their favorite',
        nominees: [
          { id: 'n7', name: 'Community Project Alpha', votes: 128 },
          { id: 'n8', name: 'Local Initiative', votes: 112 },
          { id: 'n9', name: 'Public Engagement Team', votes: 95 }
        ],
        status: 'ended',
        totalVotes: 335,
        deadline: new Date(Date.now() - 86400000).toISOString() // Yesterday
      }
    ];
  },
  getVotingAnalytics: async (eventId) => {
    // Simulated API call with mock data
    return {
      totalAwards: 3,
      activeAwards: 2,
      totalVotes: 575,
      totalParticipants: 210,
      averageVotesPerAward: 191.7
    };
  },
  submitVote: async (eventId, awardId, nomineeId) => {
    // Simulated API call for voting
    console.log(`Vote submitted for award ${awardId}, nominee ${nomineeId}`);
    return { success: true };
  }
};

const PageWrapper = styled.div`
  padding: ${spacing.lg};
  background-color: ${colors.light};
`;

const PageTitle = styled.h1`
  font-size: 24px;
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
  margin-bottom: 1.5rem;
  border: none;
  box-shadow: ${shadows.sm};
  border-radius: ${borderRadius.md};
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
  }
`;

const AwardHeader = styled.div`
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
  margin-bottom: 1rem;
`;

const NomineeItem = styled.div`
  padding: 1rem;
  border-radius: ${borderRadius.sm};
  background-color: ${colors.lightGray};
  margin-bottom: 0.75rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${colors.border};
  }
`;

const StatsCard = styled(Card)`
  height: 100%;
  border: none;
  box-shadow: ${shadows.sm};
  border-radius: ${borderRadius.md};
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${colors.dark};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: ${colors.secondary};
  font-size: 14px;
`;

const VotingDashboard = () => {
  const { eventId } = useParams();
  const [awards, setAwards] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userVotes, setUserVotes] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [awardsData, analyticsData] = await Promise.all([
          mockVotingService.getEventAwards(eventId),
          mockVotingService.getVotingAnalytics(eventId)
        ]);
        
        setAwards(awardsData);
        setAnalytics(analyticsData);
        
        // Initialize user votes from local storage or a real API in production
        const savedVotes = {};
        setUserVotes(savedVotes);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading voting data:', error);
        setError('Failed to load voting data. Please try again.');
        setLoading(false);
      }
    };

    if (eventId) {
      fetchData();
    }
  }, [eventId]);

  const handleVote = async (awardId, nomineeId) => {
    try {
      // In a real app, you would call an API here
      await mockVotingService.submitVote(eventId, awardId, nomineeId);
      
      // Update local state
      setUserVotes(prev => ({
        ...prev,
        [awardId]: nomineeId
      }));
      
      // Optimistically update the UI (in a real app you'd refetch data)
      setAwards(prev => 
        prev.map(award => {
          if (award.id === awardId) {
            const updatedNominees = award.nominees.map(nominee => {
              if (nominee.id === nomineeId) {
                return { ...nominee, votes: nominee.votes + 1 };
              }
              return nominee;
            });
            
            return {
              ...award,
              nominees: updatedNominees,
              totalVotes: award.totalVotes + 1
            };
          }
          return award;
        })
      );
    } catch (error) {
      console.error('Error submitting vote:', error);
      // Show an error message in a real app
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

  const isAwardActive = (deadline) => {
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
            <p className="mt-3">Loading voting data...</p>
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
            <Button 
              variant="primary" 
              as={Link}
              to="/dashboard/events"
            >
              Back to Events
            </Button>
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
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <PageTitle>Event Voting & Awards</PageTitle>
          <ActionButton
            variant="primary"
            as={Link}
            to={`/dashboard/events/${eventId}/voting/create`}
          >
            <Plus size={20} />
            Create New Award
          </ActionButton>
        </div>

        {analytics && (
          <Row className="g-4 mb-4">
            <Col md={3}>
              <StatsCard>
                <Card.Body>
                  <StatValue>{analytics.totalAwards}</StatValue>
                  <StatLabel>Total Awards</StatLabel>
                </Card.Body>
              </StatsCard>
            </Col>
            <Col md={3}>
              <StatsCard>
                <Card.Body>
                  <StatValue>{analytics.activeAwards}</StatValue>
                  <StatLabel>Active Awards</StatLabel>
                </Card.Body>
              </StatsCard>
            </Col>
            <Col md={3}>
              <StatsCard>
                <Card.Body>
                  <StatValue>{analytics.totalVotes}</StatValue>
                  <StatLabel>Total Votes</StatLabel>
                </Card.Body>
              </StatsCard>
            </Col>
            <Col md={3}>
              <StatsCard>
                <Card.Body>
                  <StatValue>{analytics.totalParticipants}</StatValue>
                  <StatLabel>Participants</StatLabel>
                </Card.Body>
              </StatsCard>
            </Col>
          </Row>
        )}

        {awards.length === 0 ? (
          <Card className="text-center p-5">
            <Card.Body>
              <Award size={48} className="mb-3 text-muted" />
              <h4>No Awards Yet</h4>
              <p className="text-muted mb-4">Start by creating your first award</p>
              <Button 
                variant="primary"
                as={Link}
                to={`/dashboard/events/${eventId}/voting/create`}
              >
                <Plus size={16} className="me-2" />
                Create Award
              </Button>
            </Card.Body>
          </Card>
        ) : (
          awards.map(award => (
            <AwardCard key={award.id}>
              <Card.Body>
                <AwardHeader>
                  <div>
                    <h4 className="mb-1">{award.title}</h4>
                    {award.description && (
                      <p className="text-muted mb-0">{award.description}</p>
                    )}
                  </div>
                  <Badge bg={isAwardActive(award.deadline) ? 'success' : 'secondary'}>
                    {isAwardActive(award.deadline) ? 'Voting Open' : 'Voting Closed'}
                  </Badge>
                </AwardHeader>

                <AwardMeta>
                  <span>
                    <Users size={14} className="me-1" />
                    {award.totalVotes} votes
                  </span>
                  <span>
                    <Clock size={14} className="me-1" />
                    {isAwardActive(award.deadline)
                      ? `Ends ${formatDate(award.deadline)}`
                      : `Ended ${formatDate(award.deadline)}`}
                  </span>
                </AwardMeta>

                <div className="mb-3">
                  {award.nominees.map((nominee, index) => {
                    const percentage = calculatePercentage(nominee.votes, award.totalVotes);
                    const userVoted = userVotes[award.id] === nominee.id;
                    
                    return (
                      <NomineeItem key={nominee.id}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="d-flex align-items-center gap-2">
                            <Form.Check
                              type="radio"
                              name={`award_${award.id}`}
                              id={`nominee_${nominee.id}`}
                              disabled={!isAwardActive(award.deadline)}
                              checked={userVoted}
                              onChange={() => handleVote(award.id, nominee.id)}
                            />
                            <span className="fw-medium">{nominee.name}</span>
                          </div>
                          <small>{nominee.votes} votes ({percentage.toFixed(1)}%)</small>
                        </div>
                        <ProgressBar 
                          now={percentage} 
                          variant={userVoted ? "primary" : "secondary"}
                          style={{ height: '8px' }}
                        />
                      </NomineeItem>
                    );
                  })}
                </div>

                {!isAwardActive(award.deadline) && (
                  <div className="text-center text-muted">
                    <small>Voting for this award has ended</small>
                  </div>
                )}
              </Card.Body>
            </AwardCard>
          ))
        )}
      </Container>
    </PageWrapper>
  );
};

export default VotingDashboard;

// This would be the create award component in a real implementation
export const CreateAward = () => {
  const { eventId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [nominees, setNominees] = useState([{ id: 1, name: '' }, { id: 2, name: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const handleAddNominee = () => {
    const newId = nominees.length > 0 
      ? Math.max(...nominees.map(n => n.id)) + 1 
      : 1;
    setNominees([...nominees, { id: newId, name: '' }]);
  };
  
  const handleRemoveNominee = (id) => {
    if (nominees.length > 2) {
      setNominees(nominees.filter(nominee => nominee.id !== id));
    } else {
      // Show an error or notification that at least 2 nominees are required
      setError('At least 2 nominees are required');
      setTimeout(() => setError(null), 3000);
    }
  };
  
  const handleNomineeChange = (id, value) => {
    setNominees(
      nominees.map(nominee => 
        nominee.id === id ? { ...nominee, name: value } : nominee
      )
    );
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      setError('Please enter an award title');
      return;
    }
    
    if (!deadline) {
      setError('Please set a voting deadline');
      return;
    }
    
    const emptyNominees = nominees.filter(n => !n.name.trim());
    if (emptyNominees.length > 0) {
      setError('Please fill in all nominee names');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // In a real app, you would call an API here
      // await votingService.createAward(eventId, { title, description, deadline, nominees });
      
      // For demo purposes, just simulate a request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to the awards list
      // navigate(`/dashboard/events/${eventId}/voting`);
      console.log('Award created:', {
        title,
        description,
        deadline,
        nominees: nominees.map(n => n.name)
      });
      
      // In a real app, you would redirect here
      window.location.href = `/dashboard/events/${eventId}/voting`;
      
    } catch (error) {
      console.error('Error creating award:', error);
      setError('Failed to create award. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Set default deadline to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59);
    setDeadline(tomorrow.toISOString().slice(0, 16));
  }, []);
  
  return (
    <PageWrapper>
      <Container>
        <BackLink to={`/dashboard/events/${eventId}/voting`}>
          <ChevronLeft size={16} />
          Back to Awards
        </BackLink>
        
        <PageTitle>Create New Award</PageTitle>
        
        {error && (
          <Alert variant="danger" className="mb-4" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        <Card className="mt-4">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Award Title</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter award title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  placeholder="Enter award description" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label>Voting Deadline</Form.Label>
                <Form.Control 
                  type="datetime-local" 
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </Form.Group>
              
              <h5 className="mb-3">Nominees</h5>
              <div className="mb-3">
                {nominees.map((nominee) => (
                  <NomineeItem key={nominee.id}>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter nominee name" 
                      className="mb-2"
                      value={nominee.name}
                      onChange={(e) => handleNomineeChange(nominee.id, e.target.value)}
                      required
                    />
                    <div className="d-flex justify-content-end">
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleRemoveNominee(nominee.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </NomineeItem>
                ))}
              </div>
              
              <Button 
                variant="outline-primary" 
                className="mb-4"
                onClick={handleAddNominee}
                type="button"
              >
                <Plus size={16} className="me-2" />
                Add Nominee
              </Button>
              
              <div className="d-flex justify-content-end gap-2">
                <Button 
                  variant="secondary" 
                  as={Link} 
                  to={`/dashboard/events/${eventId}/voting`}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating...
                    </>
                  ) : 'Create Award'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </PageWrapper>
  );
};
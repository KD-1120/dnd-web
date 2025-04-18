import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Badge } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { QuestionService } from './services/PollService';
import { MessageCircle, ThumbsUp, Clock, Filter } from 'lucide-react';

const PageWrapper = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 24px;
`;

const QuestionCard = styled(Card)`
  margin-bottom: 1rem;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const QuestionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #64748b;
  font-size: 0.875rem;
`;

const ResponseContainer = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
`;

const QASession = () => {
  const { eventId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'answered'
  const [responseContent, setResponseContent] = useState({});

  useEffect(() => {
    loadData();
  }, [eventId]);

  const loadData = async () => {
    try {
      const [questionsData, analyticsData] = await Promise.all([
        QuestionService.getEventQuestions(eventId),
        QuestionService.getQuestionAnalytics(eventId)
      ]);
      
      setQuestions(questionsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    try {
      await QuestionService.createQuestion(eventId, {
        content: newQuestion.trim(),
        timestamp: new Date().toISOString()
      });
      setNewQuestion('');
      await loadData();
    } catch (error) {
      console.error('Error asking question:', error);
    }
  };

  const handleUpvote = async (questionId) => {
    try {
      await QuestionService.upvoteQuestion(eventId, questionId);
      await loadData();
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  const handleAnswer = async (questionId) => {
    const content = responseContent[questionId];
    if (!content?.trim()) return;

    try {
      await QuestionService.answerQuestion(eventId, questionId, content);
      setResponseContent(prev => ({ ...prev, [questionId]: '' }));
      await loadData();
    } catch (error) {
      console.error('Error answering question:', error);
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

  const filteredQuestions = questions.filter(q => {
    if (filter === 'pending') return q.status === 'pending';
    if (filter === 'answered') return q.status === 'answered';
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <PageTitle>Q&A Session</PageTitle>
        <Form.Select 
          style={{ width: 'auto' }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Questions</option>
          <option value="pending">Pending</option>
          <option value="answered">Answered</option>
        </Form.Select>
      </div>

      {analytics && (
        <div className="row mb-4">
          <div className="col-md-3">
            <QuestionCard>
              <Card.Body>
                <h6 className="text-muted mb-2">Total Questions</h6>
                <h3>{analytics.total}</h3>
              </Card.Body>
            </QuestionCard>
          </div>
          <div className="col-md-3">
            <QuestionCard>
              <Card.Body>
                <h6 className="text-muted mb-2">Answered</h6>
                <h3>{analytics.answered}</h3>
              </Card.Body>
            </QuestionCard>
          </div>
          <div className="col-md-3">
            <QuestionCard>
              <Card.Body>
                <h6 className="text-muted mb-2">Pending</h6>
                <h3>{analytics.pending}</h3>
              </Card.Body>
            </QuestionCard>
          </div>
          <div className="col-md-3">
            <QuestionCard>
              <Card.Body>
                <h6 className="text-muted mb-2">Avg. Upvotes</h6>
                <h3>{Math.round(analytics.averageUpvotes)}</h3>
              </Card.Body>
            </QuestionCard>
          </div>
        </div>
      )}

      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleAskQuestion}>
            <Form.Group>
              <Form.Label>Ask a Question</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Type your question here..."
              />
            </Form.Group>
            <div className="mt-3 text-end">
              <Button type="submit" disabled={!newQuestion.trim()}>
                Submit Question
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {filteredQuestions.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <MessageCircle size={48} className="mb-3 text-muted" />
            <h4>No Questions Yet</h4>
            <p className="text-muted">
              {filter === 'all' 
                ? 'Be the first to ask a question!'
                : `No ${filter} questions found`}
            </p>
          </Card.Body>
        </Card>
      ) : (
        filteredQuestions.map(question => (
          <QuestionCard key={question.id}>
            <Card.Body>
              <QuestionHeader>
                <div>
                  <h5 className="mb-2">{question.content}</h5>
                  <QuestionMeta>
                    <span>
                      <Clock size={14} className="me-1" />
                      {formatDate(question.createdAt)}
                    </span>
                    <span>
                      <ThumbsUp size={14} className="me-1" />
                      {question.upvotes} upvotes
                    </span>
                  </QuestionMeta>
                </div>
                <Badge bg={question.status === 'answered' ? 'success' : 'warning'}>
                  {question.status === 'answered' ? 'Answered' : 'Pending'}
                </Badge>
              </QuestionHeader>

              {question.status === 'pending' && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleUpvote(question.id)}
                >
                  <ThumbsUp size={14} className="me-1" />
                  Upvote
                </Button>
              )}

              {question.responses.map((response, index) => (
                <ResponseContainer key={index}>
                  <p className="mb-1">{response.content}</p>
                  <small className="text-muted">
                    Answered {formatDate(response.timestamp)}
                  </small>
                </ResponseContainer>
              ))}

              {question.status === 'pending' && (
                <ResponseContainer>
                  <Form.Group>
                    <Form.Label>Answer this question</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={responseContent[question.id] || ''}
                      onChange={(e) => setResponseContent(prev => ({
                        ...prev,
                        [question.id]: e.target.value
                      }))}
                      placeholder="Type your answer..."
                    />
                  </Form.Group>
                  <div className="mt-2 text-end">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAnswer(question.id)}
                      disabled={!responseContent[question.id]?.trim()}
                    >
                      Submit Answer
                    </Button>
                  </div>
                </ResponseContainer>
              )}
            </Card.Body>
          </QuestionCard>
        ))
      )}
    </PageWrapper>
  );
};

export default QASession;
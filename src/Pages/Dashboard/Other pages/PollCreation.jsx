import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PollService } from './services/PollService';
import { ArrowLeft, Plus, Minus } from 'lucide-react';

const PageWrapper = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 24px;
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: #4a5568;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: #1a202c;
  }
`;

const OptionCard = styled(Card)`
  margin-bottom: 1rem;
`;

const PollCreation = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [pollData, setPollData] = useState({
    question: '',
    description: '',
    type: 'single', // single or multiple
    deadline: '',
    options: ['', '']
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionChange = (index, value) => {
    const newOptions = [...pollData.options];
    newOptions[index] = value;
    setPollData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const addOption = () => {
    setPollData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index) => {
    if (pollData.options.length <= 2) return;
    setPollData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate the form
      if (!pollData.question.trim()) {
        throw new Error('Question is required');
      }
      if (!pollData.deadline) {
        throw new Error('End date is required');
      }
      if (pollData.options.some(opt => !opt.trim())) {
        throw new Error('All options must be filled');
      }

      // Submit the poll
      await PollService.createPoll(eventId, {
        ...pollData,
        options: pollData.options.filter(opt => opt.trim())
      });

      // Redirect to polls dashboard
      navigate(`/dashboard/events/${eventId}/polls`);
    } catch (error) {
      console.error('Error creating poll:', error);
      setError(error.message || 'Failed to create poll. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <Container>
        <BackLink 
          onClick={() => navigate(`/dashboard/events/${eventId}/polls`)}
          type="button"
        >
          <ArrowLeft size={16} />
          Back to Polls
        </BackLink>

        <PageTitle>Create New Poll</PageTitle>

        {error && (
          <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label>Question</Form.Label>
                <Form.Control
                  type="text"
                  value={pollData.question}
                  onChange={(e) => setPollData(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Enter your question"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Description (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={pollData.description}
                  onChange={(e) => setPollData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Add additional context to your question"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Poll Type</Form.Label>
                <Form.Select
                  value={pollData.type}
                  onChange={(e) => setPollData(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="single">Single Choice</option>
                  <option value="multiple">Multiple Choice</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>End Date & Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={pollData.deadline}
                  onChange={(e) => setPollData(prev => ({ ...prev, deadline: e.target.value }))}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Form.Label className="mb-0">Options</Form.Label>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={addOption}
                    type="button"
                  >
                    <Plus size={16} className="me-1" />
                    Add Option
                  </Button>
                </div>
                {pollData.options.map((option, index) => (
                  <OptionCard key={index}>
                    <Card.Body className="d-flex gap-2">
                      <Form.Control
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                      {pollData.options.length > 2 && (
                        <Button
                          variant="outline-danger"
                          onClick={() => removeOption(index)}
                          type="button"
                        >
                          <Minus size={16} />
                        </Button>
                      )}
                    </Card.Body>
                  </OptionCard>
                ))}
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate(`/dashboard/events/${eventId}/polls`)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Poll'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </PageWrapper>
  );
};

export default PollCreation;
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { AwardsVotingService } from './services/AwardsVotingService';
import { EventTicketService } from './services/EventTicketService';
import { ArrowLeft, Plus, Minus, Trophy } from 'lucide-react';
import { colors, spacing, shadows, borderRadius, typography } from '../../../GlobalStyles';

const PageWrapper = styled.div`
  padding: ${spacing.lg};
  background-color: ${colors.light};
`;

const PageTitle = styled.h1`
  font-size: ${typography.fontSizes.h1};
  font-weight: 600;
  color: ${colors.dark};
  margin-bottom: ${spacing.md};
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

const FormSection = styled(Card)`
  margin-bottom: ${spacing.lg};
  border: none;
  box-shadow: ${shadows.sm};
  border-radius: ${borderRadius.md};
`;

const FormLabel = styled(Form.Label)`
  font-weight: 500;
  margin-bottom: ${spacing.xs};
`;

const NomineeCard = styled(Card)`
  margin-bottom: 1rem;
  border: 1px solid ${colors.border};
  box-shadow: ${shadows.sm};
`;

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
`;

const AwardCategoryCreation = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [categoryData, setCategoryData] = useState({
    name: '',
    description: '',
    deadline: '',
    nominees: [{ name: '', description: '' }, { name: '', description: '' }]
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        
        // Set default deadline to be the event end date
        if (eventData.endDate) {
          const defaultDeadline = new Date(eventData.endDate);
          defaultDeadline.setHours(23, 59);
          setCategoryData(prev => ({
            ...prev,
            deadline: defaultDeadline.toISOString().slice(0, 16)
          }));
        }
      } catch (error) {
        console.error('Error loading event data:', error);
        setError("Failed to load event data. Please try again.");
      }
    };

    loadEventData();
  }, [eventId]);

  const handleNomineeChange = (index, field, value) => {
    const newNominees = [...categoryData.nominees];
    newNominees[index] = { ...newNominees[index], [field]: value };
    setCategoryData(prev => ({
      ...prev,
      nominees: newNominees
    }));
  };

  const addNominee = () => {
    setCategoryData(prev => ({
      ...prev,
      nominees: [...prev.nominees, { name: '', description: '' }]
    }));
  };

  const removeNominee = (index) => {
    if (categoryData.nominees.length <= 2) {
      setError('At least 2 nominees are required');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    setCategoryData(prev => ({
      ...prev,
      nominees: prev.nominees.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate the form
      if (!categoryData.name.trim()) {
        throw new Error('Category name is required');
      }
      if (!categoryData.deadline) {
        throw new Error('Voting deadline is required');
      }
      
      const emptyNominees = categoryData.nominees.filter(n => !n.name.trim());
      if (emptyNominees.length > 0) {
        throw new Error('All nominee names must be filled');
      }

      // Create the category
      await AwardsVotingService.createCategory(eventId, {
        name: categoryData.name,
        description: categoryData.description,
        deadline: categoryData.deadline,
        nominees: categoryData.nominees
      });

      // Redirect to awards dashboard
      navigate(`/dashboard/events/${eventId}/awards`);
    } catch (error) {
      console.error('Error creating award category:', error);
      setError(error.message || 'Failed to create award category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <Container>
        <BackLink to={`/dashboard/events/${eventId}/awards`}>
          <ArrowLeft size={16} />
          Back to Awards
        </BackLink>

        <div className="d-flex align-items-center mb-4">
          <Trophy size={24} className="me-2 text-primary" />
          <PageTitle>Create New Award Category</PageTitle>
        </div>
        
        {event && <p className="text-muted mb-4">Event: {event.title}</p>}

        {error && (
          <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        <FormSection>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <FormLabel>Category Name</FormLabel>
                <Form.Control
                  type="text"
                  value={categoryData.name}
                  onChange={(e) => setCategoryData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Best Performance, Most Innovative, etc."
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <FormLabel>Description (Optional)</FormLabel>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={categoryData.description}
                  onChange={(e) => setCategoryData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Add details about this award category"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <FormLabel>Voting Deadline</FormLabel>
                <Form.Control
                  type="datetime-local"
                  value={categoryData.deadline}
                  onChange={(e) => setCategoryData(prev => ({ ...prev, deadline: e.target.value }))}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
                <Form.Text className="text-muted">
                  The deadline determines when voting will close. After this date, results will be visible.
                </Form.Text>
              </Form.Group>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <FormLabel className="mb-0">Nominees</FormLabel>
                  <ActionButton
                    variant="outline-primary"
                    size="sm"
                    onClick={addNominee}
                    type="button"
                  >
                    <Plus size={16} />
                    Add Nominee
                  </ActionButton>
                </div>
                
                {categoryData.nominees.map((nominee, index) => (
                  <NomineeCard key={index}>
                    <Card.Body>
                      <Form.Group className="mb-3">
                        <FormLabel>Nominee Name</FormLabel>
                        <Form.Control
                          type="text"
                          value={nominee.name}
                          onChange={(e) => handleNomineeChange(index, 'name', e.target.value)}
                          placeholder={`Nominee ${index + 1}`}
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <FormLabel>Description (Optional)</FormLabel>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={nominee.description}
                          onChange={(e) => handleNomineeChange(index, 'description', e.target.value)}
                          placeholder="Brief description of the nominee"
                        />
                      </Form.Group>
                      
                      {categoryData.nominees.length > 2 && (
                        <div className="text-end">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeNominee(index)}
                            type="button"
                          >
                            <Minus size={14} className="me-1" />
                            Remove Nominee
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </NomineeCard>
                ))}
              </div>

              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate(`/dashboard/events/${eventId}/awards`)}
                  type="button"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Award Category'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </FormSection>
      </Container>
    </PageWrapper>
  );
};

export default AwardCategoryCreation;
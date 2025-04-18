import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AwardsVotingService } from './services/AwardsVotingService';
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

const NomineeCard = styled(Card)`
  margin-bottom: 1rem;
`;

const AwardCategoryCreation = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState({
    name: '',
    description: '',
    deadline: '',
    nominees: ['', ''] // Start with at least 2 nominee fields
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNomineeChange = (index, value) => {
    const newNominees = [...categoryData.nominees];
    newNominees[index] = value;
    setCategoryData(prev => ({
      ...prev,
      nominees: newNominees
    }));
  };

  const addNominee = () => {
    setCategoryData(prev => ({
      ...prev,
      nominees: [...prev.nominees, '']
    }));
  };

  const removeNominee = (index) => {
    if (categoryData.nominees.length <= 2) return;
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
      if (categoryData.nominees.some(nom => !nom.trim())) {
        throw new Error('All nominee fields must be filled');
      }

      // Create the category
      const category = await AwardsVotingService.createCategory(eventId, {
        name: categoryData.name,
        description: categoryData.description,
        deadline: categoryData.deadline,
        nominees: categoryData.nominees.map(name => ({
          name,
          imageUrl: '', // In a real app, you'd handle image uploads
          description: ''
        }))
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
        <BackLink 
          onClick={() => navigate(`/dashboard/events/${eventId}/awards`)}
          type="button"
        >
          <ArrowLeft size={16} />
          Back to Awards
        </BackLink>

        <PageTitle>Create New Award Category</PageTitle>

        {error && (
          <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                  type="text"
                  value={categoryData.name}
                  onChange={(e) => setCategoryData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Best Performance, Most Innovative, etc."
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Description (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={categoryData.description}
                  onChange={(e) => setCategoryData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Add details about this award category"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Voting Deadline</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={categoryData.deadline}
                  onChange={(e) => setCategoryData(prev => ({ ...prev, deadline: e.target.value }))}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Form.Label className="mb-0">Nominees</Form.Label>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={addNominee}
                    type="button"
                  >
                    <Plus size={16} className="me-1" />
                    Add Nominee
                  </Button>
                </div>
                {categoryData.nominees.map((nominee, index) => (
                  <NomineeCard key={index}>
                    <Card.Body className="d-flex gap-2">
                      <Form.Control
                        type="text"
                        value={nominee}
                        onChange={(e) => handleNomineeChange(index, e.target.value)}
                        placeholder={`Nominee ${index + 1}`}
                        required
                      />
                      {categoryData.nominees.length > 2 && (
                        <Button
                          variant="outline-danger"
                          onClick={() => removeNominee(index)}
                          type="button"
                        >
                          <Minus size={16} />
                        </Button>
                      )}
                    </Card.Body>
                  </NomineeCard>
                ))}
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate(`/dashboard/events/${eventId}/awards`)}
                  type="button"
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
        </Card>
      </Container>
    </PageWrapper>
  );
};

export default AwardCategoryCreation;